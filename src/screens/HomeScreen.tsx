import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '../constants/colors';
import { Card } from '../components/Card';

export const HomeScreen: React.FC = ({ navigation }: any) => {
  const menuItems = [
    {
      title: 'Funciones',
      icon: '⚙️',
      onPress: () => navigation.navigate('Funciones'),
    },
    {
      title: 'Herramientas',
      icon: '🛠️',
      onPress: () => navigation.navigate('Herramientas'),
    },
    {
      title: 'Contáctanos',
      icon: '📞',
      onPress: () => navigation.navigate('Contacto'),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.time}>9:41</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {menuItems.map((item, index) => (
          <Card
            key={index}
            title={item.title}
            onPress={item.onPress}
            style={styles.menuCard}
          >
            <Text style={styles.menuIcon}>{item.icon}</Text>
          </Card>
        ))}
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
  content: {
    paddingVertical: 20,
  },
  menuCard: {
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
  },
  menuIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
});