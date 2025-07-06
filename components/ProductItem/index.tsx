import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Dimensions, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { Product } from '../../types/Product';
import ProductOptionsModal from '../ProductOptionsModal';
import styles from './styles';

/**
 * Props interface for ProductItem component
 */
interface ProductItemProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onPress?: (product: Product) => void;
}

const { width } = Dimensions.get('window');

/**
 * ProductItem component displays a product card with image, details, and options
 * 
 * Features:
 * - Product image with fallback to initials
 * - Price and stock information
 * - Low stock warning badge
 * - Inactive product overlay
 * - Options menu with edit/delete/view actions
 * - Category-based color coding
 */
const ProductItem: React.FC<ProductItemProps> = ({ product, onEdit, onDelete, onPress }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [imageError, setImageError] = useState(false);
  const isLowStock = product.stock <= 5;
  const isInactive = !product.isActive;

  /**
   * Handle viewing product details
   */
  const handleViewDetails = () => {
    setModalVisible(false);
    onPress && onPress(product);
  };

  /**
   * Handle editing the product
   */
  const handleEdit = () => {
    setModalVisible(false);
    onEdit && onEdit(product);
  };

  /**
   * Handle deleting the product
   */
  const handleDelete = () => {
    setModalVisible(false);
    onDelete && onDelete(product);
  };

  /**
   * Open the options menu modal
   */
  const openOptionsMenu = () => {
    setModalVisible(true);
  };

  /**
   * Handle image loading error
   */
  const handleImageError = () => {
    setImageError(true);
  };

  /**
   * Generate initials from product name for fallback image
   * @param name - Product name
   * @returns Initials string (max 2 characters)
   */
  const getProductInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  /**
   * Get background color based on product category
   * @param category - Product category
   * @returns Color string for the category
   */
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
        {/* Product image container */}
        <View style={styles.imageContainer}>
          {!imageError && product.image ? (
            <Image
              source={{ uri: product.image }}
              style={styles.productImage}
              resizeMode="cover"
              onError={handleImageError}
            />
          ) : (
            <View style={[styles.fallbackImage, { backgroundColor: categoryColor }]}>
              <Text style={styles.initialsText}>{productInitials}</Text>
            </View>
          )}
          
          {/* Low stock warning badge */}
          {isLowStock && (
            <View style={styles.stockBadge}>
              <Text style={styles.stockBadgeText}>!</Text>
            </View>
          )}
        </View>

        {/* Main content */}
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

        {/* Options menu button */}
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

        {/* Overlay for inactive products */}
        {isInactive && (
          <View style={styles.inactiveOverlay}>
            <View style={styles.inactiveLabel}>
              <Text style={styles.inactiveLabelText}>Inactive</Text>
            </View>
          </View>
        )}
      </TouchableOpacity>

      {/* Options modal */}
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

export default ProductItem; 