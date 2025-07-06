import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useProducts } from '../contexts/ProductContext';
import { useAuth } from '../contexts/AuthContext';
import FormInput from '../components/FormInput';
import Colors from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import ImagePickerField from '../components/ImagePickerField';
import { Product } from '../types/Product';
import { Button } from 'react-native-elements';
import { t } from '../utils/translations';

const CATEGORIES = [
  'Informatique', 'Sport', 'Beauté', 'Maison', 'Vêtements', 'Électronique', 'Jouets', 'Livres'
];
const VENDEURS = [
  'SportPro', 'TechStore', 'JouetCity', 'LireFacile', 'ModeChic', 'BeautéZen', 'MaisonPlus'
];

const AddProductScreen = () => {
  const navigation = useNavigation();
  const { addProduct, fetchProducts } = useProducts();
  const { user } = useAuth();

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

  // Validation
  const validate = () => {
    const newErrors: any = {};
    if (!form.name.trim()) newErrors.name = t('validation.nameRequired');
    if (!form.description.trim()) newErrors.description = t('validation.descriptionRequired');
    if (!form.price || parseFloat(form.price) <= 0) newErrors.price = t('validation.priceRequired');
    if (!form.stock || parseInt(form.stock) < 0) newErrors.stock = t('validation.stockRequired');
    if (!form.image) newErrors.image = t('validation.imageRequired');

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }
    return true;
  };

  // Gestion de la soumission
  const handleSubmit = async () => {
    if (!validate()) return;
    
    setLoading(true);
    try {
      await addProduct({
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        category: form.category,
        vendeurs: form.vendeurs,
        image: form.image,
        isActive: true,
      }, user?.email, user?.id);
      
      Alert.alert(t('common.success'), t('products.productAdded'));
      navigation.goBack();
    } catch (error) {
      Alert.alert(t('common.error'), t('errors.addProductError'));
    } finally {
      setLoading(false);
    }
  };

  // Pour le menu déroulant (catégorie/vendeur)
  const renderPicker = (label: string, value: string, options: string[], onChange: (v: string) => void, error?: string) => (
    <View style={styles.form}>
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
      <Text style={styles.title}>{t('productForm.addProduct')}</Text>
      <View style={styles.form}>
        <FormInput
          label={t('productForm.productName')}
          labelValue={form.name}
          icon="pricetag"
          handleChange={(text) => setForm({ ...form, name: text })}
          placeholder={t('productForm.productName')}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

        <FormInput
          label={t('productForm.productDescription')}
          labelValue={form.description}
          icon="document-text"
          handleChange={(text) => setForm({ ...form, description: text })}
          placeholder={t('productForm.productDescription')}
          multiline
          numberOfLines={3}
        />
        {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}

        <FormInput
          label={t('productForm.price')}
          labelValue={form.price}
          icon="cash"
          handleChange={(text) => setForm({ ...form, price: text })}
          keyboardType="decimal-pad"
        />
        {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}

        <FormInput
          label={t('productForm.stock')}
          labelValue={form.stock}
          icon="cube"
          handleChange={(text) => setForm({ ...form, stock: text })}
          keyboardType="number-pad"
        />
        {errors.stock && <Text style={styles.errorText}>{errors.stock}</Text>}

        <FormInput
          label={t('productForm.category')}
          labelValue={form.category}
          icon="grid"
          handleChange={(text) => setForm({ ...form, category: text })}
          placeholder={t('productForm.category')}
        />
        {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}

        <FormInput
          label={t('productForm.seller')}
          labelValue={form.vendeurs}
          icon="person"
          handleChange={(text) => setForm({ ...form, vendeurs: text })}
          placeholder={t('productForm.seller')}
        />
        {errors.vendeurs && <Text style={styles.errorText}>{errors.vendeurs}</Text>}

        <ImagePickerField
          value={form.image}
          onChange={(uri) => setForm({ ...form, image: uri })}
          label={t('productForm.productImage')}
          required
        />
        {errors.image && <Text style={styles.errorText}>{errors.image}</Text>}

        <Button
          title={t('productForm.addProduct')}
          onPress={handleSubmit}
          loading={loading}
          buttonStyle={styles.submitButton}
          titleStyle={{ fontWeight: '600' }}
          icon={
            <Ionicons name="add-circle-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
          }
        />
      </View>
      <TouchableOpacity
        style={styles.cancelBtn}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Text style={styles.cancelBtnText}>{t('common.cancel')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

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
  form: {
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
  submitButton: {
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

export default AddProductScreen;
