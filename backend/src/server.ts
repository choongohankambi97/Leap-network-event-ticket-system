import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { env } from './config/env';
import paymentRoutes from './routes/paymentRoutes';
import webhookRoutes from './routes/webhookRoutes';
import { logger } from './utils/logger';

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for dev/embedded widgets, or configure with env.FRONTEND_URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key', 'x-lipila-signature']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.info(`[${req.method}] ${req.path}`);
  next();
});

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    service: 'LEAP Networks Ticketing Gateway',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    lipilaConfigured: Boolean(env.LIPILA_API_KEY && env.LIPILA_API_KEY !== 'your_lipila_api_key_here')
  });
});

// Routes
app.use('/api', paymentRoutes);
app.use('/api/webhooks', webhookRoutes);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.originalUrl} not found`
  });
});

// Global Error Handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start Server — bind to 0.0.0.0 so Railway / cloud hosts can route traffic in
const server = app.listen(env.PORT, '0.0.0.0', () => {
  logger.info(`=======================================================`);
  logger.info(`🚀 LEAP Networks Ticketing API Server running on port ${env.PORT}`);
  logger.info(`🔗 API Base URL: http://localhost:${env.PORT}/api`);
  logger.info(`📡 Lipila Webhook: http://localhost:${env.PORT}/api/webhooks/lipila`);
  logger.info(`💳 Lipila Sandbox Mode: ${env.SIMULATE_LIPILA_SANDBOX ? 'Active (Auto Fallback)' : 'Live API Key'}`);
  logger.info(`=======================================================`);
});

export default app;
