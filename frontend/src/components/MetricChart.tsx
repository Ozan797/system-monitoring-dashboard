import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface MetricChartProps {
  title: string;
  data: number[];
  labels: string[];
  borderColor: string;
  backgroundColor: string;
}

const MetricChart: React.FC<MetricChartProps> = ({ title, data, labels, borderColor, backgroundColor }) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data,
        borderColor,
        backgroundColor,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: title,
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default MetricChart;
