import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../../db/prisma.js';
import { validateRequest } from '../../middleware/validate.js';
import { ProfileInputSchema } from '@wasl/contracts';

const router = Router();

router.post('/', validateRequest(ProfileInputSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profileData = req.body;
    
    // MVP: Create a new profile every time since there's no auth
    const profile = await prisma.profile.create({
      data: profileData,
    });
    
    res.status(201).json(profile);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const profile = await prisma.profile.findUnique({
      where: { id },
    });
    
    if (!profile) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Profile not found' } });
    }
    
    res.json(profile);
  } catch (error) {
    next(error);
  }
});

export default router;
