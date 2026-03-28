import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import Input from '../components/Input';
import Button from '../components/Button';
import { COLORS } from '../constants/colors';
import { getCiError, getPasswordError } from '../utils/validators';
import { authService } from '../services/auth.service';

const RegistroScreen = ({ navigation }: any) => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [cedula, setCedula] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [nombreError, setNombreError] = useState('');
  const [apellidoError, setApellidoError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [cedulaError, setCedulaError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const limpiarFormulario = () => {
    setNombre('');
    setApellido('');
    setEmail('');
    setCedula('');
    setPassword('');
    setConfirmPassword('');
    setNombreError('');
    setApellidoError('');
    setEmailError('');
    setCedulaError('');
    setPasswordError('');
    setConfirmError('');
  };

  const handleRegister = async () => {
    let hasError = false;

    // Validaciones
    if (!nombre.trim()) {
      setNombreError('El nombre es requerido');
      hasError = true;
    } else setNombreError('');

    if (!apellido.trim()) {
      setApellidoError('El apellido es requerido');
      hasError = true;
    } else setApellidoError('');

    if (!validateEmail(email)) {
      setEmailError('Ingrese un correo válido');
      hasError = true;
    } else setEmailError('');

    const ciValidation = getCiError(cedula);
    if (ciValidation) {
      setCedulaError(ciValidation);
      hasError = true;
    } else setCedulaError('');

    const passwordValidation = getPasswordError(password);
    if (passwordValidation) {
      setPasswordError(passwordValidation);
      hasError = true;
    } else setPasswordError('');

    if (password !== confirmPassword) {
      setConfirmError('Las contraseñas no coinciden');
      hasError = true;
    } else setConfirmError('');

    if (hasError) return;

    setLoading(true);

    try {
      const response = await authService.register({
        nombre,
        apellido,
        email,
        cedula,
        password
      });

      console.log('✅ Registro exitoso:', response);

      // ✅ Usar window.alert para web (funciona siempre)
      window.alert(`✅ Registro Exitoso\n\nUsuario ${nombre} ${apellido} ha sido registrado correctamente.\n\nAhora puedes iniciar sesión con tu cédula y contraseña.`);
      
      // Limpiar formulario y redirigir
      limpiarFormulario();
      navigation.navigate('Login');

    } catch (error: any) {
      console.error('❌ Error:', error);
      window.alert(`❌ Error en el registro\n\n${error.response?.data?.message || error.message || 'No se pudo completar el registro'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      <StatusBar barStyle="light-content" />

      <View style={[styles.header, { backgroundColor: COLORS.primary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Registro de Usuario</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.card, { backgroundColor: COLORS.surface }]}>

          <Input
            label="NOMBRE"
            value={nombre}
            onChangeText={(text) => { setNombre(text); setNombreError(''); }}
            placeholder="Ingrese su nombre"
            iconName="user"
            error={nombreError}
          />

          <Input
            label="APELLIDO"
            value={apellido}
            onChangeText={(text) => { setApellido(text); setApellidoError(''); }}
            placeholder="Ingrese su apellido"
            iconName="user"
            error={apellidoError}
          />

          <Input
            label="CORREO ELECTRÓNICO"
            value={email}
            onChangeText={(text) => { setEmail(text); setEmailError(''); }}
            placeholder="ejemplo@correo.com"
            keyboardType="email-address"
            iconName="mail"
            error={emailError}
          />

          <Input
            label="CÉDULA ECUATORIANA"
            value={cedula}
            onChangeText={(text) => {
              const numericText = text.replace(/[^0-9]/g, '');
              setCedula(numericText);
              setCedulaError('');
            }}
            placeholder="Ingrese su cédula (10 dígitos)"
            keyboardType="numeric"
            iconName="credit-card"
            error={cedulaError}
            maxLength={10}
          />

          <Input
            label="CONTRASEÑA"
            value={password}
            onChangeText={(text) => { setPassword(text); setPasswordError(''); }}
            placeholder="Mínimo 8 caracteres, mayúscula, minúscula, número y carácter especial"
            secureTextEntry
            iconName="lock"
            error={passwordError}
            showPasswordToggle={true}
          />

          <Input
            label="CONFIRMAR CONTRASEÑA"
            value={confirmPassword}
            onChangeText={(text) => { setConfirmPassword(text); setConfirmError(''); }}
            placeholder="Confirme su contraseña"
            secureTextEntry
            iconName="lock"
            error={confirmError}
            showPasswordToggle={true}
          />

          <Button
            title="REGISTRARSE"
            onPress={handleRegister}
            loading={loading}
          />

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={[styles.loginLinkText, { color: COLORS.primary }]}>
              ¿Ya tienes cuenta? Inicia sesión
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, paddingHorizontal: 20, paddingBottom: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' },
  content: { padding: 20, flexGrow: 1 },
  card: { borderRadius: 30, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 },
  loginLink: { marginTop: 20, alignItems: 'center' },
  loginLinkText: { fontSize: 14, fontWeight: '500', textDecorationLine: 'underline' },
});

export default RegistroScreen;
