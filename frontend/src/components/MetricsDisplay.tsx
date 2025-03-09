import React, { useEffect, useState } from 'react';

interface Metrics {
  cpuUsage: number;
  memoryUsage: number;
  diskActivity: number;
}

const MetricsDisplay: React.FC = () => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the performance metrics from the backend API
    fetch('/api/metrics')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data: Metrics) => {
        setMetrics(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading metrics...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>System Performance Metrics</h2>
      <ul>
        <li>CPU Usage: {metrics?.cpuUsage}%</li>
        <li>Memory Usage: {metrics?.memoryUsage}%</li>
        <li>Disk Activity: {metrics?.diskActivity}%</li>
      </ul>
    </div>
  );
};

export default MetricsDisplay;
