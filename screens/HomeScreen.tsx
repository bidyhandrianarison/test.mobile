import React, { useEffect, useState, useMemo } from 'react';
import { StyleSheet, View, TouchableOpacity, Text as RNText, ScrollView } from 'react-native';
import { Text } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import { useProducts } from '../contexts/ProductContext';
import ProductList from '../components/ProductList';
import FormInput from '../components/FormInput';
import { Product } from '../services/productService';
import { Ionicons } from '@expo/vector-icons';
import FilterModal, { FiltersState } from '../components/FilterModal';
import Colors from '../constants/Colors';
import LoadingSpinner from '../components/LoadingSpinner';
import FloatingActionButton from '../components/FloatingActionButton';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();
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

  const handleAddProduct = () => {
    navigation.navigate('AddProduct' as never);
  };

  const categories = Array.from(new Set(products.map(p => p.category)));
  const sellers = Array.from(new Set(products.map(p => p.vendeurs)));

  return (
    <View style={styles.container}>
      {/* Header avec gradient bleu */}
      <LinearGradient
        colors={['#4DA6E8', Colors.light.tint]}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Titre dans le header */}
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Découvrir les Produits</Text>
          <Text style={styles.headerSubtitle}>
            {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} disponible{filteredProducts.length > 1 ? 's' : ''}
          </Text>
        </View>

        {/* Barre de recherche + bouton filtre dans le gradient */}
        <View style={styles.searchSection}>
          <View style={styles.searchRow}>
            <View style={styles.searchContainer}>
              <FormInput
                label="Rechercher des produits"
                labelValue={search}
                icon="search"
                handleChange={setSearch}
                placeholderTextColor={Colors.light.tabIconDefault}
                inputStyle={{ color: Colors.light.text }}
              />
            </View>
            <TouchableOpacity 
              style={styles.filterBtn} 
              onPress={() => setFilterModalVisible(true)} 
              activeOpacity={0.8}
            >
              <Ionicons name="options" size={24} color={Colors.light.tint} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Zone blanche arrondie en bas */}
        <View style={styles.whiteRoundedSection} />
      </LinearGradient>

      {/* Container blanc avec les produits */}
      <View style={styles.productsContainer}>
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Titre de section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tous les produits</Text>
            {search.trim().length > 0 && (
              <Text style={styles.searchResultText}>
                Résultats pour "{search}"
              </Text>
            )}
          </View>

          {/* Liste des produits */}
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <ProductList products={filteredProducts} onPress={handlePressProduct} />
          )}
        </ScrollView>
      </View>

      {/* Bouton flottant d'ajout - UNIQUEMENT sur HomeScreen */}
      <FloatingActionButton 
        onPress={handleAddProduct} 
        color={Colors.light.tint}
        style={styles.fab}
      />

      {/* Modal de filtres */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9ff',
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    position: 'relative',
  },
  headerContent: {
    alignItems: 'center',
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.background,
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    fontWeight: '500',
  },
  searchSection: {
    marginBottom: 20,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchContainer: {
    flex: 1,
  },
  filterBtn: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  productsContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
    marginTop: -20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120, // Plus d'espace pour le FAB
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 4,
  },
  searchResultText: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    fontStyle: 'italic',
  },
  // Style pour le FAB spécifique au HomeScreen
  fab: {
    position: 'absolute',
    bottom: 100, // Au-dessus de la bottom tab bar
    right: 24,
    zIndex: 1000,
  },
});

export default HomeScreen;