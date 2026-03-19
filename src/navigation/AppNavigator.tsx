import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { FuncionesScreen } from '../screens/FuncionesScreen';
import { HerramientasScreen } from '../screens/HerramientasScreen';
import { ContactoScreen } from '../screens/ContactoScreen';
import { useAuth } from '../hooks/useAuth'; // Importación corregida desde hooks
import { AuthNavigator } from './AuthNavigator';
import { COLORS } from '../constants/colors';

// Definir los tipos para el stack principal
export type RootStackParamList = {
  Home: undefined;
  Auth: undefined;
};

// Definir los tipos para el tab navigator
export type TabParamList = {
  Home: undefined;
  Funciones: undefined;
  Herramientas: undefined;
  Contacto: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const HomeTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          paddingBottom: 5,
          paddingTop: 5,
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          title: 'Inicio',
        }}
      />
      <Tab.Screen 
        name="Funciones" 
        component={FuncionesScreen}
        options={{
          title: 'Funciones',
        }}
      />
      <Tab.Screen 
        name="Herramientas" 
        component={HerramientasScreen}
        options={{
          title: 'Herramientas',
        }}
      />
      <Tab.Screen 
        name="Contacto" 
        component={ContactoScreen}
        options={{
          title: 'Contacto',
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="Home" component={HomeTabs} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;