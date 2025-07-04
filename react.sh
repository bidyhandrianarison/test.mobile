#!/bin/bash

# Script de migration Expo Router vers React Navigation
# Auteur: Assistant AI
# Date: $(date)

echo "🚀 Début de la migration Expo Router vers React Navigation"
echo "=================================================="

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages colorés
print_message() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Vérifier si nous sommes dans un projet React Native/Expo
if [ ! -f "package.json" ]; then
    print_error "package.json non trouvé. Assurez-vous d'être dans le répertoire racine du projet."
    exit 1
fi

# Créer une sauvegarde
print_info "Création d'une sauvegarde..."
backup_dir="backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$backup_dir"
cp -r app "$backup_dir/" 2>/dev/null || print_warning "Dossier 'app' non trouvé (normal si pas d'Expo Router)"
cp package.json "$backup_dir/"
cp App.tsx "$backup_dir/" 2>/dev/null || cp App.js "$backup_dir/" 2>/dev/null
print_message "Sauvegarde créée dans $backup_dir"

# 3. Créer la structure de dossiers
print_info "Création de la nouvelle structure de dossiers..."

# Créer les dossiers nécessaires
mkdir -p screens
mkdir -p navigation
mkdir -p types

print_message "Structure de dossiers créée"

# 4. Supprimer l'ancienne structure app/
if [ -d "app" ]; then
    print_info "Suppression de l'ancienne structure app/..."
    rm -rf app
    print_message "Dossier app/ supprimé"
fi

# 5. Créer les fichiers de navigation
print_info "Création des fichiers de navigation..."

# Créer navigation/RootNavigator.tsx
cat > navigation/RootNavigator.tsx << 'EOF'
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, ActivityIndicator, Text, Pressable, Platform, StyleSheet } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

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

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Navigation des onglets principaux
const TabNavigator = () => {
  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: Colors.light.tint,
          headerShown: true,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Accueil',
            tabBarIcon: ({ color }) => <FontAwesome name="home" size={28} color={color} />,
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            title: 'Profil',
            tabBarIcon: ({ color }) => <FontAwesome name="user" size={28} color={color} />,
          }}
        />
      </Tab.Navigator>
      
      {/* Bouton flottant pour ajouter un produit */}
      <FloatingActionButton />
    </View>
  );
};

const FloatingActionButton = () => {
  const navigation = useNavigation();
  
  return (
    <Pressable 
      style={({ pressed }) => [styles.fab, pressed && { opacity: 0.7 }]}
      onPress={() => navigation.navigate('AddProduct' as never)}
    >
      <Ionicons name="add" size={32} color="#fff" />
    </Pressable>
  );
};

// Navigation d'authentification
const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
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
        options={{ title: 'Ajouter un produit' }}
      />
      <Stack.Screen 
        name="EditProfile" 
        component={EditProfileScreen}
        options={{ title: 'Modifier le profil' }}
      />
      <Stack.Screen 
        name="ProductDetail" 
        component={ProductDetailScreen}
        options={{ title: 'Détail du produit' }}
      />
      <Stack.Screen 
        name="ProductEdit" 
        component={ProductEditScreen}
        options={{ title: 'Modifier le produit' }}
      />
    </Stack.Navigator>
  );
};

// Navigateur racine avec gestion de l'authentification
const RootNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
        <Text style={{ marginTop: 10 }}>Chargement...</Text>
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
  fab: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 38 : 24,
    alignSelf: 'center',
    backgroundColor: Colors.light.tint,
    borderRadius: 32,
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 999,
  },
});

export default RootNavigator;
EOF

# 6. Créer types/navigation.ts
cat > types/navigation.ts << 'EOF'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';

// Types pour la navigation principale
export type RootStackParamList = {
  MainTabs: undefined;
  AddProduct: undefined;
  EditProfile: undefined;
  ProductDetail: { productId: string };
  ProductEdit: { productId: string };
};

// Types pour les onglets
export type TabParamList = {
  Home: undefined;
  Profile: undefined;
};

// Types pour l'authentification
export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

// Props types pour les écrans
export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

export type TabScreenProps<T extends keyof TabParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, T>,
  RootStackScreenProps<keyof RootStackParamList>
>;

export type AuthScreenProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<
  AuthStackParamList,
  T
>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
EOF

# 7. Créer les écrans de base
print_info "Création des écrans de base..."

# Créer screens/LoginScreen.tsx
cat > screens/LoginScreen.tsx << 'EOF'
import { View, Text, SafeAreaView, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { Button } from 'react-native-elements'
import FormInput from '../components/FormInput'
import { validateEmail, validatePassword } from '../utils/validation'
import { useAuth } from '../contexts/AuthContext';
import { AuthScreenProps } from '../types/navigation';

const LoginScreen = ({ navigation }: AuthScreenProps<'Login'>) => {
    const { login } = useAuth();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emailError, setEmailError] = useState<string | null>(null)
    const [passwordError, setPasswordError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    
    const ToSignup = () => navigation.navigate('Signup');

    const handleLogin = async () => {
        setIsLoading(true);
        setEmailError(null);
        setPasswordError(null);
        try {
            const success = await login(email, password);
            if (success) {
                // La navigation sera gérée automatiquement par le RootNavigator
            }
        } catch (error: any) {
            if (error.message.includes('mot de passe')) {
                setPasswordError(error.message);
            } else {
                setEmailError(error.message);
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <SafeAreaView style={styles.safeContainer}>
            <View style={styles.container} >
                <View style={styles.subContainer} >
                    <Text style={styles.title}>Connexion</Text>
                    <FormInput
                        icon='person'
                        handleChange={setEmail}
                        isPassword={false}
                        labelValue={email}
                        label='Email'
                    />
                    {emailError && <Text style={{ color: 'red', alignSelf: 'flex-start' }}>{emailError}</Text>}
                    <FormInput
                        icon='shield-lock'
                        handleChange={setPassword}
                        isPassword={true}
                        labelValue={password}
                        label='Mot de passe'
                    />
                    {passwordError && <Text style={{ color: 'red', alignSelf: 'flex-start' }}>{passwordError}</Text>}

                    <Button title={"Se connecter"} onPress={handleLogin} loading={isLoading} />
                </View>

                <View>
                    <Text>Vous n'avez pas de compte ?</Text>
                    <Button style={styles.outlineButton} title={"Créer un compte"} onPress={ToSignup} />
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeContainer:{
        flex: 1,
        borderWidth: 1,
        borderColor: '#0005',
        backgroundColor: '#f7f9ef'
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 50
    },
    subContainer: {
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontWeight: "bold",
        fontSize: 24,
        marginBottom: 20
    },
    outlineButton: {
        backgroundColor: 'white',
        color: 'black',
        width: '90%'
    }
})

export default LoginScreen
EOF

# Créer screens/SignupScreen.tsx
cat > screens/SignupScreen.tsx << 'EOF'
import React, { useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import FormInput from '../components/FormInput';
import { validateEmail, validatePassword } from '../utils/validation';
import { useAuth } from '../contexts/AuthContext';
import { AuthScreenProps } from '../types/navigation';

const SignupScreen = ({ navigation }: AuthScreenProps<'Signup'>) => {
    const { signup } = useAuth();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState<string | null>(null);
    const [usernameError, setUsernameError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const ToLogin = () => navigation.navigate('Login');

    const handleSignup = async () => {
        setIsLoading(true);
        setEmailError(null);
        setPasswordError(null);
        setUsernameError(null);
        
        try {
            const success = await signup(username, email, password);
            if (success) {
                // La navigation sera gérée automatiquement
            }
        } catch (error: any) {
            if (error.message.includes('email')) {
                setEmailError(error.message);
            } else if (error.message.includes('nom')) {
                setUsernameError(error.message);
            } else {
                setPasswordError(error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeContainer}>
            <View style={styles.container}>
                <View style={styles.subContainer}>
                    <Text style={styles.title}>Créer un compte</Text>
                    
                    <FormInput
                        icon='person'
                        handleChange={setUsername}
                        isPassword={false}
                        labelValue={username}
                        label='Nom d\'utilisateur'
                    />
                    {usernameError && <Text style={{ color: 'red', alignSelf: 'flex-start' }}>{usernameError}</Text>}
                    
                    <FormInput
                        icon='mail'
                        handleChange={setEmail}
                        isPassword={false}
                        labelValue={email}
                        label='Email'
                    />
                    {emailError && <Text style={{ color: 'red', alignSelf: 'flex-start' }}>{emailError}</Text>}
                    
                    <FormInput
                        icon='shield-lock'
                        handleChange={setPassword}
                        isPassword={true}
                        labelValue={password}
                        label='Mot de passe'
                    />
                    {passwordError && <Text style={{ color: 'red', alignSelf: 'flex-start' }}>{passwordError}</Text>}

                    <Button title="S'inscrire" onPress={handleSignup} loading={isLoading} />
                </View>

                <View>
                    <Text>Vous avez déjà un compte ?</Text>
                    <Button style={styles.outlineButton} title="Se connecter" onPress={ToLogin} />
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#0005',
        backgroundColor: '#f7f9ef'
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 50
    },
    subContainer: {
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontWeight: "bold",
        fontSize: 24,
        marginBottom: 20
    },
    outlineButton: {
        backgroundColor: 'white',
        color: 'black',
        width: '90%'
    }
});

export default SignupScreen;
EOF

# Créer les autres écrans de base
print_info "Création des écrans restants..."

# HomeScreen
cat > screens/HomeScreen.tsx << 'EOF'
import React, { useEffect, useState, useMemo } from 'react';
import { StyleSheet, View, TouchableOpacity, Text as RNText } from 'react-native';
import { Text } from 'react-native-elements';
import { useProducts } from '../contexts/ProductContext';
import ProductList from '../components/ProductList';
import FormInput from '../components/FormInput';
import { Product } from '../services/productService';
import { Ionicons } from '@expo/vector-icons';
import FilterModal, { FiltersState } from '../components/FilterModal';
import Colors from '../constants/Colors';
import LoadingSpinner from '../components/LoadingSpinner';
import { TabScreenProps } from '../types/navigation';

const HomeScreen = ({ navigation }: TabScreenProps<'Home'>) => {
  const { products, fetchProducts, isLoading } = useProducts();
  const [search, setSearch] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState<FiltersState>({
    category: null,
    seller: null,
    minPrice: '',
    maxPrice: '',
    activeOnly: false,
  });

  const filteredProducts = useMemo(() => {
    let filtered = products;
    if (filters.category) filtered = filtered.filter(p => p.category === filters.category);
    if (filters.seller) filtered = filtered.filter(p => p.vendeurs === filters.seller);
    if (filters.minPrice) filtered = filtered.filter(p => p.price >= parseFloat(filters.minPrice));
    if (filters.maxPrice) filtered = filtered.filter(p => p.price <= parseFloat(filters.maxPrice));
    if (filters.activeOnly) filtered = filtered.filter(p => p.isActive);
    if (search.trim().length > 0) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase()) ||
        p.vendeurs.toLowerCase().includes(search.toLowerCase())
      );
    }
    return filtered;
  }, [products, filters, search]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const handlePressProduct = (product: Product) => {
    navigation.navigate('ProductDetail', { productId: product.id });
  };

  const categories = Array.from(new Set(products.map(p => p.category)));
  const sellers = Array.from(new Set(products.map(p => p.vendeurs)));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Produits</Text>
      <View style={styles.separator} />
      
      <View style={styles.searchRow}>
        <View style={{ flex: 1 }}>
          <FormInput
            label="Rechercher des produits"
            labelValue={search}
            icon="search"
            handleChange={setSearch}
            placeholderTextColor={Colors.light.tabIconDefault}
            inputStyle={{ color: Colors.light.text }}
          />
        </View>
        <TouchableOpacity style={styles.filterBtn} onPress={() => setFilterModalVisible(true)} activeOpacity={0.8}>
          <Ionicons name="options" size={24} color={Colors.light.tint} />
        </TouchableOpacity>
      </View>
      
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        filters={filters}
        setFilters={setFilters}
        categories={categories}
        sellers={sellers}
        onApply={() => setFilterModalVisible(false)}
        onReset={() => setFilters({ category: null, seller: null, minPrice: '', maxPrice: '', activeOnly: false })}
      />
      
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <ProductList products={filteredProducts} onPress={handlePressProduct} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 24,
    backgroundColor: '#f7fafd',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: '90%',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    marginBottom: 8,
  },
  filterBtn: {
    marginLeft: 8,
    backgroundColor: '#e3eafc',
    borderRadius: 10,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
  },
});

export default HomeScreen;
EOF

# ProfileScreen
cat > screens/ProfileScreen.tsx << 'EOF'
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import Colors from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import UserStats from '../components/UserStats';
import { TabScreenProps } from '../types/navigation';

const ProfileScreen = ({ navigation }: TabScreenProps<'Profile'>) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    Alert.alert('Déconnexion', 'Voulez-vous vraiment vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Se déconnecter', style: 'destructive', onPress: async () => {
          await logout();
        }
      }
    ]);
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  if (!user) return null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || 'User') }}
            style={styles.profileImage}
          />
        </View>
        <Text style={styles.username}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleEditProfile}>
          <Ionicons name="create-outline" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Modifier le profil</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.actionButton, styles.logoutButton]} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Se déconnecter</Text>
        </TouchableOpacity>
      </View>

      <UserStats />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7fafd',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: Colors.light.background,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.light.tint,
    marginBottom: 16,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: Colors.light.tint,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  logoutButton: {
    backgroundColor: '#e53935',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default ProfileScreen;
EOF

# Créer des placeholders pour les autres écrans
cat > screens/AddProductScreen.tsx << 'EOF'
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RootStackScreenProps } from '../types/navigation';

const AddProductScreen = ({ navigation }: RootStackScreenProps<'AddProduct'>) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajouter un produit</Text>
      <Text>Écran à implémenter</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7fafd',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default AddProductScreen;
EOF

cat > screens/EditProfileScreen.tsx << 'EOF'
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RootStackScreenProps } from '../types/navigation';

const EditProfileScreen = ({ navigation }: RootStackScreenProps<'EditProfile'>) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modifier le profil</Text>
      <Text>Écran à implémenter</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7fafd',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default EditProfileScreen;
EOF

cat > screens/ProductDetailScreen.tsx << 'EOF'
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RootStackScreenProps } from '../types/navigation';

const ProductDetailScreen = ({ navigation, route }: RootStackScreenProps<'ProductDetail'>) => {
  const { productId } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Détail du produit</Text>
      <Text>ID: {productId}</Text>
      <Text>Écran à implémenter</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7fafd',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default ProductDetailScreen;
EOF

cat > screens/ProductEditScreen.tsx << 'EOF'
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RootStackScreenProps } from '../types/navigation';

const ProductEditScreen = ({ navigation, route }: RootStackScreenProps<'ProductEdit'>) => {
  const { productId } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modifier le produit</Text>
      <Text>ID: {productId}</Text>
      <Text>Écran à implémenter</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7fafd',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default ProductEditScreen;
EOF

# 8. Créer le nouveau App.tsx
print_info "Création du nouveau App.tsx..."

# Sauvegarder l'ancien App.tsx s'il existe
if [ -f "App.tsx" ]; then
    mv App.tsx "$backup_dir/App.tsx.old"
elif [ -f "App.js" ]; then
    mv App.js "$backup_dir/App.js.old"
fi

cat > App.tsx << 'EOF'
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import RootNavigator from './navigation/RootNavigator';
import { AuthProvider } from './contexts/AuthContext';
import { ProductProvider } from './contexts/ProductContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ProductProvider>
          <RootNavigator />
          <StatusBar style="auto" />
        </ProductProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
EOF

# 9. Ajouter import manquant dans RootNavigator
print_info "Correction des imports dans RootNavigator..."

sed -i '7a import { useNavigation } from '"'"'@react-navigation/native'"'"';' navigation/RootNavigator.tsx

# 10. Nettoyer les fichiers de configuration Expo Router s'ils existent
print_info "Nettoyage des fichiers de configuration..."

# Supprimer les fichiers de configuration Expo Router s'ils existent
rm -f expo-env.d.ts 2>/dev/null
rm -f metro.config.js 2>/dev/null

# 11. Afficher les modifications à faire manuellement
print_info "Migration terminée ! Actions manuelles requises :"
echo ""
print_warning "ACTIONS MANUELLES REQUISES :"
echo "1. Vérifiez vos imports dans tous les composants existants"
echo "   - Remplacez 'useRouter' par 'useNavigation'"
echo "   - Remplacez 'router.push()' par 'navigation.navigate()'"
echo "   - Remplacez 'useLocalSearchParams' par 'route.params'"
echo ""
echo "2. Adaptez vos composants existants aux nouvelles props de navigation"
echo ""
echo "3. Implémentez les écrans manquants dans le dossier 'screens/'"
echo ""
echo "4. Testez la navigation et corrigez les erreurs TypeScript"
echo ""
print_message "Sauvegarde disponible dans : $backup_dir"
print_message "Redémarrez votre serveur de développement : npx expo start"

echo ""
echo "=================================================="
print_message "Migration terminée avec succès ! 🎉"