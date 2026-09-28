import { Router } from 'express';
import { paymentController } from '../controllers/paymentController';
import {
    subscribeToPayment,
    unsubscribeFromPayment
} from '../services/paymentEvents';

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
// SSE payment confirmation stream
router.get('/payments/:reference/events', (req, res) => {
    const reference = req.params.reference;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    res.flushHeaders();

    res.write(
        `data: ${JSON.stringify({
            type: 'CONNECTED',
            reference
        })}\n\n`
    );

    subscribeToPayment(reference, res);

    const keepAlive = setInterval(() => {
        res.write(': keepalive\n\n');
    }, 15000);

    req.on('close', () => {
        clearInterval(keepAlive);
        unsubscribeFromPayment(reference, res);
    });
});
