import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useProducts } from '../contexts/ProductContext';

const ProductDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { productId } = route.params as { productId: string };
  const { products } = useProducts();
  const product = products.find((p) => p.id === productId);
  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Produit introuvable</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Détail du produit</Text>
      <Text>ID: {productId}</Text>
      <Text>Nom: {product.name}</Text>
      <Text>Écran à implémenter</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7fafd',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default ProductDetailScreen;
