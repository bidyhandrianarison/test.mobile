import React, { useEffect, useState, useRef, useMemo } from 'react';
import {
  StyleSheet, View, TouchableOpacity, Text as RNText, Modal, Animated, Platform, Dimensions, ScrollView, TextInput
} from 'react-native';
import { Text } from 'react-native-elements';
import { useRouter } from 'expo-router';
import { useProducts } from '@/contexts/ProductContext';
import ProductList from '@/components/ProductList';
import FormInput from '@/components/FormInput';
import { Product } from '@/services/productService';
import { Ionicons } from '@expo/vector-icons';
import FilterModal, { FiltersState } from '@/components/FilterModal';
import Colors from '@/constants/Colors';
import LoadingSpinner from '@/components/LoadingSpinner';

// --- Helpers to extract unique categories and sellers ---
const getCategories = (products: Product[]) => Array.from(new Set(products.map(p => p.category)));
const getSellers = (products: Product[]) => Array.from(new Set(products.map(p => p.vendeurs)));


/**
 * Page d'accueil des produits (onglet principal)
 */
export default function TabOneScreen() {
  const { products, fetchProducts, isLoading } = useProducts();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState<FiltersState>({
    category: null,
    seller: null,
    minPrice: '',
    maxPrice: '',
    activeOnly: false,
  });

  // --- Filtrage et recherche combinés ---
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

  // --- Handlers ---
  const handleSearch = (text: string) => setSearch(text);
  const handleApplyFilters = () => setFilterModalVisible(false);
  const handleResetFilters = () => setFilters({ category: null, seller: null, minPrice: '', maxPrice: '', activeOnly: false });
  const handlePressProduct = (product: Product) => {
    router.push({
      pathname: '/(tabs)/product-detail',
      params: { productId: product.id },
    });
  };

  // --- Données pour les filtres ---
  const categories = getCategories(products);
  const sellers = getSellers(products);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Produits</Text>
      <View style={styles.separator} />
      {/* Barre de recherche + bouton filtre */}
      <View style={styles.searchRow}>
        <View style={{ flex: 1 }}>
          <FormInput
            label="Rechercher des produits"
            labelValue={search}
            icon="search"
            handleChange={handleSearch}
            placeholderTextColor={Colors.light.tabIconDefault}
            inputStyle={{ color: Colors.light.text }}
          />
        </View>
        <TouchableOpacity style={styles.filterBtn} onPress={() => setFilterModalVisible(true)} activeOpacity={0.8}>
          <Ionicons name="options" size={24} color={Colors.light.tint} />
        </TouchableOpacity>
      </View>
      {/* Modal de filtres */}
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        filters={filters}
        setFilters={setFilters}
        categories={categories}
        sellers={sellers}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      />
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <ProductList products={filteredProducts} onPress={handlePressProduct} />
      )}
    </View>
  );
}

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
  modalContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 10,
    zIndex: 100,
  },
  handleBar: {
    width: 48,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#e3eafc',
    alignSelf: 'center',
    marginVertical: 10,
  },
  modalContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 18,
    alignSelf: 'center',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2196f3',
    marginBottom: 6,
    marginTop: 10,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    backgroundColor: '#f4f8fb',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 4,
  },
  chipSelected: {
    backgroundColor: '#1976d2',
  },
  chipText: {
    color: '#1976d2',
    fontWeight: '600',
    fontSize: 14,
  },
  chipTextSelected: {
    color: '#fff',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceInput: {
    backgroundColor: '#f4f8fb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e3eafc',
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 15,
    width: 80,
    color: '#222',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  switch: {
    width: 38,
    height: 22,
    borderRadius: 12,
    backgroundColor: '#e3eafc',
    justifyContent: 'center',
    padding: 2,
  },
  switchActive: {
    backgroundColor: '#1976d2',
  },
  switchCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#fff',
    marginLeft: 2,
    elevation: 1,
  },
  switchCircleActive: {
    backgroundColor: '#fff',
    marginLeft: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
    gap: 12,
  },
  resetBtn: {
    backgroundColor: '#e3eafc',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: 'center',
    flex: 1,
  },
  resetBtnText: {
    color: '#1976d2',
    fontWeight: 'bold',
    fontSize: 15,
  },
  applyBtn: {
    backgroundColor: '#1976d2',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: 'center',
    flex: 1,
  },
  applyBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Change center to flex-start
    backgroundColor: '#fff',
    borderRadius: 18,
    marginVertical: 8,
    marginHorizontal: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    ...Platform.select({
      ios: { shadowOpacity: 0.12 },
      android: { elevation: 3 },
    }),
    minHeight: 90, // Réduire la hauteur minimale
    position: 'relative',
    overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
  },
  imageWrapper: {
    width: 100,
    height: 80,
    borderRadius: 14,
    overflow: 'hidden',
    marginRight: 14,
    backgroundColor: '#e3eafc',
    // Supprimer justifyContent et alignItems pour que l'image prenne tout l'espace
  },
  info: {
    flex: 1,
    justifyContent: 'flex-start', // Change center to flex-start
    minWidth: 0,
    paddingRight: 8,
  },
  actions: {
    flexDirection: 'column',
    justifyContent: 'center', // Changer space-between à center
    alignItems: 'flex-end', // Changer center à flex-end
    paddingVertical: 2,
    paddingHorizontal: 4,
    gap: 8,
    alignSelf: 'stretch', // Ajouter pour étirer sur toute la hauteur
  },
});
