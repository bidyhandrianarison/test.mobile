import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';
import { t } from '../utils/translations';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'large';
  color?: string;
}

/**
 * LoadingSpinner component for consistent loading states
 * 
 * @param message - Optional message to display below the spinner
 * @param size - Size of the activity indicator ('small' or 'large')
 * @param color - Color of the spinner (defaults to app tint color)
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = t('loading.loading'),
  size = 'large',
  color = Colors.light.tint,
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.light.text,
    textAlign: 'center',
  },
});

export default LoadingSpinner; 