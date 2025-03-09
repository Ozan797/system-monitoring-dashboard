import { Router, Request, Response } from 'express';
import si from 'systeminformation';

const router = Router();

// Endpoint to retrieve real performance metrics
router.get('/metrics', async (req: Request, res: Response) => {
  try {
    const cpu = await si.currentLoad();
    const memory = await si.mem();
    const disk = await si.fsSize();

    const metrics = {
      cpuUsage: cpu.currentLoad.toFixed(2), // percentage
      memoryUsage: ((memory.active / memory.total) * 100).toFixed(2), // percentage
      diskActivity: disk.length > 0 ? disk[0].use.toFixed(2) : 'N/A' // percentage
    };

    res.json(metrics);
  } catch (error) {
    console.error('Error fetching system metrics:', error);
    res.status(500).json({ error: 'Error fetching system metrics' });
  }
});

export default router;
