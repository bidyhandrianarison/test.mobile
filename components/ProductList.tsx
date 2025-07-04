import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import ProductItem from './ProductItem';
import { Product } from '../types/Product';
import EmptyState from './EmptyState';

interface ProductListProps {
  products: Product[];
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onPress?: (product: Product) => void;
}

/**
 * Affiche une liste de produits sous forme de cartes modernes
 */
const ProductList: React.FC<ProductListProps> = ({ products, onEdit, onDelete, onPress }) => {
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
    <FlatList
      data={products}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <ProductItem
          product={item}
          onEdit={onEdit ? () => onEdit(item) : undefined}
          onDelete={onDelete ? () => onDelete(item) : undefined}
          onPress={onPress ? () => onPress(item) : undefined}
        />
      )}
      ListFooterComponent={<View style={{ height: 24 }} />}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
});

export default ProductList;
