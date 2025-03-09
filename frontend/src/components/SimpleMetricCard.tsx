import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

interface SimpleMetricCardProps {
  title: string;
  value: string;
}

const SimpleMetricCard: React.FC<SimpleMetricCardProps> = ({ title, value }) => {
  return (
    <Card sx={{ backgroundColor: 'background.paper', margin: '1rem' }}>
      <CardContent>
        <Typography variant="h6" color="primary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body1">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SimpleMetricCard;
