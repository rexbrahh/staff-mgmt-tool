import React from 'react';
import { Typography, Box } from '@mui/material';

const Dashboard: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1">
        Welcome to your staff management dashboard.
      </Typography>
    </Box>
  );
};

export default Dashboard; 