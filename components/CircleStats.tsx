import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CircleStatsProps {
  value: number;
  label: string;
  color?: string;
  size?: number;
}

const CircleStats: React.FC<CircleStatsProps> = ({
  value,
  label = 'Ventes',
  color = '#8B7ED8',
  size = 120
}) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={[
        styles.circle, 
        { 
          width: size, 
          height: size, 
          borderRadius: size / 2,
          borderColor: color 
        }
      ]}>
        <Text style={[styles.value, { color }]}>{value}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  circle: {
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  value: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
});

export default CircleStats;