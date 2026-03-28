import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import Input from '../components/Input';
import Button from '../components/Button';
import { COLORS } from '../constants/colors';
import { authService } from '../services/auth.service';

const RestablecerClaveScreen = ({ navigation, route }: any) => {
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificandoToken, setVerificandoToken] = useState(true);
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');

  useEffect(() => {
    let tokenValue = route.params?.token;
    if (!tokenValue && typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      tokenValue = params.get('token');
    }
    setToken(tokenValue);
    setVerificandoToken(false);
  }, [route.params]);

  const validatePassword = (pass: string): string => {
    if (!pass) return 'La contraseña es requerida';
    if (pass.length < 8) return '❌ Mínimo 8 caracteres';
    if (!/[a-z]/.test(pass)) return '❌ Debe tener una letra minúscula';
    if (!/[A-Z]/.test(pass)) return '❌ Debe tener una letra mayúscula';
    if (!/\d/.test(pass)) return '❌ Debe tener un número';
    if (!/[@$!%*?&]/.test(pass)) return '❌ Debe tener un carácter especial (@$!%*?&)';
    return '';
  };

  const handleResetPassword = async () => {
    const passError = validatePassword(password);
    if (passError) {
      setPasswordError(passError);
      return;
    }
    setPasswordError('');

    if (password !== confirmPassword) {
      setConfirmError('Las contraseñas no coinciden');
      return;
    }
    setConfirmError('');

    if (!token) {
      Alert.alert('Error', 'Token inválido o expirado');
      navigation.navigate('Login');
      return;
    }

    setLoading(true);
    try {
      await authService.nuevaClave(token, password);
      Alert.alert(
        '✅ Contraseña actualizada',
        'Tu contraseña ha sido cambiada exitosamente.',
        [{ text: 'Ir al Login', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'No se pudo cambiar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  if (verificandoToken) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Verificando enlace...</Text>
      </View>
    );
  }

  if (!token) {
    return (
      <View style={styles.errorContainer}>
        <Feather name="alert-triangle" size={60} color={COLORS.error} />
        <Text style={styles.errorTitle}>Enlace inválido</Text>
        <Text style={styles.errorText}>El enlace de recuperación no es válido o ha expirado.</Text>
        <Button title="Volver al Login" onPress={() => navigation.navigate('Login')} style={styles.errorButton} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.header, { backgroundColor: COLORS.primary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Restablecer Contraseña</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.description}>Ingresa tu nueva contraseña para completar el proceso.</Text>
          <Input
            label="NUEVA CONTRASEÑA"
            value={password}
            onChangeText={setPassword}
            placeholder="Mínimo 8 caracteres, mayúscula, minúscula, número y carácter especial"
            secureTextEntry
            iconName="lock"
            error={passwordError}
            showPasswordToggle
          />
          <Input
            label="CONFIRMAR CONTRASEÑA"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirme su nueva contraseña"
            secureTextEntry
            iconName="lock"
            error={confirmError}
            showPasswordToggle
          />
          <Button title="ACTUALIZAR CONTRASEÑA" onPress={handleResetPassword} loading={loading} />
          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.loginLink}>
            <Text style={[styles.loginLinkText, { color: COLORS.primary }]}>Volver al inicio de sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, paddingHorizontal: 20, paddingBottom: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' },
  content: { padding: 20, flexGrow: 1 },
  card: { backgroundColor: COLORS.surface, borderRadius: 30, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 },
  description: { fontSize: 16, textAlign: 'center', marginBottom: 30, lineHeight: 22, color: COLORS.textSecondary },
  loginLink: { marginTop: 20, alignItems: 'center' },
  loginLinkText: { fontSize: 14, fontWeight: '500', textDecorationLine: 'underline' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  loadingText: { marginTop: 20, fontSize: 16, color: COLORS.textSecondary },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: COLORS.background },
  errorTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.error, marginTop: 20, marginBottom: 10 },
  errorText: { fontSize: 16, color: COLORS.textSecondary, textAlign: 'center', marginBottom: 30 },
  errorButton: { width: '80%' },
});

export default RestablecerClaveScreen;

