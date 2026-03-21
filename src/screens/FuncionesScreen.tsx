import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

const FuncionesScreen = ({ navigation }: any) => {
  const funciones = [
    {
      id: 1,
      titulo: 'Conocer Proveedores',
      descripcion: 'Gestión completa de tu red de proveedores',
      icono: 'home',
      color: '#2A4494',
      items: ['Registrar proveedor', 'Lista de proveedores', 'Evaluación', 'Historial']
    },
    {
      id: 2,
      titulo: 'Conocer Obligaciones',
      descripcion: 'Control de pagos y obligaciones fiscales',
      icono: 'file-text',
      color: '#E6B91E',
      items: ['Próximos pagos', 'Historial', 'Impuestos', 'Recordatorios']
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      <StatusBar barStyle="light-content" />
      
      <View style={[styles.header, { backgroundColor: COLORS.primary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Funciones</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {funciones.map((funcion) => (
          <View key={funcion.id} style={styles.functionSection}>
            <View style={[styles.sectionHeader, { backgroundColor: funcion.color }]}>
              <Feather name={funcion.icono as any} size={30} color="#FFFFFF" style={styles.sectionIcon} />
              <View>
                <Text style={styles.sectionTitle}>{funcion.titulo}</Text>
                <Text style={styles.sectionDescription}>{funcion.descripcion}</Text>
              </View>
            </View>

            <View style={styles.itemsGrid}>
              {funcion.items.map((item, index) => (
                <TouchableOpacity key={index} style={[styles.itemCard, { borderColor: COLORS.border }]}>
                  <View style={[styles.itemGradient, { backgroundColor: COLORS.surface }]}>
                    <Text style={[styles.itemText, { color: COLORS.text }]}>{item}</Text>
                    <Feather name="chevron-right" size={16} color={COLORS.primary} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <View style={[styles.statsCard, { backgroundColor: COLORS.accent }]}>
          <Text style={styles.statsTitle}>Estadísticas Generales</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statBlock}>
              <Feather name="home" size={30} color="#FFFFFF" />
              <Text style={styles.statNumber}>24</Text>
              <Text style={styles.statLabel}>Proveedores</Text>
            </View>
            <View style={styles.statBlock}>
              <Feather name="file-text" size={30} color="#FFFFFF" />
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Obligaciones</Text>
            </View>
            <View style={styles.statBlock}>
              <Feather name="alert-triangle" size={30} color="#FFFFFF" />
              <Text style={styles.statNumber}>5</Text>
              <Text style={styles.statLabel}>Vencidas</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, paddingHorizontal: 20, paddingBottom: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' },
  content: { padding: 20 },
  functionSection: { marginBottom: 25 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 15, marginBottom: 10 },
  sectionIcon: { marginRight: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
  sectionDescription: { fontSize: 13, color: 'rgba(255,255,255,0.9)' },
  itemsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  itemCard: { width: '48%', marginBottom: 10, borderRadius: 12, overflow: 'hidden', borderWidth: 1 },
  itemGradient: { padding: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemText: { fontSize: 14, flex: 1 },
  statsCard: { padding: 20, borderRadius: 20, marginTop: 10 },
  statsTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 15, textAlign: 'center' },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-around' },
  statBlock: { alignItems: 'center' },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', marginTop: 5 },
  statLabel: { fontSize: 13, color: 'rgba(255,255,255,0.9)' },
});

export default FuncionesScreen;