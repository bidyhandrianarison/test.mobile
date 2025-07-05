import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface FormFieldErrorProps {
  error?: string | null;
  style?: any;
}

/**
 * Composant pour afficher les erreurs de champ de formulaire
 */
const FormFieldError: React.FC<FormFieldErrorProps> = ({ error, style }) => {
  if (!error) return null;

  return (
    <Text style={[styles.error, style]}>
      {error}
    </Text>
  );
};

const styles = StyleSheet.create({
  error: {
    color: '#D32F2F',
    fontSize: 13,
    marginTop: 4,
    marginLeft: 4,
    fontWeight: '500',
  },
});

export default FormFieldError;