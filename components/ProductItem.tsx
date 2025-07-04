import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Dimensions, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { Product } from '../types/Product';
import ProductOptionsModal from './ProductOptionsModal';

interface ProductItemProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onPress?: (product: Product) => void;
}

const { width } = Dimensions.get('window');

/**
 * Carte produit moderne avec image à gauche, contenu au centre et menu à droite
 */
const ProductItem: React.FC<ProductItemProps> = ({ product, onEdit, onDelete, onPress }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [imageError, setImageError] = useState(false);
  const isLowStock = product.stock <= 5;
  const isInactive = !product.isActive;

  const handleViewDetails = () => {
    setModalVisible(false);
    onPress && onPress(product);
  };

  const handleEdit = () => {
    setModalVisible(false);
    onEdit && onEdit(product);
  };

  const handleDelete = () => {
    setModalVisible(false);
    onDelete && onDelete(product);
  };

  const openOptionsMenu = () => {
    setModalVisible(true);
  };

  // ✅ NOUVEAU : Gestion de l'erreur d'image
  const handleImageError = () => {
    setImageError(true);
  };

  // ✅ NOUVEAU : Génération des initiales pour l'image de secours
  const getProductInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  // ✅ NOUVEAU : Déterminer la couleur de fond basée sur la catégorie
  const getCategoryColor = (category: string) => {
    const categoryColors: Record<string, string> = {
      'Électronique': '#E3F2FD',
      'Vêtements': '#F3E5F5',
      'Maison': '#E8F5E8',
      'Sport': '#FFF3E0',
      'Livres': '#FFF8E1',
      'Informatique': '#E1F5FE',
      'Beauté': '#FCE4EC',
      'Jouets': '#F1F8E9',
      'Automobile': '#FFEBEE',
      default: '#F5F5F5'
    };
    
    return categoryColors[category] || categoryColors['default'];
  };

  const categoryColor = getCategoryColor(product.category);
  const productInitials = getProductInitials(product.name);

  return (
    <>
      <TouchableOpacity
        style={[
          styles.card,
          isInactive && styles.inactiveCard
        ]}
        onPress={() => onPress && onPress(product)}
        activeOpacity={0.7}
        disabled={isInactive}
      >
        {/* ✅ REMPLACÉ : Image du produit à la place de l'icône */}
        <View style={styles.imageContainer}>
          {!imageError && product.image ? (
            <Image
              source={{ uri: product.image }}
              style={styles.productImage}
              resizeMode="cover"
              onError={handleImageError}
            />
          ) : (
            // ✅ Image de secours avec initiales
            <View style={[styles.fallbackImage, { backgroundColor: categoryColor }]}>
              <Text style={styles.initialsText}>{productInitials}</Text>
            </View>
          )}
          
          {/* Badge stock faible */}
          {isLowStock && (
            <View style={styles.stockBadge}>
              <Text style={styles.stockBadgeText}>!</Text>
            </View>
          )}
        </View>

        {/* Contenu principal */}
        <View style={styles.content}>
          <Text style={[styles.productName, isInactive && styles.inactiveText]} numberOfLines={2}>
            {product.name}
          </Text>
          <Text style={[styles.price, isInactive && styles.inactivePrice]}>
            {product.price.toFixed(2)} €
          </Text>
          <View style={styles.metaRow}>
            <Text style={[styles.vendor, isInactive && styles.inactiveMeta]}>
              {product.vendeurs}
            </Text>
            <Text style={[styles.stock, isInactive && styles.inactiveMeta]}>
              Stock: {product.stock}
            </Text>
          </View>
        </View>

        {/* Bouton menu 3 points */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={openOptionsMenu}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons 
            name="ellipsis-vertical" 
            size={20} 
            color={isInactive ? Colors.light.tabIconDefault : Colors.light.text} 
          />
        </TouchableOpacity>

        {/* Overlay pour les produits inactifs */}
        {isInactive && (
          <View style={styles.inactiveOverlay}>
            <View style={styles.inactiveLabel}>
              <Text style={styles.inactiveLabelText}>Inactif</Text>
            </View>
          </View>
        )}
      </TouchableOpacity>

      {/* Modal des options */}
      <ProductOptionsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        product={product}
        onViewDetails={handleViewDetails}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    minHeight: 80,
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowOpacity: 0.06,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  inactiveCard: {
    backgroundColor: '#F8F8F8',
    opacity: 0.7,
  },
  // ✅ NOUVEAU : Container pour l'image (même taille que l'ancienne icône)
  imageContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    marginRight: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  // ✅ NOUVEAU : Styles pour l'image du produit
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  // ✅ NOUVEAU : Image de secours avec initiales
  fallbackImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  // ✅ NOUVEAU : Style pour les initiales
  initialsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.tint,
    textAlign: 'center',
  },
  stockBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.light.background,
  },
  stockBadgeText: {
    color: Colors.light.background,
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
    lineHeight: 20,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.tint,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  vendor: {
    fontSize: 13,
    color: '#4CAF50',
    fontWeight: '500',
    flex: 1,
  },
  stock: {
    fontSize: 13,
    color: Colors.light.tabIconDefault,
    fontWeight: '500',
    marginLeft: 8,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  inactiveOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inactiveLabel: {
    backgroundColor: Colors.light.tabIconDefault,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  inactiveLabelText: {
    color: Colors.light.background,
    fontSize: 12,
    fontWeight: '600',
  },
  inactiveText: {
    color: Colors.light.tabIconDefault,
  },
  inactivePrice: {
    color: Colors.light.tabIconDefault,
  },
  inactiveMeta: {
    color: Colors.light.tabIconDefault,
  },
});

export default ProductItem;
