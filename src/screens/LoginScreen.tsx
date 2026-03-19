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
import { useAuth } from '../context/AuthContext';

export const LoginScreen: React.FC = ({ navigation }: any) => {
  const [ci, setCi] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!ci || !password) {
      Alert.alert('Error', 'Por favor complete todos los campos');
      return;
    }

    setLoading(true);
    try {
      await signIn(ci, password);
      navigation.replace('Home');
    } catch (error) {
      Alert.alert('Error', 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  const handleRecoverPassword = () => {
    navigation.navigate('RecuperarClave'); // Cambiado para navegar a RecuperarClave
  };

  const handleRegister = () => {
    navigation.navigate('Registro'); // Cambiado para navegar a Registro
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>INICIO</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="C.I:"
            value={ci}
            onChangeText={setCi}
            placeholder="Ingrese su cédula"
            keyboardType="numeric"
          />

          <Input
            label="Password:"
            value={password}
            onChangeText={setPassword}
            placeholder="Ingrese su contraseña"
            secureTextEntry
          />

          <Button
            title="Continuar"
            onPress={handleLogin}
            loading={loading}
            style={styles.button}
          />

          <TouchableOpacity onPress={handleRecoverPassword}>
            <Text style={styles.recoverText}>Recuperar Clave?</Text>
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>No tienes una Cuenta? </Text>
            <TouchableOpacity onPress={handleRegister}>
              <Text style={styles.registerLink}>Registrate!</Text>
            </TouchableOpacity>
          </View>
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
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  form: {
    width: '100%',
  },
  button: {
    marginTop: 20,
    marginBottom: 16,
  },
  recoverText: {
    color: COLORS.primary,
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 20,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  registerText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  registerLink: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});