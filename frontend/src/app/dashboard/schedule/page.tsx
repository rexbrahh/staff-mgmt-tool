'use client';

import { Container, Typography, Paper, Box } from '@mui/material';

export default function SchedulePage() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Schedule Management
      </Typography>
      
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Coming Soon
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Schedule management features will be implemented in a future update.
        </Typography>
        <Box mt={2}>
          <Typography variant="body2" color="text.secondary">
            This page will include:
          </Typography>
          <ul style={{ textAlign: 'left', marginTop: '8px', color: '#666' }}>
            <li>Work schedule planning</li>
            <li>Leave request management</li>
            <li>Attendance tracking</li>
            <li>Shift management</li>
          </ul>
        </Box>
      </Paper>
    </Container>
  );
}