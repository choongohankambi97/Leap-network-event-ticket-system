import axios, { AxiosInstance } from 'axios';
import { env } from '../config/env';
import { logger } from '../utils/logger';
import { LipilaMobileMoneyPayload, LipilaCardPayload, LipilaResponse } from '../types';

export interface ILipilaService {
  initiateMobileMoney(payload: LipilaMobileMoneyPayload): Promise<LipilaResponse>;
  initiateCard(payload: LipilaCardPayload): Promise<LipilaResponse>;
}

class LipilaService implements ILipilaService {
  private httpClient: AxiosInstance;
  private isSimulationMode: boolean;

  constructor() {
    this.isSimulationMode = env.SIMULATE_LIPILA_SANDBOX || !env.LIPILA_API_KEY || env.LIPILA_API_KEY === 'your_lipila_api_key_here';
    
    this.httpClient = axios.create({
      baseURL: env.LIPILA_BASE_URL,
      timeout: 15000,
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'x-api-key': env.LIPILA_API_KEY
      }
    });

    if (this.isSimulationMode) {
      logger.info('LipilaService initialized in SIMULATION / SANDBOX FALLBACK mode. Set LIPILA_API_KEY in .env for live/sandbox gateway.');
    } else {
      logger.info(`LipilaService initialized with endpoint: ${env.LIPILA_BASE_URL}`);
    }
  }

  /**
   * Clean and normalize Zambian phone number to 260 format
   * Accepts: 0979333751, 979333751, +260979333751, 260979333751
   */
  public normalizePhoneNumber(phone: string): string {
    let clean = phone.replace(/[\s+-]/g, '');
    if (clean.startsWith('0')) {
      clean = '260' + clean.slice(1);
    } else if (!clean.startsWith('260') && clean.length === 9) {
      clean = '260' + clean;
    }
    return clean;
  }

  /**
   * Determine network provider (Airtel, MTN, Zamtel) from Zambian phone prefix
   */
  public detectPaymentType(phone: string): string {
    const normalized = this.normalizePhoneNumber(phone);
    const prefix = normalized.substring(3, 5); // 260XX...
    if (['97', '77'].includes(prefix)) return 'AirtelMoney';
    if (['96', '76'].includes(prefix)) return 'MTNMoney';
    if (['95', '75'].includes(prefix)) return 'ZamtelKwacha';
    return 'MobileMoney';
  }

  /**
   * Initiate Mobile Money Collection via Lipila API
   * POST /collections/mobile-money
   */
  async initiateMobileMoney(payload: LipilaMobileMoneyPayload): Promise<LipilaResponse> {
    const formattedAccount = this.normalizePhoneNumber(payload.accountNumber);
    const paymentType = this.detectPaymentType(formattedAccount);

    const requestBody = {
      callbackUrl: payload.callbackUrl || env.LIPILA_CALLBACK_URL,
      referenceId: payload.referenceId,
      amount: payload.amount,
      narration: payload.narration || `LEAP Founders Connect - Ticket (${payload.referenceId})`,
      accountNumber: formattedAccount,
      currency: payload.currency || 'ZMW',
      backUrl: payload.backUrl || `${env.FRONTEND_URL}/?status=cancelled&ref=${payload.referenceId}`,
      redirectUrl: payload.redirectUrl || `${env.FRONTEND_URL}/?status=success&ref=${payload.referenceId}`,
      email: payload.email || 'customer@leapnetworks.org'
    };

    logger.info(`[LipilaService] Initiating Mobile Money collection for ref: ${payload.referenceId}`, {
      amount: requestBody.amount,
      accountNumber: requestBody.accountNumber,
      paymentType
    });

    if (this.isSimulationMode) {
      // Mock Sandbox Response adhering precisely to official Lipila spec
      logger.info(`[LipilaService] Returning simulated pending response for sandbox testing`);
      return {
        currency: requestBody.currency,
        amount: requestBody.amount,
        accountNumber: requestBody.accountNumber,
        status: 'Pending',
        paymentType: paymentType,
        ipAddress: '::ffff:127.0.0.1',
        cardRedirectionUrl: null,
        createdAt: new Date().toISOString()
      };
    }

    try {
      const response = await this.httpClient.post<LipilaResponse>('/collections/mobile-money', requestBody);
      logger.info(`[LipilaService] Mobile Money response received:`, response.data);
      return response.data;
    } catch (error: any) {
      logger.error(`[LipilaService] Mobile Money collection failed: ${error.message}`, error.response?.data || error);
      throw new Error(error.response?.data?.message || error.message || 'Lipila Mobile Money initiation failed');
    }
  }

  /**
   * Initiate Card Collection via Lipila API
   * POST /collections/card
   */
  async initiateCard(payload: LipilaCardPayload): Promise<LipilaResponse> {
    const defaultCustomer = {
      firstName: 'Valued',
      lastName: 'Attendee',
      phoneNumber: payload.accountNumber,
      email: payload.email || 'attendee@leapnetworks.org'
    };

    const customerInfo = payload.customerInfo ? {
      firstName: payload.customerInfo.firstName || defaultCustomer.firstName,
      lastName: payload.customerInfo.lastName || defaultCustomer.lastName,
      phoneNumber: payload.customerInfo.phoneNumber || defaultCustomer.phoneNumber,
      email: payload.customerInfo.email || defaultCustomer.email
    } : defaultCustomer;

    const requestBody = {
      callbackUrl: payload.callbackUrl || env.LIPILA_CALLBACK_URL,
      referenceId: payload.referenceId,
      amount: payload.amount,
      narration: payload.narration || `LEAP Founders Connect - Card Ticket (${payload.referenceId})`,
      accountNumber: payload.accountNumber,
      currency: payload.currency || 'ZMW',
      backUrl: payload.backUrl || `${env.FRONTEND_URL}/?status=cancelled&ref=${payload.referenceId}`,
      redirectUrl: payload.redirectUrl || `${env.FRONTEND_URL}/?status=success&ref=${payload.referenceId}`,
      email: payload.email,
      customerInfo
    };

    logger.info(`[LipilaService] Initiating Card collection for ref: ${payload.referenceId}`, {
      amount: requestBody.amount,
      email: requestBody.email
    });

    if (this.isSimulationMode) {
      return {
        currency: requestBody.currency,
        amount: requestBody.amount,
        accountNumber: requestBody.accountNumber,
        status: 'Pending',
        paymentType: 'Card',
        cardRedirectionUrl: `${env.FRONTEND_URL}/mock-card-gateway?ref=${payload.referenceId}&amount=${payload.amount}`,
        createdAt: new Date().toISOString()
      };
    }

    try {
      const response = await this.httpClient.post<LipilaResponse>('/collections/card', requestBody);
      logger.info(`[LipilaService] Card response received:`, response.data);
      return response.data;
    } catch (error: any) {
      logger.error(`[LipilaService] Card collection initiation failed: ${error.message}`, error.response?.data || error);
      throw new Error(error.response?.data?.message || error.message || 'Lipila Card initiation failed');
    }
  }
}

export const lipilaService = new LipilaService();
