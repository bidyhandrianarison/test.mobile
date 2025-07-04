import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

interface FloatingActionButtonProps {
  onPress: () => void;
  color?: string;
  size?: number;
  iconSize?: number;
  style?: ViewStyle;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
  color = Colors.light.tint,
  size = 56,
  iconSize = 28,
  style
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.fab,
        {
          backgroundColor: color,
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        style // Permet de passer un style personnalisé
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons name="add" size={iconSize} color="#fff" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.light.tint,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default FloatingActionButton;