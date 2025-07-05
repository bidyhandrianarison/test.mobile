import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, ActivityIndicator, Text, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

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

// Custom Tab Bar avec découpe centrale et FAB
function CustomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const tabBarHeight = Platform.OS === 'ios' ? 84 : 70;
  const fabSize = 64;
  const fabRadius = fabSize / 2;
  const notchRadius = fabRadius + 8;
  const tabWidth = 393 / 2;
  const totalTabBarHeight = tabBarHeight + insets.bottom;

  return (
    <View style={{ 
      position: 'absolute', 
      left: 0, 
      right: 0, 
      bottom: insets.bottom, 
      height: totalTabBarHeight, 
      backgroundColor: 'transparent', 
      // ✅ MODIFIÉ : Z-index encore plus réduit pour que les modals passent au-dessus
      zIndex: 10 // Réduit de 50 à 10
    }}>
      {/* Fond de la tab bar avec découpe centrale */}
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: totalTabBarHeight }}>
        <Svg width="100%" height={totalTabBarHeight} viewBox={`0 0 393 ${totalTabBarHeight}`} style={{ position: 'absolute', bottom: 0 }}>
          <Path
            d={`M0,0
                H${tabWidth - notchRadius}
                C${tabWidth - notchRadius + 10},0 ${tabWidth - fabRadius},${notchRadius * 1.1} ${tabWidth},${notchRadius + 2}
                C${tabWidth + fabRadius},${notchRadius * 1.1} ${tabWidth + notchRadius - 10},0 ${tabWidth + notchRadius},0
                H393
                V${totalTabBarHeight}
                H0
                Z`}
            fill={Colors.light.background}
            stroke="#E1E1E1"
            strokeWidth={1}
          />
        </Svg>
      </View>

      {/* FAB centré */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          left: '50%',
          transform: [{ translateX: -fabRadius }],
          bottom: totalTabBarHeight - fabRadius + 6,
          width: fabSize,
          height: fabSize,
          borderRadius: fabRadius,
          backgroundColor: Colors.light.tint,
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 8,
          // ✅ MODIFIÉ : Z-index réduit pour le FAB aussi
          zIndex: 11, // Réduit de 51 à 11
        }}
        onPress={() => navigation.navigate('AddProduct')}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      {/* Tabs à gauche et à droite du FAB */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: totalTabBarHeight, paddingHorizontal: 32 }}>
        {state.routes.map((route, index) => {
          if (route.name === 'AddProduct') return null; // FAB gère ce bouton
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;
          const isFocused = state.index === index;
          const iconName = route.name === 'Home'
            ? (isFocused ? 'home' : 'home-outline')
            : (isFocused ? 'person' : 'person-outline');
          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={() => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              }}
              style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 10 }}
              activeOpacity={0.7}
            >
              <Ionicons name={iconName} size={24} color={isFocused ? Colors.light.tint : Colors.light.tabIconDefault} />
              <Text style={{ color: isFocused ? Colors.light.tint : Colors.light.tabIconDefault, fontSize: 12, fontWeight: '600', marginTop: 2 }}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

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

const TabNavigator = () => {
  const insets = useSafeAreaInsets();
  const tabBarHeight = Platform.OS === 'ios' ? 84 : 70;
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.light.tint,
        tabBarInactiveTintColor: Colors.light.tabIconDefault,
        tabBarStyle: { display: 'none' }, // On masque la tabBar native
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}

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
