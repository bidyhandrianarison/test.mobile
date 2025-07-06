import React from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Colors from '../constants/Colors';
import { t } from '../utils/translations';

interface ImagePickerFieldProps {
  value: string;
  onChange: (uri: string) => void;
  label?: string;
  required?: boolean;
}

export default function ImagePickerField({ value, onChange, label = 'Image', required }: ImagePickerFieldProps) {
  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t('errors.permissionRequired'), t('errors.galleryPermission'));
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      onChange(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    onChange('');
  };

  return (
    <View style={styles.imageUploadBlock}>
      {label && (
        <Text style={styles.label}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
      )}
      {value ? (
        <View style={styles.imagePreviewWrapper}>
          <Image source={{ uri: value }} style={styles.imagePreview} />
          <TouchableOpacity style={styles.imageEditBtn} onPress={pickImage}>
            <Ionicons name="camera" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.imageRemoveBtn} onPress={removeImage}>
            <Ionicons name="close-circle" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.imagePickerBtn} onPress={pickImage}>
          <Ionicons name="camera" size={28} color={Colors.light.tint} />
          <Text style={styles.imagePickerBtnText}>{t('productForm.selectImage')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  imageUploadBlock: {
    marginBottom: 18,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 6,
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
  required: {
    color: '#e53935',
  },
});
