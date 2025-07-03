'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Typography, Box, Paper, Button } from '@mui/material';
import { useAppSelector } from '../lib/hooks';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to Staff Management Tool
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          A modern solution for managing your team and projects
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button 
            variant="contained" 
            size="large" 
            onClick={handleLogin}
            sx={{ mr: 2 }}
          >
            Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}