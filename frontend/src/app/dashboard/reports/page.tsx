'use client';

import { Container, Typography, Paper, Box } from '@mui/material';

export default function ReportsPage() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Reports & Analytics
      </Typography>
      
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Coming Soon
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Reporting and analytics features will be implemented in a future update.
        </Typography>
        <Box mt={2}>
          <Typography variant="body2" color="text.secondary">
            This page will include:
          </Typography>
          <ul style={{ textAlign: 'left', marginTop: '8px', color: '#666' }}>
            <li>Performance dashboards</li>
            <li>Task completion metrics</li>
            <li>Team productivity reports</li>
            <li>Project analytics</li>
          </ul>
        </Box>
      </Paper>
    </Container>
  );
}