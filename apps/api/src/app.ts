/**
 * Composes HTTP middleware and feature routers for the Express application.
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { pinoHttp } from 'pino-http';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';
import { requestId } from './middleware/requestId.js';
import { environment } from './config/env.js';
import { logger } from './config/logger.js';
import profileRoutes from './modules/profiles/profile.routes.js';
import communityRoutes from './modules/communities/community.routes.js';
import resourceRoutes from './modules/resources/resource.routes.js';
import recommendationRoutes from './modules/recommendations/recommendation.routes.js';
import aiRoutes from './modules/ai/ai.routes.js';

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: environment.APP_URL,
    credentials: true,
  }),
);
app.use(requestId);
app.use(pinoHttp({ logger, genReqId: (request) => request.id }));
app.use(express.json({ limit: '1mb' }));

app.get('/api/v1/health', (_request, response) => {
  response.status(200).json({ data: { status: 'ok' } });
});

app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/communities', communityRoutes);
app.use('/api/v1/resources', resourceRoutes);
app.use('/api/v1/recommendations', recommendationRoutes);
app.use('/api/v1/ai', aiRoutes);

app.use(notFound);
app.use(errorHandler);
