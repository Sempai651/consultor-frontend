import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { COLORS } from '../../constants/colors';
import { CategoriaPicker } from '../../components/CategoriaPicker';
import Button from '../../components/Button';
import { promocionesService } from '../../services/promociones.service';
import { Promocion } from '../../interfaces/promocion.interface';
import { formatDateForInput } from '../../utils/dateValidators';
import { useAuth } from '../../hooks/useAuth';

export const EditarPromocionScreen = ({ navigation, route }: any) => {
  const { id } = route.params;
  const { isAdmin } = useAuth();
  
  // VALIDACIÓN DE ROL - Solo administradores pueden editar
  useEffect(() => {
    if (!isAdmin) {
      Alert.alert(
        'Acceso Denegado',
        'No tienes permisos para editar promociones. Solo los administradores pueden realizar esta acción.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }
  }, [isAdmin]);

  const [promocion, setPromocion] = useState<Promocion | null>(null);
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('Firmas');
  const [descripcion, setDescripcion] = useState('');
  const [fechaVencimiento, setFechaVencimiento] = useState(new Date());
  const [imagen, setImagen] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [errors, setErrors] = useState({ titulo: '', descripcion: '', fechaVencimiento: '' });

  useEffect(() => {
    if (isAdmin) {
      cargarPromocion();
    }
  }, [isAdmin]);

  const cargarPromocion = async () => {
    try {
      const data = await promocionesService.getById(id);
      setPromocion(data);
      setTitulo(data.titulo);
      setCategoria(data.categoria);
      setDescripcion(data.descripcion);
      setFechaVencimiento(new Date(data.fecha_vencimiento));
      setImagen(data.imagen);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la promoción');
      navigation.goBack();
    }
  };

  const validarFormulario = (): boolean => {
    let isValid = true;
    const newErrors = { titulo: '', descripcion: '', fechaVencimiento: '' };

    if (!titulo.trim()) {
      newErrors.titulo = 'El título es requerido';
      isValid = false;
    }
    if (!descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a tus imágenes');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      const base64String = result.assets[0].base64;
      setImagen(base64String);
    }
  };

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleConfirm = (selectedDate: Date) => {
    hideDatePicker();
    setFechaVencimiento(selectedDate);
  };

  const handleUpdate = async () => {
    if (!validarFormulario()) {
      Alert.alert('Error', 'Por favor completa todos los campos correctamente');
      return;
    }

    setLoading(true);
    try {
      const anio = fechaVencimiento.getFullYear();
      const mes = String(fechaVencimiento.getMonth() + 1).padStart(2, '0');
      const dia = String(fechaVencimiento.getDate()).padStart(2, '0');
      const fechaFormateada = `${anio}-${mes}-${dia}`;

      await promocionesService.update(id, {
        titulo: titulo.trim(),
        categoria: categoria as any,
        descripcion: descripcion.trim(),
        fecha_vencimiento: fechaFormateada,
        imagen: imagen || '',
      });
      
      Alert.alert('Éxito', `Promoción "${titulo}" actualizada exitosamente`);
      navigation.goBack();
      
    } catch (error: any) {
      const mensaje = error?.response?.data?.msg || 'Error al actualizar la promoción';
      Alert.alert('Error', mensaje);
    } finally {
      setLoading(false);
    }
  };

  // Si no es admin, mostrar pantalla de acceso denegado
  if (!isAdmin) {
    return (
      <View style={styles.deniedContainer}>
        <Feather name="lock" size={60} color={COLORS.error} />
        <Text style={styles.deniedTitle}>Acceso Denegado</Text>
        <Text style={styles.deniedText}>
          No tienes permisos para editar promociones. Esta acción solo está disponible para administradores.
        </Text>
        <TouchableOpacity style={styles.deniedButton} onPress={() => navigation.goBack()}>
          <Text style={styles.deniedButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!promocion) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.header, { backgroundColor: COLORS.primary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Promoción</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>TÍTULO</Text>
        <TextInput
          style={[styles.input, errors.titulo ? styles.inputError : null]}
          value={titulo}
          onChangeText={(text) => { setTitulo(text); setErrors({ ...errors, titulo: '' }); }}
          placeholder="Ingrese el título"
          placeholderTextColor={COLORS.textLight}
        />
        {errors.titulo ? <Text style={styles.errorText}>{errors.titulo}</Text> : null}

        <CategoriaPicker selected={categoria} onSelect={setCategoria} />

        <Text style={styles.label}>DESCRIPCIÓN</Text>
        <TextInput
          style={[styles.input, styles.textArea, errors.descripcion ? styles.inputError : null]}
          value={descripcion}
          onChangeText={(text) => { setDescripcion(text); setErrors({ ...errors, descripcion: '' }); }}
          placeholder="Ingrese la descripción"
          placeholderTextColor={COLORS.textLight}
          multiline
          numberOfLines={4}
        />
        {errors.descripcion ? <Text style={styles.errorText}>{errors.descripcion}</Text> : null}

        <Text style={styles.label}>FECHA DE VENCIMIENTO</Text>
        <TouchableOpacity 
          style={[styles.dateButton, errors.fechaVencimiento ? styles.inputError : null]} 
          onPress={showDatePicker}
        >
          <Feather name="calendar" size={20} color={COLORS.textLight} />
          <Text style={styles.dateButtonText}>
            {formatDateForInput(fechaVencimiento)}
          </Text>
        </TouchableOpacity>
        {errors.fechaVencimiento ? <Text style={styles.errorText}>{errors.fechaVencimiento}</Text> : null}

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          date={fechaVencimiento}
          locale="es_ES"
          confirmTextIOS="Aceptar"
          cancelTextIOS="Cancelar"
        />

        <Text style={styles.label}>IMAGEN</Text>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {imagen ? (
            <Image source={{ uri: `data:image/jpeg;base64,${imagen}` }} style={styles.imagePreview} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Feather name="image" size={40} color={COLORS.textLight} />
              <Text style={styles.imageText}>Seleccionar imagen</Text>
            </View>
          )}
        </TouchableOpacity>

        <Button title="ACTUALIZAR PROMOCIÓN" onPress={handleUpdate} loading={loading} style={styles.button} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, paddingHorizontal: 20, paddingBottom: 20 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' },
  content: { padding: 20 },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 8, marginTop: 16 },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 12, fontSize: 16, color: COLORS.text, backgroundColor: COLORS.white },
  inputError: { borderColor: COLORS.error },
  errorText: { fontSize: 12, color: COLORS.error, marginTop: 4 },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  dateButton: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 12, backgroundColor: COLORS.white },
  dateButtonText: { fontSize: 16, color: COLORS.text, flex: 1 },
  imagePicker: { marginTop: 8, marginBottom: 20 },
  imagePlaceholder: { height: 150, backgroundColor: COLORS.surface, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, borderStyle: 'dashed' },
  imagePreview: { width: '100%', height: 150, borderRadius: 12, resizeMode: 'cover' },
  imageText: { marginTop: 8, color: COLORS.textLight },
  button: { marginTop: 20, marginBottom: 30 },
  // Estilos para pantalla de acceso denegado
  deniedContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: COLORS.background },
  deniedTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.error, marginTop: 20, marginBottom: 10 },
  deniedText: { fontSize: 16, color: COLORS.textSecondary, textAlign: 'center', marginBottom: 30 },
  deniedButton: { backgroundColor: COLORS.primary, paddingHorizontal: 30, paddingVertical: 12, borderRadius: 10 },
  deniedButtonText: { color: COLORS.white, fontWeight: 'bold', fontSize: 16 },
});