'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Alert 
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch } from '../../lib/hooks';
import { loginUser } from '../../lib/features/auth/authSlice';

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [error, setError] = useState('');

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      setError('');
      const result = await dispatch(loginUser(values));
      
      if (result.meta.requestStatus === 'fulfilled') {
        // Small delay to ensure Redux state is updated
        setTimeout(() => {
          router.replace('/dashboard');
        }, 100);
      } else if (result.meta.requestStatus === 'rejected') {
        setError(result.error?.message || 'Invalid credentials');
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" textAlign="center" gutterBottom>
          Login
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <Box sx={{ mb: 2 }}>
                <Field
                  as={TextField}
                  name="email"
                  label="Email"
                  type="email"
                  fullWidth
                  error={touched.email && errors.email}
                  helperText={touched.email && errors.email}
                />
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Field
                  as={TextField}
                  name="password"
                  label="Password"
                  type="password"
                  fullWidth
                  error={touched.password && errors.password}
                  helperText={touched.password && errors.password}
                />
              </Box>
              
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </Button>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
}