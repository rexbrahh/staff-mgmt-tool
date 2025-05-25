import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { login, register, logout, getProfile, clearError } from '../store/slices/authSlice';
import { LoginData, RegisterData } from '../services/auth.service';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error } = useSelector((state: RootState) => state.auth);

  const loginUser = async (credentials: LoginData) => {
    try {
      await dispatch(login(credentials)).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

  const registerUser = async (data: RegisterData) => {
    try {
      await dispatch(register(data)).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  const loadProfile = async () => {
    try {
      await dispatch(getProfile()).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    user,
    loading,
    error,
    loginUser,
    registerUser,
    logoutUser,
    loadProfile,
    clearAuthError,
  };
}; 