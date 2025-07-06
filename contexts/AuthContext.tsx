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
 * AuthProvider component provides authentication context
 * 
 * Features:
 * - User login/logout functionality
 * - User registration
 * - Profile updates
 * - Persistent authentication state
 * - Loading and error state management
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
     * Authenticate user with email and password
     * @param email - User's email address
     * @param password - User's password
     * @returns Promise<boolean> - True if login successful
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
      } catch (e: any) {
        console.error('AuthContext - Login error:', e);
        dispatch({ type: 'SET_ERROR', payload: e.message });
        dispatch({ type: 'SET_LOADING', payload: false });
        throw e;
      }
    },
    /**
     * Register a new user and log them in
     * @param name - User's name
     * @param email - User's email address
     * @param password - User's password
     * @returns Promise<boolean> - True if registration successful
     */
    signup: async (name, email, password) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      try {
        await registerUser(email, name, password);
        // Optional: automatic login after registration
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
     * @param updatedData - Partial user data to update
     */
    updateProfile: async (updatedData) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      try {
        const currentUser = state.user;
      if (!currentUser) return;
      
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