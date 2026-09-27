import QRCode from 'qrcode';
import { logger } from './logger';

export async function generateQrCodeDataUrl(payload: string): Promise<string> {
  try {
    const dataUrl = await QRCode.toDataURL(payload, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 320,
      color: {
        dark: '#1C1917', // Dark charcoal/slate
        light: '#FFFFFF'
      }
    });
    return dataUrl;
  } catch (error) {
    logger.error('Failed to generate QR code data URL', error);
    // Return empty fallback if generation fails
    return '';
  }
}
