import { Request, Response } from 'express';
import { z } from 'zod';
import { paymentService } from '../services/paymentService';
import { PAYMENT_METHODS, EVENT_DETAILS } from '../config/constants';
import { logger } from '../utils/logger';
import { emitPaymentSuccess } from '../services/paymentEvents';
// Input validation schema using Zod
const createPaymentSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(9, 'Please provide a valid phone number (e.g. 0979333751)'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(20, 'Maximum 20 tickets per purchase'),
  paymentMethod: z.enum([PAYMENT_METHODS.MOBILE_MONEY, PAYMENT_METHODS.CARD], {
    errorMap: () => ({ message: 'Payment method must be MOBILE_MONEY or CARD' })
  }),
  ticketTierId: z.string().optional()
});

export class PaymentController {
  /**
   * POST /api/payments
   * Initiates payment for ticket purchase
   */
  async createPayment(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = createPaymentSchema.safeParse(req.body);

      if (!validationResult.success) {
        const errorDetails = validationResult.error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));

        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errorDetails
        });
        return;
      }

      const dto = validationResult.data;
      const { payment, lipilaResponse } = await paymentService.createPayment(dto);

      res.status(201).json({
        success: true,
        reference: payment.id,
        amount: payment.amount,
        unitPrice: payment.unitPrice,
        quantity: payment.quantity,
        currency: payment.currency,
        status: payment.status,
        paymentMethod: payment.paymentMethod,
        cardRedirectionUrl: payment.cardRedirectionUrl || null,
        message: payment.paymentMethod === PAYMENT_METHODS.MOBILE_MONEY
          ? 'Payment prompt sent to your phone. Please approve the prompt with your PIN.'
          : 'Card payment initiated.',
        lipilaDetails: {
          paymentType: lipilaResponse.paymentType || null,
          status: lipilaResponse.status
        }
      });
    } catch (error: any) {
      logger.error('Error in createPayment controller:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to initiate payment. Please try again.'
      });
    }
  }

  /**
   * GET /api/payments/:reference/status
   * Checks current payment status and returns ticket when ready
   */
  async getPaymentStatus(req: Request, res: Response): Promise<void> {
    try {
      const rawRef = req.params.reference;
      const reference = Array.isArray(rawRef) ? rawRef[0] : rawRef;

      if (!reference) {
        res.status(400).json({ success: false, error: 'Reference is required' });
        return;
      }

      const statusResult = await paymentService.getPaymentStatus(reference);

      if (!statusResult) {
        res.status(404).json({
          success: false,
          error: `Payment with reference '${reference}' was not found`
        });
        return;
      }

      res.status(200).json({
        success: true,
        ...statusResult
      });
    } catch (error: any) {
      logger.error(`Error in getPaymentStatus for ref ${req.params.reference}:`, error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve payment status'
      });
    }
  }

  /**
   * POST /api/payments/:reference/simulate-success
   * Developer Sandbox helper to simulate instant customer approval
   */
  async simulatePaymentApproval(req: Request, res: Response): Promise<void> {
    try {
      const rawRef = req.params.reference;
      const reference = Array.isArray(rawRef) ? rawRef[0] : rawRef;

      if (!reference) {
        res.status(400).json({
          success: false,
          error: 'Reference is required'
        });
        return;
      }

      const ticket = await paymentService.simulatePaymentApproval(reference);

      if (!ticket) {
        res.status(404).json({
          success: false,
          error: 'Payment record not found'
        });
        return;
      }

      emitPaymentSuccess(reference, ticket);

      res.status(200).json({
        success: true,
        message: 'Payment simulated as SUCCESSFUL for sandbox testing',
        status: 'SUCCESSFUL',
        ticket
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /api/event
   * Returns current event details and ticket pricing
   */
  async getEventDetails(_req: Request, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      event: EVENT_DETAILS
    });
  }
}

export const paymentController = new PaymentController();
