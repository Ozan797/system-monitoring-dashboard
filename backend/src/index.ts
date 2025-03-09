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
    origin: '*', // Update this with your frontend URL in production
  },
});

// When a client connects, log their connection
io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);
  socket.emit('message', 'Welcome to the real-time performance dashboard');
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Middleware and routes
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Backend is up and running with WebSocket optimisation!');
});

// Define the function to collect and emit metrics
const emitMetrics = async () => {
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
    console.log('Emitted metrics:', metrics);
  } catch (error) {
    console.error('Error fetching or emitting system metrics:', error);
  }
};

// Create a throttled version of emitMetrics that runs at most once every 1000ms
const throttledEmitMetrics = throttle(emitMetrics, 1000);

// For example, if you gather metrics frequently (e.g., every 100ms)
setInterval(throttledEmitMetrics, 100);

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
