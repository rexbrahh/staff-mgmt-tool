import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import { register } from '../store/slices/authSlice';
import { AppDispatch, RootState } from '../store';
import { RegisterData } from '../services/auth.service';
import { validateRegisterForm, ValidationErrors } from '../utils/validation';

const roles = [
  { value: 'employee' as const, label: 'Employee' },
  { value: 'manager' as const, label: 'Manager' },
  { value: 'admin' as const, label: 'Admin' },
] as const;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'employee',
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState({
    email: false,
    password: false,
    firstName: false,
    lastName: false,
    role: false,
  });

  const handleBlur = (field: keyof typeof touched) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateRegisterForm(
      formData.email,
      formData.password,
      formData.firstName,
      formData.lastName,
      formData.role
    );
    setValidationErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      try {
        await dispatch(register(formData)).unwrap();
        navigate('/');
      } catch (err) {
        // Error is handled by the auth slice
        console.error('Registration failed:', err);
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Sign Up
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="firstName"
              label="First Name"
              name="firstName"
              autoComplete="given-name"
              autoFocus
              value={formData.firstName}
              onChange={handleChange}
              onBlur={() => handleBlur('firstName')}
              error={touched.firstName && !!validationErrors.firstName}
              helperText={touched.firstName && validationErrors.firstName}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="lastName"
              label="Last Name"
              name="lastName"
              autoComplete="family-name"
              value={formData.lastName}
              onChange={handleChange}
              onBlur={() => handleBlur('lastName')}
              error={touched.lastName && !!validationErrors.lastName}
              helperText={touched.lastName && validationErrors.lastName}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={() => handleBlur('email')}
              error={touched.email && !!validationErrors.email}
              helperText={touched.email && validationErrors.email}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              onBlur={() => handleBlur('password')}
              error={touched.password && !!validationErrors.password}
              helperText={touched.password && validationErrors.password}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              select
              id="role"
              label="Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              onBlur={() => handleBlur('role')}
              error={touched.role && !!validationErrors.role}
              helperText={touched.role && validationErrors.role}
              disabled={loading}
            >
              {roles.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign Up'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register; 