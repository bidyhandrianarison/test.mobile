import React, { createContext, useReducer, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockUsers } from '../constants/users';
import { registerUser, loginUser, updateUser } from '@/services/authService';

// Définir le type utilisateur et le type du contexte
export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

export type AuthContextType = {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updatedData: Partial<AuthUser>) => Promise<void>;
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

type UserAction = 
  | { type: 'LOGIN', payload: AuthUser }
  | { type: 'SIGNUP', payload: AuthUser[] }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING', payload: boolean }
  | { type: 'SET_ERROR', payload: string | null }
  | { type: 'UPDATE_USER', payload: Partial<AuthUser> }

type AuthState = {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Reducer pour la gestion de l'état d'authentification
 */
const authReducer = (state: AuthState, action: UserAction): AuthState => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload, isLoading: false };
    case 'SIGNUP':
      // Pas de users dans le state, mais on pourrait gérer une liste si besoin
      return state;
    case 'LOGOUT':
      return { ...state, user: null, isLoading: false };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'UPDATE_USER':
      // Met à jour l'utilisateur dans AsyncStorage via le service
      if (!state.user) return state;
      const updatedUser = { ...state.user, ...action.payload };
      AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      return { ...state, user: updatedUser };
    default:
      return state;
  }
};

/**
 * Fournit le contexte d'authentification à l'application
 * @param children - Sous-arbre React
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isLoading: true,
    error: null,
  });

  // Vérifie la session utilisateur au démarrage
  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Vérifie si un utilisateur est connecté (AsyncStorage ou state)
   * Met à jour le state si besoin, retourne true/false
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
    } catch (e) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to check auth.' });
      return false;
    }
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
     * Authentifie l'utilisateur
     */
    login: async (email, password) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      try {
        const user = await loginUser(email, password);
        const userData = { id: user.id || String(Date.now()), name: user.username || user.name || '', email: user.email };
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        dispatch({ type: 'LOGIN', payload: userData });
        return true;
      } catch (e: any) {
        dispatch({ type: 'SET_ERROR', payload: e.message });
        dispatch({ type: 'SET_LOADING', payload: false });
        return false;
      }
    },
    /**
     * Inscrit un nouvel utilisateur et le connecte
     */
    signup: async (name, email, password) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      try {
        await registerUser(email, name, password);
        // Optionnel : login automatique après inscription
        const user = await loginUser(email, password);
        const userData = { id: user.id || String(Date.now()), name: user.username || user.name || '', email: user.email };
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        dispatch({ type: 'LOGIN', payload: userData });
        return true;
      } catch (e: any) {
        dispatch({ type: 'SET_ERROR', payload: e.message });
        dispatch({ type: 'SET_LOADING', payload: false });
        return false;
      }
    },
    /**
     * Déconnecte l'utilisateur
     */
    logout: async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      await AsyncStorage.removeItem('user');
      dispatch({ type: 'LOGOUT' });
    },
    /**
     * Met à jour le profil utilisateur (persistance et state)
     */
    updateProfile: async (updatedData) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      await new Promise(resolve => setTimeout(resolve, 500));
      const currentUser = state.user;
      if (!currentUser) return;
      // Persiste la modification dans AsyncStorage via le service
      const updated = await updateUser(currentUser.email, updatedData);
      await AsyncStorage.setItem('user', JSON.stringify(updated));
      dispatch({ type: 'UPDATE_USER', payload: updatedData });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>;
};

/**
 * Hook pour accéder au contexte d'authentification
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};