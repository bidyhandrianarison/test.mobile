import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface ErrorMessageProps {
  message?: string | null;
  onDismiss?: () => void;
  style?: any;
  type?: 'error' | 'warning' | 'info';
}

/**
 * Composant d'affichage des messages d'erreur avec animation fade-in
 */
const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onDismiss,
  style,
  type = 'error'
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (message) {
      // Animation fade-in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Animation fade-out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [message, fadeAnim]);

  if (!message) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'warning':
        return {
          backgroundColor: '#FFF3E0',
          borderColor: '#FF9800',
          iconColor: '#F57C00',
          textColor: '#E65100',
          iconName: 'alert-triangle' as const,
        };
      case 'info':
        return {
          backgroundColor: '#E3F2FD',
          borderColor: '#2196F3',
          iconColor: '#1976D2',
          textColor: '#0D47A1',
          iconName: 'info' as const,
        };
      default: // error
        return {
          backgroundColor: '#FFEBEE',
          borderColor: '#FF6B6B',
          iconColor: '#F44336',
          textColor: '#D32F2F',
          iconName: 'alert-circle' as const,
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: typeStyles.backgroundColor,
          borderColor: typeStyles.borderColor,
          opacity: fadeAnim,
        },
        style,
      ]}
    >
      <View style={styles.content}>
        <Feather
          name={typeStyles.iconName}
          size={20}
          color={typeStyles.iconColor}
          style={styles.icon}
        />
        <Text style={[styles.message, { color: typeStyles.textColor }]}>
          {message}
        </Text>
        {onDismiss && (
          <TouchableOpacity
            style={styles.dismissButton}
            onPress={onDismiss}
            activeOpacity={0.7}
          >
            <Feather
              name="x"
              size={18}
              color={typeStyles.iconColor}
            />
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    borderWidth: 1,
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
    flexShrink: 0,
  },
  message: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    flex: 1,
  },
  dismissButton: {
    marginLeft: 8,
    padding: 4,
    flexShrink: 0,
  },
});

export default ErrorMessage;