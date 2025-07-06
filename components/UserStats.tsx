import React, { useMemo, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useProducts } from '../contexts/ProductContext';
import { useAuth } from '../contexts/AuthContext';
import CircleStats from './CircleStats';
import StatCard from './StatCard';
import Colors from '../constants/Colors';
import { t, pluralize } from '../utils/translations';

/**
 * UserStats component displays user's product statistics
 * 
 * Features:
 * - Total product count with circular progress
 * - Active/inactive product counts
 * - Average price and total value
 * - Category breakdown
 * - Automatic updates when products change
 */
const UserStats = () => {
  const { products, getUserStats } = useProducts();
  const { user } = useAuth();

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

    return getUserStats(user.email, user.name, user.id);
  }, [products, user, getUserStats]);

  useEffect(() => {
    console.log('UserStats updated:', {
      totalProducts: products.length,
      userProducts: stats.totalCount,
      userEmail: user?.email
    });
  }, [products.length, stats.totalCount, user?.email]);

  if (!user) return null;

  return (
    <View style={styles.container}>
      {/* Main section with progress circle */}
      <View style={styles.progressSection}>
        <Text style={styles.description}>
          {stats.totalCount > 0 
            ? `You have created a total of ${stats.totalCount} product${stats.totalCount > 1 ? 's' : ''}`
            : "You haven't created any products yet"
          }
        </Text>
        
        <CircleStats
          value={stats.totalCount}
          label="Products"
          color={Colors.light.tint}
          size={140}
        />
        
        {/* Total inventory value */}
        {stats.totalCount > 0 && (
          <Text style={styles.totalValue}>
            Total value: {stats.totalValue.toFixed(2)} €
          </Text>
        )}
      </View>

      {/* Detailed statistics */}
      {stats.totalCount > 0 && (
        <>
          <View style={styles.statsRow}>
            <StatCard
              title="Active Products"
              value={stats.activeCount}
              iconName="checkmark-circle"
              color="#4CAF50"
            />
            <StatCard
              title="Inactive Products"
              value={stats.inactiveCount}
              iconName="close-circle"
              color="#FF6B6B"
            />
          </View>

          <View style={styles.statsRow}>
            <StatCard
              title="Average Price"
              value={`${stats.averagePrice.toFixed(2)} €`}
              iconName="trending-up"
              color="#FF9800"
            />
            <StatCard
              title="Categories"
              value={stats.categories.length}
              iconName="grid"
              color="#9C27B0"
            />
          </View>

          {/* Categories section */}
          {stats.categories.length > 0 && (
            <View style={styles.categoriesSection}>
              <Text style={styles.categoriesTitle}>Your categories:</Text>
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

      {/* Empty state with encouragement */}
      {stats.totalCount === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            Start by adding your first product to see your statistics!
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