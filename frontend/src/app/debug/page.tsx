'use client';

import { useState } from 'react';
import { Container, Paper, Button, Typography, Box, Alert } from '@mui/material';
import { authService } from '../../lib/services/auth.service';

export default function DebugPage() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    
    try {
      console.log('🧪 Testing API connection...');
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        })
      });
      
      console.log('📡 Raw response:', response);
      console.log('✅ Response status:', response.status);
      console.log('📋 Response headers:', Object.fromEntries(response.headers.entries()));
      
      const data = await response.json();
      console.log('📄 Response data:', data);
      
      setResult({
        status: response.status,
        statusText: response.statusText,
        data: data
      });
      
    } catch (err: any) {
      console.error('💥 Test connection failed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testAuthService = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    
    try {
      console.log('🧪 Testing AuthService...');
      const response = await authService.login({
        email: 'test@example.com',
        password: 'password123'
      });
      
      console.log('📡 AuthService response:', response);
      setResult({ authService: response });
      
    } catch (err: any) {
      console.error('💥 AuthService test failed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          API Debug Page
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Button 
            variant="contained" 
            onClick={testConnection}
            disabled={loading}
            sx={{ mr: 2 }}
          >
            Test Raw Fetch
          </Button>
          
          <Button 
            variant="outlined" 
            onClick={testAuthService}
            disabled={loading}
          >
            Test AuthService
          </Button>
        </Box>
        
        {loading && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Testing API connection...
          </Alert>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <strong>Error:</strong> {error}
          </Alert>
        )}
        
        {result && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Result:
            </Typography>
            <Box component="pre" sx={{ 
              bgcolor: 'grey.100', 
              p: 2, 
              borderRadius: 1, 
              overflow: 'auto',
              fontSize: '0.875rem'
            }}>
              {JSON.stringify(result, null, 2)}
            </Box>
          </Box>
        )}
        
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Environment Info:
          </Typography>
          <Typography variant="body2">
            API URL: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}
          </Typography>
          <Typography variant="body2">
            Current Host: {typeof window !== 'undefined' ? window.location.origin : 'Server-side'}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}