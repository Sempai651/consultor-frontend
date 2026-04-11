import React, { useState } from 'react';
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
  Modal,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '../../constants/colors';
import { CategoriaPicker } from '../../components/CategoriaPicker';
import Button from '../../components/Button';
import { promocionesService } from '../../services/promociones.service';
import { useAuth } from '../../hooks/useAuth';

export const CrearPromocionScreen = ({ navigation }: any) => {
  const { isAdmin } = useAuth();
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('Firmas');
  const [descripcion, setDescripcion] = useState('');
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [imagen, setImagen] = useState<string | null>(null);
  const [imagenBase64, setImagenBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [errors, setErrors] = useState({ titulo: '', descripcion: '', fechaVencimiento: '' });

  if (!isAdmin) {
    Alert.alert('Acceso denegado', 'Solo administradores pueden crear promociones');
    navigation.goBack();
    return null;
  }

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
    if (!fechaVencimiento) {
      newErrors.fechaVencimiento = 'La fecha de vencimiento es requerida';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const pickImage = async () => {
    try {
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
        setImagenBase64(base64String);
        setImagen(`data:image/jpeg;base64,${base64String}`);
      }
    } catch (error) {
      console.error('Error al seleccionar imagen:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  const handleDateSelect = (day: any) => {
    setFechaVencimiento(day.dateString);
    setShowCalendar(false);
  };

  const handleCreate = async () => {
    if (!validarFormulario()) {
      Alert.alert('Error', 'Por favor completa todos los campos correctamente');
      return;
    }

    setLoading(true);
    try {
      const datosParaEnviar = {
        titulo: titulo.trim(),
        categoria: categoria as any,
        descripcion: descripcion.trim(),
        fecha_vencimiento: fechaVencimiento,
        imagen: imagenBase64 || '',
      };

      console.log('📤 Enviando:', datosParaEnviar);

      await promocionesService.create(datosParaEnviar);
      
      Alert.alert('Éxito', `Promoción "${titulo}" creada exitosamente`);
      navigation.goBack();
      
    } catch (error: any) {
      console.error('Error al crear:', error);
      const mensaje = error?.response?.data?.msg || 'Error al crear la promoción';
      Alert.alert('Error', mensaje);
    } finally {
      setLoading(false);
    }
  };

  // Formatear fecha para mostrar
  const formatFechaMostrar = (fecha: string) => {
    if (!fecha) return 'Seleccionar fecha';
    const [year, month, day] = fecha.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={[styles.header, { backgroundColor: COLORS.primary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nueva Promoción</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        <Text style={styles.label}>TÍTULO</Text>
        <TextInput
          style={[styles.input, errors.titulo ? styles.inputError : null]}
          value={titulo}
          onChangeText={(text) => { setTitulo(text); setErrors({ ...errors, titulo: '' }); }}
          placeholder="Ej: Oferta Especial"
          placeholderTextColor={COLORS.textLight}
        />
        {errors.titulo ? <Text style={styles.errorText}>{errors.titulo}</Text> : null}

        {/* CATEGORÍA - El componente CategoriaPicker ya incluye su propio label */}
        <CategoriaPicker selected={categoria} onSelect={setCategoria} />

        <Text style={styles.label}>DESCRIPCIÓN</Text>
        <TextInput
          style={[styles.input, styles.textArea, errors.descripcion ? styles.inputError : null]}
          value={descripcion}
          onChangeText={(text) => { setDescripcion(text); setErrors({ ...errors, descripcion: '' }); }}
          placeholder="Describe tu promoción"
          placeholderTextColor={COLORS.textLight}
          multiline
          numberOfLines={4}
        />
        {errors.descripcion ? <Text style={styles.errorText}>{errors.descripcion}</Text> : null}

        <Text style={styles.label}>FECHA DE VENCIMIENTO</Text>
        
        <TouchableOpacity 
          style={[styles.dateButton, errors.fechaVencimiento ? styles.inputError : null]}
          onPress={() => setShowCalendar(true)}
        >
          <Feather name="calendar" size={20} color={COLORS.textLight} />
          <Text style={styles.dateButtonText}>
            {formatFechaMostrar(fechaVencimiento)}
          </Text>
        </TouchableOpacity>
        {errors.fechaVencimiento ? <Text style={styles.errorText}>{errors.fechaVencimiento}</Text> : null}

        <Modal
          visible={showCalendar}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowCalendar(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Seleccionar fecha</Text>
                <TouchableOpacity onPress={() => setShowCalendar(false)}>
                  <Feather name="x" size={24} color={COLORS.text} />
                </TouchableOpacity>
              </View>
              
              <Calendar
                onDayPress={handleDateSelect}
                markedDates={{
                  [fechaVencimiento]: {
                    selected: true,
                    selectedColor: COLORS.primary,
                  },
                }}
                theme={{
                  todayTextColor: COLORS.primary,
                  selectedDayBackgroundColor: COLORS.primary,
                  arrowColor: COLORS.primary,
                  monthTextColor: COLORS.text,
                  textMonthFontWeight: 'bold',
                  textDayHeaderFontWeight: '600',
                }}
                locale="es"
              />
              
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={() => setShowCalendar(false)}
              >
                <Text style={styles.modalButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Text style={styles.label}>IMAGEN</Text>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {imagen ? (
            <Image source={{ uri: imagen }} style={styles.imagePreview} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Feather name="image" size={40} color={COLORS.textLight} />
              <Text style={styles.imageText}>Seleccionar imagen</Text>
            </View>
          )}
        </TouchableOpacity>

        <Button title="CREAR PROMOCIÓN" onPress={handleCreate} loading={loading} style={styles.button} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
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
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: COLORS.white, borderRadius: 20, padding: 20, width: '90%', maxWidth: 400 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  modalButton: { marginTop: 20, backgroundColor: COLORS.primary, padding: 12, borderRadius: 10, alignItems: 'center' },
  modalButtonText: { color: COLORS.white, fontWeight: 'bold', fontSize: 16 },
});