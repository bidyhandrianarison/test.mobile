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
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import UserStats from '../components/UserStats';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../constants/Colors';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();

  // ✅ CALCUL CORRECT : Même hauteur que dans HomeScreen
  const tabBarHeight = Platform.OS === 'ios' ? 84 : 70;
  const safeTabBarHeight = tabBarHeight + Math.max(insets.bottom, 0);

  const handleLogout = async () => {
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
        // ✅ CORRECTION : ContentContainerStyle avec padding bottom correct
        contentContainerStyle={{
          paddingBottom: safeTabBarHeight + 20
        }}
      >
        {/* Header avec dégradé */}
        <LinearGradient
          colors={['#4DA6E8', Colors.light.tint]}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Bouton d'édition en haut à droite */}
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Ionicons name="create-outline" size={24} color={Colors.light.background} />
          </TouchableOpacity>

          {/* Zone blanche arrondie en bas */}
          <View style={styles.whiteRoundedSection} />
        </LinearGradient>

        {/* Avatar centré sur l'intersection */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{ 
                uri: 'https://ui-avatars.com/api/?name=' + 
                     encodeURIComponent(user?.name || 'User') + 
                     '&background=' + Colors.light.tint.substring(1) +
                     '&color=fff&size=120'
              }}
              style={styles.avatar}
            />
          </View>
        </View>

        {/* Informations utilisateur */}
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>

        {/* Composant de statistiques intégré */}
        <UserStats />

        {/* Bouton de déconnexion */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color={Colors.light.background} />
            <Text style={styles.logoutButtonText}>Se déconnecter</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles restent identiques
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
  },
  avatar: {
    width: 112,
    height: 112,
    borderRadius: 56,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 8,
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
  actionsContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    gap: 8,
  },
  logoutButtonText: {
    color: Colors.light.background,
    fontWeight: '600',
    fontSize: 16,
  },
});

export default ProfileScreen;