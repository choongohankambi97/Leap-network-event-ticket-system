import { Response } from 'express';

const clients = new Map<string, Set<Response>>();

export function subscribeToPayment(reference: string, res: Response) {
    if (!clients.has(reference)) {
        clients.set(reference, new Set());
    }

    clients.get(reference)!.add(res);

    console.log(`[PaymentEvents] Client subscribed: ${reference}`);
}

export function unsubscribeFromPayment(reference: string, res: Response) {
    const paymentClients = clients.get(reference);

    if (!paymentClients) return;

    paymentClients.delete(res);

    if (paymentClients.size === 0) {
        clients.delete(reference);
    }

    console.log(`[PaymentEvents] Client unsubscribed: ${reference}`);
}

export function emitPaymentSuccess(reference: string, ticket: any) {
    const paymentClients = clients.get(reference);

    if (!paymentClients || paymentClients.size === 0) {
        console.log(`[PaymentEvents] No connected clients for ${reference}`);
        return;
    }

    const event = `data: ${JSON.stringify({
        type: 'PAYMENT_SUCCESSFUL',
        reference,
        ticket,
    })}\n\n`;

    for (const client of paymentClients) {
        client.write(event);
    }

    console.log(
        `[PaymentEvents] SUCCESSFUL event sent to ${paymentClients.size} client(s): ${reference}`
    );
}