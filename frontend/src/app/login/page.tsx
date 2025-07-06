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
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { loginUser } from '../../lib/features/auth/authSlice';

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

export default function LoginPage() {
  console.log('🎬 LoginPage: Component function called');
  
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [error, setError] = useState('');
  const { isAuthenticated, user, loading } = useAppSelector((state) => state.auth);
  
  // Debug current auth state
  console.log('🏠 LoginPage: Component rendered/re-rendered');
  console.log('🏠 LoginPage: Current auth state:', { isAuthenticated, user: user?.email, loading });
  console.log('🏠 LoginPage: Dependencies loaded successfully');
  console.log('🏠 LoginPage: dispatch type:', typeof dispatch);
  console.log('🏠 LoginPage: router type:', typeof router);
  
  // Add click handler debugging
  const handleButtonClick = (e: React.MouseEvent) => {
    console.log('🖱️ BUTTON CLICKED!', e);
    console.log('🖱️ Button event type:', e.type);
    console.log('🖱️ Button target:', e.target);
  };

  const handleSubmit = async (values: { email: string; password: string }) => {
    console.log('🎯 handleSubmit CALLED!!! Values:', values);
    console.log('🎯 handleSubmit function type:', typeof handleSubmit);
    
    try {
      console.log('🚀 Login attempt started');
      setError('');
      console.log('📧 Credentials:', { email: values.email, password: '***' });
      
      const result = await dispatch(loginUser(values));
      console.log('📬 Redux dispatch result:', result);
      console.log('📊 Result meta:', result.meta);
      console.log('🔍 Request status:', result.meta?.requestStatus);
      
      if (result.meta.requestStatus === 'fulfilled') {
        console.log('✅ Login fulfilled, payload:', result.payload);
        console.log('🔀 Redirecting to dashboard...');
        
        // Small delay to ensure cookie is set
        setTimeout(() => {
          router.push('/dashboard');
        }, 100);
      } else if (result.meta.requestStatus === 'rejected') {
        console.log('❌ Login rejected:', result);
        console.log('❌ Rejection payload:', result.payload);
        console.log('❌ Rejection error:', result.error);
        
        // Extract more detailed error message
        const errorMsg = result.error?.message || 'Invalid credentials. Please check your email and password.';
        setError(errorMsg);
      } else {
        console.log('❓ Unknown login result:', result);
        setError('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('💥 Login error in catch:', error);
      setError('Login failed. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" textAlign="center" gutterBottom>
          Login
        </Typography>
        
        {/* Development hint */}
        <Box sx={{ mb: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
          <Typography variant="body2" color="info.contrastText">
            <strong>Test Credentials:</strong><br />
            Email: test@example.com<br />
            Password: password123
          </Typography>
        </Box>
        
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Formik
          initialValues={{ email: 'test@example.com', password: 'password123' }}
          validationSchema={validationSchema}
          onSubmit={(values, formikBag) => {
            console.log('📝 Formik onSubmit triggered!', values);
            console.log('📝 Formik bag:', formikBag);
            return handleSubmit(values);
          }}
        >
          {({ errors, touched, isSubmitting, handleSubmit: formikHandleSubmit }) => {
            console.log('📋 Formik render function called');
            console.log('📋 isSubmitting:', isSubmitting);
            console.log('📋 errors:', errors);
            console.log('📋 formikHandleSubmit type:', typeof formikHandleSubmit);
            
            return (
            <Form onSubmit={(e) => {
              console.log('🔥 FORM onSubmit triggered!', e);
              console.log('🔥 Event target:', e.target);
              console.log('🔥 Event type:', e.type);
              formikHandleSubmit(e);
            }}>
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
                onClick={(e) => {
                  console.log('🔴 BUTTON CLICKED!!!', e);
                  console.log('🔴 Button disabled?', isSubmitting);
                  console.log('🔴 Button type:', e.currentTarget.type);
                  handleButtonClick(e);
                }}
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </Button>
            </Form>
            );
          }}
        </Formik>
      </Paper>
    </Container>
  );
}