import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import si from 'systeminformation';
import throttle from 'lodash/throttle';

const app = express();
const port = process.env.PORT || 3000;

// Create an HTTP server from the Express app
const server = http.createServer(app);

// Initialise Socket.io server
const io = new Server(server, {
  cors: {
    origin: '*', // Adjust for your production environment
  },
});

// Log client connections
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

// Function to collect and emit metrics
const emitMetrics = async () => {
  try {
    // Basic metrics
    const cpu = await si.currentLoad();
    const memory = await si.mem();
    const disk = await si.fsSize();

    // Additional metrics
    const cpuSpeedData = await si.cpuCurrentSpeed();
    const timeData = await si.time();
    const network = await si.networkStats();

    // Safely format disk usage if available
    const diskActivity =
      disk.length > 0 && disk[0].use != null
        ? parseFloat(disk[0].use.toFixed(2))
        : null;

    // Format CPU current speed (average)
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
          : null, // bytes per second
      networkUploadSpeed:
        network.length > 0 && network[0].tx_sec != null
          ? parseFloat(network[0].tx_sec.toFixed(2))
          : null // bytes per second
    };

    // Emit the metrics to all connected clients
    io.emit('metricsUpdate', metrics);
    console.log('Emitted metrics:', metrics);
  } catch (error) {
    console.error('Error fetching or emitting system metrics:', error);
  }
};

// Create a throttled version of emitMetrics that runs at most once every 1000ms
const throttledEmitMetrics = throttle(emitMetrics, 1000);

// Call the throttled function frequently (e.g., every 100ms)
setInterval(throttledEmitMetrics, 100);

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
