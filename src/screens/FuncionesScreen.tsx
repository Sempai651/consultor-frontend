import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { COLORS } from '../constants/colors';
import { Card } from '../components/Card';

export const FuncionesScreen: React.FC = ({ navigation }: any) => {
  const funciones = [
    {
      title: 'Conocer Proveedores',
      marca: 'Marca Conocer Proveedores',
      onPress: () => Alert.alert('Proveedores', 'Función próximamente'),
    },
    {
      title: 'Conocer Obligaciones',
      marca: 'Marca Conocer Obligaciones',
      onPress: () => Alert.alert('Obligaciones', 'Función próximamente'),
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

      <Text style={styles.screenTitle}>Funciones</Text>

      <ScrollView contentContainerStyle={styles.content}>
        {funciones.map((item, index) => (
          <Card
            key={index}
            title={item.title}
            onPress={item.onPress}
            style={styles.funcionCard}
          >
            <Text style={styles.marcaText}>{item.marca}</Text>
          </Card>
        ))}

        <View style={styles.duplicateSection}>
          <Text style={styles.sectionTitle}>Marca</Text>
          {funciones.map((item, index) => (
            <Card
              key={`duplicate-${index}`}
              title={item.title}
              onPress={item.onPress}
              style={styles.funcionCard}
            >
              <Text style={styles.marcaText}>Marca</Text>
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
  funcionCard: {
    alignItems: 'center',
  },
  marcaText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 5,
  },
  duplicateSection: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 10,
  },
});