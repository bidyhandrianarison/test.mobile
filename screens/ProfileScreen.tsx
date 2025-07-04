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
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import UserStats from '../components/UserStats';
// SUPPRIMÉ: import FloatingActionButton from '../components/FloatingActionButton';
import { useNavigation } from '@react-navigation/native';
import Colors from '../constants/Colors';

const { width: screenWidth } = Dimensions.get('window');

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();

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
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header avec dégradé basé sur votre couleur principale */}
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

        {/* Statistiques */}
        <UserStats />

        {/* Bouton de déconnexion */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color={Colors.light.background} />
            <Text style={styles.logoutButtonText}>Se déconnecter</Text>
          </TouchableOpacity>
        </View>

        {/* Espace en bas - PLUS BESOIN DE FAB */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* SUPPRIMÉ: FloatingActionButton */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9ff',
  },
  scrollView: {
    flex: 1,
  },
  headerGradient: {
    height: 220,
    width: '100%',
    position: 'relative',
  },
  editButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
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
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 6,
    borderColor: Colors.light.background,
    shadowColor: Colors.light.tint,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  userInfo: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 6,
  },
  userEmail: {
    fontSize: 16,
    color: Colors.light.tabIconDefault,
    fontWeight: '500',
  },
  actionsContainer: {
    padding: 24,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#FF6B6B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 28,
    gap: 10,
    minWidth: 180,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  logoutButtonText: {
    color: Colors.light.background,
    fontWeight: 'bold',
    fontSize: 16,
  },
  bottomSpacer: {
    height: 40, // Réduit car plus de FAB
  },
});

export default ProfileScreen;