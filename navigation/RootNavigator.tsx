import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, ActivityIndicator, Text, Pressable, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

import { useAuth } from '../contexts/AuthContext';
import Colors from '../constants/Colors';
import type { 
  RootStackParamList, 
  TabParamList, 
  AuthStackParamList 
} from '../types/navigation';

// Screens
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AddProductScreen from '../screens/AddProductScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import ProductEditScreen from '../screens/ProductEditScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

// Composant pour un élément de la tab bar
interface TabBarItemProps {
  label: string;
  iconName: string;
  isActive: boolean;
  onPress: () => void;
}

const TabBarItem: React.FC<TabBarItemProps> = ({ label, iconName, isActive, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.tabBarItem} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons 
        name={iconName as any} 
        size={24} 
        color={isActive ? Colors.light.tint : Colors.light.tabIconDefault} 
      />
      <Text style={[
        styles.tabBarLabel, 
        { color: isActive ? Colors.light.tint : Colors.light.tabIconDefault }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

// Custom Tab Bar Component
const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  const { routes, index: activeIndex } = state;

  return (
    <View style={styles.tabBar}>
      {/* Onglet Home */}
      <TabBarItem
        label="Accueil"
        iconName="home"
        isActive={activeIndex === 0}
        onPress={() => navigation.navigate('Home')}
      />
      
      {/* Onglet Profile */}
      <TabBarItem
        label="Profil"
        iconName="person"
        isActive={activeIndex === 1}
        onPress={() => navigation.navigate('Profile')}
      />
    </View>
  );
};

// Navigation des onglets principaux
const TabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: { display: 'none' }, // On masque la tabBar native
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Accueil',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profil',
        }}
      />
    </Tab.Navigator>
  );
};

// Navigation d'authentification
const AuthNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
    </AuthStack.Navigator>
  );
};

// Navigation principale avec toutes les pages
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
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      />
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen}
        options={{ 
          title: 'Modifier le profil',
          headerStyle: { backgroundColor: Colors.light.tint },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' }
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
  const { isAuthenticated, isLoading } = useAuth();

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
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  // Loading styles
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
  
  // Tab Bar styles
  tabBar: {
    flexDirection: 'row',
    height: 80,
    backgroundColor: Colors.light.background,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    paddingTop: 10,
  },
  tabBarItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 8,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
});

export default RootNavigator;
