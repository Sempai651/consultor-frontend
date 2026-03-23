import React, { useState } from 'react'
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert, StatusBar
} from 'react-native'
import { Feather } from '@expo/vector-icons'
import Input from '../components/Input'
import Button from '../components/Button'
import { COLORS } from '../constants/colors'
import { getCiError } from '../utils/validators'
import { authService } from '../services/auth.service'

const RegistroScreen = ({ navigation }: any) => {
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [email, setEmail] = useState('')
  const [cedula, setCedula] = useState('')  // ← cambió de ci a cedula
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const [nombreError, setNombreError] = useState('')
  const [apellidoError, setApellidoError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [cedulaError, setCedulaError] = useState('')  // ← cambió
  const [passwordError, setPasswordError] = useState('')
  const [confirmError, setConfirmError] = useState('')

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleRegister = async () => {
    let hasError = false

    if (!nombre.trim()) {
      setNombreError('El nombre es requerido')
      hasError = true
    } else {
      setNombreError('')
    }

    if (!apellido.trim()) {
      setApellidoError('El apellido es requerido')
      hasError = true
    } else {
      setApellidoError('')
    }

    if (!validateEmail(email)) {
      setEmailError('Ingrese un correo válido')
      hasError = true
    } else {
      setEmailError('')
    }

    const cedulaValidation = getCiError(cedula)  // ← validación de cédula
    if (cedulaValidation) {
      setCedulaError(cedulaValidation)
      hasError = true
    } else {
      setCedulaError('')
    }

    if (!password || password.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres')
      hasError = true
    } else {
      setPasswordError('')
    }

    if (password !== confirmPassword) {
      setConfirmError('Las contraseñas no coinciden')
      hasError = true
    } else {
      setConfirmError('')
    }

    if (hasError) return

    setLoading(true)
    try {
      // Usar "cedula" como pide la interfaz
      await authService.register({
        nombre: nombre,
        apellido: apellido,
        email: email,
        cedula: cedula,      // ← clave correcta
        password: password
      })

      Alert.alert(
        'Registro Exitoso',
        `Usuario ${nombre} ${apellido} ha sido registrado correctamente.\n\nAhora puedes iniciar sesión con tu cédula y contraseña.`,
        [
          {
            text: 'Ir al Login',
            onPress: () => navigation.navigate('Login')
          }
        ]
      )
    } catch (error: any) {
      console.error('Error en registro:', error)
      Alert.alert(
        'Error en el registro',
        error.response?.data?.message || error.message || 'No se pudo completar el registro'
      )
    } finally {
      setLoading(false)
    }
  }

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
            onChangeText={(text) => { setNombre(text); setNombreError('') }}
            placeholder="Ingrese su nombre"
            iconName="user"
            error={nombreError}
          />

          <Input
            label="APELLIDO"
            value={apellido}
            onChangeText={(text) => { setApellido(text); setApellidoError('') }}
            placeholder="Ingrese su apellido"
            iconName="user"
            error={apellidoError}
          />

          <Input
            label="CORREO ELECTRÓNICO"
            value={email}
            onChangeText={(text) => { setEmail(text); setEmailError('') }}
            placeholder="ejemplo@correo.com"
            keyboardType="email-address"
            iconName="mail"
            error={emailError}
          />

          <Input
            label="CÉDULA ECUATORIANA"
            value={cedula}
            onChangeText={(text) => {
              const numericText = text.replace(/[^0-9]/g, '')
              setCedula(numericText)
              setCedulaError('')
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
            onChangeText={(text) => { setPassword(text); setPasswordError('') }}
            placeholder="Mínimo 6 caracteres"
            secureTextEntry
            iconName="lock"
            error={passwordError}
          />

          <Input
            label="CONFIRMAR CONTRASEÑA"
            value={confirmPassword}
            onChangeText={(text) => { setConfirmPassword(text); setConfirmError('') }}
            placeholder="Confirme su contraseña"
            secureTextEntry
            iconName="lock"
            error={confirmError}
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
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, paddingHorizontal: 20, paddingBottom: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' },
  content: { padding: 20, flexGrow: 1 },
  card: { borderRadius: 30, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 },
  loginLink: { marginTop: 20, alignItems: 'center' },
  loginLinkText: { fontSize: 14, fontWeight: '500', textDecorationLine: 'underline' },
})

export default RegistroScreen