export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  // At least 6 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
  return passwordRegex.test(password);
};

export const validateName = (name: string): boolean => {
  return name.length >= 2 && /^[a-zA-Z\s-']+$/.test(name);
};

export interface ValidationErrors {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

export const validateLoginForm = (email: string, password: string): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!email) {
    errors.email = 'Email is required';
  } else if (!validateEmail(email)) {
    errors.email = 'Invalid email format';
  }

  if (!password) {
    errors.password = 'Password is required';
  } else if (!validatePassword(password)) {
    errors.password = 'Password must be at least 6 characters with 1 uppercase, 1 lowercase, and 1 number';
  }

  return errors;
};

export const validateRegisterForm = (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  role: 'employee' | 'manager' | 'admin'
): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!email) {
    errors.email = 'Email is required';
  } else if (!validateEmail(email)) {
    errors.email = 'Invalid email format';
  }

  if (!password) {
    errors.password = 'Password is required';
  } else if (!validatePassword(password)) {
    errors.password = 'Password must be at least 6 characters with 1 uppercase, 1 lowercase, and 1 number';
  }

  if (!firstName) {
    errors.firstName = 'First name is required';
  } else if (!validateName(firstName)) {
    errors.firstName = 'First name must be at least 2 characters and contain only letters';
  }

  if (!lastName) {
    errors.lastName = 'Last name is required';
  } else if (!validateName(lastName)) {
    errors.lastName = 'Last name must be at least 2 characters and contain only letters';
  }

  if (!role) {
    errors.role = 'Role is required';
  } else if (!['employee', 'manager', 'admin'].includes(role)) {
    errors.role = 'Invalid role selected';
  }

  return errors;
}; 