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

// ✅ CORRECTION : Types de navigation spécifiques
type ProductDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;
type ProductDetailScreenRouteProp = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>['route'];

/**
 * Écran de détail d'un produit avec navigation et gestion des actions
 */
const ProductDetailScreenPage = () => {
  const navigation = useNavigation<ProductDetailScreenNavigationProp>();
  const route = useRoute<ProductDetailScreenRouteProp>();
  const { productId } = route.params;
  const { products, deleteProduct, fetchProducts } = useProducts();
  const { user } = useAuth();

  // Recherche du produit à afficher
  const product = products.find((p) => p.id === productId);

  // Vérification des droits de modification
  const canModify = product?.createdBy === user?.email;

  // Gestion de la modification du produit
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

    // ✅ CORRECTION : Navigation typée vers l'écran d'édition
    navigation.navigate('ProductEdit', { productId: product.id });
  };

  // Gestion de la suppression du produit
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
      `Êtes-vous sûr de vouloir supprimer "${product.name}" ?\n\nCette action est irréversible.`,
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

  // États de chargement et d'erreur
  if (!products.length) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <LoadingSpinner />
        <Text style={styles.loadingText}>Chargement du produit...</Text>
      </SafeAreaView>
    );
  }

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
        
        {/* Indicateur de permissions si l'utilisateur n'est pas propriétaire */}
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
    lineHeight: 24,
    marginBottom: 32,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.tint,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    shadowColor: Colors.light.tint,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  permissionIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.tabIconDefault,
  },
  permissionText: {
    marginLeft: 8,
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
});

export default ProductDetailScreenPage;
