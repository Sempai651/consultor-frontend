import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, TextInput, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { useAuth } from '../hooks/useAuth';
import { PromocionesDestacadas } from '../components/PromocionesDestacadas';
import { ActividadReciente } from '../components/ActividadReciente';
import { registrarActividad } from '../services/actividad.service';

const HomeScreen = ({ navigation }: any) => {
  const { signOut, user, isAdmin } = useAuth();
  const [busqueda, setBusqueda] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setRefreshKey(prev => prev + 1);
    }, [])
  );

  const menuItems = [
    { id: 1, title: 'Funciones', icon: 'settings', description: 'Gestión de proveedores y obligaciones', screen: 'MainTabs', params: { screen: 'Funciones' } },
    { id: 2, title: 'Herramientas', icon: 'tool', description: 'Calculadoras y utilidades empresariales', screen: 'MainTabs', params: { screen: 'Herramientas' } },
    { id: 3, title: 'Promociones', icon: 'tag', description: 'Gestiona tus promociones y ofertas', screen: 'Promociones', adminOnly: true },
    { id: 4, title: 'Contáctanos', icon: 'phone', description: 'Soporte y atención al cliente', screen: 'MainTabs', params: { screen: 'Contacto' } },
  ];

  const menuItemsFiltrados = menuItems.filter(item => !item.adminOnly || isAdmin);

  // ✅ CORREGIDO: usar Alert.alert en lugar de window.confirm
  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            await registrarActividad('logout', 'Cierre de sesión', 'Usuario cerró sesión');
            await signOut();
            navigation.replace('Login');
          }
        }
      ]
    );
  };

  const handleMenuPress = async (item: any) => {
    if (item.id === 1) {
      await registrarActividad('proveedor', 'Acceso a Funciones', 'Usuario accedió al módulo de funciones');
    } else if (item.id === 2) {
      await registrarActividad('pago', 'Acceso a Herramientas', 'Usuario accedió al módulo de herramientas');
    } else if (item.id === 3) {
      await registrarActividad('promocion', 'Acceso a Promociones', 'Usuario accedió al módulo de promociones');
    }
    
    if (item.screen === 'Promociones') {
      navigation.navigate('Promociones');
    } else {
      navigation.navigate(item.screen, item.params);
    }
  };

  const getColor = (id: number) => {
    if (id === 1) return '#2A4494';
    if (id === 2) return '#E6B91E';
    if (id === 3) return '#F59E0B';
    return '#0F973D';
  };

  const rolUsuario = user?.rol === 'admin' ? 'Administrador' : 'Cliente';
  const rolColor = user?.rol === 'admin' ? '#F59E0B' : '#0F973D';

  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      <StatusBar barStyle="light-content" />
      
      <View style={[styles.header, { backgroundColor: COLORS.primary }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>¡Hola, {user?.nombre || 'Usuario'}! 🎉</Text>
            <Text style={styles.location}>Ecuador</Text>
            <View style={[styles.rolBadge, { backgroundColor: rolColor }]}>
              <Text style={styles.rolText}>{rolUsuario}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Feather name="log-out" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color={COLORS.textLight} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar productos, servicios..."
            placeholderTextColor={COLORS.textLight}
            value={busqueda}
            onChangeText={setBusqueda}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <PromocionesDestacadas 
          key={refreshKey}
          busqueda={busqueda}
          navigation={navigation}
          onPressPromocion={(id) => navigation.navigate('DetallePromocion', { id })}
          onEditPromocion={(id) => navigation.navigate('EditarPromocion', { id })}
        />

        <Text style={[styles.sectionTitle, { color: COLORS.text }]}>Accesos Rápidos</Text>

        {menuItemsFiltrados.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuCard}
            onPress={() => handleMenuPress(item)}
            activeOpacity={0.8}
          >
            <View style={[styles.menuGradient, { backgroundColor: getColor(item.id) }]}>
              <View style={[styles.menuIconContainer, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                <Feather name={item.icon as any} size={28} color="#FFFFFF" />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuDescription}>{item.description}</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.activitySection}>
          <ActividadReciente 
            navigation={navigation}
            onPressActividad={(actividad) => {
              console.log('Actividad presionada:', actividad);
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 50, paddingHorizontal: 20, paddingBottom: 30, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  greeting: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' },
  location: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  rolBadge: { marginTop: 8, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, alignSelf: 'flex-start' },
  rolText: { fontSize: 12, color: '#FFFFFF', fontWeight: 'bold' },
  logoutButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, paddingHorizontal: 12, marginBottom: 20 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 16, color: '#FFFFFF' },
  content: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  menuCard: { marginBottom: 15, borderRadius: 20, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 },
  menuGradient: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  menuIconContainer: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  menuContent: { flex: 1 },
  menuTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 },
  menuDescription: { fontSize: 13, color: 'rgba(255,255,255,0.9)' },
  activitySection: { marginTop: 20 },
});

export default HomeScreen;