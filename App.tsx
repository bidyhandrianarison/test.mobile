import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from './contexts/AuthContext';
import { ProductsProvider } from './contexts/ProductContext';
import RootNavigator from './navigation/RootNavigator';

/**
 * Main App component
 * 
 * Provides the application with:
 * - Safe area handling for different device screens
 * - Authentication context for user management
 * - Products context for product data management
 * - Root navigation for screen routing
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ProductsProvider>
          {/* ✅ SIMPLIFIÉ : RootNavigator gère maintenant tout en interne */}
          <RootNavigator />
          <StatusBar style="auto" />
        </ProductsProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
