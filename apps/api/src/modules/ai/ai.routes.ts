import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../../db/prisma.js';
import { validateRequest } from '../../middleware/validate.js';
import { RecommendationRequestSchema } from '@wasl/contracts';
import { generateRecommendations } from './ai.service.js';

const router = Router();

router.post('/navigate', validateRequest(RecommendationRequestSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { profileId } = req.body;

    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
    });

    if (!profile) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Profile not found' } });
    }

    const communities = await prisma.community.findMany();

    const result = await generateRecommendations(profile, communities);

    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
