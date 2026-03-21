import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

interface CardProps {
  title?: string;
  subtitle?: string;
  icon?: string;
  onPress?: () => void;
  children?: React.ReactNode;
  style?: any;
  variant?: 'default' | 'gradient';
  color?: string;
}

const Card: React.FC<CardProps> = ({ 
  title, 
  subtitle, 
  icon, 
  onPress, 
  children, 
  style, 
  variant = 'default',
  color 
}) => {
  // Si hay onPress, usamos TouchableOpacity, sino View
  if (onPress) {
    return (
      <TouchableOpacity 
        onPress={onPress} 
        activeOpacity={0.7}
        style={variant === 'gradient' 
          ? [styles.gradientCard, { backgroundColor: color || COLORS.primary }, style]
          : [styles.card, style]
        }
      >
        {icon && <Feather name={icon as any} size={24} color={variant === 'gradient' ? COLORS.white : COLORS.primary} style={styles.icon} />}
        {title && <Text style={variant === 'gradient' ? styles.gradientTitle : styles.title}>{title}</Text>}
        {subtitle && <Text style={variant === 'gradient' ? styles.gradientSubtitle : styles.subtitle}>{subtitle}</Text>}
        {children}
      </TouchableOpacity>
    );
  }

  // Si no hay onPress, usamos View
  return (
    <View style={variant === 'gradient' 
      ? [styles.gradientCard, { backgroundColor: color || COLORS.primary }, style]
      : [styles.card, style]
    }>
      {icon && <Feather name={icon as any} size={24} color={variant === 'gradient' ? COLORS.white : COLORS.primary} style={styles.icon} />}
      {title && <Text style={variant === 'gradient' ? styles.gradientTitle : styles.title}>{title}</Text>}
      {subtitle && <Text style={variant === 'gradient' ? styles.gradientSubtitle : styles.subtitle}>{subtitle}</Text>}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gradientCard: {
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  icon: { marginBottom: 10 },
  title: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  subtitle: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 8 },
  gradientTitle: { fontSize: 18, fontWeight: '700', color: COLORS.white, marginBottom: 4 },
  gradientSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.9)', marginBottom: 8 },
});

export default Card;