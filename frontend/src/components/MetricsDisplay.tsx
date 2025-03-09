import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Container,
  Box
} from '@mui/material';

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
    const socketClient = io('http://localhost:3000');
    setSocket(socketClient);

    socketClient.on('metricsUpdate', (data: Metrics) => {
      setMetrics(data);
    });

    socketClient.on('connect_error', (err) => {
      setError('Socket connection error: ' + err);
    });

    return () => {
      socketClient.disconnect();
    };
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth="md" sx={{ marginTop: '2rem' }}>
      <Box
        sx={{
          background: 'linear-gradient(45deg, #00bcd4 30%, #ff5722 90%)',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '2rem'
        }}
      >
        <Typography variant="h4" gutterBottom align="center" color="common.white">
          Real-Time System Performance Metrics
        </Typography>
      </Box>
      {metrics ? (
        <Grid container spacing={3}>
          {[
            { title: 'CPU Usage', value: `${metrics.cpuUsage}%` },
            { title: 'Memory Usage', value: `${metrics.memoryUsage}%` },
            { title: 'Disk Activity', value: `${metrics.diskActivity}%` },
            { title: 'CPU Speed', value: metrics.cpuSpeed !== null ? `${metrics.cpuSpeed} GHz` : 'N/A' },
            { title: 'System Uptime', value: `${metrics.systemUptime} sec` },
            { title: 'Network Download Speed', value: metrics.networkDownloadSpeed !== null ? `${metrics.networkDownloadSpeed} B/s` : 'N/A' },
            { title: 'Network Upload Speed', value: metrics.networkUploadSpeed !== null ? `${metrics.networkUploadSpeed} B/s` : 'N/A' },
          ].map((item, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Card sx={{ backgroundColor: 'background.paper' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    {item.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {item.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography align="center" variant="h6">
          Waiting for metrics...
        </Typography>
      )}
    </Container>
  );
};

export default MetricsDisplay;
