import React from 'react';
import { Typography, Box } from '@mui/material';

const Profile: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>
      <Typography variant="body1">
        View and edit your profile here.
      </Typography>
    </Box>
  );
};

export default Profile; 