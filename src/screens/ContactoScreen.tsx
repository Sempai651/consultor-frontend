import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

const ContactoScreen = ({ navigation }: any) => {
  // Información de contacto real
  const contactInfo = [
    { 
      tipo: 'WhatsApp', 
      valor: '098 279 2618', 
      icono: 'phone', 
      color: '#25D366', 
      action: () => Linking.openURL('https://wa.me/593982792618') 
    },
    { 
      tipo: 'Teléfono', 
      valor: '098 279 2618', 
      icono: 'phone-call', 
      color: COLORS.primary, 
      action: () => Linking.openURL('tel:+593982792618') 
    },
    { 
      tipo: 'Email', 
      valor: 'info@begroup.com.ec', 
      icono: 'mail', 
      color: '#EA4335', 
      action: () => Linking.openURL('mailto:info@begroup.com.ec') 
    },
    { 
      tipo: 'Sitio Web', 
      valor: 'begroupec.com', 
      icono: 'globe', 
      color: '#0F973D', 
      action: () => Linking.openURL('https://begroupec.com') 
    },
    { 
      tipo: 'Dirección', 
      valor: 'C. Latacunga, Santo Domingo 230101', 
      icono: 'map-pin', 
      color: COLORS.accent, 
      action: () => Linking.openURL('https://www.google.com/maps/place/Be+Group+S.A.S./@-0.2587958,-79.1728981,17z') 
    },
  ];

  // Horario de atención real
  const horarios = [
    { dia: 'Lunes', horario: '8:30 a.m. - 5:30 p.m.' },
    { dia: 'Martes', horario: '8:30 a.m. - 5:30 p.m.' },
    { dia: 'Miércoles', horario: '8:30 a.m. - 5:30 p.m.' },
    { dia: 'Jueves', horario: '8:30 a.m. - 5:30 p.m.' },
    { dia: 'Viernes', horario: '8:30 a.m. - 5:30 p.m.' },
    { dia: 'Sábado', horario: '9:00 a.m. - 12:30 p.m.' },
    { dia: 'Domingo', horario: 'Cerrado' },
  ];

  const handleOpenMaps = () => {
    Linking.openURL('https://www.google.com/maps/place/Be+Group+S.A.S./@-0.2587958,-79.1728981,17z');
  };

  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      <StatusBar barStyle="light-content" />
      
      <View style={[styles.header, { backgroundColor: COLORS.primary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contáctanos</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Mapa de ubicación con enlace */}
        <TouchableOpacity onPress={handleOpenMaps} style={styles.mapCard}>
          <View style={[styles.mapBackground, { backgroundColor: COLORS.primary }]}>
            <Text style={styles.mapTitle}>📍 Nuestra Ubicación</Text>
            <View style={styles.mapPlaceholder}>
              <Feather name="map-pin" size={40} color="#FFFFFF" />
              <Text style={styles.mapAddress}>C. Latacunga, Santo Domingo</Text>
              <Text style={styles.mapText}>Ver en Google Maps →</Text>
            </View>
          </View>
        </TouchableOpacity>

        <Text style={[styles.sectionTitle, { color: COLORS.text }]}>Información de Contacto</Text>
        
        {contactInfo.map((item, index) => (
          <TouchableOpacity key={index} onPress={item.action} style={[styles.contactCard, { backgroundColor: item.color }]}>
            <Feather name={item.icono as any} size={28} color="#FFFFFF" style={styles.contactIcon} />
            <View style={styles.contactContent}>
              <Text style={styles.contactType}>{item.tipo}</Text>
              <Text style={styles.contactValue}>{item.valor}</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        ))}

        {/* Horario de Atención */}
        <View style={[styles.hoursCard, { backgroundColor: COLORS.accent }]}>
          <Text style={styles.hoursTitle}>Horario de Atención</Text>
          {horarios.map((item, index) => (
            <View key={index} style={styles.hoursRow}>
              <Text style={styles.hoursDay}>{item.dia}</Text>
              <Text style={styles.hoursTime}>{item.horario}</Text>
            </View>
          ))}
        </View>

        {/* Redes sociales */}
        <Text style={[styles.sectionTitle, { color: COLORS.text }]}>Síguenos</Text>
        <View style={styles.socialGrid}>
          <TouchableOpacity style={[styles.socialCard, { backgroundColor: '#25D366' }]}>
            <Feather name="phone" size={24} color="#FFFFFF" />
            <Text style={styles.socialName}>WhatsApp</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.socialCard, { backgroundColor: '#3B5998' }]}>
            <Feather name="facebook" size={24} color="#FFFFFF" />
            <Text style={styles.socialName}>Facebook</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.socialCard, { backgroundColor: '#E4405F' }]}>
            <Feather name="instagram" size={24} color="#FFFFFF" />
            <Text style={styles.socialName}>Instagram</Text>
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
  content: { padding: 20 },
  mapCard: { marginBottom: 20, borderRadius: 20, overflow: 'hidden' },
  mapBackground: { padding: 20, borderRadius: 20 },
  mapTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 15 },
  mapPlaceholder: { 
    backgroundColor: 'rgba(255,255,255,0.1)', 
    borderRadius: 12, 
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    borderStyle: 'dashed'
  },
  mapAddress: { color: '#FFFFFF', fontSize: 16, fontWeight: '500', marginTop: 10, textAlign: 'center' },
  mapText: { color: '#FFFFFF', fontSize: 14, marginTop: 10, textDecorationLine: 'underline' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, marginTop: 10 },
  contactCard: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 15, marginBottom: 12 },
  contactIcon: { width: 50, textAlign: 'center' },
  contactContent: { flex: 1 },
  contactType: { fontSize: 14, color: 'rgba(255,255,255,0.9)', marginBottom: 2 },
  contactValue: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
  hoursCard: { padding: 20, borderRadius: 20, marginVertical: 20 },
  hoursTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 15 },
  hoursRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  hoursDay: { fontSize: 15, color: 'rgba(255,255,255,0.9)' },
  hoursTime: { fontSize: 15, fontWeight: 'bold', color: '#FFFFFF' },
  socialGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  socialCard: { width: '31%', padding: 15, borderRadius: 15, alignItems: 'center' },
  socialName: { fontSize: 11, color: '#FFFFFF', marginTop: 5 },
});

export default ContactoScreen;