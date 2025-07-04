import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { Feather, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { Product } from '../types/Product';
import Colors from '../constants/Colors';

// Props du composant
interface ProductDetailScreenProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

const { width } = Dimensions.get('window');

/**
 * ✅ CORRIGÉ : Page de détail produit avec animation de scroll fixée
 */
const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({ product, onEdit, onDelete }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const isLowStock = product.stock <= 5;
  const isInactive = !product.isActive;

  // ✅ Animation d'entrée seulement (suppression des animations de scroll buggy)
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // ✅ Fonction pour déterminer la couleur de statut
  const getStatusConfig = () => {
    if (isInactive) {
      return {
        color: '#FF6B6B',
        backgroundColor: '#FFEBEE',
        text: 'Inactif',
        icon: 'x-circle' as const,
      };
    }
    return {
      color: '#4CAF50',
      backgroundColor: '#E8F5E8',
      text: 'Actif',
      icon: 'check-circle' as const,
    };
  };

  const statusConfig = getStatusConfig();

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true} // ✅ Activation du bounce naturel
      >
        {/* ✅ CORRIGÉ : Image fixe sans animation de scroll */}
        <View style={styles.imageSection}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: product.image }}
              style={styles.productImage}
              resizeMode="cover"
            />
            
            {/* Badge stock faible */}
            {isLowStock && (
              <View style={styles.stockBadge}>
                <Feather name="alert-triangle" size={16} color="#fff" />
                <Text style={styles.stockBadgeText}>Stock faible</Text>
              </View>
            )}
            
            {/* Badge statut */}
            <View style={[styles.statusBadge, { backgroundColor: statusConfig.backgroundColor }]}>
              <Feather name={statusConfig.icon} size={14} color={statusConfig.color} />
              <Text style={[styles.statusBadgeText, { color: statusConfig.color }]}>
                {statusConfig.text}
              </Text>
            </View>

            {/* Overlay inactif */}
            {isInactive && (
              <View style={styles.inactiveOverlay}>
                <Feather name="pause-circle" size={48} color="rgba(255,255,255,0.8)" />
              </View>
            )}
          </View>
        </View>

        {/* ✅ CORRIGÉ : Informations principales */}
        <View style={styles.mainInfoCard}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>{product.price.toFixed(2)} €</Text>
          <Text style={styles.productDescription}>{product.description}</Text>
        </View>

        {/* ✅ CORRIGÉ : Détails avec icônes */}
        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Détails du produit</Text>
          
          {/* Vendeur */}
          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <FontAwesome5 name="store" size={16} color={Colors.light.tint} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Vendeur</Text>
              <Text style={styles.detailValue}>{product.vendeurs}</Text>
            </View>
          </View>

          {/* Catégorie */}
          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Feather name="tag" size={16} color={Colors.light.tint} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Catégorie</Text>
              <Text style={styles.detailValue}>{product.category}</Text>
            </View>
          </View>

          {/* Stock */}
          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Feather name="box" size={16} color={isLowStock ? '#FF9800' : Colors.light.tint} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Stock disponible</Text>
              <Text style={[
                styles.detailValue,
                isLowStock && { color: '#FF9800', fontWeight: 'bold' }
              ]}>
                {product.stock} {product.stock > 1 ? 'unités' : 'unité'}
              </Text>
            </View>
          </View>

          {/* Statut */}
          <View style={styles.detailRow}>
            <View style={styles.detailIconContainer}>
              <Feather 
                name={statusConfig.icon} 
                size={16} 
                color={statusConfig.color} 
              />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Statut</Text>
              <View style={styles.statusContainer}>
                <View style={[styles.statusDot, { backgroundColor: statusConfig.color }]} />
                <Text style={[styles.detailValue, { color: statusConfig.color }]}>
                  {statusConfig.text}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* ✅ Informations supplémentaires */}
        {(product.createdBy || product.createdAt) && (
          <View style={styles.metaCard}>
            <Text style={styles.sectionTitle}>Informations</Text>
            
            {product.createdBy && (
              <View style={styles.metaRow}>
                <Feather name="user" size={14} color={Colors.light.tabIconDefault} />
                <Text style={styles.metaText}>Créé par : {product.createdBy}</Text>
              </View>
            )}
            
            {product.createdAt && (
              <View style={styles.metaRow}>
                <Feather name="calendar" size={14} color={Colors.light.tabIconDefault} />
                <Text style={styles.metaText}>
                  Créé le : {new Date(product.createdAt).toLocaleDateString('fr-FR')}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Espacement pour les boutons */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ✅ Boutons d'action flottants */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => onEdit && onEdit(product)}
          activeOpacity={0.8}
        >
          <Feather name="edit-2" size={20} color="#fff" />
          <Text style={styles.editButtonText}>Modifier</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete && onDelete(product)}
          activeOpacity={0.8}
        >
          <MaterialIcons name="delete-outline" size={22} color="#fff" />
          <Text style={styles.deleteButtonText}>Supprimer</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

// ✅ STYLES CORRIGÉS ET SIMPLIFIÉS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4ff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120, // Espace pour les boutons flottants
  },

  // ✅ Section image corrigée
  imageSection: {
    backgroundColor: '#fff',
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  imageContainer: {
    position: 'relative',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5', // ✅ Couleur de fond au cas où l'image ne charge pas
  },
  productImage: {
    width: '100%',
    height: 280, // ✅ Hauteur fixe pour éviter les problèmes de layout
    borderRadius: 16,
  },
  stockBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF9800',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  stockBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  inactiveOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },

  // ✅ Carte informations principales
  mainInfoCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 8,
    lineHeight: 30,
  },
  productPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.tint,
    marginBottom: 16,
  },
  productDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },

  // ✅ Carte détails
  detailsCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f4ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  // ✅ Carte meta informations
  metaCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  metaText: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
  },

  // ✅ Boutons d'action flottants
  actionButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
    gap: 12,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.tint,
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
    shadowColor: Colors.light.tint,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProductDetailScreen;
