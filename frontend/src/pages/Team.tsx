import React from 'react';
import { Typography, Box } from '@mui/material';

const Team: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Team
      </Typography>
      <Typography variant="body1">
        View and manage your team members here.
      </Typography>
    </Box>
  );
};

export default Team; 