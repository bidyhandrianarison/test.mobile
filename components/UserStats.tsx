import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useProducts } from '../contexts/ProductContext';
import { useAuth } from '../contexts/AuthContext';
import CircleStats from './CircleStats';
import StatCard from './StatCard';
import Colors from '../constants/Colors';

/**
 * Composant affichant les statistiques des produits créés par l'utilisateur
 */
const UserStats = () => {
  const { products } = useProducts();
  const { user } = useAuth();

  // Calcul des statistiques utilisateur
  const stats = useMemo(() => {
    // Filtrer les produits créés par l'utilisateur connecté
    // Utilisation du champ 'vendeurs' pour identifier les produits de l'utilisateur
    const userProducts = products.filter(p => 
      p.vendeurs.toLowerCase() === user?.name.toLowerCase() || 
      p.vendeurs.toLowerCase() === user?.email.toLowerCase()
    );

    // Nombre total de produits
    const totalCount = userProducts.length;
    
    // Produits actifs/inactifs
    const activeCount = userProducts.filter(p => p.isActive).length;
    const inactiveCount = totalCount - activeCount;
    
    return {
      totalCount,
      activeCount,
      inactiveCount,
    };
  }, [products, user]);

  if (!user) return null;

  return (
    <View style={styles.container}>
      <View style={styles.progressSection}>
        <Text style={styles.description}>
          Vous avez créé un total de {stats.totalCount} vente{stats.totalCount > 1 ? 's' : ''}
        </Text>
        
        <CircleStats
          value={stats.totalCount}
          label="Ventes"
          color={Colors.light.tint}
          size={140}
        />
      </View>

      <View style={styles.statsRow}>
        <StatCard
          title="Produits Actifs"
          value={stats.activeCount}
          iconName="checkmark-circle"
          color="#4CAF50"
        />
        <StatCard
          title="Produits Inactifs"
          value={stats.inactiveCount}
          iconName="close-circle"
          color="#FF6B6B"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.background,
    borderRadius: 24,
    margin: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  progressSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  description: {
    fontSize: 16,
    color: Colors.light.tabIconDefault,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
});

export default UserStats;