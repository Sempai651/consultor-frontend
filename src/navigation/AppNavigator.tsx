import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import FuncionesScreen from '../screens/FuncionesScreen';
import HerramientasScreen from '../screens/HerramientasScreen';
import ContactoScreen from '../screens/ContactoScreen';
import { COLORS } from '../constants/colors';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';
          if (route.name === 'Funciones') iconName = 'settings';
          else if (route.name === 'Herramientas') iconName = 'tool';
          else if (route.name === 'Contacto') iconName = 'phone';
          return <Feather name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: { paddingBottom: 5, paddingTop: 5, height: 60 }
      })}
    >
      <Tab.Screen name="Funciones" component={FuncionesScreen} />
      <Tab.Screen name="Herramientas" component={HerramientasScreen} />
      <Tab.Screen name="Contacto" component={ContactoScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="MainTabs" component={HomeTabs} />
    </Stack.Navigator>
  );
};

export default AppNavigator;