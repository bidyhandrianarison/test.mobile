import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import { useProducts } from '../contexts/ProductContext';
import { useAuth } from '../contexts/AuthContext';
import Colors from '../constants/Colors';
import type { RootStackParamList } from '../types/navigation';
import { Product } from '../types/Product';

interface ProductOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  product: Product;
  onViewDetails?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

/**
 * Modal des options pour un produit (Voir, Modifier, Supprimer)
 */
const ProductOptionsModal: React.FC<ProductOptionsModalProps> = ({
  visible,
  onClose,
  product,
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { deleteProduct } = useProducts();
  const { user } = useAuth();

  // Vérifie si l'utilisateur peut modifier/supprimer ce produit
  const canModify = product.createdBy === user?.email || product.userId === user?.id;

  // Navigation vers les détails du produit
  const handleViewDetails = () => {
    onClose();
    if (onViewDetails) {
      onViewDetails();
    } else {
      navigation.navigate('ProductDetail', { productId: product.id });
    }
  };

  // Navigation vers l'édition du produit
  const handleEdit = () => {
    // Fermer le modal en premier pour une meilleure UX
    onClose();
    
    if (!canModify) {
      Alert.alert(
        'Action non autorisée',
        'Vous ne pouvez modifier que vos propres produits.',
        [{ text: 'OK' }]
      );
      return;
    }
    // Navigation directe vers l'écran d'édition (toujours prioritaire)
      try {
        navigation.navigate('ProductEdit', { productId: product.id });
      } catch (error) {
        console.error('Erreur de navigation vers ProductEdit:', error);
        Alert.alert(
          'Erreur de navigation',
          'Impossible d\'ouvrir l\'écran d\'édition. Vérifiez que l\'écran ProductEdit est bien configuré.',
          [{ text: 'OK' }]
        );
      }
    // Si une fonction onEdit est fournie, l'appeler en complément
    if (onEdit) {
      onEdit();
    }
  };

  // Suppression du produit avec confirmation
  const handleDelete = () => {
    onClose();
    
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
              Alert.alert('Succès', 'Produit supprimé avec succès');
              if (onDelete) {
                onDelete();
              }
            } catch (error: any) {
              Alert.alert('Erreur', error.message || 'Impossible de supprimer le produit');
            }
          },
        },
      ]
    );
  };

  const menuOptions = [
    {
      id: 'view',
      title: 'Voir les détails',
      icon: 'eye-outline' as const,
      color: Colors.light.tint,
      backgroundColor: '#E3F2FD',
      onPress: handleViewDetails,
      available: true,
    },
    {
      id: 'edit',
      title: 'Modifier',
      icon: 'create-outline' as const,
      color: canModify ? '#FF9800' : Colors.light.tabIconDefault,
      backgroundColor: canModify ? '#FFF3E0' : '#F5F5F5',
      onPress: handleEdit,
      available: true,
    },
    {
      id: 'delete',
      title: 'Supprimer',
      icon: 'trash-outline' as const,
      color: canModify ? '#F44336' : Colors.light.tabIconDefault,
      backgroundColor: canModify ? '#FFEBEE' : '#F5F5F5',
      onPress: handleDelete,
      available: true,
    },
  ];

  return (
    <Modal
      isVisible={visible}
      onSwipeComplete={onClose}
      swipeDirection="down"
      animationIn="slideInUp"
      animationOut="slideOutDown"
      propagateSwipe
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      style={styles.modal}
      backdropOpacity={0.4}
      backdropTransitionOutTiming={0}
    >
      <View style={styles.container}>
        {/* Poignée de glissement */}
        <View style={styles.handle} />
        
        {/* En-tête avec le nom du produit */}
        <View style={styles.header}>
          <View style={styles.productInfo}>
            <Text style={styles.productTitle} numberOfLines={2}>
              {product.name}
            </Text>
            <Text style={styles.productPrice}>
              {product.price.toFixed(2)} €
            </Text>
            <View style={styles.productMeta}>
              <Text style={styles.productVendor}>par {product.vendeurs}</Text>
              {!product.isActive && (
                <View style={styles.inactiveBadge}>
                  <Text style={styles.inactiveBadgeText}>Inactif</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Message d'information si l'utilisateur n'est pas propriétaire */}
        {!canModify && (
          <View style={styles.infoContainer}>
            <Ionicons name="information-circle-outline" size={16} color={Colors.light.tabIconDefault} />
            <Text style={styles.infoText}>
              Vous ne pouvez modifier que vos propres produits
            </Text>
          </View>
        )}

        {/* Options du menu */}
        <View style={styles.optionsContainer}>
          {menuOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionButton, 
                { backgroundColor: option.backgroundColor },
                !canModify && (option.id === 'edit' || option.id === 'delete') && styles.optionButtonDisabled
              ]}
              onPress={() => {
                option.onPress();
              }}
              activeOpacity={0.7}
              disabled={!canModify && (option.id === 'edit' || option.id === 'delete')}
            >
              <View style={[
                styles.optionIconContainer,
                !canModify && (option.id === 'edit' || option.id === 'delete') && styles.optionIconDisabled
              ]}>
                <Ionicons name={option.icon} size={22} color={option.color} />
              </View>
              <Text style={[styles.optionText, { color: option.color }]}>
                {option.title}
              </Text>
              <Ionicons 
                name="chevron-forward" 
                size={18} 
                color={option.color} 
                style={{ opacity: !canModify && (option.id === 'edit' || option.id === 'delete') ? 0.4 : 1 }}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Informations sur le produit */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Stock: {product.stock} • Catégorie: {product.category}
          </Text>
          {product.createdBy && (
            <Text style={styles.footerText}>
              Créé par: {product.createdBy}
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    backgroundColor: Colors.light.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 32,
    maxHeight: '60%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.light.tabIconDefault,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
    opacity: 0.4,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  productInfo: {
    gap: 4,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    lineHeight: 24,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.tint,
  },
  productMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  productVendor: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    fontStyle: 'italic',
  },
  inactiveBadge: {
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  inactiveBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F8F9FA',
    marginHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  infoText: {
    fontSize: 13,
    color: Colors.light.tabIconDefault,
    flex: 1,
  },
  optionsContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  optionButtonDisabled: {
    opacity: 0.6,
  },
  optionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionIconDisabled: {
    backgroundColor: 'rgba(200,200,200,0.5)',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
    textAlign: 'center',
  },
});

export default ProductOptionsModal;