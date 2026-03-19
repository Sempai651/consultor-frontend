import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { COLORS } from '../constants/colors';

export const RecuperarClaveScreen: React.FC = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRecover = async () => {
    if (!email) {
      Alert.alert('Error', 'Por favor ingrese su correo electrónico');
      return;
    }

    setLoading(true);
    // Simular envío de recuperación
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Correo enviado',
        'Se han enviado las instrucciones a tu correo electrónico',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    }, 2000);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Recuperar Contraseña</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.description}>
            Ingresa tu correo electrónico y te enviaremos las instrucciones para recuperar tu contraseña.
          </Text>

          <Input
            label="Correo Electrónico:"
            value={email}
            onChangeText={setEmail}
            placeholder="ejemplo@correo.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Button
            title="Enviar Instrucciones"
            onPress={handleRecover}
            loading={loading}
            style={styles.button}
          />

          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backToLogin}>Volver al inicio de sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    fontSize: 28,
    color: COLORS.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    flex: 1,
  },
  form: {
    width: '100%',
  },
  description: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 22,
  },
  button: {
    marginTop: 20,
    marginBottom: 16,
  },
  backToLogin: {
    color: COLORS.primary,
    textAlign: 'center',
    fontSize: 14,
    marginTop: 20,
    textDecorationLine: 'underline',
  },
});