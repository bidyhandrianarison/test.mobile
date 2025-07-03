import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

interface EmptyStateProps {
  type: 'no-products' | 'no-results' | 'error';
  title: string;
  subtitle?: string;
  onRetry?: () => void;
}

export default function EmptyState({ type, title, subtitle, onRetry }: EmptyStateProps) {
  const getIcon = () => {
    switch (type) {
      case 'no-products':
        return <Ionicons name="cart-outline" size={64} color={Colors.light.tabIconDefault} />;
      case 'no-results':
        return <Ionicons name="search-outline" size={64} color={Colors.light.tabIconDefault} />;
      case 'error':
        return <Ionicons name="alert-circle-outline" size={64} color="#e53935" />;
      default:
        return <Ionicons name="cart-outline" size={64} color={Colors.light.tabIconDefault} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {getIcon()}
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {onRetry && (
        <TouchableOpacity style={styles.retryBtn} onPress={onRetry}>
          <Text style={styles.retryBtnText}>Réessayer</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  iconContainer: {
    marginBottom: 24,
    opacity: 0.7,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.tabIconDefault,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 12,
  },
  retryBtn: {
    marginTop: 16,
    backgroundColor: Colors.light.tint,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  retryBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 