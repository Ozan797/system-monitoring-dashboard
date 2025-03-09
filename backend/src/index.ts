import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import si from 'systeminformation';
import throttle from 'lodash/throttle';

const app = express();
const port = process.env.PORT || 3000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', 
  },
});

io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);
  socket.emit('message', 'Welcome to the real-time performance dashboard');
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

app.use(express.json());
app.get('/', (req, res) => {
  res.send('Backend is up and running with extended metrics!');
});

const emitMetrics = async () => {
  try {
    const cpu = await si.currentLoad();
    const memory = await si.mem();
    const disk = await si.fsSize();
    const cpuSpeedData = await si.cpuCurrentSpeed();
    const timeData = await si.time();
    const network = await si.networkStats();

    const diskActivity =
      disk.length > 0 && disk[0].use != null
        ? parseFloat(disk[0].use.toFixed(2))
        : null;

    const cpuSpeed =
      cpuSpeedData.avg != null
        ? parseFloat(cpuSpeedData.avg.toFixed(2))
        : null;

    const metrics = {
      cpuUsage: parseFloat(cpu.currentLoad.toFixed(2)), // %
      memoryUsage: parseFloat(((memory.active / memory.total) * 100).toFixed(2)), // %
      diskActivity, // %
      cpuSpeed, // GHz
      systemUptime: timeData.uptime, // seconds
      networkDownloadSpeed:
        network.length > 0 && network[0].rx_sec != null
          ? parseFloat(network[0].rx_sec.toFixed(2))
          : null,
      networkUploadSpeed:
        network.length > 0 && network[0].tx_sec != null
          ? parseFloat(network[0].tx_sec.toFixed(2))
          : null
    };

    io.emit('metricsUpdate', metrics);
    console.log('Emitted metrics:', metrics);

    if (metrics.cpuUsage > 25) {
      io.emit('alert', { type: 'CPU', message: `High CPU usage detected: ${metrics.cpuUsage}%` });
      console.warn(`High CPU usage alert: ${metrics.cpuUsage}%`);
    }

  } catch (error) {
    console.error('Error fetching or emitting system metrics:', error);
  }
};


const throttledEmitMetrics = throttle(emitMetrics, 1000);

setInterval(throttledEmitMetrics, 100);

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
