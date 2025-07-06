'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent,
  Button,
  Box
} from '@mui/material';
import { 
  People, 
  Assignment, 
  Assessment, 
  Schedule 
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../lib/hooks';
import { logout } from '../../lib/features/auth/authSlice';

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, token, loading } = useAppSelector((state) => state.auth);
  const [mounted, setMounted] = useState(false);

  // Debug dashboard state
  console.log('🏢 Dashboard: Component rendered');
  console.log('🏢 Dashboard: Auth state:', { 
    isAuthenticated, 
    user: user?.email, 
    token: token ? 'YES' : 'NO', 
    mounted,
    loading 
  });

  useEffect(() => {
    console.log('🏢 Dashboard: Mounting...');
    setMounted(true);
  }, []);

  useEffect(() => {
    console.log('🏢 Dashboard: Auth check - mounted:', mounted, 'isAuthenticated:', isAuthenticated, 'loading:', loading);
    
    // Simplified auth check - only redirect if clearly not authenticated
    if (mounted && !isAuthenticated && !loading) {
      console.log('❌ Dashboard: Not authenticated, redirecting to login');
      router.push('/login');
    } else if (mounted && isAuthenticated) {
      console.log('✅ Dashboard: User is authenticated, staying on dashboard');
    }
  }, [isAuthenticated, router, mounted, loading]);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  // Show loading while waiting for auth state
  if (!mounted || loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  // If not authenticated, the useEffect will handle redirect
  if (!isAuthenticated) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography>Redirecting to login...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>
        <Button variant="outlined" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      <Typography variant="h6" gutterBottom>
        Welcome back, {user?.firstName} {user?.lastName}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <People color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">Team</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Manage team members
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Assignment color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">Projects</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Track project progress
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Assessment color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">Reports</Typography>
                  <Typography variant="body2" color="text.secondary">
                    View analytics
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Schedule color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">Schedule</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Manage schedules
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}