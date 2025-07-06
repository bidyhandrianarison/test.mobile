/**
 * Error handling utilities for authentication and form validation
 */

import { t } from './translations';

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
  const errorMessage = error?.message || error?.toString() || t('errors.unknownError');
  
  // Network and connection errors
  if (errorMessage.toLowerCase().includes('network') || 
      errorMessage.toLowerCase().includes('connection') ||
      errorMessage.toLowerCase().includes('fetch')) {
    return {
      field: 'global',
      message: t('errors.networkError'),
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
        message: t('errors.emailAlreadyInUse'),
        userFriendly: true
      };
    }
    if (errorMessage.toLowerCase().includes('invalid') || 
        errorMessage.toLowerCase().includes('format')) {
      return {
        field: 'email',
        message: t('validation.emailInvalid'),
        userFriendly: true
      };
    }
    if (errorMessage.toLowerCase().includes('not found') || 
        errorMessage.toLowerCase().includes('does not exist')) {
      return {
        field: 'email',
        message: t('errors.emailNotFound'),
        userFriendly: true
      };
    }
    return {
      field: 'email',
      message: t('validation.emailInvalid'),
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
        message: t('errors.usernameTaken'),
        userFriendly: true
      };
    }
    if (errorMessage.toLowerCase().includes('invalid') || 
        errorMessage.toLowerCase().includes('format')) {
      return {
        field: 'username',
        message: t('validation.usernameTooShort'),
        userFriendly: true
      };
    }
    return {
      field: 'username',
      message: t('validation.usernameTooShort'),
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
        message: t('errors.wrongPassword'),
        userFriendly: true
      };
    }
    if (errorMessage.toLowerCase().includes('weak') || 
        errorMessage.toLowerCase().includes('requirements')) {
      return {
        field: 'password',
        message: t('validation.passwordTooShort'),
        userFriendly: true
      };
    }
    return {
      field: 'password',
      message: t('validation.passwordTooShort'),
      userFriendly: true
    };
  }

  // Authentication errors
  if (errorMessage.toLowerCase().includes('auth') || 
      errorMessage.toLowerCase().includes('login') ||
      errorMessage.toLowerCase().includes('signin')) {
    return {
      field: 'global',
      message: t('errors.invalidCredentials'),
      userFriendly: true
    };
  }

  // Registration errors
  if (errorMessage.toLowerCase().includes('signup') || 
      errorMessage.toLowerCase().includes('register') ||
      errorMessage.toLowerCase().includes('create')) {
    return {
      field: 'global',
      message: t('errors.signupFailed'),
      userFriendly: true
    };
  }

  // Default fallback
  return {
    field: 'global',
    message: t('errors.somethingWentWrong'),
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