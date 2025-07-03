import React from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Colors from '../constants/Colors';

interface ImagePickerFieldProps {
  value: string;
  onChange: (uri: string) => void;
  label?: string;
  required?: boolean;
}

export default function ImagePickerField({ value, onChange, label = 'Image', required }: ImagePickerFieldProps) {
  // Ouvre la galerie et met à jour l'image
  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission requise', "Autorisez l'accès à la galerie pour choisir une image.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      onChange(result.assets[0].uri);
    }
  };

  const handleRemoveImage = () => {
    onChange('');
  };

  return (
    <View style={styles.imageUploadBlock}>
      {label && (
        <Text style={styles.label}>
          {label} {required && <Text style={{ color: '#e53935' }}>*</Text>}
        </Text>
      )}
      {value ? (
        <View style={styles.imagePreviewWrapper}>
          <Image source={{ uri: value }} style={styles.imagePreview} />
          <TouchableOpacity style={styles.imageEditBtn} onPress={handlePickImage}>
            <Ionicons name="camera" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.imageRemoveBtn} onPress={handleRemoveImage}>
            <Ionicons name="close-circle" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.imagePickerBtn} onPress={handlePickImage}>
          <Ionicons name="camera" size={28} color={Colors.light.tint} />
          <Text style={styles.imagePickerBtnText}>Choisir une image</Text>
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
});
