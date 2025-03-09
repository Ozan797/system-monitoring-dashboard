import { Router, Request, Response } from 'express';

const router = Router();

// Endpoint to retrieve dummy performance metrics
router.get('/metrics', (req: Request, res: Response) => {
  const dummyMetrics = {
    cpuUsage: 35,         // percentage
    memoryUsage: 65,      // percentage
    diskActivity: 50      // percentage
  };
  res.json(dummyMetrics);
});

export default router;
