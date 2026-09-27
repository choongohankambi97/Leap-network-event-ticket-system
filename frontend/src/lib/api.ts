import { CreatePaymentDTO, CreatePaymentResponse, PaymentStatusResponse } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://leap-network-event-ticket-system-production.up.railway.app/api';

/**
 * Submit ticket order and initiate Lipila payment
 */
export async function createPayment(payload: CreatePaymentDTO): Promise<CreatePaymentResponse> {
  const response = await fetch(`${API_BASE_URL}/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || data.message || 'Failed to initiate payment');
  }
  return data;
}

/**
 * Poll payment status by reference ID
 */
export async function fetchPaymentStatus(reference: string): Promise<PaymentStatusResponse> {
  const response = await fetch(`${API_BASE_URL}/payments/${encodeURIComponent(reference)}/status`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch payment status');
  }
  return data;
}

/**
 * Developer Sandbox helper: Simulates payment approval for testing without live phone prompt
 */
export async function simulatePaymentApproval(reference: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/payments/${encodeURIComponent(reference)}/simulate-success`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to simulate payment approval');
  }
  return data;
}
