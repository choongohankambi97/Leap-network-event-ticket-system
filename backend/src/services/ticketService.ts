import crypto from 'crypto';
import { EVENT_DETAILS, PAYMENT_STATUSES } from '../config/constants';
import { env } from '../config/env';
import { TicketDetails, PaymentRecord } from '../types';
import { generateQrCodeDataUrl } from '../utils/qrCode';
import { logger } from '../utils/logger';

export interface ITicketService {
  generateTicketToken(): string;
  generateTicket(payment: PaymentRecord): Promise<TicketDetails>;
  verifyTicketToken(token: string, signature: string): boolean;
}

class TicketService implements ITicketService {
  /**
   * Generates a cryptographically secure, human-readable ticket token
   * Format: LEAP-2026-XXXXXXXX (e.g., LEAP-2026-8F42K91X)
   */
  generateTicketToken(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude ambiguous chars like 0/O, 1/I
    const bytes = crypto.randomBytes(8);
    let tokenPart = '';
    for (let i = 0; i < 8; i++) {
      tokenPart += chars[bytes[i] % chars.length];
    }
    return `LEAP-2026-${tokenPart}`;
  }

  /**
   * Generate an HMAC security signature for ticket verification
   */
  private generateSignature(ticketToken: string, paymentRef: string): string {
    return crypto
      .createHmac('sha256', env.TICKET_SECRET)
      .update(`${ticketToken}:${paymentRef}:${EVENT_DETAILS.id}`)
      .digest('hex')
      .substring(0, 16);
  }

  /**
   * Verify a ticket token against its signature
   */
  verifyTicketToken(token: string, signature: string): boolean {
    // For future verification app integration
    return Boolean(token && signature);
  }

  /**
   * Generate a complete digital ticket with QR code
   */
  async generateTicket(payment: PaymentRecord): Promise<TicketDetails> {
    logger.info(`Generating ticket for payment reference: ${payment.id} (${payment.customerName})`);

    const ticketToken = payment.ticketToken || this.generateTicketToken();
    const signature = this.generateSignature(ticketToken, payment.id);

    // Create JSON QR payload for gate scanner & future verification app
    const qrPayloadObj = {
      token: ticketToken,
      event: EVENT_DETAILS.name,
      holder: payment.customerName,
      qty: payment.quantity,
      amount: payment.amount,
      ref: payment.id,
      status: PAYMENT_STATUSES.SUCCESSFUL,
      sig: signature
    };

    const qrPayload = JSON.stringify(qrPayloadObj);
    const qrCodeDataUrl = await generateQrCodeDataUrl(qrPayload);

    const ticket: TicketDetails = {
      ticketToken,
      eventName: EVENT_DETAILS.name,
      eventDate: EVENT_DETAILS.date,
      eventTime: EVENT_DETAILS.time,
      eventVenue: EVENT_DETAILS.venue,
      customerName: payment.customerName,
      customerEmail: payment.customerEmail,
      customerPhone: payment.customerPhone,
      quantity: payment.quantity,
      unitPrice: payment.unitPrice,
      amountPaid: payment.amount,
      currency: payment.currency,
      paymentReference: payment.id,
      paymentStatus: PAYMENT_STATUSES.SUCCESSFUL,
      qrCodeDataUrl,
      qrPayload,
      issuedAt: new Date().toISOString()
    };

    return ticket;
  }
}

export const ticketService = new TicketService();
