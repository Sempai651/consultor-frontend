import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: any;
  iconName?: string;
  error?: string;
  maxLength?: number;
}

const Input: React.FC<InputProps> = ({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
  secureTextEntry, 
  keyboardType, 
  iconName, 
  error,
  maxLength
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[
        styles.inputContainer, 
        error ? styles.inputError : null
      ]}>
        {iconName && (
          <Feather name={iconName as any} size={20} color={COLORS.textLight} style={styles.icon} />
        )}
        <TextInput
          style={[styles.input, iconName ? styles.inputWithIcon : null]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textLight}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          maxLength={maxLength}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 20, width: '100%' },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  inputError: { borderColor: COLORS.error },
  icon: { marginRight: 12 },
  input: { flex: 1, paddingVertical: 14, fontSize: 16, color: COLORS.text },
  inputWithIcon: { paddingLeft: 0 },
  errorText: { fontSize: 12, color: COLORS.error, marginTop: 4 },
});

export default Input;