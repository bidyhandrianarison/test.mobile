import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context'; // ✅ AJOUT

import { AuthProvider } from './contexts/AuthContext';
import { ProductsProvider } from './contexts/ProductContext';
import RootNavigator from './navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ProductsProvider>
          <View style={styles.container}>
            <RootNavigator />
            <StatusBar style="auto" />
          </View>
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
