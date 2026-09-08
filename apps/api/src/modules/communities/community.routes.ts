import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../../db/prisma.js';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const communities = await prisma.community.findMany({
      orderBy: { createdAt: 'desc' },
    });
    
    res.json({
      data: communities,
      total: communities.length,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const community = await prisma.community.findUnique({
      where: { id },
    });
    
    if (!community) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Community not found' } });
    }
    
    res.json(community);
  } catch (error) {
    next(error);
  }
});

export default router;
