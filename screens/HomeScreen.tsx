import React, { useEffect, useState, useMemo } from 'react';
import { StyleSheet, View, TouchableOpacity, Text as RNText, Platform } from 'react-native';
import { Text } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import { useProducts } from '../contexts/ProductContext';
import { FlatList } from 'react-native';
import FormInput from '../components/FormInput';
import { Product } from '../types/Product';
import { Ionicons } from '@expo/vector-icons';
import FilterModal, { FiltersState } from '../components/FilterModal';
import Colors from '../constants/Colors';
import LoadingSpinner from '../components/LoadingSpinner';
import FloatingActionButton from '../components/FloatingActionButton';
import ProductItem from '../components/ProductItem';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';

// Type de navigation spécifique
type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { products, fetchProducts, isLoading } = useProducts();
  const insets = useSafeAreaInsets();
  
  const [search, setSearch] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState<FiltersState>({
    category: null,
    seller: null,
    minPrice: '',
    maxPrice: '',
    activeOnly: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  // ✅ CALCUL PRÉCIS : Position du FAB en tenant compte de la TabBar et SafeArea
  const fabBottomPosition = useMemo(() => {
    // Hauteur de base de la TabBar selon la plateforme
    const baseTabBarHeight = Platform.OS === 'ios' ? 84 : 70;
    // Ajout de la safe area pour les appareils avec encoche/barre de geste
    const totalTabBarHeight = baseTabBarHeight + Math.max(insets.bottom, 0);
    
    // Position le FAB à 10px au-dessus de la TabBar
    return totalTabBarHeight + 10;
  }, [insets.bottom]);

  // ✅ CALCUL : Padding pour la FlatList
  const flatListPaddingBottom = useMemo(() => {
    // Assurer qu'il y a assez d'espace pour voir le dernier produit
    // TabBar + FAB (56px) + marges (40px) = environ 160px minimum
    return fabBottomPosition + 56 + 40;
  }, [fabBottomPosition]);

  // ✅ NOUVEAU : Calcul du nombre de filtres actifs
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.category) count++;
    if (filters.seller) count++;
    if (filters.minPrice) count++;
    if (filters.maxPrice) count++;
    if (filters.activeOnly) count++;
    return count;
  }, [filters]);

  const hasActiveFilters = activeFiltersCount > 0;

  // ✅ NOUVEAU : Tri des produits par date de création/modification (plus récents en premier)
  const sortedProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    
    // Créer une copie pour éviter de muter le tableau original
    const productsCopy = [...products];
    
    return productsCopy.sort((a, b) => {
      // Priorité 1: Si updatedAt existe, l'utiliser
      const aDate = a.updatedAt || a.createdAt;
      const bDate = b.updatedAt || b.createdAt;
      
      if (aDate && bDate) {
        // Trier par date décroissante (plus récent en premier)
        return new Date(bDate).getTime() - new Date(aDate).getTime();
      }
      
      // Priorité 2: Si seulement createdAt existe
      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      
      // Priorité 3: Si aucune date, utiliser l'ID comme indicateur d'ordre
      if (a.id && b.id) {
        // Tenter de convertir en nombre pour un tri numérique
        const aId = isNaN(Number(a.id)) ? a.id : Number(a.id);
        const bId = isNaN(Number(b.id)) ? b.id : Number(b.id);
        
        if (typeof aId === 'number' && typeof bId === 'number') {
          return bId - aId; // Plus grand ID en premier
        }
        
        // Sinon, tri lexicographique inverse
        return b.id.localeCompare(a.id);
      }
      
      // Fallback: garder l'ordre original
      return 0;
    });
  }, [products]);

  // ✅ MODIFIÉ : Application des filtres sur les produits triés
  const filteredProducts = useMemo(() => {
    let filtered = sortedProducts; // ✅ Utiliser sortedProducts au lieu de products
    
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
  }, [sortedProducts, filters, search]);

  // Calcul des produits paginés
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage, ITEMS_PER_PAGE]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredProducts.length, search, filters]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const handlePressProduct = (product: Product) => {
    navigation.navigate('ProductDetail', { productId: product.id });
  };

  const handleAddProduct = () => {
    navigation.navigate('AddProduct');
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // ✅ MODIFIÉ : Utiliser sortedProducts pour les filtres (catégories/vendeurs)
  const categories = Array.from(new Set(sortedProducts.map(p => p.category)));
  const sellers = Array.from(new Set(sortedProducts.map(p => p.vendeurs)));

  // Header Component pour la FlatList
  const renderHeader = () => (
    <>
      {/* Section info */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Tous les produits</Text>
        {search.trim().length > 0 && (
          <Text style={styles.searchResultText}>
            Résultats pour "{search}"
          </Text>
        )}
        {/* ✅ NOUVEAU : Indicateur des filtres actifs */}
        {hasActiveFilters && (
          <Text style={styles.activeFiltersIndicator}>
            {activeFiltersCount} filtre{activeFiltersCount > 1 ? 's' : ''} appliqué{activeFiltersCount > 1 ? 's' : ''}
          </Text>
        )}
        {totalPages > 1 && (
          <Text style={styles.pageIndicator}>
            Page {currentPage} sur {totalPages}
          </Text>
        )}
      </View>
    </>
  );

  // Footer Component pour la pagination
  const renderFooter = () => {
    if (totalPages <= 1) return null;

    return (
      <View style={styles.paginationContainer}>
        <View style={styles.paginationControls}>
          <TouchableOpacity
            style={[
              styles.paginationButton,
              currentPage === 1 && styles.disabledButton
            ]}
            onPress={handlePreviousPage}
            disabled={currentPage === 1}
          >
            <Text style={[
              styles.prevNextText,
              currentPage === 1 && styles.disabledText
            ]}>
              Précédent
            </Text>
          </TouchableOpacity>

          <Text style={styles.pageInfo}>
            {currentPage} / {totalPages}
          </Text>

          <TouchableOpacity
            style={[
              styles.paginationButton,
              currentPage === totalPages && styles.disabledButton
            ]}
            onPress={handleNextPage}
            disabled={currentPage === totalPages}
          >
            <Text style={[
              styles.prevNextText,
              currentPage === totalPages && styles.disabledText
            ]}>
              Suivant
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#4DA6E8', Colors.light.tint]}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.welcomeText}>Bienvenue</Text>
          <Text style={styles.headerTitle}>Découvrez nos produits</Text>
        </LinearGradient>
        <LoadingSpinner />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ✅ Header avec gradient + barre de recherche intégrée */}
      <LinearGradient
        colors={['#4DA6E8', Colors.light.tint]}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.welcomeText}>Bienvenue</Text>
        <Text style={styles.headerTitle}>Découvrez nos produits</Text>
        
        {/* ✅ DÉPLACÉ : Barre de recherche et filtre dans le header bleu */}
      <View style={styles.searchRow}>
        <View style={{ flex: 1 }}>
          <FormInput
            label="Rechercher des produits"
            labelValue={search}
            icon="search"
            handleChange={setSearch}
              placeholderTextColor="rgba(255,255,255,0.7)"
              inputStyle={styles.searchInputInHeader}
              style={styles.searchFormInputInHeader}
          />
        </View>
          {/* ✅ NOUVEAU : Bouton filtre avec badge d'indication */}
          <View style={styles.filterButtonContainer}>
            <TouchableOpacity 
              style={[
                styles.filterBtnInHeader,
                hasActiveFilters && styles.filterBtnActive
              ]} 
              onPress={() => setFilterModalVisible(true)} 
              activeOpacity={0.8}
            >
              <Ionicons 
                name="options" 
                size={24} 
                color={hasActiveFilters ? Colors.light.tint : "#fff"} 
              />
        </TouchableOpacity>
            {/* ✅ NOUVEAU : Badge du nombre de filtres */}
            {hasActiveFilters && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>
                  {activeFiltersCount}
                </Text>
              </View>
            )}
          </View>
      </View>
      </LinearGradient>

      {/* ✅ CORRIGÉ : Products list avec padding calculé dynamiquement */}
      <FlatList
        data={paginatedData}
        renderItem={({ item }) => (
          <ProductItem
            product={item}
            onPress={() => handlePressProduct(item)}
          />
        )}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        contentContainerStyle={[
          styles.listContent,
          { 
            // ✅ CORRIGÉ : Padding dynamique pour éviter le chevauchement
            paddingBottom: flatListPaddingBottom
          }
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />

      {/* ✅ CORRIGÉ : FAB avec position parfaite et centrage */}
      <FloatingActionButton 
        onPress={handleAddProduct} 
        color={Colors.light.tint}
        style={{
          ...styles.fab,
          bottom: fabBottomPosition
        }}
      />
      
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        filters={filters}
        setFilters={setFilters}
        categories={categories}
        sellers={sellers}
        onApply={() => setFilterModalVisible(false)}
        onReset={() => setFilters({ 
          category: null, 
          seller: null, 
          minPrice: '', 
          maxPrice: '', 
          activeOnly: false 
        })}
      />
    </View>
  );
};

// ✅ STYLES CORRIGÉS avec position optimisée du FAB
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9ff',
  },
  listContent: {
    // Padding géré dynamiquement
  },
  // ✅ Header agrandi pour inclure la recherche
  headerGradient: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  welcomeText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  // ✅ Styles pour la recherche dans le header
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchFormInputInHeader: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1,
  },
  searchInputInHeader: {
    color: '#fff',
  },
  // ✅ Container pour le bouton filtre avec badge
  filterButtonContainer: {
    position: 'relative',
  },
  filterBtnInHeader: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  filterBtnActive: {
    backgroundColor: '#fff',
    borderColor: '#fff',
    shadowColor: Colors.light.tint,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  // ✅ Badge de notification des filtres
  filterBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  filterBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    lineHeight: 14,
  },
  
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.light.background,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 4,
  },
  searchResultText: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    fontStyle: 'italic',
  },
  activeFiltersIndicator: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '600',
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  pageIndicator: {
    fontSize: 14,
    color: Colors.light.tint,
    fontWeight: '600',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  
  // ✅ CORRIGÉ : Style du FAB optimisé et centré
  fab: {
    position: 'absolute',
    alignSelf: 'center', // ✅ Centrage horizontal automatique
    zIndex: 100, // ✅ Au-dessus de tout
    // ✅ Ombre douce et élévation
    shadowColor: Colors.light.tint,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 12,
    // bottom sera défini dynamiquement via la prop style
  },
  
  paginationContainer: {
    backgroundColor: Colors.light.background,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginTop: 16,
  },
  paginationControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paginationButton: {
    backgroundColor: Colors.light.tint,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  disabledButton: {
    backgroundColor: '#f0f0f0',
  },
  prevNextText: {
    color: Colors.light.background,
    fontWeight: '600',
    fontSize: 14,
  },
  disabledText: {
    color: Colors.light.tabIconDefault,
  },
  pageInfo: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.tint,
  },
});

export default HomeScreen;