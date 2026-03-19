import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking, Alert } from 'react-native';
import { COLORS } from '../constants/colors';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

export const ContactoScreen: React.FC = ({ navigation }: any) => {
  const handleWhatsApp = () => {
    Linking.openURL('https://wa.me/1234567890');
  };

  const handleEmail = () => {
    Linking.openURL('mailto:contacto@consultor.com');
  };

  const handlePhone = () => {
    Linking.openURL('tel:+1234567890');
  };

  const handleWebsite = () => {
    Linking.openURL('https://www.consultor.com');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.time}>9:41</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.screenTitle}>Contáctanos</Text>

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.contactCard}>
          <Text style={styles.contactTitle}>Información de Contacto</Text>
          
          <TouchableOpacity style={styles.contactItem} onPress={handleWhatsApp}>
            <Text style={styles.contactIcon}>📱</Text>
            <Text style={styles.contactText}>WhatsApp: +123 456 7890</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactItem} onPress={handleEmail}>
            <Text style={styles.contactIcon}>📧</Text>
            <Text style={styles.contactText}>Email: contacto@consultor.com</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactItem} onPress={handlePhone}>
            <Text style={styles.contactIcon}>📞</Text>
            <Text style={styles.contactText}>Teléfono: +123 456 7890</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactItem} onPress={handleWebsite}>
            <Text style={styles.contactIcon}>🌐</Text>
            <Text style={styles.contactText}>Sitio Web: www.consultor.com</Text>
          </TouchableOpacity>
        </Card>

        <Card style={styles.locationCard}>
          <Text style={styles.contactTitle}>Ubicación</Text>
          <Text style={styles.locationText}>
            Av. Principal 123, Ciudad
          </Text>
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapText}>Mapa de ubicación</Text>
          </View>
        </Card>

        <Button
          title="Enviar Mensaje"
          onPress={() => Alert.alert('Información', 'Función de mensaje próximamente')}
          style={styles.messageButton}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  time: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  backButton: {
    fontSize: 24,
    color: COLORS.primary,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginVertical: 20,
  },
  content: {
    paddingVertical: 10,
  },
  contactCard: {
    marginBottom: 20,
  },
  locationCard: {
    marginBottom: 20,
  },
  contactTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 15,
    textAlign: 'center',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  contactIcon: {
    fontSize: 24,
    marginRight: 15,
    width: 40,
    textAlign: 'center',
  },
  contactText: {
    fontSize: 16,
    color: COLORS.text,
    flex: 1,
  },
  locationText: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 15,
  },
  mapPlaceholder: {
    height: 150,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  mapText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  messageButton: {
    margin: 16,
  },
});