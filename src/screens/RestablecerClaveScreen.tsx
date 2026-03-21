import React, { useState } from 'react'
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert, StatusBar
} from 'react-native'
import { Feather } from '@expo/vector-icons'
import Input from '../components/Input'
import Button from '../components/Button'
import { COLORS } from '../constants/colors'
import { authService } from '../services/auth.service'

const RestablecerClaveScreen = ({ navigation, route }: any) => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmError, setConfirmError] = useState('')
  const [loading, setLoading] = useState(false)

  // token viene desde el enlace del correo
  const { token } = route.params || {}

  const handleResetPassword = async () => {
    let hasError = false

    if (!password || password.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres')
      hasError = true
    } else setPasswordError('')

    if (password !== confirmPassword) {
      setConfirmError('Las contraseñas no coinciden')
      hasError = true
    } else setConfirmError('')

    if (hasError) return

    // Verificar que llegó el token desde el enlace del correo
    if (!token) {
      Alert.alert('Error', 'Token inválido. Solicita un nuevo enlace de recuperación.')
      return
    }

    setLoading(true)
    try {
      // Llama al backend real con el token y la nueva contraseña
      await authService.nuevaClave(token, password)

      Alert.alert(
        'Contraseña actualizada',
        'Tu contraseña ha sido cambiada exitosamente',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      )
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Token inválido o expirado'
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
        <Text style={styles.headerTitle}>Restablecer Contraseña</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.card, { backgroundColor: COLORS.surface }]}>

          <View style={styles.iconContainer}>
            <Feather name="lock" size={50} color={COLORS.primary} />
          </View>

          <Text style={[styles.description, { color: COLORS.textSecondary }]}>
            Ingresa tu nueva contraseña para completar el proceso de recuperación.
          </Text>

          <Input
            label="NUEVA CONTRASEÑA"
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
            placeholder="Confirme su nueva contraseña"
            secureTextEntry
            iconName="lock"
            error={confirmError}
          />

          <Button
            title="ACTUALIZAR CONTRASEÑA"
            onPress={handleResetPassword}
            loading={loading}
          />

          <TouchableOpacity
            style={styles.backLink}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={[styles.backLinkText, { color: COLORS.primary }]}>
              Volver al inicio de sesión
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
  iconContainer: { alignItems: 'center', marginBottom: 20 },
  description: { fontSize: 16, textAlign: 'center', marginBottom: 30, lineHeight: 22 },
  backLink: { marginTop: 20, alignItems: 'center' },
  backLinkText: { fontSize: 14, fontWeight: '500', textDecorationLine: 'underline' },
})

export default RestablecerClaveScreen


