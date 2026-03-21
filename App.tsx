import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { ActivityIndicator, View } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { AuthProvider, useAuth } from './src/context/AuthContext'
import AppNavigator from './src/navigation/AppNavigator'
import LoginScreen from './src/screens/LoginScreen'
import RegistroScreen from './src/screens/RegistroScreen'
import RecuperarClaveScreen from './src/screens/RecuperarClaveScreen'
import RestablecerClaveScreen from './src/screens/RestablecerClaveScreen'
import { COLORS } from './src/constants/colors'

const Stack = createStackNavigator()

// Configuración del deep linking
// Esto le dice a la app qué pantalla abrir según la URL
const linking = {
  prefixes: [
    'consultor://',           
    'exp://localhost:8081',   
  ],
  config: {
    screens: {
      // cuando llega consultor://restablecer-clave/TOKEN
      // abre RestablecerClave con params: { token: TOKEN }
      RestablecerClave: 'restablecer-clave/:token',
    }
  }
}

function RootStack() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    )
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="MainApp" component={AppNavigator} />
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Registro" component={RegistroScreen} />
          <Stack.Screen name="RecuperarClave" component={RecuperarClaveScreen} />
          <Stack.Screen
            name="RestablecerClave"
            component={RestablecerClaveScreen}
          />
        </>
      )}
    </Stack.Navigator>
  )
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer linking={linking}>
          <StatusBar style="light" />
          <RootStack />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  )
}