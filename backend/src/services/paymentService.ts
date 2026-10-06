import { v4 as uuidv4 } from 'uuid';
import { EVENT_DETAILS, PAYMENT_METHODS, PAYMENT_STATUSES, PaymentStatus, TICKET_TIERS } from '../config/constants';
import { CreatePaymentDTO, PaymentRecord, TicketDetails } from '../types';
import { lipilaService } from './lipilaService';
import { ticketService } from './ticketService';
import { logger } from '../utils/logger';

// Repository interface for database extensibility
export interface IPaymentRepository {
  save(payment: PaymentRecord): Promise<PaymentRecord>;
  findById(id: string): Promise<PaymentRecord | null>;
  findByLipilaReference(ref: string): Promise<PaymentRecord | null>;
  update(id: string, updates: Partial<PaymentRecord>): Promise<PaymentRecord | null>;
}

// In-Memory Repository Implementation (Ready to swap for Prisma / Mongo / Postgres)
class InMemoryPaymentRepository implements IPaymentRepository {
  private store: Map<string, PaymentRecord> = new Map();

  async save(payment: PaymentRecord): Promise<PaymentRecord> {
    this.store.set(payment.id, { ...payment });
    return payment;
  }

  async findById(id: string): Promise<PaymentRecord | null> {
    const record = this.store.get(id);
    return record ? { ...record } : null;
  }

  async findByLipilaReference(ref: string): Promise<PaymentRecord | null> {
    for (const record of this.store.values()) {
      if (record.lipilaReferenceId === ref || record.id === ref) {
        return { ...record };
      }
    }
    return null;
  }

  async update(id: string, updates: Partial<PaymentRecord>): Promise<PaymentRecord | null> {
    const existing = this.store.get(id);
    if (!existing) return null;

    const updated: PaymentRecord = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.store.set(id, updated);
    return { ...updated };
  }
}

export class PaymentService {
  constructor(
    private repository: IPaymentRepository = new InMemoryPaymentRepository(),
    private lipila = lipilaService,
    private tickets = ticketService
  ) { }

  /**
   * Initiate a new ticket purchase payment
   * Backend strictly calculates unit price & total amount
   */
  async createPayment(dto: CreatePaymentDTO): Promise<{
    payment: PaymentRecord;
    lipilaResponse: any;
  }> {
    const quantity = Math.max(1, Math.min(20, Math.floor(dto.quantity || 1)));

    // Determine unit price
    const unitPrice: number = EVENT_DETAILS.ticketPriceZMW;
    const tierName: string = TICKET_TIERS.STANDARD.name;
    const totalAmount = unitPrice * quantity;
    const paymentId = uuidv4();
    const now = new Date().toISOString();

    const paymentRecord: PaymentRecord = {
      id: paymentId,
      lipilaReferenceId: paymentId,
      customerName: dto.fullName.trim(),
      customerEmail: dto.email.trim().toLowerCase(),
      customerPhone: dto.phone.trim(),
      quantity,
      unitPrice,
      amount: totalAmount,
      currency: EVENT_DETAILS.currency,
      paymentMethod: dto.paymentMethod,
      status: PAYMENT_STATUSES.PENDING,
      createdAt: now,
      updatedAt: now
    };

    // Save initial pending payment record
    await this.repository.save(paymentRecord);

    let lipilaResult: any;

    try {
      if (dto.paymentMethod === PAYMENT_METHODS.MOBILE_MONEY) {
        lipilaResult = await this.lipila.initiateMobileMoney({
          referenceId: paymentId,
          amount: totalAmount,
          accountNumber: dto.phone,
          currency: EVENT_DETAILS.currency,
          email: dto.email,
          narration: `${EVENT_DETAILS.name} - ${tierName} (${quantity} qty)`
        });
      } else {
        const nameParts = dto.fullName.trim().split(' ');
        const firstName = nameParts[0] || 'Valued';
        const lastName = nameParts.slice(1).join(' ') || 'Customer';

        lipilaResult = await this.lipila.initiateCard({
          referenceId: paymentId,
          amount: totalAmount,
          accountNumber: dto.phone,
          currency: EVENT_DETAILS.currency,
          email: dto.email,
          narration: `${EVENT_DETAILS.name} - ${tierName} (${quantity} qty)`,
          customerInfo: {
            firstName,
            lastName,
            phoneNumber: dto.phone,
            email: dto.email
          }
        });
      }

      // Update record with Lipila response details
      await this.repository.update(paymentId, {
        cardRedirectionUrl: lipilaResult.cardRedirectionUrl,
        lipilaPaymentType: lipilaResult.paymentType
      });

      const updatedRecord = await this.repository.findById(paymentId);

      return {
        payment: updatedRecord || paymentRecord,
        lipilaResponse: lipilaResult
      };
    } catch (error: any) {
      logger.error(`Failed to initiate Lipila collection for payment ${paymentId}: ${error.message}`);
      await this.repository.update(paymentId, {
        status: PAYMENT_STATUSES.FAILED,
        failureReason: error.message
      });
      throw error;
    }
  }

  /**
   * Retrieve payment status and ticket if successful
   */
  async getPaymentStatus(referenceId: string): Promise<{
    reference: string;
    status: PaymentStatus;
    amount: number;
    currency: string;
    customerName: string;
    quantity: number;
    ticket?: TicketDetails;
    cardRedirectionUrl?: string | null;
    failureReason?: string;
  } | null> {
    const payment = await this.repository.findById(referenceId) ||
      await this.repository.findByLipilaReference(referenceId);

    if (!payment) return null;

    return {
      reference: payment.id,
      status: payment.status,
      amount: payment.amount,
      currency: payment.currency,
      customerName: payment.customerName,
      quantity: payment.quantity,
      ticket: payment.ticket,
      cardRedirectionUrl: payment.cardRedirectionUrl,
      failureReason: payment.failureReason
    };
  }

  /**
   * Process webhook confirmation from Lipila
   * Idempotent: Does not regenerate tickets if already successful
   */
  async processLipilaWebhook(payload: any): Promise<{
    success: boolean;
    reference: string;
    status: PaymentStatus;
    ticketIssued: boolean;
  }> {
    const reference = payload.referenceId || payload.reference || payload.reference_id || payload.ref;
    if (!reference) {
      logger.warn('[PaymentService] Webhook received without reference ID', payload);
      throw new Error('Reference ID is missing in webhook payload');
    }

    const payment = await this.repository.findById(reference) ||
      await this.repository.findByLipilaReference(reference);

    if (!payment) {
      logger.warn(`[PaymentService] Payment not found for webhook reference: ${reference}`);
      return { success: false, reference, status: PAYMENT_STATUSES.FAILED, ticketIssued: false };
    }

    // Idempotency check: if already confirmed successful and ticket is generated
    if (payment.status === PAYMENT_STATUSES.SUCCESSFUL && payment.ticket) {
      logger.info(`[PaymentService] Webhook received for already confirmed payment: ${reference}. Returning existing ticket.`);
      return {
        success: true,
        reference: payment.id,
        status: PAYMENT_STATUSES.SUCCESSFUL,
        ticketIssued: false // Already issued
      };
    }

    // Determine status from Lipila webhook payload
    const rawStatus = (payload.status || payload.paymentStatus || '').toLowerCase();
    let nextStatus: PaymentStatus = PAYMENT_STATUSES.PENDING;

    if (rawStatus === 'successful' || rawStatus === 'success' || rawStatus === 'completed' || rawStatus === 'paid') {
      nextStatus = PAYMENT_STATUSES.SUCCESSFUL;
    } else if (rawStatus === 'failed' || rawStatus === 'declined' || rawStatus === 'error') {
      nextStatus = PAYMENT_STATUSES.FAILED;
    } else if (rawStatus === 'cancelled' || rawStatus === 'canceled' || rawStatus === 'expired') {
      nextStatus = PAYMENT_STATUSES.CANCELLED;
    }

    if (nextStatus === PAYMENT_STATUSES.SUCCESSFUL) {
      // Generate digital ticket
      const ticket = await this.tickets.generateTicket(payment);

      await this.repository.update(payment.id, {
        status: PAYMENT_STATUSES.SUCCESSFUL,
        ticketToken: ticket.ticketToken,
        ticket: ticket
      });

      logger.info(`[PaymentService] Payment ${payment.id} marked as SUCCESSFUL. Ticket ${ticket.ticketToken} generated!`);
      return {
        success: true,
        reference: payment.id,
        status: PAYMENT_STATUSES.SUCCESSFUL,
        ticketIssued: true
      };
    } else {
      await this.repository.update(payment.id, {
        status: nextStatus,
        failureReason: payload.message || payload.error || `Payment ${nextStatus.toLowerCase()}`
      });

      logger.info(`[PaymentService] Payment ${payment.id} status updated to: ${nextStatus}`);
      return {
        success: true,
        reference: payment.id,
        status: nextStatus,
        ticketIssued: false
      };
    }
  }

  /**
   * Developer helper: Simulates payment approval for sandbox / test runs
   */
  async simulatePaymentApproval(referenceId: string): Promise<TicketDetails | null> {
    const payment = await this.repository.findById(referenceId);
    if (!payment) return null;

    const ticket = await this.tickets.generateTicket(payment);
    await this.repository.update(payment.id, {
      status: PAYMENT_STATUSES.SUCCESSFUL,
      ticketToken: ticket.ticketToken,
      ticket: ticket
    });

    return ticket;
  }
}

export const paymentService = new PaymentService();
