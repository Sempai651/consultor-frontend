import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { registrarActividad } from '../services/actividad.service';

const HerramientasScreen = ({ navigation }: any) => {
  useEffect(() => {
    registrarActividad('pago', 'Módulo de Herramientas', 'Accediste a las herramientas financieras');
  }, []);

  const herramientas = [
    {
      categoria: 'Financieras',
      icono: 'dollar-sign',
      items: [
        { nombre: 'Calculadora de Préstamos', icono: 'calculator', color: '#2A4494' },
        { nombre: 'Conversor de Monedas', icono: 'refresh-cw', color: '#E6B91E' },
        { nombre: 'Calculadora de IVA', icono: 'percent', color: '#0F973D' },
      ]
    },
    {
      categoria: 'Gestión',
      icono: 'briefcase',
      items: [
        { nombre: 'Generador de Reportes', icono: 'file-text', color: '#D42B2B' },
        { nombre: 'Calendario Fiscal', icono: 'calendar', color: '#2A4494' },
        { nombre: 'Recordatorios', icono: 'bell', color: '#E68A2E' },
      ]
    },
    {
      categoria: 'Análisis',
      icono: 'bar-chart-2',
      items: [
        { nombre: 'Análisis de Datos', icono: 'trending-up', color: '#0F973D' },
        { nombre: 'Gráficos', icono: 'pie-chart', color: '#E6B91E' },
        { nombre: 'Indicadores', icono: 'activity', color: '#2A4494' },
      ]
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      <StatusBar barStyle="light-content" />
      
      <View style={[styles.header, { backgroundColor: COLORS.primary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Herramientas</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Feather name="search" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {herramientas.map((categoria, idx) => (
          <View key={idx} style={styles.categorySection}>
            <View style={styles.categoryHeader}>
              <Feather name={categoria.icono as any} size={24} color={COLORS.primary} style={styles.categoryIcon} />
              <Text style={[styles.categoryTitle, { color: COLORS.text }]}>{categoria.categoria}</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.toolsScroll}>
              {categoria.items.map((item, index) => (
                <TouchableOpacity key={index} style={[styles.toolCard, { backgroundColor: item.color }]}>
                  <Feather name={item.icono as any} size={36} color="#FFFFFF" />
                  <Text style={styles.toolName}>{item.nombre}</Text>
                  <View style={styles.toolBadge}>
                    <Feather name="arrow-right" size={16} color="#FFFFFF" />
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ))}

        <View style={[styles.featuredCard, { backgroundColor: COLORS.accent }]}>
          <Feather name="star" size={40} color="#FFFFFF" style={styles.featuredIcon} />
          <Text style={styles.featuredTitle}>Herramienta Destacada</Text>
          <Text style={styles.featuredName}>Asistente BEGROUP</Text>
          <Text style={styles.featuredDescription}>Tu asistente virtual para gestión empresarial</Text>
          <TouchableOpacity style={styles.featuredButton}>
            <Text style={styles.featuredButtonText}>Probar ahora →</Text>
          </TouchableOpacity>
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
  searchButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  content: { padding: 20 },
  categorySection: { marginBottom: 25 },
  categoryHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  categoryIcon: { marginRight: 10 },
  categoryTitle: { fontSize: 18, fontWeight: 'bold' },
  toolsScroll: { flexDirection: 'row' },
  toolCard: { width: 140, marginRight: 15, padding: 15, borderRadius: 20, alignItems: 'center' },
  toolName: { fontSize: 14, fontWeight: '600', color: '#FFFFFF', textAlign: 'center', marginVertical: 10 },
  toolBadge: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center' },
  featuredCard: { padding: 20, borderRadius: 20, marginTop: 10, alignItems: 'center' },
  featuredIcon: { marginBottom: 10 },
  featuredTitle: { fontSize: 14, color: 'rgba(255,255,255,0.9)', marginBottom: 5 },
  featuredName: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8 },
  featuredDescription: { fontSize: 14, color: 'rgba(255,255,255,0.9)', textAlign: 'center', marginBottom: 15 },
  featuredButton: { backgroundColor: 'rgba(255,255,255,0.2)', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10 },
  featuredButtonText: { color: '#FFFFFF', fontWeight: '600' },
});

export default HerramientasScreen;