import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen } from '../screens/LoginScreen';
import { SplashScreen } from '../screens/SplashScreen';
import { RecuperarClaveScreen } from '../screens/RecuperarClaveScreen'; // Añade esta línea

export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  RecuperarClave: undefined; // Añade esta línea
};

const Stack = createStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="RecuperarClave" component={RecuperarClaveScreen} /> {/* Añade esta línea */}
    </Stack.Navigator>
  );
};