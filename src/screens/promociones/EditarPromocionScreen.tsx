import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  TextInput,
  Image,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '../../constants/colors';
import { CategoriaPicker } from '../../components/CategoriaPicker';
import Button from '../../components/Button';
import { promocionesService } from '../../services/promociones.service';
import { Promocion } from '../../interfaces/promocion.interface';

export const EditarPromocionScreen = ({ navigation, route }: any) => {
  const { id } = route.params;
  const [promocion, setPromocion] = useState<Promocion | null>(null);
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('Firmas');
  const [descripcion, setDescripcion] = useState('');
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [imagen, setImagen] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ titulo: '', descripcion: '', fechaVencimiento: '' });

  useEffect(() => {
    cargarPromocion();
  }, []);

  const cargarPromocion = async () => {
    try {
      const data = await promocionesService.getById(id);
      setPromocion(data);
      setTitulo(data.titulo);
      setCategoria(data.categoria);
      setDescripcion(data.descripcion);
      setFechaVencimiento(data.fecha_vencimiento.split('T')[0]);
      setImagen(data.imagen);
    } catch (error) {
      alert('No se pudo cargar la promoción');
      navigation.goBack();
    }
  };

  const validarFecha = (fecha: string): boolean => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(fecha)) return false;
    const fechaDate = new Date(fecha);
    return !isNaN(fechaDate.getTime());
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
    if (!fechaVencimiento.trim()) {
      newErrors.fechaVencimiento = 'La fecha de vencimiento es requerida';
      isValid = false;
    } else if (!validarFecha(fechaVencimiento)) {
      newErrors.fechaVencimiento = 'Formato inválido. Usa YYYY-MM-DD';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Necesitamos acceso a tus imágenes');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled) {
      setImagen(result.assets[0].base64 || null);
    }
  };

  const handleUpdate = async () => {
    if (!validarFormulario()) {
      alert('❌ Por favor completa todos los campos correctamente');
      return;
    }

    setLoading(true);
    try {
      await promocionesService.update(id, {
        titulo: titulo.trim(),
        categoria: categoria as any,
        descripcion: descripcion.trim(),
        fecha_vencimiento: fechaVencimiento.trim(),
        imagen: imagen || '',
      });
      
      alert(`✅ Promoción "${titulo}" actualizada exitosamente`);
      navigation.goBack();
      
    } catch (error: any) {
      alert('❌ Error: No se pudo actualizar la promoción');
    } finally {
      setLoading(false);
    }
  };

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
        <TextInput
          style={[styles.input, errors.fechaVencimiento ? styles.inputError : null]}
          value={fechaVencimiento}
          onChangeText={(text) => { setFechaVencimiento(text); setErrors({ ...errors, fechaVencimiento: '' }); }}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={COLORS.textLight}
        />
        {errors.fechaVencimiento ? <Text style={styles.errorText}>{errors.fechaVencimiento}</Text> : null}

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
  imagePicker: { marginTop: 8, marginBottom: 20 },
  imagePlaceholder: { height: 150, backgroundColor: COLORS.surface, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, borderStyle: 'dashed' },
  imagePreview: { width: '100%', height: 150, borderRadius: 12 },
  imageText: { marginTop: 8, color: COLORS.textLight },
  button: { marginTop: 20, marginBottom: 30 },
});