'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '../lib/hooks';
import { initializeAuth, fetchUserProfile } from '../lib/features/auth/authSlice';

export function AuthInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Only run on client side to avoid hydration mismatch
    console.log('🔧 AuthInitializer: Checking localStorage for token...');
    const token = localStorage.getItem('token');
    console.log('🎟️ Found token:', token ? 'YES' : 'NO');
    
    dispatch(initializeAuth({ token }));
    console.log('✅ AuthInitializer: Dispatched initializeAuth');
    
    // If we have a token, fetch the user profile
    if (token) {
      console.log('👤 AuthInitializer: Fetching user profile...');
      dispatch(fetchUserProfile());
    }
  }, [dispatch]);

  return null; // This component doesn't render anything
}