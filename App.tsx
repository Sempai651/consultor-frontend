import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import LoginScreen from './src/screens/LoginScreen';
import RegistroScreen from './src/screens/RegistroScreen';
import RecuperarClaveScreen from './src/screens/RecuperarClaveScreen';
import RestablecerClaveScreen from './src/screens/RestablecerClaveScreen';
import { ListaPromocionesScreen } from './src/screens/promociones/ListaPromocionesScreen';
import { CrearPromocionScreen } from './src/screens/promociones/CrearPromocionScreen';
import { EditarPromocionScreen } from './src/screens/promociones/EditarPromocionScreen';
import { DetallePromocionScreen } from './src/screens/promociones/DetallePromocionScreen';

const Stack = createStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Registro" component={RegistroScreen} />
      <Stack.Screen name="RecuperarClave" component={RecuperarClaveScreen} />
      <Stack.Screen name="RestablecerClave" component={RestablecerClaveScreen} />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainApp" component={AppNavigator} />
      <Stack.Screen name="Promociones" component={ListaPromocionesScreen} />
      <Stack.Screen name="CrearPromocion" component={CrearPromocionScreen} />
      <Stack.Screen name="EditarPromocion" component={EditarPromocionScreen} />
      <Stack.Screen name="DetallePromocion" component={DetallePromocionScreen} />
    </Stack.Navigator>
  );
}

function RootStack() {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <AppStack /> : <AuthStack />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <RootStack />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}