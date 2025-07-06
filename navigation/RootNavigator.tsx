import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, ActivityIndicator, Text, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import Colors from '../constants/Colors';
import { useAuth } from '../contexts/AuthContext';

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

/**
 * Authentication navigator for login and signup screens
 */
const AuthNavigator = () => {
  return (
    <AuthStack.Navigator 
      screenOptions={{ 
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
    </AuthStack.Navigator>
  );
};

/**
 * Custom tab bar with central notch and floating action button
 */
function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
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
      zIndex: 10
    }}>
      {/* Tab bar background with central notch */}
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

      {/* Centered floating action button */}
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
          zIndex: 11,
        }}
        onPress={() => navigation.navigate('AddProduct')}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      {/* Tabs on left and right of FAB */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: totalTabBarHeight, paddingHorizontal: 32 }}>
        {state.routes.map((route, index) => {
          if (route.name === 'AddProduct') return null; // FAB handles this button
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
              <Text style={{ color: isFocused ? Colors.light.tint : Colors.light.tabIconDefault, fontSize: 12, fontWeight: '600', marginTop: 2 }}>
                {typeof label === 'string' ? label : route.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

/**
 * Tab navigator for main app screens
 */
const TabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

/**
 * Main navigator for authenticated users
 */
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
          title: 'Add Product',
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
          title: 'Edit Profile',
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
          title: 'Product Details',
          headerStyle: { backgroundColor: Colors.light.tint },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      />
      <Stack.Screen 
        name="ProductEdit" 
        component={ProductEditScreen}
        options={{ 
          title: 'Edit Product',
          headerStyle: { backgroundColor: Colors.light.tint },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      />
    </Stack.Navigator>
  );
};

/**
 * Root navigator that handles authentication state
 */
const RootNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
        <Text style={styles.loadingText}>Loading...</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.light.text,
  },
});

export default RootNavigator;