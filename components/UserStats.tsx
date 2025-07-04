import React, { useMemo, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useProducts } from '../contexts/ProductContext';
import { useAuth } from '../contexts/AuthContext';
import CircleStats from './CircleStats';
import StatCard from './StatCard';
import Colors from '../constants/Colors';

/**
 * Composant affichant les statistiques des produits créés par l'utilisateur
 * ✅ CORRECTION : Mise à jour automatique lors des changements de produits
 */
const UserStats = () => {
  const { products, getUserStats } = useProducts(); // ✅ AJOUT : getUserStats depuis le contexte
  const { user } = useAuth();

  // ✅ CORRECTION : Utilisation de getUserStats du contexte pour une cohérence parfaite
  const stats = useMemo(() => {
    if (!user) {
      return {
        totalCount: 0,
        activeCount: 0,
        inactiveCount: 0,
        averagePrice: 0,
        totalValue: 0,
        categories: [],
      };
    }

    // Utilise la méthode du contexte pour garantir la cohérence
    return getUserStats(user.email, user.name);
  }, [products, user, getUserStats]); // ✅ IMPORTANT : Dépendance sur products pour re-calculer automatiquement

  // ✅ DEBUG : Log pour vérifier les mises à jour (à supprimer en production)
  useEffect(() => {
    console.log('🔄 UserStats updated:', {
      totalProducts: products.length,
      userProducts: stats.totalCount,
      userEmail: user?.email
    });
  }, [products.length, stats.totalCount, user?.email]);

  if (!user) return null;

  return (
    <View style={styles.container}>
      {/* Section principale avec cercle de progression */}
      <View style={styles.progressSection}>
        <Text style={styles.description}>
          {stats.totalCount > 0 
            ? `Vous avez créé un total de ${stats.totalCount} produit${stats.totalCount > 1 ? 's' : ''}`
            : "Vous n'avez créé aucun produit pour le moment"
          }
        </Text>
        
        <CircleStats
          value={stats.totalCount}
          label="Produits"
          color={Colors.light.tint}
          size={140}
        />
        
        {/* Valeur totale de l'inventaire */}
        {stats.totalCount > 0 && (
          <Text style={styles.totalValue}>
            Valeur totale: {stats.totalValue.toFixed(2)} €
          </Text>
        )}
      </View>

      {/* Statistiques détaillées */}
      {stats.totalCount > 0 && (
        <>
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

          <View style={styles.statsRow}>
            <StatCard
              title="Prix moyen"
              value={`${stats.averagePrice.toFixed(2)} €`}
              iconName="trending-up"
              color="#FF9800"
            />
            <StatCard
              title="Catégories"
              value={stats.categories.length}
              iconName="grid"
              color="#9C27B0"
            />
          </View>

          {/* Section des catégories */}
          {stats.categories.length > 0 && (
            <View style={styles.categoriesSection}>
              <Text style={styles.categoriesTitle}>Vos catégories:</Text>
              <View style={styles.categoriesContainer}>
                {stats.categories.map((category, index) => (
                  <View key={index} style={styles.categoryChip}>
                    <Text style={styles.categoryText}>{category}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </>
      )}

      {/* État vide avec encouragement */}
      {stats.totalCount === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            Commencez par ajouter votre premier produit pour voir vos statistiques !
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.background,
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 20,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  progressSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.tint,
    marginTop: 16,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  categoriesSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E1E1E1',
  },
  categoriesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 12,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    backgroundColor: '#E3F2FD',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  categoryText: {
    fontSize: 12,
    color: Colors.light.tint,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.light.tabIconDefault,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 22,
  },
});

export default UserStats;