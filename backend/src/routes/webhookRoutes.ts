import { Router } from 'express';
import { webhookController } from '../controllers/webhookController';

const router = Router();

// Lipila Webhook callback endpoint
router.post('/lipila', (req, res) => webhookController.handleLipilaWebhook(req, res));

export default router;
