import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, ActivityIndicator, Text, Platform, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '../contexts/AuthContext';
import Colors from '../constants/Colors';

// Screens
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AddProductScreen from '../screens/AddProductScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import ProductEditScreen from '../screens/ProductEditScreen';

// Types
import type { RootStackParamList, AuthStackParamList, TabStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<TabStackParamList>();

// Navigation d'authentification
const AuthNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
    </AuthStack.Navigator>
  );
};

// ✅ CORRECTION : Tab bar avec hauteur corrigée et icônes fonctionnelles
const TabNavigator = () => {
  const insets = useSafeAreaInsets();
  
  // ✅ CALCUL CORRECT : Hauteur optimisée pour la tab bar
  const tabBarHeight = Platform.OS === 'ios' ? 84 : 70;
  const paddingBottom = Platform.OS === 'ios' ? 34 : 16;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.light.tint,
        tabBarInactiveTintColor: Colors.light.tabIconDefault,
        tabBarStyle: {
          backgroundColor: Colors.light.background,
          borderTopWidth: 1,
          borderTopColor: '#E1E1E1',
          paddingBottom: Math.max(insets.bottom, paddingBottom),
          paddingTop: 10,
          height: tabBarHeight + Math.max(insets.bottom, 0),
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: Platform.OS === 'ios' ? 4 : 2,
        },
        // ✅ SUPPRESSION : tabBarIconStyle qui causait des problèmes d'affichage
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color, size, focused }) => (
            // ✅ SIMPLIFICATION : Icône directe sans container supplémentaire
            <Ionicons 
              name={focused ? "home" : "home-outline"} 
              size={24} // ✅ TAILLE FIXE pour éviter les problèmes
              color={color} 
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size, focused }) => (
            // ✅ SIMPLIFICATION : Icône directe sans container supplémentaire
            <Ionicons 
              name={focused ? "person" : "person-outline"} 
              size={24} // ✅ TAILLE FIXE pour éviter les problèmes
              color={color} 
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// ✅ CORRECTION : Navigation principale sans padding bottom excessif
const MainNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="MainTabs" 
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="AddProduct" 
        component={AddProductScreen}
        options={{ 
          title: 'Ajouter un produit',
          headerStyle: { backgroundColor: Colors.light.tint },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          presentation: 'modal',
        }}
      />
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen}
        options={{ 
          title: 'Modifier le profil',
          headerStyle: { backgroundColor: Colors.light.tint },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          presentation: 'modal',
        }}
      />
      <Stack.Screen 
        name="ProductDetail" 
        component={ProductDetailScreen}
        options={{ 
          title: 'Détail du produit',
          headerStyle: { backgroundColor: Colors.light.tint },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      />
      <Stack.Screen 
        name="ProductEdit" 
        component={ProductEditScreen}
        options={{ 
          title: 'Modifier le produit',
          headerStyle: { backgroundColor: Colors.light.tint },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      />
    </Stack.Navigator>
  );
};

// Navigateur racine avec gestion de l'authentification
const RootNavigator = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  console.log('RootNavigator - État actuel:', { 
    isAuthenticated, 
    isLoading, 
    userEmail: user?.email 
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <MainNavigator />
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.light.text,
  },
});

export default RootNavigator;
