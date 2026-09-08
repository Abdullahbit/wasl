import { Router, Request, Response, NextFunction } from 'express';

const router = Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({ message: 'Not implemented yet' });
  } catch (error) {
    next(error);
  }
});

export default router;
