import React from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Alert } from 'react-native';
import { useProducts } from '@/contexts/ProductContext';
import ProductDetailScreen from '@/components/ProductDetail';

export default function ProductDetailScreenPage() {
  const router = useRouter();
  const { productId } = useLocalSearchParams();
  const { products, deleteProduct, fetchProducts } = useProducts();

  // Trouve le produit à afficher
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return null;
  }

  // Action de suppression avec confirmation
  const handleDelete = async () => {
    Alert.alert(
      'Supprimer le produit',
      'Voulez-vous vraiment supprimer ce produit ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer', style: 'destructive', onPress: async () => {
            await deleteProduct(product.id);
            await fetchProducts();
            router.back();
          }
        }
      ]
    );
  };

  // Action de modification (à adapter selon navigation/UX)
  const handleEdit = () => {
    router.push({ pathname: '/(tabs)/product-edit', params: { productId: product.id } });
  };

  return (
    <ProductDetailScreen
      product={product}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
} 