import React from 'react';
import { View, Text, StyleSheet, Alert, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useProducts } from '../contexts/ProductContext';
import { useAuth } from '../contexts/AuthContext';
import ProductDetailScreen from '../components/ProductDetail';
import { Feather } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import LoadingSpinner from '../components/LoadingSpinner';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';

/**
 * Navigation prop type for product detail screen
 */
type ProductDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * Route prop type for product detail screen
 */
type ProductDetailScreenRouteProp = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>['route'];

/**
 * ProductDetailScreenPage component displays detailed product information
 * 
 * Features:
 * - Product details display
 * - Edit and delete functionality for product owners
 * - Permission-based access control
 * - Loading and error states
 * - Navigation back to previous screen
 */
const ProductDetailScreenPage = () => {
  const navigation = useNavigation<ProductDetailScreenNavigationProp>();
  const route = useRoute<ProductDetailScreenRouteProp>();
  const { productId } = route.params;
  const { products, deleteProduct, fetchProducts } = useProducts();
  const { user } = useAuth();

  // Find the product to display
  const product = products.find((p) => p.id === productId);

  // Check modification permissions
  const canModify = product?.createdBy === user?.email;

  /**
   * Handle product editing
   * Navigates to edit screen if user has permission
   */
  const handleEdit = () => {
    if (!product) return;
    
    if (!canModify) {
      Alert.alert(
        'Action non autorisée',
        'Vous ne pouvez modifier que vos propres produits.',
        [{ text: 'OK' }]
      );
      return;
    }

    navigation.navigate('ProductEdit', { productId: product.id });
  };

  /**
   * Handle product deletion
   * Shows confirmation dialog and deletes if user has permission
   */
  const handleDelete = () => {
    if (!product) return;

    if (!canModify) {
      Alert.alert(
        'Action non autorisée',
        'Vous ne pouvez supprimer que vos propres produits.',
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Confirmer la suppression',
      `Êtes-vous sûr de vouloir supprimer "${product.name}" ?\n\nCette action ne peut pas être annulée.`,
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProduct(product.id);
              await fetchProducts();
              
              Alert.alert(
                'Succès', 
                'Produit supprimé avec succès',
                [
                  { 
                    text: 'OK', 
                    onPress: () => navigation.goBack() 
                  }
                ]
              );
            } catch (error: any) {
              Alert.alert(
                'Erreur', 
                error.message || 'Impossible de supprimer le produit'
              );
            }
          },
        },
      ]
    );
  };

  // Loading state
  if (!products.length) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <LoadingSpinner />
        <Text style={styles.loadingText}>Chargement du produit...</Text>
      </SafeAreaView>
    );
  }

  // Error state - product not found
  if (!product) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <View style={styles.errorContent}>
          <Feather name="alert-circle" size={64} color={Colors.light.tabIconDefault} />
          <Text style={styles.errorTitle}>Produit introuvable</Text>
          <Text style={styles.errorSubtitle}>
            Ce produit n'existe pas ou a été supprimé
          </Text>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Feather name="arrow-left" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.backButtonText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{
          paddingBottom: 32,
          ...styles.scrollContent,
        }}
        showsVerticalScrollIndicator={false}
      >
        <ProductDetailScreen
          product={product}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        
        {/* Permission indicator if user is not the owner */}
        {!canModify && product.createdBy && (
          <View style={styles.permissionIndicator}>
            <Feather name="info" size={16} color={Colors.light.tabIconDefault} />
            <Text style={styles.permissionText}>
              Seul le créateur peut modifier ce produit
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7fafd',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7fafd',
    paddingHorizontal: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.light.tabIconDefault,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#f7fafd',
  },
  errorContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtitle: {
    fontSize: 16,
    color: Colors.light.tabIconDefault,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2f95dc',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  permissionIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    borderColor: '#ffeaa7',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 16,
    marginTop: 16,
  },
  permissionText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#856404',
  },
});

export default ProductDetailScreenPage;
