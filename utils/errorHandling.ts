/**
 * Error handling utilities for authentication and form validation
 */

export interface AuthError {
  field?: 'email' | 'password' | 'username' | 'global';
  message: string;
  userFriendly?: boolean;
}

/**
 * Maps authentication errors to user-friendly messages
 * @param error - The original error object
 * @returns AuthError object with user-friendly message
 */
export const mapAuthError = (error: any): AuthError => {
  const errorMessage = error?.message || error?.toString() || 'An unknown error occurred';
  
  // Network and connection errors
  if (errorMessage.toLowerCase().includes('network') || 
      errorMessage.toLowerCase().includes('connection') ||
      errorMessage.toLowerCase().includes('fetch')) {
    return {
      field: 'global',
      message: 'Network error. Please check your internet connection and try again.',
      userFriendly: true
    };
  }

  // Email-related errors
  if (errorMessage.toLowerCase().includes('email')) {
    if (errorMessage.toLowerCase().includes('already') || 
        errorMessage.toLowerCase().includes('exists') ||
        errorMessage.toLowerCase().includes('in use')) {
      return {
        field: 'email',
        message: 'This email is already in use. Please use a different email or try logging in.',
        userFriendly: true
      };
    }
    if (errorMessage.toLowerCase().includes('invalid') || 
        errorMessage.toLowerCase().includes('format')) {
      return {
        field: 'email',
        message: 'Please enter a valid email address.',
        userFriendly: true
      };
    }
    if (errorMessage.toLowerCase().includes('not found') || 
        errorMessage.toLowerCase().includes('does not exist')) {
      return {
        field: 'email',
        message: 'No account found with this email address. Please sign up or check your email.',
        userFriendly: true
      };
    }
    return {
      field: 'email',
      message: 'Email error. Please check your email address.',
      userFriendly: true
    };
  }

  // Username-related errors
  if (errorMessage.toLowerCase().includes('username')) {
    if (errorMessage.toLowerCase().includes('already') || 
        errorMessage.toLowerCase().includes('exists') ||
        errorMessage.toLowerCase().includes('taken')) {
      return {
        field: 'username',
        message: 'This username is already taken. Please choose a different username.',
        userFriendly: true
      };
    }
    if (errorMessage.toLowerCase().includes('invalid') || 
        errorMessage.toLowerCase().includes('format')) {
      return {
        field: 'username',
        message: 'Username must be at least 3 characters long.',
        userFriendly: true
      };
    }
    return {
      field: 'username',
      message: 'Username error. Please check your username.',
      userFriendly: true
    };
  }

  // Password-related errors
  if (errorMessage.toLowerCase().includes('password')) {
    if (errorMessage.toLowerCase().includes('invalid') || 
        errorMessage.toLowerCase().includes('incorrect') ||
        errorMessage.toLowerCase().includes('wrong')) {
      return {
        field: 'password',
        message: 'Invalid password. Please check your password and try again.',
        userFriendly: true
      };
    }
    if (errorMessage.toLowerCase().includes('weak') || 
        errorMessage.toLowerCase().includes('requirements')) {
      return {
        field: 'password',
        message: 'Password must be at least 6 characters long.',
        userFriendly: true
      };
    }
    return {
      field: 'password',
      message: 'Password error. Please check your password.',
      userFriendly: true
    };
  }

  // Authentication errors
  if (errorMessage.toLowerCase().includes('auth') || 
      errorMessage.toLowerCase().includes('login') ||
      errorMessage.toLowerCase().includes('signin')) {
    return {
      field: 'global',
      message: 'Invalid email or password. Please check your credentials.',
      userFriendly: true
    };
  }

  // Registration errors
  if (errorMessage.toLowerCase().includes('signup') || 
      errorMessage.toLowerCase().includes('register') ||
      errorMessage.toLowerCase().includes('create')) {
    return {
      field: 'global',
      message: 'Failed to create account. Please try again.',
      userFriendly: true
    };
  }

  // Default fallback
  return {
    field: 'global',
    message: 'Something went wrong. Please try again.',
    userFriendly: true
  };
};

/**
 * Clears all form errors when user starts typing
 * @param setErrors - Array of error setter functions
 */
export const clearErrorsOnInput = (...setErrors: Array<(error: string | null) => void>) => {
  setErrors.forEach(setError => setError(null));
};

/**
 * Validates if an error should be shown to the user
 * @param error - The error object
 * @returns boolean indicating if error should be displayed
 */
export const shouldShowError = (error: any): boolean => {
  if (!error) return false;
  
  // Don't show technical errors to users
  const technicalErrors = [
    'network request failed',
    'timeout',
    'cancelled',
    'aborted'
  ];
  
  const errorMessage = error?.message?.toLowerCase() || '';
  return !technicalErrors.some(techError => errorMessage.includes(techError));
}; 