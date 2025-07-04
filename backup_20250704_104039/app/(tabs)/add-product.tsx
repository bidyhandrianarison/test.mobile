import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useProducts } from '@/contexts/ProductContext';
import FormInput from '@/components/FormInput';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import ImagePickerField from '@/components/ImagePickerField';

const CATEGORIES = [
  'Informatique', 'Sport', 'Beauté', 'Maison', 'Vêtements', 'Électronique', 'Jouets', 'Livres'
];
const VENDEURS = [
  'SportPro', 'TechStore', 'JouetCity', 'LireFacile', 'ModeChic', 'BeautéZen', 'MaisonPlus'
];

export default function AddProductScreen() {
  const router = useRouter();
  const { addProduct, fetchProducts } = useProducts();

  // Form state
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    vendeurs: '',
    image: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  // Validation simple
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.name) newErrors.name = 'Nom requis';
    if (!form.description) newErrors.description = 'Description requise';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) newErrors.price = 'Prix invalide';
    if (!form.stock || isNaN(Number(form.stock)) || Number(form.stock) < 0) newErrors.stock = 'Stock invalide';
    if (!form.category) newErrors.category = 'Catégorie requise';
    if (!form.vendeurs) newErrors.vendeurs = 'Vendeur requis';
    if (!form.image) newErrors.image = "Image requise (URL)";
    return newErrors;
  };

  // Gestion de la soumission
  const handleSubmit = async () => {
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    setLoading(true);
    try {
      await addProduct({
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        category: form.category,
        vendeurs: form.vendeurs,
        image: form.image,
        isActive: true,
      });
      await fetchProducts();
      Alert.alert('Succès', 'Produit ajouté avec succès', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') },
      ]);
    } catch (e) {
      Alert.alert('Erreur', "Impossible d'ajouter le produit");
    } finally {
      setLoading(false);
    }
  };

  // Pour le menu déroulant (catégorie/vendeur)
  const renderPicker = (label: string, value: string, options: string[], onChange: (v: string) => void, error?: string) => (
    <View style={styles.formGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.pickerWrapper}>
        {options.map(opt => (
          <TouchableOpacity
            key={opt}
            style={[
              styles.pickerChip,
              value === opt && styles.pickerChipSelected
            ]}
            onPress={() => onChange(opt)}
          >
            <Text style={[
              styles.pickerChipText,
              value === opt && styles.pickerChipTextSelected
            ]}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Ajouter un produit</Text>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Nom</Text>
        <FormInput
          label="Nom du produit"
          labelValue={form.name}
          handleChange={text => setForm(f => ({ ...f, name: text }))}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Description</Text>
        <FormInput
          label="Description"
          labelValue={form.description}
          handleChange={text => setForm(f => ({ ...f, description: text }))}
        />
        {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
      </View>
      <View style={styles.row}>
        <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.label}>Prix (€)</Text>
          <FormInput
            label="Prix"
            labelValue={form.price}
            handleChange={text => setForm(f => ({ ...f, price: text }))}
            keyboardType="decimal-pad"
          />
          {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
        </View>
        <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.label}>Stock</Text>
          <FormInput
            label="Stock"
            labelValue={form.stock}
            handleChange={text => setForm(f => ({ ...f, stock: text }))}
            keyboardType="number-pad"
          />
          {errors.stock && <Text style={styles.errorText}>{errors.stock}</Text>}
        </View>
      </View>
      {renderPicker('Catégorie', form.category, CATEGORIES, v => setForm(f => ({ ...f, category: v })), errors.category)}
      {renderPicker('Vendeur', form.vendeurs, VENDEURS, v => setForm(f => ({ ...f, vendeurs: v })), errors.vendeurs)}
      <ImagePickerField
        value={form.image}
        onChange={uri => setForm(f => ({ ...f, image: uri }))}
        label="Image du produit"
        required
      />
      <TouchableOpacity
        style={styles.saveBtn}
        onPress={handleSubmit}
        disabled={loading}
        activeOpacity={0.85}
      >
        <Ionicons name="add-circle-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.saveBtnText}>{loading ? 'Ajout...' : 'Ajouter'}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.cancelBtn}
        onPress={() => router.back()}
        activeOpacity={0.7}
      >
        <Text style={styles.cancelBtnText}>Annuler</Text>
      </TouchableOpacity>
    </ScrollView>
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
    color: Colors.light.tint,
    marginBottom: 18,
    alignSelf: 'center',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 6,
  },
  errorText: {
    color: '#e53935',
    fontSize: 13,
    marginTop: 2,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  pickerWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pickerChip: {
    backgroundColor: '#f4f8fb',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 4,
  },
  pickerChipSelected: {
    backgroundColor: Colors.light.tint,
  },
  pickerChipText: {
    color: Colors.light.tint,
    fontWeight: '600',
    fontSize: 14,
  },
  pickerChipTextSelected: {
    color: '#fff',
  },
  imageUploadBlock: {
    marginBottom: 18,
  },
  imagePreviewWrapper: {
    position: 'relative',
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  imagePreview: {
    width: 150,
    height: 150,
    borderRadius: 16,
    backgroundColor: '#e3eafc',
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 3,
  },
  imageEditBtn: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: Colors.light.tint,
    borderRadius: 16,
    padding: 6,
    zIndex: 2,
  },
  imageRemoveBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#e53935',
    borderRadius: 16,
    padding: 4,
    zIndex: 2,
  },
  imagePickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#f4f8fb',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginTop: 8,
    marginBottom: 8,
    elevation: 1,
  },
  imagePickerBtnText: {
    color: Colors.light.tint,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
  saveBtn: {
    backgroundColor: Colors.light.tint,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 28,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
    marginBottom: 8,
    elevation: 2,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelBtn: {
    backgroundColor: Colors.light.tabIconDefault,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 28,
    alignItems: 'center',
    marginBottom: 18,
  },
  cancelBtnText: {
    color: Colors.light.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
});