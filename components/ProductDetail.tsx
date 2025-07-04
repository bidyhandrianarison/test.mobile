import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { Feather, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { Product } from '@/contexts/ProductContext';

// Props du composant
interface ProductDetailScreenProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

/**
 * Affiche une page de détail produit élégante et moderne
 * @param {ProductDetailScreenProps} props
 */
const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({ product, onEdit, onDelete }) => {
  // Animation pour effet zoom au scroll
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const HEADER_MAX_HEIGHT = 320;
  const HEADER_MIN_HEIGHT = 120;
  const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

  const isLowStock = product.stock <= 5;
  const isInactive = !product.isActive;

  // Calcul de l'opacité et du scale de l'image au scroll
  const imageScale = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.85],
    extrapolate: 'clamp',
  });
  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.85, 0.7],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      {/* Image produit avec effet visuel et badge */}
      <Animated.View style={[styles.header, { height: HEADER_MAX_HEIGHT }]}>  
        <Animated.Image
          source={{ uri: product.image }}
          style={[
            styles.image,
            {
              transform: [{ scale: imageScale }],
              opacity: imageOpacity,
            },
            isInactive && { opacity: 0.5 },
          ]}
          resizeMode="cover"
        />
        {/* Badge stock faible */}
        {isLowStock && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Stock faible</Text>
          </View>
        )}
        {/* Overlay inactif */}
        {isInactive && (
          <View style={styles.overlay}>
            <Text style={styles.inactiveText}>Inactif</Text>
          </View>
        )}
      </Animated.View>
      {/* ScrollView pour le contenu détaillé */}
      <Animated.ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        {/* Nom et prix */}
        <View style={styles.section}>
          <Text style={styles.title}>{product.name}</Text>
          <Text style={styles.price}>{product.price.toFixed(2)} €</Text>
        </View>
        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>
        {/* Infos vendeur, catégorie, stock, état */}
        <View style={styles.infoRow}>
          <View style={styles.infoBlock}>
            <FontAwesome5 name="store" size={18} color="#4caf50" style={styles.infoIcon} />
            <Text style={styles.infoLabel}>Vendeur</Text>
            <Text style={styles.infoValue}>{product.vendeurs}</Text>
          </View>
          <View style={styles.infoBlock}>
            <Feather name="tag" size={18} color="#2196f3" style={styles.infoIcon} />
            <Text style={styles.infoLabel}>Catégorie</Text>
            <Text style={styles.infoValue}>{product.category}</Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <View style={styles.infoBlock}>
            <Feather name="box" size={18} color="#ffb300" style={styles.infoIcon} />
            <Text style={styles.infoLabel}>Stock</Text>
            <Text style={[styles.infoValue, isLowStock && { color: '#ffb300', fontWeight: 'bold' }]}>{product.stock}</Text>
          </View>
          <View style={styles.infoBlock}>
            <Feather name="check-circle" size={18} color={isInactive ? '#aaa' : '#4caf50'} style={styles.infoIcon} />
            <Text style={styles.infoLabel}>État</Text>
            <Text style={[styles.infoValue, !product.isActive && { color: '#aaa' }]}>{product.isActive ? 'Actif' : 'Inactif'}</Text>
          </View>
        </View>
        {/* Séparateur */}
        <View style={styles.separator} />
        {/* Actions principales */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => onEdit && onEdit(product)}
            activeOpacity={0.8}
          >
            <Feather name="edit-2" size={20} color="#2196f3" style={{ marginRight: 8 }} />
            <Text style={styles.actionText}>Modifier</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.deleteBtn]}
            onPress={() => onDelete && onDelete(product)}
            activeOpacity={0.8}
          >
            <MaterialIcons name="delete-outline" size={22} color="#e53935" style={{ marginRight: 8 }} />
            <Text style={[styles.actionText, { color: '#e53935' }]}>Supprimer</Text>
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

// Styles modernes et responsives
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7fafd',
  },
  header: {
    width: '100%',
    backgroundColor: '#e3eafc',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    overflow: 'hidden',
    marginBottom: 0,
  },
  image: {
    width: '100%',
    height: '100%',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  badge: {
    position: 'absolute',
    top: 24,
    left: 24,
    backgroundColor: '#ffb300',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
    zIndex: 2,
    shadowColor: '#ffb300',
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 2,
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
    letterSpacing: 0.2,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(220,220,220,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  inactiveText: {
    color: '#888',
    fontWeight: 'bold',
    fontSize: 18,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 10,
    opacity: 0.95,
  },
  scroll: {
    flex: 1,
    marginTop: -32,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginHorizontal: 18,
    marginTop: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222',
    marginBottom: 8,
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2196f3',
    marginBottom: 2,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2196f3',
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  description: {
    fontSize: 16,
    color: '#444',
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 18,
    marginTop: 18,
  },
  infoBlock: {
    flex: 1,
    backgroundColor: '#f4f8fb',
    borderRadius: 14,
    marginHorizontal: 6,
    padding: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  infoIcon: {
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 13,
    color: '#888',
    fontWeight: '500',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    color: '#222',
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: '#e3eafc',
    marginHorizontal: 32,
    marginVertical: 28,
    borderRadius: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 18,
    gap: 16,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3eafc',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 22,
    marginHorizontal: 4,
    shadowColor: '#2196f3',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  deleteBtn: {
    backgroundColor: '#fff0f0',
    borderWidth: 1,
    borderColor: '#e53935',
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196f3',
  },
});

export default ProductDetailScreen;
