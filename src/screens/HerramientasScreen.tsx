import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/colors';
import { Card } from '../components/Card';

export const HerramientasScreen: React.FC = ({ navigation }: any) => {
  const herramientas = [
    {
      title: 'Conocer Proveedores',
      marca: 'Marca',
    },
    {
      title: 'Conocer Obligaciones',
      marca: 'Marca',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.time}>9:41</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.screenTitle}>Herramientas</Text>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Primera sección */}
        <View style={styles.section}>
          {herramientas.map((item, index) => (
            <Card key={index} style={styles.herramientaCard}>
              <Text style={styles.marcaText}>{item.marca}</Text>
            </Card>
          ))}
        </View>

        {/* Segunda sección con imágenes */}
        <View style={styles.imageSection}>
          <Text style={styles.sectionTitle}>Marca</Text>
          {herramientas.map((item, index) => (
            <Card key={`img-${index}`} style={styles.herramientaCard}>
              <View style={styles.imagePlaceholder} />
              <Text style={styles.herramientaTitle}>{item.title}</Text>
            </Card>
          ))}
        </View>

        {/* Tercera sección */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Marca</Text>
          {herramientas.map((item, index) => (
            <Card key={`section3-${index}`} style={styles.herramientaCard}>
              <Text style={styles.marcaText}>{item.marca}</Text>
            </Card>
          ))}
        </View>

        {/* Cuarta sección */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Marca</Text>
          {herramientas.map((item, index) => (
            <Card key={`section4-${index}`} style={styles.herramientaCard}>
              <Text style={styles.herramientaTitle}>{item.title}</Text>
            </Card>
          ))}
        </View>
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
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 10,
  },
  herramientaCard: {
    alignItems: 'center',
    minHeight: 100,
  },
  marcaText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  herramientaTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    marginTop: 5,
  },
  imageSection: {
    marginBottom: 20,
  },
  imagePlaceholder: {
    width: '100%',
    height: 100,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    marginBottom: 10,
  },
});