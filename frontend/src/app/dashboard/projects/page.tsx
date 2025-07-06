'use client';

import { Container, Typography, Paper, Box } from '@mui/material';

export default function ProjectsPage() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Project Management
      </Typography>
      
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Coming Soon
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Project management features will be implemented in a future update.
        </Typography>
        <Box mt={2}>
          <Typography variant="body2" color="text.secondary">
            This page will include:
          </Typography>
          <ul style={{ textAlign: 'left', marginTop: '8px', color: '#666' }}>
            <li>Project creation and tracking</li>
            <li>Project assignments</li>
            <li>Timeline management</li>
            <li>Progress monitoring</li>
          </ul>
        </Box>
      </Paper>
    </Container>
  );
}