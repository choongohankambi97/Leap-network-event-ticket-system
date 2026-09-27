import { PaymentMethod, PaymentStatus } from '../config/constants';

export interface CreatePaymentDTO {
  fullName: string;
  email: string;
  phone: string;
  quantity: number;
  paymentMethod: PaymentMethod;
  ticketTierId?: string;
}

export interface TicketDetails {
  ticketToken: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  eventVenue: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  quantity: number;
  unitPrice: number;
  amountPaid: number;
  currency: string;
  paymentReference: string;
  paymentStatus: PaymentStatus;
  qrCodeDataUrl: string;
  qrPayload: string;
  issuedAt: string;
}

export interface PaymentRecord {
  id: string; // Unique internal reference (UUID)
  lipilaReferenceId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  cardRedirectionUrl?: string | null;
  lipilaPaymentType?: string | null;
  ticketToken?: string;
  ticket?: TicketDetails;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LipilaMobileMoneyPayload {
  callbackUrl?: string;
  referenceId: string;
  amount: number;
  narration: string;
  accountNumber: string;
  currency: string;
  backUrl?: string;
  redirectUrl?: string;
  email?: string;
}

export interface LipilaCardPayload {
  callbackUrl?: string;
  referenceId: string;
  amount: number;
  narration: string;
  accountNumber: string;
  currency: string;
  backUrl?: string;
  redirectUrl?: string;
  email?: string;
  customerInfo?: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
  };
}

export interface LipilaResponse {
  currency: string;
  amount: number;
  accountNumber: string;
  status: string;
  paymentType?: string;
  ipAddress?: string;
  cardRedirectionUrl?: string | null;
  createdAt?: string;
  message?: string;
  statusCode?: number;
}

export interface LipilaWebhookPayload {
  referenceId?: string;
  reference?: string;
  status?: string;
  amount?: number;
  currency?: string;
  accountNumber?: string;
  paymentType?: string;
  transactionId?: string;
  message?: string;
  [key: string]: any;
}
