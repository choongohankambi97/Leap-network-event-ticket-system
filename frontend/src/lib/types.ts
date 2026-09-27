export type PaymentMethod = 'MOBILE_MONEY' | 'CARD';

export type PaymentStatus = 'PENDING' | 'SUCCESSFUL' | 'FAILED' | 'CANCELLED';

export interface CreatePaymentDTO {
  fullName: string;
  email: string;
  phone: string;
  quantity: number;
  paymentMethod: PaymentMethod;
  ticketTierId?: 'standard' | 'testing';
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

export interface CreatePaymentResponse {
  success: boolean;
  reference: string;
  amount: number;
  unitPrice: number;
  quantity: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  cardRedirectionUrl?: string | null;
  message: string;
  lipilaDetails?: {
    paymentType?: string | null;
    status: string;
  };
  error?: string;
  details?: Array<{ field: string; message: string }>;
}

export interface PaymentStatusResponse {
  success: boolean;
  reference: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  customerName: string;
  quantity: number;
  ticket?: TicketDetails;
  cardRedirectionUrl?: string | null;
  failureReason?: string;
  error?: string;
}

export interface Speaker {
  name: string;
  title: string;
  company: string;
  role: string;
  accentColor: string;
  bgGradient: string;
  highlight: string;
  avatarText: string;
}
