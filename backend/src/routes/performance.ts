import { Router, Request, Response } from 'express';
import si from 'systeminformation';
import { Server } from 'socket.io';

let io: Server;

const router = Router();

export const setSocketIo = (socketIoInstance: Server) => {
  io = socketIoInstance;
};

router.get('/metrics', async (req: Request, res: Response) => {
  try {
    const cpu = await si.currentLoad();
    const memory = await si.mem();
    const disk = await si.fsSize();

    const metrics = {
      cpuUsage: parseFloat(cpu.currentLoad.toFixed(2)),
      memoryUsage: parseFloat(((memory.active / memory.total) * 100).toFixed(2)),
      diskActivity: disk.length > 0 ? parseFloat(disk[0].use.toFixed(2)) : null,
    };

    io.emit('metricsUpdate', metrics);

    res.json(metrics);
  } catch (error) {
    console.error('Error fetching or emitting system metrics:', error);
    res.status(500).json({ error: 'Error fetching or emitting system metrics' });
  }
});

export default router;
