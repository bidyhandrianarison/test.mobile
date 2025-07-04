import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useProducts } from '@/contexts/ProductContext';
import { Product } from '@/contexts/ProductContext';
import { Feather } from '@expo/vector-icons';
import { validateProductForm } from '@/utils/validation';
import ImagePickerField from '@/components/ImagePickerField';

/**
 * Écran d'édition d'un produit existant
 */
export default function ProductEditScreen() {
  const router = useRouter();
  const { productId } = useLocalSearchParams();
  const { products, updateProduct, fetchProducts } = useProducts();

  // Recherche du produit à éditer
  const product = products.find((p) => p.id === productId);

  // États du formulaire (toujours initialisés)
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
        image: product.image,
        isActive: product.isActive,
      });
    }
  }, [product]);

  // Gestion de la soumission (inchangée)
  const handleSubmit = async () => {
    const validationErrors = validateProductForm(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    setLoading(true);
    try {
      await updateProduct(productId as string, {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        category: form.category,
        vendeurs: form.vendeurs,
        image: form.image,
        isActive: form.isActive,
      });
      await fetchProducts();
      Alert.alert('Succès', 'Produit mis à jour avec succès', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (e) {
      Alert.alert('Erreur', "Impossible de mettre à jour le produit");
    } finally {
      setLoading(false);
    }
  };

  // Rendu conditionnel à l'intérieur du return principal
  return (
    <>
      {!product ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>Produit introuvable</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Modifier le produit</Text>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Nom</Text>
            <TextInput
              style={styles.input}
              value={form.name}
              onChangeText={(text) => setForm((f) => ({ ...f, name: text }))}
              placeholder="Nom du produit"
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, { minHeight: 60 }]}
              value={form.description}
              onChangeText={(text) => setForm((f) => ({ ...f, description: text }))}
              placeholder="Description"
              multiline
            />
            {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
          </View>
          <View style={styles.row}>
            <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Prix (€)</Text>
              <TextInput
                style={styles.input}
                value={form.price}
                onChangeText={(text) => setForm((f) => ({ ...f, price: text }))}
                placeholder="Prix"
                keyboardType="decimal-pad"
              />
              {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
            </View>
            <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Stock</Text>
              <TextInput
                style={styles.input}
                value={form.stock}
                onChangeText={(text) => setForm((f) => ({ ...f, stock: text }))}
                placeholder="Stock"
                keyboardType="number-pad"
              />
              {errors.stock && <Text style={styles.errorText}>{errors.stock}</Text>}
            </View>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Catégorie</Text>
            <TextInput
              style={styles.input}
              value={form.category}
              onChangeText={(text) => setForm((f) => ({ ...f, category: text }))}
              placeholder="Catégorie"
            />
            {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Vendeur</Text>
            <TextInput
              style={styles.input}
              value={form.vendeurs}
              onChangeText={(text) => setForm((f) => ({ ...f, vendeurs: text }))}
              placeholder="Vendeur"
            />
            {errors.vendeurs && <Text style={styles.errorText}>{errors.vendeurs}</Text>}
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Image (URL)</Text>
            <ImagePickerField
              value={form.image}
              onChange={uri => setForm((f) => ({ ...f, image: uri }))}
              label="Image du produit"
              required
            />
            {errors.image && <Text style={styles.errorText}>{errors.image}</Text>}
          </View>
          <View style={styles.formGroup}>
            <View style={styles.switchRow}>
              <Text style={styles.label}>Actif</Text>
              <TouchableOpacity
                style={[styles.switch, form.isActive ? styles.switchActive : styles.switchInactive]}
                onPress={() => setForm((f) => ({ ...f, isActive: !f.isActive }))}
              >
                <Feather name={form.isActive ? 'check-circle' : 'x-circle'} size={22} color={form.isActive ? '#4caf50' : '#aaa'} />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.85}
          >
            <Feather name="save" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.saveBtnText}>{loading ? 'Enregistrement...' : 'Enregistrer'}</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#f7fafd',
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 18,
    color: '#222',
    alignSelf: 'center',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2196f3',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e3eafc',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#222',
  },
  errorText: {
    color: '#e53935',
    fontSize: 13,
    marginTop: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  switch: {
    marginLeft: 12,
    padding: 6,
    borderRadius: 16,
    backgroundColor: '#f4f8fb',
  },
  switchActive: {
    borderColor: '#4caf50',
    borderWidth: 1,
  },
  switchInactive: {
    borderColor: '#aaa',
    borderWidth: 1,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196f3',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignSelf: 'center',
    marginTop: 18,
    shadowColor: '#2196f3',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f7fafd',
  },
});