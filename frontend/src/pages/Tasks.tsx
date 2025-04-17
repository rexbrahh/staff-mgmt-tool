import React from 'react';
import { Typography, Box } from '@mui/material';

const Tasks: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Tasks
      </Typography>
      <Typography variant="body1">
        View and manage your tasks here.
      </Typography>
    </Box>
  );
};

export default Tasks; 