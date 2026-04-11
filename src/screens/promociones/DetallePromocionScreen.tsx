import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  Image,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import Button from '../../components/Button';
import { promocionesService } from '../../services/promociones.service';
import { Promocion } from '../../interfaces/promocion.interface';
import { useAuth } from '../../hooks/useAuth';

export const DetallePromocionScreen = ({ navigation, route }: any) => {
  // Obtenemos el ID de la promocion desde los parametros de navegacion
  const { id } = route.params;
  const { isAdmin } = useAuth();
  const [promocion, setPromocion] = useState<Promocion | null>(null);
  const [loading, setLoading] = useState(true);

  // Al cargar la pantalla, traemos los datos de la promocion
  useEffect(() => {
    cargarPromocion();
  }, []);

  // Funcion para obtener los datos de la promocion desde el backend
  const cargarPromocion = async () => {
    try {
      const data = await promocionesService.getById(id);
      setPromocion(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la promoción');
      navigation.goBack(); // Si hay error, volvemos a la lista
    } finally {
      setLoading(false);
    }
  };

  // Cambia el estado de la promocion (activo/inactivo) - SOLO ADMIN
  const toggleEstado = async () => {
    if (!promocion) return;
    const nuevoEstado = promocion.estado === 'activo' ? 'inactivo' : 'activo';
    try {
      await promocionesService.toggleEstado(id, nuevoEstado);
      setPromocion({ ...promocion, estado: nuevoEstado }); // Actualiza el estado local
      Alert.alert('Éxito', `Promoción ${nuevoEstado === 'activo' ? 'activada' : 'desactivada'}`);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cambiar el estado');
    }
  };

  // Mientras carga, mostramos un indicador
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  if (!promocion) return null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header con boton de regreso y edicion (solo admin ve el botón editar) */}
      <View style={[styles.header, { backgroundColor: COLORS.primary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle Promoción</Text>
        {isAdmin ? (
          <TouchableOpacity onPress={() => navigation.navigate('EditarPromocion', { id: promocion.id })}>
            <Feather name="edit-2" size={24} color="#FFF" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Muestra la imagen de la promocion */}
        {promocion.imagen ? (
          <Image source={{ uri: `data:image/jpeg;base64,${promocion.imagen}` }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Feather name="image" size={50} color={COLORS.textLight} />
            <Text style={styles.imagePlaceholderText}>Sin imagen</Text>
          </View>
        )}

        {/* Tarjeta con la informacion de la promocion */}
        <View style={styles.infoCard}>
          <Text style={styles.titulo}>{promocion.titulo}</Text>
          
          {/* Badge de estado (activo/inactivo) - SOLO PARA ADMIN */}
          {isAdmin && (
            <View style={[styles.estadoBadge, promocion.estado === 'activo' ? styles.activo : styles.inactivo]}>
              <Text style={styles.estadoText}>{promocion.estado === 'activo' ? 'ACTIVO' : 'INACTIVO'}</Text>
            </View>
          )}
          
          <Text style={styles.categoria}>{promocion.categoria}</Text>
          <Text style={styles.descripcion}>{promocion.descripcion}</Text>
          
          {/* Fecha de creacion */}
          <View style={styles.fechaContainer}>
            <Feather name="calendar" size={16} color={COLORS.textLight} />
            <Text style={styles.fecha}>Creado: {new Date(promocion.fecha_creacion).toLocaleDateString()}</Text>
          </View>
          
          {/* Fecha de vencimiento */}
          <View style={styles.fechaContainer}>
            <Feather name="clock" size={16} color={COLORS.textLight} />
            <Text style={styles.fecha}>Vence: {new Date(promocion.fecha_vencimiento).toLocaleDateString()}</Text>
          </View>
        </View>

        {/* Boton para activar/desactivar la promocion - SOLO PARA ADMIN */}
        {isAdmin && (
          <Button
            title={promocion.estado === 'activo' ? 'DESACTIVAR PROMOCIÓN' : 'ACTIVAR PROMOCIÓN'}
            onPress={toggleEstado}
            variant={promocion.estado === 'activo' ? 'secondary' : 'primary'}
            style={styles.button}
          />
        )}
      </ScrollView>
    </View>
  );
};

// Estilos del componente
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, paddingHorizontal: 20, paddingBottom: 20 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  content: { padding: 20 },
  image: { width: '100%', height: 200, borderRadius: 16, marginBottom: 20 },
  imagePlaceholder: { width: '100%', height: 200, backgroundColor: COLORS.surface, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: COLORS.border, borderStyle: 'dashed' },
  imagePlaceholderText: { marginTop: 8, color: COLORS.textLight },
  infoCard: { backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 20 },
  titulo: { fontSize: 22, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 },
  estadoBadge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginBottom: 12 },
  activo: { backgroundColor: '#4CAF50' },
  inactivo: { backgroundColor: '#9E9E9E' },
  estadoText: { fontSize: 12, color: '#FFF', fontWeight: 'bold' },
  categoria: { fontSize: 16, color: COLORS.primary, marginBottom: 12 },
  descripcion: { fontSize: 16, color: COLORS.text, marginBottom: 16, lineHeight: 24 },
  fechaContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  fecha: { fontSize: 14, color: COLORS.textLight, marginLeft: 8 },
  button: { marginTop: 10, marginBottom: 30 },
});