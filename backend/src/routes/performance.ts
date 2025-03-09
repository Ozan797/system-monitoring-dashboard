import { Router, Request, Response } from 'express';
import si from 'systeminformation';
import { Server } from 'socket.io';

// Assuming you have access to your Socket.io instance
// You might need to refactor to make the instance accessible here
let io: Server;

const router = Router();

// A function to set the Socket.io instance (call this from your main server file)
export const setSocketIo = (socketIoInstance: Server) => {
  io = socketIoInstance;
};

// Endpoint to retrieve and emit performance metrics
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

    // Emit the metrics to all connected clients
    io.emit('metricsUpdate', metrics);

    res.json(metrics);
  } catch (error) {
    console.error('Error fetching or emitting system metrics:', error);
    res.status(500).json({ error: 'Error fetching or emitting system metrics' });
  }
});

export default router;
