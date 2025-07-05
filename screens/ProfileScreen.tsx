import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Alert,
  SafeAreaView,
  Platform,
  Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../contexts/AuthContext';
import { Ionicons, Feather } from '@expo/vector-icons';
import UserStats from '../components/UserStats';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../constants/Colors';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();

  // ✅ CALCUL CORRECT : Même hauteur que dans HomeScreen et RootNavigator
  const tabBarHeight = Platform.OS === 'ios' ? 84 : 70;
  const totalTabBarHeight = tabBarHeight + Math.max(insets.bottom, 0);
  
  // ✅ NOUVEAU : Padding bottom pour le contenu (même calcul que HomeScreen)
  const contentPaddingBottom = totalTabBarHeight + 20; // +20px de marge

  // ✅ NOUVEAU : Fonction pour générer les initiales
  const getUserInitials = (name: string) => {
    if (!name || name.trim().length === 0) return 'U';
    
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }
    
    // Prendre la première lettre des deux premiers mots
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  };

  const userInitials = getUserInitials(user?.name || '');

  // ✅ NOUVEAU : Animation pour le bouton de déconnexion
  const logoutButtonScale = new Animated.Value(1);

  const handleLogoutPress = () => {
    // Animation de clic
    Animated.sequence([
      Animated.timing(logoutButtonScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(logoutButtonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Afficher la confirmation
    Alert.alert('Déconnexion', 'Voulez-vous vraiment vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Se déconnecter', 
        style: 'destructive', 
        onPress: async () => {
          await logout();
        }
      }
    ]);
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile' as never);
  };

  if (!user) return null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          // ✅ CORRIGÉ : Padding bottom calculé pour éviter le chevauchement avec la tab bar
          paddingBottom: contentPaddingBottom,
        }}
      >
        {/* Header avec dégradé */}
        <LinearGradient
          colors={['#4DA6E8', Colors.light.tint]}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* ✅ NOUVEAU : Bouton de déconnexion en haut à gauche */}
          <Animated.View style={[
            styles.logoutButtonContainer,
            { transform: [{ scale: logoutButtonScale }] }
          ]}>
            <TouchableOpacity 
              style={styles.logoutIconButton} 
              onPress={handleLogoutPress}
              activeOpacity={0.8}
              accessibilityLabel="Se déconnecter"
            >
              <Feather name="log-out" size={20} color="#E53935" />
            </TouchableOpacity>
          </Animated.View>

          {/* Bouton d'édition en haut à droite (inchangé) */}
          <TouchableOpacity 
            style={styles.editButton} 
            onPress={handleEditProfile}
            activeOpacity={0.8}
            accessibilityLabel="Modifier le profil"
          >
            <Ionicons name="create-outline" size={24} color={Colors.light.background} />
          </TouchableOpacity>

          {/* Zone blanche arrondie en bas */}
          <View style={styles.whiteRoundedSection} />
        </LinearGradient>

        {/* ✅ Avatar avec initiales (inchangé) */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarWrapper}>
            {/* ✅ Dégradé de fond pour l'avatar */}
            <LinearGradient
              colors={[Colors.light.tint, '#4DA6E8']}
              style={styles.avatarGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {/* ✅ Initiales en grand */}
              <Text style={styles.avatarInitials}>
                {userInitials}
              </Text>
            </LinearGradient>
          </View>
        </View>

        {/* Informations utilisateur */}
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>

        {/* Composant de statistiques intégré */}
        <UserStats />
      </ScrollView>
    </SafeAreaView>
  );
};

// ✅ STYLES AMÉLIORÉS avec nouveau bouton de déconnexion iconique
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9ff',
  },
  scrollView: {
    flex: 1,
  },
  headerGradient: {
    height: 200,
    position: 'relative',
    paddingHorizontal: 20,
    paddingTop: 50,
  },

  // ✅ NOUVEAU : Container pour le bouton de déconnexion iconique
  logoutButtonContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  
  // ✅ NOUVEAU : Style du bouton de déconnexion iconique
  logoutIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#E53935',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(229, 57, 53, 0.1)',
  },

  // ✅ Style du bouton d'édition (légèrement ajusté pour symétrie)
  editButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },

  whiteRoundedSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: '#f8f9ff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: -60,
    marginBottom: 20,
  },
  avatarWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    position: 'relative',
  },
  // ✅ Dégradé pour l'avatar
  avatarGradient: {
    width: 112,
    height: 112,
    borderRadius: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // ✅ Style pour les initiales
  avatarInitials: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: Colors.light.tabIconDefault,
  },
});

export default ProfileScreen;