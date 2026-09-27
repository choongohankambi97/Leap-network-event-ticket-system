import { Router } from 'express';
import { paymentController } from '../controllers/paymentController';

const router = Router();

// Initiate ticket payment
router.post('/payments', (req, res) => paymentController.createPayment(req, res));

// Poll payment status & fetch ticket
router.get('/payments/:reference/status', (req, res) => paymentController.getPaymentStatus(req, res));

// Sandbox helper to simulate instant customer approval
router.post('/payments/:reference/simulate-success', (req, res) => paymentController.simulatePaymentApproval(req, res));

// Get event information
router.get('/event', (req, res) => paymentController.getEventDetails(req, res));

export default router;
