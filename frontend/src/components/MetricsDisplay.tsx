import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface Metrics {
  cpuUsage: number;
  memoryUsage: number;
  diskActivity: number;
  cpuSpeed: number | null;
  systemUptime: number;
  networkDownloadSpeed: number | null;
  networkUploadSpeed: number | null;
}

const MetricsDisplay: React.FC = () => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Connect to the Socket.io server
    const socketClient = io('http://localhost:3000');
    setSocket(socketClient);

    // Listen for metrics updates
    socketClient.on('metricsUpdate', (data: Metrics) => {
      setMetrics(data);
    });

    socketClient.on('connect_error', (err) => {
      setError('Socket connection error: ' + err);
    });

    // Cleanup on component unmount
    return () => {
      socketClient.disconnect();
    };
  }, []);

  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Real-Time System Performance Metrics</h2>
      {metrics ? (
        <ul>
          <li>CPU Usage: {metrics.cpuUsage}%</li>
          <li>Memory Usage: {metrics.memoryUsage}%</li>
          <li>Disk Activity: {metrics.diskActivity}%</li>
          <li>
            CPU Speed:{" "}
            {metrics.cpuSpeed !== null ? `${metrics.cpuSpeed} GHz` : "N/A"}
          </li>
          <li>System Uptime: {metrics.systemUptime} seconds</li>
          <li>
            Network Download Speed:{" "}
            {metrics.networkDownloadSpeed !== null ? `${metrics.networkDownloadSpeed} B/s` : "N/A"}
          </li>
          <li>
            Network Upload Speed:{" "}
            {metrics.networkUploadSpeed !== null ? `${metrics.networkUploadSpeed} B/s` : "N/A"}
          </li>
        </ul>
      ) : (
        <p>Waiting for metrics...</p>
      )}
    </div>
  );
};

export default MetricsDisplay;
