import React from 'react';
import {
  View,
  Text as RNText,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Modal from 'react-native-modal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../constants/Colors';

export type FiltersState = {
  category: string | null;
  seller: string | null;
  minPrice: string;
  maxPrice: string;
  activeOnly: boolean;
};

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: FiltersState;
  setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;
  categories: string[];
  sellers: string[];
  onApply: () => void;
  onReset: () => void;
}

const { height: screenHeight } = Dimensions.get('window');

const FilterModal: React.FC<FilterModalProps> = ({
  visible, onClose, filters, setFilters, categories, sellers, onApply, onReset
}) => {
  const insets = useSafeAreaInsets();

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
      // ✅ NOUVEAU : Props pour étendre le modal sur tout l'écran
      deviceHeight={screenHeight}
      statusBarTranslucent
      coverScreen={true}
      // ✅ NOUVEAU : Désactiver les marges par défaut
      style={[styles.modal, { margin: 0 }]}
      hasBackdrop={true}
    >
      {/* ✅ NOUVEAU : Container qui s'étend sur toute la hauteur */}
      <View style={[styles.fullScreenContainer, { paddingBottom: insets.bottom }]}>
        {/* ✅ NOUVEAU : Fond opaque qui recouvre tout */}
        <TouchableOpacity 
          style={styles.backdrop} 
          activeOpacity={1} 
          onPress={onClose}
        />
        
        {/* ✅ MODIFIÉ : Container du modal positionné en bas */}
        <View style={[styles.modalContainer, { marginBottom: 0 }]}>
          {/* Poignée de glissement */}
          <View style={styles.handleBar} />
          
          <ScrollView 
            contentContainerStyle={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            <RNText style={styles.modalTitle}>Filtres</RNText>
            
            {/* Catégorie */}
            <RNText style={styles.sectionTitle}>Catégorie</RNText>
            <View style={styles.chipRow}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.chip, filters.category === cat && styles.chipSelected]}
                  onPress={() => setFilters(f => ({ ...f, category: f.category === cat ? null : cat }))}
                >
                  <RNText style={[styles.chipText, filters.category === cat && styles.chipTextSelected]}>{cat}</RNText>
                </TouchableOpacity>
              ))}
            </View>
            
            {/* Vendeur */}
            <RNText style={styles.sectionTitle}>Vendeur</RNText>
            <View style={styles.chipRow}>
              {sellers.map((seller) => (
                <TouchableOpacity
                  key={seller}
                  style={[styles.chip, filters.seller === seller && styles.chipSelected]}
                  onPress={() => setFilters(f => ({ ...f, seller: f.seller === seller ? null : seller }))}
                >
                  <RNText style={[styles.chipText, filters.seller === seller && styles.chipTextSelected]}>{seller}</RNText>
                </TouchableOpacity>
              ))}
            </View>
            
            {/* Prix */}
            <RNText style={styles.sectionTitle}>Prix</RNText>
            <View style={styles.priceRow}>
              <TextInput
                style={styles.priceInput}
                value={filters.minPrice}
                onChangeText={val => setFilters(f => ({ ...f, minPrice: val }))}
                placeholder="Min"
                keyboardType="numeric"
                placeholderTextColor={Colors.light.tabIconDefault}
              />
              <RNText style={styles.priceSeparator}>-</RNText>
              <TextInput
                style={styles.priceInput}
                value={filters.maxPrice}
                onChangeText={val => setFilters(f => ({ ...f, maxPrice: val }))}
                placeholder="Max"
                keyboardType="numeric"
                placeholderTextColor={Colors.light.tabIconDefault}
              />
            </View>
            
            {/* Actif uniquement */}
            <View style={styles.switchRow}>
              <RNText style={styles.sectionTitle}>Actifs uniquement</RNText>
              <TouchableOpacity
                style={[styles.switch, filters.activeOnly && styles.switchActive]}
                onPress={() => setFilters(f => ({ ...f, activeOnly: !f.activeOnly }))}
              >
                <View style={[styles.switchCircle, filters.activeOnly && styles.switchCircleActive]} />
              </TouchableOpacity>
            </View>
            
            {/* Actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.resetBtn} 
                onPress={() => {
                  setFilters({
                    category: null,
                    seller: null,
                    minPrice: '',
                    maxPrice: '',
                    activeOnly: false
                  });
                  onReset();
                }}
              >
                <RNText style={styles.resetBtnText}>Réinitialiser</RNText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.applyBtn} 
                onPress={() => {
                  console.log('Filtres à appliquer:', filters);
                  onApply();
                }}
              >
                <RNText style={styles.applyBtnText}>Appliquer les filtres</RNText>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
    // ✅ CORRIGÉ : Z-index très élevé pour passer au-dessus de tout
    zIndex: 999999,
  },
  
  // ✅ NOUVEAU : Container qui occupe tout l'écran
  fullScreenContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    // ✅ Étendre jusqu'en bas de l'écran
    height: screenHeight,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  
  // ✅ NOUVEAU : Fond semi-transparent qui recouvre tout
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent', // La modalité gère déjà le backdrop
  },
  
  modalContainer: {
    backgroundColor: Colors.light.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '75%', // Augmenté pour plus d'espace
    minHeight: '50%', // Hauteur minimale
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 15, // ✅ Élévation très élevée pour Android
    // ✅ NOUVEAU : S'assurer que le modal s'étend jusqu'en bas
    paddingBottom: 0,
    marginBottom: 0,
  },
  
  handleBar: {
    width: 48,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.light.tabIconDefault,
    alignSelf: 'center',
    marginVertical: 12,
    opacity: 0.6,
  },
  modalContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.tint,
    marginBottom: 18,
    alignSelf: 'center',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 6,
    marginTop: 10,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    backgroundColor: '#f4f8fb',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 4,
  },
  chipSelected: {
    backgroundColor: Colors.light.tint,
  },
  chipText: {
    color: Colors.light.tint,
    fontWeight: '600',
    fontSize: 14,
  },
  chipTextSelected: {
    color: '#fff',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceInput: {
    backgroundColor: '#f4f8fb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e3eafc',
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 15,
    width: 80,
    color: Colors.light.text,
    textAlign: 'center',
  },
  priceSeparator: {
    marginHorizontal: 8,
    fontSize: 16,
    color: Colors.light.text,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  switch: {
    width: 38,
    height: 22,
    borderRadius: 12,
    backgroundColor: '#e3eafc',
    justifyContent: 'center',
    padding: 2,
  },
  switchActive: {
    backgroundColor: Colors.light.tint,
  },
  switchCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.light.background,
    marginLeft: 2,
    elevation: 1,
  },
  switchCircleActive: {
    backgroundColor: Colors.light.background,
    marginLeft: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
    gap: 12,
  },
  resetBtn: {
    backgroundColor: '#e3eafc',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: 'center',
    flex: 1,
  },
  resetBtnText: {
    color: Colors.light.text,
    fontWeight: 'bold',
    fontSize: 15,
  },
  applyBtn: {
    backgroundColor: Colors.light.tint,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: 'center',
    flex: 1,
  },
  applyBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default FilterModal;
