import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middleware/errorHandler.js';

// Route imports
import profileRoutes from './modules/profiles/profile.routes.js';
import communityRoutes from './modules/communities/community.routes.js';
import resourceRoutes from './modules/resources/resource.routes.js';
import recommendationRoutes from './modules/recommendations/recommendation.routes.js';
import aiRoutes from './modules/ai/ai.routes.js';

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Routes
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/communities', communityRoutes);
app.use('/api/v1/resources', resourceRoutes);
app.use('/api/v1/recommendations', recommendationRoutes);
app.use('/api/v1/ai', aiRoutes);

// Error handler
app.use(errorHandler);
