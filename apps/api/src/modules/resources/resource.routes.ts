import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../../db/prisma.js';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const resources = await prisma.resource.findMany({
      orderBy: { createdAt: 'desc' },
    });
    
    res.json({
      data: resources,
      total: resources.length,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const resource = await prisma.resource.findUnique({
      where: { id },
    });
    
    if (!resource) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Resource not found' } });
    }
    
    res.json(resource);
  } catch (error) {
    next(error);
  }
});

export default router;
