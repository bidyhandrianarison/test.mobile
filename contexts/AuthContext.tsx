import React, { createContext, useReducer, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockUsers } from '../data/users';
import { registerUser, loginUser, updateUser } from '../services/authService';
import { t } from '../utils/translations';

/**
 * User data structure for authentication
 */
export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

/**
 * Standardized error object for authentication operations
 * @property code - Unique error code for programmatic handling
 * @property message - User-friendly error message
 * @property field - Optional field-specific error (for form validation)
 * @property technical - Technical details for debugging (not shown to users)
 */
export type AuthError = {
  code: string;
  message: string;
  field?: 'email' | 'password' | 'username' | 'name' | 'global';
  technical?: string;
};

/**
 * Authentication context interface providing auth functionality
 */
export type AuthContextType = {
  user: AuthUser | null;
  isLoading: boolean;
  error: AuthError | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updatedData: Partial<AuthUser>) => Promise<void>;
  clearError: () => void;
  /**
   * Vérifie si un utilisateur est connecté (AsyncStorage ou state)
   * Met à jour le state si besoin, retourne true/false
   */
  checkAuth: () => Promise<boolean>;
  /**
   * Indique si un utilisateur est authentifié (user !== null)
   */
  isAuthenticated: boolean;
};

/**
 * Action types for the auth reducer
 */
type UserAction = 
  | { type: 'LOGIN', payload: AuthUser }
  | { type: 'SIGNUP', payload: AuthUser[] }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING', payload: boolean }
  | { type: 'SET_ERROR', payload: AuthError | null }
  | { type: 'CLEAR_ERROR' }
  | { type: 'UPDATE_USER', payload: Partial<AuthUser> }

/**
 * State interface for authentication
 */
type AuthState = {
  user: AuthUser | null;
  isLoading: boolean;
  error: AuthError | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Reducer for managing authentication state
 * @param state - Current auth state
 * @param action - Action to perform
 * @returns Updated auth state
 */
const authReducer = (state: AuthState, action: UserAction): AuthState => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload, isLoading: false, error: null };
    case 'SIGNUP':
      return state;
    case 'LOGOUT':
      return { ...state, user: null, isLoading: false, error: null };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'UPDATE_USER':
      if (!state.user) return state;
      const updatedUser = { ...state.user, ...action.payload };
      AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      return { ...state, user: updatedUser };
    default:
      return state;
  }
};

/**
 * Normalizes errors into consistent AuthError objects
 * @param error - Raw error from any source
 * @param operation - The operation that failed (for context)
 * @returns Normalized AuthError object
 */
const normalizeError = (error: any, operation: string): AuthError => {
  const errorMessage = error?.message || error?.toString() || 'Une erreur inconnue s\'est produite';
  const technical = error?.stack || error?.toString();

  // Network and connection errors
  if (errorMessage.toLowerCase().includes('network') || 
      errorMessage.toLowerCase().includes('connection') ||
      errorMessage.toLowerCase().includes('fetch') ||
      errorMessage.toLowerCase().includes('timeout')) {
    return {
      code: 'auth/network-error',
      message: 'Erreur réseau. Veuillez vérifier votre connexion internet et réessayer.',
      field: 'global',
      technical
    };
  }

  // Email-related errors
  if (errorMessage.toLowerCase().includes('email')) {
    if (errorMessage.toLowerCase().includes('already') || 
        errorMessage.toLowerCase().includes('exists') ||
        errorMessage.toLowerCase().includes('in use')) {
      return {
        code: 'auth/email-already-in-use',
        message: t('errors.emailAlreadyInUse'),
        field: 'email',
        technical
      };
    }
    if (errorMessage.toLowerCase().includes('invalid') || 
        errorMessage.toLowerCase().includes('format')) {
      return {
        code: 'auth/invalid-email',
        message: t('validation.emailInvalid'),
        field: 'email',
        technical
      };
    }
    if (errorMessage.toLowerCase().includes('not found') || 
        errorMessage.toLowerCase().includes('does not exist')) {
      return {
        code: 'auth/user-not-found',
        message: t('errors.emailNotFound'),
        field: 'email',
        technical
      };
    }
    return {
      code: 'auth/email-error',
      message: t('validation.emailInvalid'),
      field: 'email',
      technical
    };
  }

  // Password-related errors
  if (errorMessage.toLowerCase().includes('password')) {
    if (errorMessage.toLowerCase().includes('invalid') || 
        errorMessage.toLowerCase().includes('incorrect') ||
        errorMessage.toLowerCase().includes('wrong')) {
      return {
        code: 'auth/wrong-password',
        message: t('errors.wrongPassword'),
        field: 'password',
        technical
      };
    }
    if (errorMessage.toLowerCase().includes('weak') || 
        errorMessage.toLowerCase().includes('requirements') ||
        errorMessage.toLowerCase().includes('short')) {
      return {
        code: 'auth/weak-password',
        message: t('validation.passwordTooShort'),
        field: 'password',
        technical
      };
    }
    return {
      code: 'auth/password-error',
      message: t('validation.passwordTooShort'),
      field: 'password',
      technical
    };
  }

  // Username-related errors
  if (errorMessage.toLowerCase().includes('username') || 
      errorMessage.toLowerCase().includes('name')) {
    if (errorMessage.toLowerCase().includes('already') || 
        errorMessage.toLowerCase().includes('exists') ||
        errorMessage.toLowerCase().includes('taken')) {
      return {
        code: 'auth/username-taken',
        message: t('errors.usernameTaken'),
        field: 'username',
        technical
      };
    }
    if (errorMessage.toLowerCase().includes('invalid') || 
        errorMessage.toLowerCase().includes('format') ||
        errorMessage.toLowerCase().includes('short')) {
      return {
        code: 'auth/invalid-username',
        message: t('validation.usernameTooShort'),
        field: 'username',
        technical
      };
    }
    return {
      code: 'auth/username-error',
      message: t('validation.usernameTooShort'),
      field: 'username',
      technical
    };
  }

  // Storage errors
  if (errorMessage.toLowerCase().includes('storage') || 
      errorMessage.toLowerCase().includes('asyncstorage')) {
    return {
      code: 'auth/storage-error',
      message: 'Impossible de sauvegarder les informations de connexion. Veuillez réessayer.',
      field: 'global',
      technical
    };
  }

  // Authentication errors
  if (errorMessage.toLowerCase().includes('auth') || 
      errorMessage.toLowerCase().includes('login') ||
      errorMessage.toLowerCase().includes('signin')) {
    return {
      code: 'auth/invalid-credentials',
      message: t('errors.invalidCredentials'),
      field: 'global',
      technical
    };
  }

  // Registration errors
  if (errorMessage.toLowerCase().includes('signup') || 
      errorMessage.toLowerCase().includes('register') ||
      errorMessage.toLowerCase().includes('create')) {
    return {
      code: 'auth/signup-failed',
      message: t('errors.signupFailed'),
      field: 'global',
      technical
    };
  }

  // Default fallback
  return {
    code: 'auth/unknown-error',
    message: t('errors.somethingWentWrong'),
    field: 'global',
    technical
  };
};

/**
 * AuthProvider component provides authentication context
 * 
 * Features:
 * - User login/logout functionality with comprehensive error handling
 * - User registration with validation
 * - Profile updates with persistence
 * - Persistent authentication state via AsyncStorage
 * - Loading and error state management
 * - Normalized error responses with user-friendly messages
 * 
 * Error Codes:
 * - auth/network-error: Network connectivity issues
 * - auth/email-already-in-use: Email already registered
 * - auth/invalid-email: Invalid email format
 * - auth/user-not-found: No account with this email
 * - auth/wrong-password: Incorrect password
 * - auth/weak-password: Password too short
 * - auth/username-taken: Username already taken
 * - auth/invalid-username: Username too short
 * - auth/storage-error: AsyncStorage issues
 * - auth/invalid-credentials: General auth failure
 * - auth/registration-failed: Signup failure
 * - auth/unknown-error: Unhandled errors
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isLoading: true,
    error: null,
  });

  /**
   * Check user session on app startup
   */
  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Check if a user is logged in from AsyncStorage
   * Updates state if needed, returns true/false
   * @returns Promise<boolean> - True if user is authenticated
   */
  const checkAuth = async (): Promise<boolean> => {
      try {
        const userJSON = await AsyncStorage.getItem('user');
        if (userJSON) {
        const user = JSON.parse(userJSON);
        dispatch({ type: 'LOGIN', payload: user });
        return true;
        } else {
        dispatch({ type: 'LOGOUT' });
        return false;
      }
    } catch (error) {
      const normalizedError = normalizeError(error, 'checkAuth');
      dispatch({ type: 'SET_ERROR', payload: normalizedError });
      return false;
    }
  };

  /**
   * Clear the current error state
   */
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  /**
   * Objet du contexte d'authentification
   */                                                                                                                                                                                                                                                                                                                                                                 
  const authContext: AuthContextType = {
    ...state,
    /**
     * Indique si un utilisateur est authentifié (user !== null)
     */
    isAuthenticated: !!state.user,
    /**
     * Vérifie si un utilisateur est connecté (AsyncStorage ou state)
     */
    checkAuth,
    /**
     * Clear the current error state
     */
    clearError,
    /**
     * Authenticate user with email and password
     * 
     * @param email - User's email address
     * @param password - User's password
     * @returns Promise<boolean> - True if login successful
     * @throws AuthError - Normalized error with code and user-friendly message
     * 
     * Possible error codes:
     * - auth/network-error: Network connectivity issues
     * - auth/invalid-email: Invalid email format
     * - auth/user-not-found: No account with this email
     * - auth/wrong-password: Incorrect password
     * - auth/storage-error: Failed to save login data
     * - auth/unknown-error: Unhandled errors
     */
    login: async (email, password) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      try {
        console.log('AuthContext - Login attempt:', email);
        const user = await loginUser(email, password);
        const userData = { 
          id: user.id || String(Date.now()), 
          name: user.name || user.username || '', 
          email: user.email 
        };
        
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        console.log('AuthContext - User saved:', userData);
        
        dispatch({ type: 'LOGIN', payload: userData });
        console.log('AuthContext - Login successful, isAuthenticated should be true');
        
        return true;
      } catch (error) {
        console.error('AuthContext - Login error:', error);
        const normalizedError = normalizeError(error, 'login');
        dispatch({ type: 'SET_ERROR', payload: normalizedError });
        return false;
      }
    },
    /**
     * Register a new user and log them in
     * 
     * @param name - User's name
     * @param email - User's email address
     * @param password - User's password
     * @returns Promise<boolean> - True if registration successful
     * @throws AuthError - Normalized error with code and user-friendly message
     * 
     * Possible error codes:
     * - auth/network-error: Network connectivity issues
     * - auth/email-already-in-use: Email already registered
     * - auth/invalid-email: Invalid email format
     * - auth/weak-password: Password too short
     * - auth/username-taken: Username already taken
     * - auth/invalid-username: Username too short
     * - auth/registration-failed: General signup failure
     * - auth/unknown-error: Unhandled errors
     */
    signup: async (name, email, password) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });
      
      try {
        await registerUser(email, name, password);
        // Automatic login after registration
        const user = await loginUser(email, password);
        const userData = { 
          id: user.id || String(Date.now()), 
          name: user.name || name, 
          email: user.email 
        };
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        dispatch({ type: 'LOGIN', payload: userData });
        return true;
      } catch (error) {
        console.error('AuthContext - Signup error:', error);
        const normalizedError = normalizeError(error, 'signup');
        dispatch({ type: 'SET_ERROR', payload: normalizedError });
        return false;
      }
    },
    /**
     * Log out the current user
     * Clears user data from AsyncStorage and state
     */
    logout: async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
      await AsyncStorage.removeItem('user');
      dispatch({ type: 'LOGOUT' });
      } catch (error) {
        console.error('AuthContext - Logout error:', error);
        const normalizedError = normalizeError(error, 'logout');
        dispatch({ type: 'SET_ERROR', payload: normalizedError });
        // Still logout even if storage fails
        dispatch({ type: 'LOGOUT' });
      }
    },
    /**
     * Update user profile (persists to AsyncStorage and state)
     * 
     * @param updatedData - Partial user data to update
     * @throws AuthError - If update fails
     */
    updateProfile: async (updatedData) => {
        dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
        
      try {
        const currentUser = state.user;
        if (!currentUser) {
          throw new Error('No user logged in');
        }
        
        const updated = await updateUser(currentUser.email, updatedData);
        await AsyncStorage.setItem('user', JSON.stringify(updated));
        dispatch({ type: 'UPDATE_USER', payload: updatedData });
        dispatch({ type: 'SET_LOADING', payload: false });
      } catch (error) {
        console.error('AuthContext - Update profile error:', error);
        const normalizedError = normalizeError(error, 'updateProfile');
        dispatch({ type: 'SET_ERROR', payload: normalizedError });
        // No throw here
      }
    }
  };

  return <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>;
};

/**
 * Hook to access the authentication context
 * @returns Authentication context with all methods and state
 * @throws Error if used outside of AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};