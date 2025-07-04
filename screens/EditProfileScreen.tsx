import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { validateProfileForm } from '../utils/validation';
import ProfileEditForm from '../components/ProfileEditForm';
import { useNavigation } from '@react-navigation/native';

const EditProfileScreen = () => {
  const { user, updateProfile } = useAuth();
  const navigation = useNavigation();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSave = async () => {
    const validationErrors = validateProfileForm({ name, email });
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    setLoading(true);
    try {
      await updateProfile({ name }); // email non modifiable ici
      Alert.alert('Succès', 'Profil mis à jour', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      setErrors({ general: "Erreur lors de la mise à jour du profil" });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <ProfileEditForm
      name={name}
      email={email}
      onChangeName={setName}
      loading={loading}
      errors={errors}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
};

export default EditProfileScreen;
