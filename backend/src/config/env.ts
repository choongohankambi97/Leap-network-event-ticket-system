import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const env = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',

  // Lipila API Configuration
  LIPILA_API_KEY: process.env.LIPILA_API_KEY || '',
  LIPILA_BASE_URL: process.env.LIPILA_BASE_URL || 'https://blz.lipila.io/api/v1',
  LIPILA_WEBHOOK_SECRET: process.env.LIPILA_WEBHOOK_SECRET || '',
  LIPILA_CALLBACK_URL: process.env.LIPILA_CALLBACK_URL || 'http://localhost:5000/api/webhooks/lipila',

  // Ticket Generator Secret
  TICKET_SECRET: process.env.TICKET_SECRET || 'leap_founders_connect_2026_salt',

  // Mock Sandbox fallback
  SIMULATE_LIPILA_SANDBOX: process.env.SIMULATE_LIPILA_SANDBOX === 'true' || !process.env.LIPILA_API_KEY
};
