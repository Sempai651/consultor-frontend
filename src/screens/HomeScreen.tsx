import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { useAuth } from '../hooks/useAuth';

const HomeScreen = ({ navigation }: any) => {
  const { signOut, user } = useAuth();

  const menuItems = [
    { id: 1, title: 'Funciones', icon: 'settings', description: 'Gestión de proveedores y obligaciones', screen: 'MainTabs', params: { screen: 'Funciones' } },
    { id: 2, title: 'Herramientas', icon: 'tool', description: 'Calculadoras y utilidades empresariales', screen: 'MainTabs', params: { screen: 'Herramientas' } },
    { id: 3, title: 'Promociones', icon: 'tag', description: 'Gestiona tus promociones y ofertas', screen: 'Promociones' }, // ← NUEVO
    { id: 4, title: 'Contáctanos', icon: 'phone', description: 'Soporte y atención al cliente', screen: 'MainTabs', params: { screen: 'Contacto' } },
  ];

  const stats = [
    { label: 'Proveedores', value: '24', icon: 'home' },
    { label: 'Obligaciones', value: '12', icon: 'file-text' },
    { label: 'Mensajes', value: '3', icon: 'message-square' },
  ];

  const handleLogout = async () => {
    const confirmacion = window.confirm("¿Desea cerrar sesión?");
    console.log(confirmacion);
    
    if (!confirmacion) return;
    if (!localStorage.getItem("@Auth:token") && !localStorage.getItem("@Auth:user")) return;
    localStorage.clear();
    window.location.reload();
  };

  // Determinar color según ID
  const getColor = (id: number) => {
    if (id === 1) return '#2A4494';
    if (id === 2) return '#E6B91E';
    if (id === 3) return '#F59E0B'; // Color para promociones
    return '#0F973D';
  };

  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      <StatusBar barStyle="light-content" />
      
      <View style={[styles.header, { backgroundColor: COLORS.primary }]}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>¡Bienvenido!</Text>
            <Text style={styles.userName}>{user?.nombre || 'Usuario BEGROUP'}</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Feather name="log-out" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
          <Text style={styles.summaryTitle}>Resumen del día</Text>
          <View style={styles.statsContainer}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statItem}>
                <Feather name={stat.icon as any} size={24} color="#FFFFFF" style={styles.statIcon} />
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.sectionTitle, { color: COLORS.text }]}>Accesos Rápidos</Text>

        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuCard}
            onPress={() => {
              if (item.screen === 'Promociones') {
                navigation.navigate('Promociones');
              } else {
                navigation.navigate(item.screen, item.params);
              }
            }}
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
          <Text style={[styles.sectionTitle, { color: COLORS.text }]}>Actividad Reciente</Text>
          <View style={[styles.activityCard, { backgroundColor: COLORS.surface }]}>
            <View style={styles.activityItem}>
              <Feather name="home" size={20} color={COLORS.primary} style={styles.activityIcon} />
              <View style={styles.activityContent}>
                <Text style={[styles.activityTitle, { color: COLORS.text }]}>Nuevo proveedor registrado</Text>
                <Text style={[styles.activityTime, { color: COLORS.textLight }]}>Hace 2 horas</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <Feather name="credit-card" size={20} color={COLORS.accent} style={styles.activityIcon} />
              <View style={styles.activityContent}>
                <Text style={[styles.activityTitle, { color: COLORS.text }]}>Pago programado</Text>
                <Text style={[styles.activityTime, { color: COLORS.textLight }]}>Hace 5 horas</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <Feather name="message-circle" size={20} color={COLORS.success} style={styles.activityIcon} />
              <View style={styles.activityContent}>
                <Text style={[styles.activityTitle, { color: COLORS.text }]}>Mensaje de soporte</Text>
                <Text style={[styles.activityTime, { color: COLORS.textLight }]}>Ayer</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 50, paddingHorizontal: 20, paddingBottom: 30, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  greeting: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  userName: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF' },
  logoutButton: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  summaryCard: { borderRadius: 20, padding: 15 },
  summaryTitle: { fontSize: 16, color: '#FFFFFF', marginBottom: 15, fontWeight: '600' },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statIcon: { marginBottom: 5 },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' },
  statLabel: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  content: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  menuCard: { marginBottom: 15, borderRadius: 20, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 },
  menuGradient: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  menuIconContainer: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  menuContent: { flex: 1 },
  menuTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 },
  menuDescription: { fontSize: 13, color: 'rgba(255,255,255,0.9)' },
  activitySection: { marginTop: 20 },
  activityCard: { borderRadius: 20, padding: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  activityItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  activityIcon: { marginRight: 15, width: 30 },
  activityContent: { flex: 1 },
  activityTitle: { fontSize: 15, fontWeight: '600', marginBottom: 4 },
  activityTime: { fontSize: 12 },
});

export default HomeScreen;