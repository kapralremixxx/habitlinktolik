import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

import { prisma } from './utils/prisma';
import authRouter from './routes/auth';
import habitRouter from './routes/habit';
import userRouter from './routes/user';
import adminRouter from './routes/admin';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 4000;

// Global middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('combined'));

// Rate limiting – 100 requests per minute per IP
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Simple health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRouter);
app.use('/api/habits', habitRouter);
app.use('/api/users', userRouter);
app.use('/api/admin', adminRouter);

// Swagger docs (generated from swagger.yaml in root)
try {
  const swaggerDocument = YAML.load('swagger.yaml');
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (err) {
  console.warn('⚠️  Swagger docs not found or failed to load');
}

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal Server Error' });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 Backend listening on http://localhost:${PORT}`);
});
