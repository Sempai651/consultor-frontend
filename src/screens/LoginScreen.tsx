import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import Input from '../components/Input';
import Button from '../components/Button';
import { COLORS } from '../constants/colors';
import { getCiError, getPasswordError } from '../utils/validators';
import { useAuth } from '../hooks/useAuth';

const LoginScreen = ({ navigation }: any) => {
  const [ci, setCi] = useState('');
  const [password, setPassword] = useState('');
  const [ciError, setCiError] = useState('');
  const [passwordFormatError, setPasswordFormatError] = useState(''); // Error de formato
  const [passwordCredentialError, setPasswordCredentialError] = useState(''); // Error de credenciales
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    // Limpiar error de credenciales anterior
    setPasswordCredentialError('');

    // 1. Validar formato de cédula
    const ciValidation = getCiError(ci);
    setCiError(ciValidation);
    if (ciValidation) return;

    // 2. Validar formato de contraseña (mayúscula, minúscula, etc.)
    const passwordValidation = getPasswordError(password);
    setPasswordFormatError(passwordValidation);
    if (passwordValidation) return;

    // 3. Si el formato es correcto, intentar login
    setLoading(true);
    try {
      await signIn(ci, password);
      // Login exitoso
    } catch (error: any) {
      // ✅ Mostrar error de credenciales incorrectas
      setPasswordCredentialError('❌ Contraseña incorrecta. Verifica tus datos.');
    } finally {
      setLoading(false);
    }
  };

  // Mostrar el error que corresponda (formato tiene prioridad sobre credenciales)
  const mostrarErrorPassword = () => {
    if (passwordFormatError) return passwordFormatError;
    if (passwordCredentialError) return passwordCredentialError;
    return '';
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={[styles.container, { backgroundColor: COLORS.primary }]}>
        <StatusBar barStyle="light-content" />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          
          <View style={styles.logoContainer}>
            <View style={[styles.logoCircle, { backgroundColor: COLORS.accent }]}>
              <Feather name="home" size={40} color="#FFFFFF" />
            </View>
            <Text style={styles.brandName}>BEGROUP</Text>
            <Text style={styles.slogan}>Soluciones Empresariales</Text>
          </View>

          <View style={[styles.card, { backgroundColor: COLORS.surface }]}>
            <Text style={[styles.welcomeTitle, { color: COLORS.primary }]}>Bienvenido</Text>
            <Text style={[styles.welcomeSubtitle, { color: COLORS.textSecondary }]}>Inicia sesión en tu cuenta</Text>

            <Input
              label="CÉDULA ECUATORIANA"
              value={ci}
              onChangeText={(text) => {
                const numericText = text.replace(/[^0-9]/g, '');
                setCi(numericText);
                setCiError('');
              }}
              placeholder="Ingrese su cédula (10 dígitos)"
              keyboardType="numeric"
              iconName="user"
              error={ciError}
              maxLength={10}
            />

            <Input
              label="CONTRASEÑA"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordFormatError(''); // Limpiar error de formato al escribir
                setPasswordCredentialError(''); // Limpiar error de credenciales al escribir
              }}
              placeholder="Mínimo 8 caracteres, mayúscula, minúscula, número y carácter especial"
              secureTextEntry
              iconName="lock"
              error={mostrarErrorPassword()}
              showPasswordToggle={true}
            />

            <TouchableOpacity style={styles.forgotContainer} onPress={() => navigation.navigate('RecuperarClave')}>
              <Text style={[styles.forgotText, { color: COLORS.primary }]}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

            <Button title="INICIAR SESIÓN" onPress={handleLogin} loading={loading} />

            <View style={styles.dividerContainer}>
              <View style={[styles.divider, { backgroundColor: COLORS.border }]} />
              <Text style={[styles.dividerText, { color: COLORS.textLight }]}>O continúa con</Text>
              <View style={[styles.divider, { backgroundColor: COLORS.border }]} />
            </View>

            <View style={styles.socialContainer}>
              <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#DB4437' }]}>
                <Feather name="mail" size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#4267B2' }]}>
                <Feather name="facebook" size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#0077B5' }]}>
                <Feather name="linkedin" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.registerContainer}>
              <Text style={[styles.registerText, { color: COLORS.textSecondary }]}>¿No tienes una cuenta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Registro')}>
                <Text style={[styles.registerLink, { color: COLORS.primary }]}>REGÍSTRATE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 20, paddingVertical: 40 },
  logoContainer: { alignItems: 'center', marginBottom: 30 },
  logoCircle: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  brandName: { fontSize: 32, fontWeight: 'bold', color: '#FFFFFF', letterSpacing: 2, marginBottom: 5 },
  slogan: { fontSize: 14, color: 'rgba(255,255,255,0.8)', letterSpacing: 1 },
  card: { borderRadius: 30, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 },
  welcomeTitle: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 5 },
  welcomeSubtitle: { fontSize: 14, textAlign: 'center', marginBottom: 25 },
  forgotContainer: { alignSelf: 'flex-end', marginBottom: 20 },
  forgotText: { fontSize: 13, fontWeight: '500' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  divider: { flex: 1, height: 1 },
  dividerText: { marginHorizontal: 10, fontSize: 12 },
  socialContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
  socialButton: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginHorizontal: 8 },
  registerContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  registerText: { fontSize: 14 },
  registerLink: { fontSize: 14, fontWeight: 'bold' },
});

export default LoginScreen;