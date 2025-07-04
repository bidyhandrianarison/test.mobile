import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { Product } from '../contexts/ProductContext';
import ProductOptionsModal from './ProductOptionsModal';

interface ProductItemProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onPress?: (product: Product) => void;
}

const { width } = Dimensions.get('window');

/**
 * Carte produit moderne avec icône à gauche, contenu au centre et menu à droite
 */
const ProductItem: React.FC<ProductItemProps> = ({ product, onEdit, onDelete, onPress }) => {
  const [modalVisible, setModalVisible] = useState(false);
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

  // Déterminer la couleur de l'icône basée sur la catégorie
  const getIconData = (category: string) => {
    const categoryColors: Record<string, { bg: string; icon: string; color: string }> = {
      'Électronique': { bg: '#E3F2FD', icon: 'phone-portrait-outline', color: '#1976D2' },
      'Vêtements': { bg: '#F3E5F5', icon: 'shirt-outline', color: '#7B1FA2' },
      'Maison': { bg: '#E8F5E8', icon: 'home-outline', color: '#388E3C' },
      'Sport': { bg: '#FFF3E0', icon: 'fitness-outline', color: '#F57C00' },
      'Livres': { bg: '#FFF8E1', icon: 'book-outline', color: '#F9A825' },
      'Automobile': { bg: '#FFEBEE', icon: 'car-outline', color: '#D32F2F' },
      default: { bg: '#F5F5F5', icon: 'cube-outline', color: Colors.light.tint }
    };
    
    return categoryColors[category] || categoryColors['default'];
  };

  const iconData = getIconData(product.category);

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
        {/* Icône de catégorie à gauche */}
        <View style={[styles.iconContainer, { backgroundColor: iconData.bg }]}>
          <Ionicons 
            name={iconData.icon as any} 
            size={28} 
            color={iconData.color} 
          />
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
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
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
