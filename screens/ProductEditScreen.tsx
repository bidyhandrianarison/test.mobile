import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useProducts } from '../contexts/ProductContext';
import { Product } from '../types/Product';
import { Feather } from '@expo/vector-icons';
import { validateProductForm } from '../utils/validation';
import ImagePickerField from '../components/ImagePickerField';
import Colors from '../constants/Colors';

/**
 * Écran d'édition d'un produit existant
 */
const ProductEditScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { productId } = route.params as { productId: string };
  const { products, updateProduct, fetchProducts } = useProducts();

  // Recherche du produit à éditer
  const product = products.find((p) => p.id === productId);

  // États du formulaire
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    vendeurs: '',
    image: '',
    isActive: true,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  // Pré-remplit le formulaire avec les valeurs du produit
  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        description: product.description,
        price: String(product.price),
        stock: String(product.stock),
        category: product.category,
        vendeurs: product.vendeurs,
        image: product.image ?? '',
        isActive: product.isActive,
      });
    }
  }, [product]);

  // Gestion de la soumission
  const handleSubmit = async () => {
    // ✅ NOUVEAU : Fermer le clavier avant la soumission
    Keyboard.dismiss();
    
    const validationErrors = validateProductForm(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    try {
      const updatedProduct: Product = {
        ...product!,
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        category: form.category,
        vendeurs: form.vendeurs,
        image: form.image,
        isActive: form.isActive,
      };

      await updateProduct(productId, updatedProduct);
      await fetchProducts();

      Alert.alert('Succès', 'Produit mis à jour avec succès', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert('Erreur', error.message || "Impossible de mettre à jour le produit");
    } finally {
      setLoading(false);
    }
  };

  // ✅ NOUVEAU : Gestion de l'annulation avec fermeture du clavier
  const handleCancel = () => {
    Keyboard.dismiss();
    navigation.goBack();
  };

  // Si le produit n'existe pas
  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Feather name="alert-circle" size={64} color={Colors.light.tabIconDefault} />
          <Text style={styles.errorTitle}>Produit introuvable</Text>
          <Text style={styles.errorSubtitle}>Ce produit n'existe pas ou a été supprimé</Text>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backBtnText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            bounces={false}
          >
            <View style={styles.header}>
      <Text style={styles.title}>Modifier le produit</Text>
              <Text style={styles.subtitle}>Modifiez les informations de votre produit</Text>
            </View>

            <View style={styles.formContainer}>
              {/* Nom du produit */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Nom du produit *</Text>
                <TextInput
                  style={[styles.input, errors.name && styles.inputError]}
                  value={form.name}
                  onChangeText={(text) => setForm((f) => ({ ...f, name: text }))}
                  placeholder="Nom du produit"
                  placeholderTextColor={Colors.light.tabIconDefault}
                />
                {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
              </View>

              {/* Description */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Description *</Text>
                <TextInput
                  style={[styles.input, styles.textArea, errors.description && styles.inputError]}
                  value={form.description}
                  onChangeText={(text) => setForm((f) => ({ ...f, description: text }))}
                  placeholder="Description du produit"
                  placeholderTextColor={Colors.light.tabIconDefault}
                  multiline
                  numberOfLines={4}
                />
                {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
              </View>

              {/* Prix et Stock */}
              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.label}>Prix (€) *</Text>
                  <TextInput
                    style={[styles.input, errors.price && styles.inputError]}
                    value={form.price}
                    onChangeText={(text) => setForm((f) => ({ ...f, price: text }))}
                    placeholder="0.00"
                    placeholderTextColor={Colors.light.tabIconDefault}
                    keyboardType="decimal-pad"
                  />
                  {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
                </View>

                <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.label}>Stock *</Text>
                  <TextInput
                    style={[styles.input, errors.stock && styles.inputError]}
                    value={form.stock}
                    onChangeText={(text) => setForm((f) => ({ ...f, stock: text }))}
                    placeholder="0"
                    placeholderTextColor={Colors.light.tabIconDefault}
                    keyboardType="number-pad"
                  />
                  {errors.stock && <Text style={styles.errorText}>{errors.stock}</Text>}
                </View>
              </View>

              {/* Catégorie */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Catégorie *</Text>
                <TextInput
                  style={[styles.input, errors.category && styles.inputError]}
                  value={form.category}
                  onChangeText={(text) => setForm((f) => ({ ...f, category: text }))}
                  placeholder="Catégorie du produit"
                  placeholderTextColor={Colors.light.tabIconDefault}
                />
                {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
              </View>

              {/* Vendeur */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Vendeur *</Text>
                <TextInput
                  style={[styles.input, errors.vendeurs && styles.inputError]}
                  value={form.vendeurs}
                  onChangeText={(text) => setForm((f) => ({ ...f, vendeurs: text }))}
                  placeholder="Nom du vendeur"
                  placeholderTextColor={Colors.light.tabIconDefault}
                />
                {errors.vendeurs && <Text style={styles.errorText}>{errors.vendeurs}</Text>}
              </View>

              {/* Image */}
              <View style={styles.formGroup}>
                <ImagePickerField
                  value={form.image}
                  onChange={(uri) => setForm((f) => ({ ...f, image: uri }))}
                  label="Image du produit"
                  required
                />
                {errors.image && <Text style={styles.errorText}>{errors.image}</Text>}
              </View>

              {/* Switch Actif/Inactif */}
              <View style={styles.formGroup}>
                <View style={styles.switchRow}>
                  <Text style={styles.label}>Statut du produit</Text>
                  <TouchableOpacity
                    style={[styles.switch, form.isActive && styles.switchActive]}
                    onPress={() => {
                      Keyboard.dismiss();
                      setForm((f) => ({ ...f, isActive: !f.isActive }));
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.switchCircle, form.isActive && styles.switchCircleActive]} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.switchLabel}>
                  {form.isActive ? 'Produit actif' : 'Produit inactif'}
                </Text>
              </View>

              {/* ✅ NOUVEAU : Boutons d'action dans un container fixe */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={handleCancel}
                  activeOpacity={0.7}
                  disabled={loading}
                >
                  <Feather name="x" size={20} color={Colors.light.tabIconDefault} />
                  <Text style={styles.cancelBtnText}>Annuler</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={handleSubmit}
                  disabled={loading}
                  activeOpacity={0.85}
                >
                  <Feather name="save" size={20} color="#fff" style={{ marginRight: 8 }} />
                  <Text style={styles.saveBtnText}>
                    {loading ? 'Enregistrement...' : 'Enregistrer'}
                  </Text>
                </TouchableOpacity>
              </View>
    </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9ff',
  },
  // ✅ NOUVEAU : Container pour KeyboardAvoidingView
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: Platform.OS === 'ios' ? 40 : 30,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.tabIconDefault,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: Colors.light.background,
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  formGroup: {
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.tint,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8f9ff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e3eafc',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.light.text,
  },
  inputError: {
    borderColor: '#e53935',
    backgroundColor: '#ffeaea',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#e53935',
    fontSize: 14,
    marginTop: 4,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  switch: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e3eafc',
    justifyContent: 'center',
    padding: 2,
  },
  switchActive: {
    backgroundColor: Colors.light.tint,
  },
  switchCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.light.background,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  switchCircleActive: {
    marginLeft: 18,
  },
  switchLabel: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    fontStyle: 'italic',
  },
  // ✅ NOUVEAU : Container pour les boutons
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 16,
  },
  cancelBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f4f8fb',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#e3eafc',
    gap: 8,
  },
  cancelBtnText: {
    color: Colors.light.tabIconDefault,
    fontWeight: '600',
    fontSize: 16,
  },
  saveBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.tint,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    shadowColor: Colors.light.tint,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveBtnText: {
    color: Colors.light.background,
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Styles pour l'état d'erreur
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  backBtn: {
    backgroundColor: Colors.light.tint,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  backBtnText: {
    color: Colors.light.background,
    fontWeight: '600',
    fontSize: 16,
  },
});

export default ProductEditScreen;
