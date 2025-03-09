import React, { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Container, Typography, Box, Grid, Snackbar, Alert, Button } from '@mui/material';
import MetricChart from './MetricChart';
import SimpleMetricCard from './SimpleMetricCard';
import formatUptime from '../utils/formatUptime';
import DashboardSettings, { DashboardSettings as DS } from './DashboardSettings';

interface Metrics {
  cpuUsage: number;
  memoryUsage: number;
  diskActivity: number;
  cpuSpeed: number | null;
  systemUptime: number;
  networkDownloadSpeed: number | null;
  networkUploadSpeed: number | null;
  timestamp: number;
}

const MetricsDisplay: React.FC = () => {
  const [metricsHistory, setMetricsHistory] = useState<Metrics[]>([]);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [openAlert, setOpenAlert] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [dashboardSettings, setDashboardSettings] = useState<DS>({
    showCpuUsage: true,
    showMemoryUsage: true,
    showDiskActivity: true,
    showNetworkDownload: true,
    showNetworkUpload: true,
    refreshRate: 1000, // default refresh rate in milliseconds
  });

  // Ref to track last update time
  const lastUpdateTimeRef = useRef<number>(0);

  useEffect(() => {
    const socketClient: Socket = io('http://localhost:3000');

    socketClient.on('metricsUpdate', (data: Omit<Metrics, 'timestamp'>) => {
      const now = Date.now();
      if (now - lastUpdateTimeRef.current >= dashboardSettings.refreshRate) {
        lastUpdateTimeRef.current = now;
        const metricWithTimestamp = { ...data, timestamp: now };
        setMetricsHistory(prevHistory => {
          const newHistory = [...prevHistory, metricWithTimestamp];
          return newHistory.slice(-50); // keep the last 50 entries
        });
      }
    });

    socketClient.on('alert', (data: { type: string; message: string }) => {
      setAlertMessage(data.message);
      setOpenAlert(true);
    });

    socketClient.on('connect_error', (err) => {
      setError('Socket connection error: ' + err);
    });

    return () => {
      socketClient.disconnect();
    };
  }, [dashboardSettings.refreshRate]);

  const labels = metricsHistory.map(entry => new Date(entry.timestamp).toLocaleTimeString());
  const latestMetrics = metricsHistory.length ? metricsHistory[metricsHistory.length - 1] : null;

  const handleClose = () => {
    setOpenAlert(false);
  };

  const handleSettingsSave = (newSettings: DS) => {
    setDashboardSettings(newSettings);
    localStorage.setItem('dashboardSettings', JSON.stringify(newSettings));
  };

  useEffect(() => {
    const savedSettings = localStorage.getItem('dashboardSettings');
    if (savedSettings) {
      setDashboardSettings(JSON.parse(savedSettings));
    }
  }, []);

  return (
    <Container maxWidth="lg" sx={{ marginTop: '2rem' }}>
      <Box
        sx={{
          background: 'linear-gradient(45deg, #1976d2 30%, #9c27b0 90%)',
          padding: '1.5rem',
          borderRadius: '12px',
          marginBottom: '2rem',
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" gutterBottom align="center" color="common.white">
          Real-Time System Performance Metrics
        </Typography>
        <Box textAlign="center" mt={2}>
          <Button variant="contained" color="secondary" onClick={() => setSettingsOpen(true)}>
            Dashboard Settings
          </Button>
        </Box>
      </Box>

      {error && (
        <Typography variant="h6" color="error" align="center">
          {error}
        </Typography>
      )}

      <Grid container spacing={4}>
        {dashboardSettings.showCpuUsage && (
          <Grid item xs={12} md={6}>
            <MetricChart
              title="CPU Usage (%)"
              data={metricsHistory.map(item => item.cpuUsage)}
              labels={labels}
              borderColor="#00bcd4"
              backgroundColor="rgba(0,188,212,0.5)"
            />
          </Grid>
        )}
        {dashboardSettings.showMemoryUsage && (
          <Grid item xs={12} md={6}>
            <MetricChart
              title="Memory Usage (%)"
              data={metricsHistory.map(item => item.memoryUsage)}
              labels={labels}
              borderColor="#ff5722"
              backgroundColor="rgba(255,87,34,0.5)"
            />
          </Grid>
        )}
        {dashboardSettings.showDiskActivity && (
          <Grid item xs={12} md={6}>
            <MetricChart
              title="Disk Activity (%)"
              data={metricsHistory.map(item => item.diskActivity)}
              labels={labels}
              borderColor="#4caf50"
              backgroundColor="rgba(76,175,80,0.5)"
            />
          </Grid>
        )}
        {dashboardSettings.showNetworkDownload && (
          <Grid item xs={12} md={6}>
            <MetricChart
              title="Network Download (B/s)"
              data={metricsHistory.map(item => (item.networkDownloadSpeed !== null ? item.networkDownloadSpeed : 0))}
              labels={labels}
              borderColor="#f44336"
              backgroundColor="rgba(244,67,54,0.5)"
            />
          </Grid>
        )}
        {dashboardSettings.showNetworkUpload && (
          <Grid item xs={12} md={6}>
            <MetricChart
              title="Network Upload (B/s)"
              data={metricsHistory.map(item => (item.networkUploadSpeed !== null ? item.networkUploadSpeed : 0))}
              labels={labels}
              borderColor="#ffeb3b"
              backgroundColor="rgba(255,235,59,0.5)"
            />
          </Grid>
        )}
      </Grid>

      {/* Cards for CPU Speed and System Uptime */}
      {latestMetrics && (
        <Grid container spacing={4} sx={{ marginTop: '2rem' }}>
          <Grid item xs={12} md={6}>
            <SimpleMetricCard
              title="CPU Speed (GHz)"
              value={latestMetrics.cpuSpeed !== null ? `${latestMetrics.cpuSpeed} GHz` : 'N/A'}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <SimpleMetricCard
              title="System Uptime"
              value={formatUptime(latestMetrics.systemUptime)}
            />
          </Grid>
        </Grid>
      )}

      <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="warning" sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>

      {/* Settings Dialog */}
      <DashboardSettings
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={dashboardSettings}
        onSave={handleSettingsSave}
      />
    </Container>
  );
};

export default MetricsDisplay;
