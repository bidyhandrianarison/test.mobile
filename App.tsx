import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import RootNavigator from './navigation/RootNavigator';
import { AuthProvider } from './contexts/AuthContext';
import { ProductsProvider } from './contexts/ProductContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ProductsProvider>
          <RootNavigator />
          <StatusBar style="auto" />
        </ProductsProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
