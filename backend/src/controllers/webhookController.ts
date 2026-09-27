import { Request, Response } from 'express';
import { paymentService } from '../services/paymentService';
import { env } from '../config/env';
import { logger } from '../utils/logger';

export class WebhookController {
  /**
   * POST /api/webhooks/lipila
   * Webhook receiver for Lipila payment callbacks
   */
  async handleLipilaWebhook(req: Request, res: Response): Promise<void> {
    const payload = req.body;
    logger.info('[WebhookController] Received Lipila webhook notification:', payload);

    // Optional webhook secret verification if configured
    if (env.LIPILA_WEBHOOK_SECRET) {
      const incomingSecret = req.headers['x-lipila-signature'] || req.headers['x-webhook-secret'] || req.query.secret;
      if (incomingSecret !== env.LIPILA_WEBHOOK_SECRET) {
        logger.warn('[WebhookController] Webhook secret signature mismatch');
        res.status(401).json({ success: false, error: 'Unauthorized webhook signature' });
        return;
      }
    }

    try {
      const result = await paymentService.processLipilaWebhook(payload);

      // Always return 200 to acknowledge webhook receipt to Lipila
      res.status(200).json({
        received: true,
        success: result.success,
        reference: result.reference,
        status: result.status,
        ticketIssued: result.ticketIssued
      });
    } catch (error: any) {
      logger.error('[WebhookController] Error processing Lipila webhook:', error);
      // Return 200 or 400 depending on error, Lipila retries on 500
      res.status(200).json({
        received: true,
        success: false,
        error: error.message
      });
    }
  }
}

export const webhookController = new WebhookController();
