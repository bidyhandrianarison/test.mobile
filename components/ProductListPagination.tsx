import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProductItem from './ProductItem';
import EmptyState from './EmptyState';
import Colors from '../constants/Colors';
import { Product } from '../types/Product';

interface ProductListPaginationProps {
  products: Product[];
  totalProducts: number;
  currentPage: number;
  totalPages: number;
  onPress?: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onNextPage: () => void;
  onPreviousPage: () => void;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  loading?: boolean;
}

/**
 * Composant de liste de produits avec pagination
 */
const ProductListPagination: React.FC<ProductListPaginationProps> = ({
  products,
  totalProducts,
  currentPage,
  totalPages,
  onPress,
  onEdit,
  onDelete,
  onNextPage,
  onPreviousPage,
  onPageChange,
  itemsPerPage,
  loading = false,
}) => {
  
  // Version simplifiée de la génération des numéros de pages
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 3; // Réduit pour éviter le débordement

    if (totalPages <= maxVisible + 2) {
      // Afficher toutes les pages si peu de pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Version simplifiée pour éviter le débordement
      if (currentPage <= 2) {
        // Au début
        pages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 1) {
        // À la fin
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        // Au milieu
        pages.push(1, '...', currentPage, '...', totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  // Fonction de rendu d'un item avec gestion explicite des props
  const renderProductItem = ({ item, index }: { item: Product; index: number }) => {
    return (
      <ProductItem
        key={`${item.id}-${index}`} // Key unique même après filtrage
        product={item}
        onEdit={onEdit ? () => onEdit(item) : undefined}
        onDelete={onDelete ? () => onDelete(item) : undefined}
        onPress={onPress ? () => onPress(item) : undefined}
      />
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
        <Text style={styles.loadingText}>Chargement des produits...</Text>
      </View>
    );
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        type="no-products"
        title="Aucun produit à afficher"
        subtitle="Ajoutez un produit ou modifiez vos filtres pour voir des résultats."
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* Liste des produits */}
      <View style={styles.list}>
        {products.map((item, index) => (
          <ProductItem
            key={`${item.id}-${index}`}
            product={item}
            onEdit={onEdit ? () => onEdit(item) : undefined}
            onDelete={onDelete ? () => onDelete(item) : undefined}
            onPress={onPress ? () => onPress(item) : undefined}
          />
        ))}
      </View>

      {/* Contrôles de pagination - VERSION RESPONSIVE */}
      {totalPages > 1 && (
        <View style={styles.paginationContainer}>
          {/* Informations sur la pagination */}
          <View style={styles.paginationInfo}>
            <Text style={styles.paginationText}>
              Page {currentPage} sur {totalPages} • {totalProducts} produits
            </Text>
          </View>

          {/* Navigation responsive */}
          <View style={styles.paginationControls}>
            {/* Bouton Précédent */}
            <TouchableOpacity
              style={[
                styles.navButton,
                currentPage === 1 && styles.disabledButton
              ]}
              onPress={onPreviousPage}
              disabled={currentPage === 1}
              activeOpacity={0.7}
            >
              <Ionicons 
                name="chevron-back" 
                size={20} 
                color={currentPage === 1 ? Colors.light.tabIconDefault : Colors.light.background} 
              />
            </TouchableOpacity>

            {/* ScrollView horizontal pour les numéros de pages */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.pageNumbersScrollContent}
              style={styles.pageNumbersScroll}
            >
              {pageNumbers.map((page, index) => (
                <TouchableOpacity
                  key={`page-${index}`}
                  style={[
                    styles.pageButton,
                    typeof page === 'number' && page === currentPage && styles.activePageButton,
                    typeof page === 'string' && styles.ellipsisButton
                  ]}
                  onPress={() => typeof page === 'number' && onPageChange(page)}
                  disabled={typeof page === 'string'}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.pageButtonText,
                    typeof page === 'number' && page === currentPage && styles.activePageText,
                    typeof page === 'string' && styles.ellipsisText
                  ]}>
                    {page}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Bouton Suivant */}
            <TouchableOpacity
              style={[
                styles.navButton,
                currentPage === totalPages && styles.disabledButton
              ]}
              onPress={onNextPage}
              disabled={currentPage === totalPages}
              activeOpacity={0.7}
            >
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={currentPage === totalPages ? Colors.light.tabIconDefault : Colors.light.background} 
              />
            </TouchableOpacity>
          </View>

          {/* Navigation rapide en bas */}
          <View style={styles.quickNavigation}>
            <TouchableOpacity
              style={styles.quickNavButton}
              onPress={() => onPageChange(1)}
              disabled={currentPage === 1}
            >
              <Text style={[
                styles.quickNavText,
                currentPage === 1 && styles.disabledText
              ]}>
                Première
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickNavButton}
              onPress={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              <Text style={[
                styles.quickNavText,
                currentPage === totalPages && styles.disabledText
              ]}>
                Dernière
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.light.tabIconDefault,
    textAlign: 'center',
  },
  
  // Styles de pagination CORRIGÉS
  paginationContainer: {
    backgroundColor: Colors.light.background,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginTop: 16,
  },
  paginationInfo: {
    alignItems: 'center',
    marginBottom: 12,
  },
  paginationText: {
    fontSize: 13,
    color: Colors.light.tabIconDefault,
    textAlign: 'center',
    fontWeight: '500',
  },
  paginationControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  
  // Boutons de navigation (Précédent/Suivant)
  navButton: {
    backgroundColor: Colors.light.tint,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  disabledButton: {
    backgroundColor: '#f0f0f0',
  },
  
  // ScrollView pour les numéros de pages
  pageNumbersScroll: {
    flex: 1,
    marginHorizontal: 12,
  },
  pageNumbersScrollContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  pageButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#e3eafc',
  },
  activePageButton: {
    backgroundColor: Colors.light.tint,
    borderColor: Colors.light.tint,
  },
  ellipsisButton: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  pageButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.tint,
  },
  activePageText: {
    color: Colors.light.background,
  },
  ellipsisText: {
    color: Colors.light.tabIconDefault,
  },
  
  // Navigation rapide
  quickNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
  },
  quickNavButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f8f9ff',
  },
  quickNavText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.tint,
  },
  disabledText: {
    color: Colors.light.tabIconDefault,
  },
});

export default ProductListPagination;