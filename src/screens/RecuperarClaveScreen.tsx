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

const RecuperarClaveScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [loading, setLoading] = useState(false)

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSendEmail = async () => {
    if (!validateEmail(email)) {
      setEmailError('Ingrese un correo válido')
      return
    }

    setLoading(true)
    try {
      // Llama al backend real — envía el email con Nodemailer
      await authService.recuperarClave(email)

      // Mismo mensaje siempre — no revelamos si el email existe
      Alert.alert(
        'Correo enviado',
        'Si el correo está registrado, recibirás las instrucciones en tu bandeja de entrada.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      )
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message || 'No se pudo procesar la solicitud'
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
        <Text style={styles.headerTitle}>Recuperar Contraseña</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.card, { backgroundColor: COLORS.surface }]}>

          <View style={styles.iconContainer}>
            <Feather name="mail" size={50} color={COLORS.primary} />
          </View>

          <Text style={[styles.description, { color: COLORS.textSecondary }]}>
            Ingrese su correo electrónico y le enviaremos las instrucciones para recuperar su contraseña.
          </Text>

          <Input
            label="CORREO ELECTRÓNICO"
            value={email}
            onChangeText={(text) => { setEmail(text); setEmailError('') }}
            placeholder="ejemplo@correo.com"
            keyboardType="email-address"
            iconName="mail"
            error={emailError}
          />

          <Button
            title="ENVIAR INSTRUCCIONES"
            onPress={handleSendEmail}
            loading={loading}
          />

          <TouchableOpacity
            style={styles.backLink}
            onPress={() => navigation.goBack()}
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

export default RecuperarClaveScreen