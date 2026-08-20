import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  Material,
  MaterialCategory,
  MaterialUnit,
} from '../../../core/domain/entities/Material';
import { colors } from '../../../shared/theme/colors';
import { typography } from '../../../shared/theme/typography';
import { borderRadius, spacing } from '../../../shared/theme/spacing';
import { shadows } from '../../../shared/theme/shadows';

interface CreateMaterialModalProps {
  visible: boolean;
  materialToEdit?: Material | null;
  onClose: () => void;
  onSave: (material: Material) => void;
}

export const CreateMaterialModal: React.FC<CreateMaterialModalProps> = ({
  visible,
  materialToEdit,
  onClose,
  onSave,
}) => {
  const isEditing = !!materialToEdit;

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<MaterialCategory>('aluminio');
  const [unit, setUnit] = useState<MaterialUnit>('m');
  const [unitPrice, setUnitPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [stockDetailLabel, setStockDetailLabel] = useState('');
  const [minStockAlert, setMinStockAlert] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (visible) {
      if (materialToEdit) {
        setCode(materialToEdit.code || '');
        setName(materialToEdit.name);
        setCategory(materialToEdit.category);
        setUnit(materialToEdit.unit);
        setUnitPrice(materialToEdit.unitPriceDemo.toString());
        setStockQuantity(
          materialToEdit.stockQuantity !== undefined
            ? materialToEdit.stockQuantity.toString()
            : ''
        );
        setStockDetailLabel(materialToEdit.stockDetailLabel || '');
        setMinStockAlert(
          materialToEdit.minStockAlert !== undefined
            ? materialToEdit.minStockAlert.toString()
            : ''
        );
        setDescription(materialToEdit.description || '');
      } else {
        handleReset();
      }
      setErrors({});
    }
  }, [visible, materialToEdit]);

  const categoryOptions: { id: MaterialCategory; label: string }[] = [
    { id: 'aluminio', label: 'Perfiles Aluminio' },
    { id: 'vidrio', label: 'Vidrio / Cristal' },
    { id: 'accesorios', label: 'Herrajes & Cierres' },
    { id: 'sellantes', label: 'Felpas & Sellantes' },
    { id: 'tornilleria', label: 'Tornillería' },
    { id: 'policarbonato', label: 'Policarbonato' },
    { id: 'acm', label: 'Panel ACM' },
  ];

  const unitOptions: { id: MaterialUnit; label: string; desc: string }[] = [
    { id: 'm', label: 'm (metros)', desc: 'Para perfiles y felpas' },
    { id: 'm²', label: 'm² (área)', desc: 'Para vidrios y paneles' },
    { id: 'und', label: 'und (unidades)', desc: 'Para rodamientos y tornillos' },
    { id: 'juego', label: 'juego', desc: 'Para cerraduras y spiders' },
    { id: 'tubo', label: 'tubo / cartucho', desc: 'Para siliconas' },
    { id: 'plancha', label: 'plancha', desc: 'Para láminas enteras' },
    { id: 'rollo', label: 'rollo', desc: 'Para empaques y felpas' },
  ];

  const handleReset = () => {
    setCode('');
    setName('');
    setCategory('aluminio');
    setUnit('m');
    setUnitPrice('');
    setStockQuantity('');
    setStockDetailLabel('');
    setMinStockAlert('');
    setDescription('');
    setErrors({});
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!name.trim()) errs.name = 'El nombre del material es obligatorio.';
    if (!code.trim()) errs.code = 'El código del material es obligatorio.';
    const priceNum = parseFloat(unitPrice.replace(/[^0-9.]/g, ''));
    if (isNaN(priceNum) || priceNum <= 0) {
      errs.unitPrice = 'Ingresa un precio unitario válido mayor a 0.';
    }
    const stockNum = parseFloat(stockQuantity.replace(/[^0-9.]/g, ''));
    if (isNaN(stockNum) || stockNum < 0) {
      errs.stockQuantity = 'Ingresa una cantidad de stock inicial válida (0 o más).';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const priceNum = parseFloat(unitPrice.replace(/[^0-9.]/g, ''));
    const stockNum = parseFloat(stockQuantity.replace(/[^0-9.]/g, ''));
    const alertNum = minStockAlert
      ? parseFloat(minStockAlert.replace(/[^0-9.]/g, ''))
      : undefined;

    // Build default stock packaging label if empty
    let finalStockDetail = stockDetailLabel.trim();
    if (!finalStockDetail) {
      if (unit === 'm') {
        const bars = (stockNum / 6.0).toFixed(1);
        finalStockDetail = `${bars} barras aprox. (de 6.0 m)`;
      } else if (unit === 'm²') {
        const sheets = (stockNum / 3.6).toFixed(1);
        finalStockDetail = `${sheets} planchas aprox. (3.6 m²)`;
      } else {
        finalStockDetail = `${stockNum} ${unit} en bodega`;
      }
    }

    const savedMaterial: Material = {
      id: materialToEdit ? materialToEdit.id : `mat-${Date.now()}`,
      code: code.trim().toUpperCase(),
      name: name.trim(),
      category,
      unit,
      unitPriceDemo: priceNum,
      stockQuantity: stockNum,
      stockDetailLabel: finalStockDetail,
      minStockAlert: isNaN(alertNum as number) ? undefined : alertNum,
      description: description.trim() || undefined,
    };

    onSave(savedMaterial);
    handleClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderLeft}>
              <View style={styles.headerIconCircle}>
                <MaterialCommunityIcons
                  name={isEditing ? 'pencil-outline' : 'plus-box-outline'}
                  size={24}
                  color={colors.gold}
                />
              </View>
              <View>
                <Text style={styles.modalTitle}>
                  {isEditing ? 'Editar Material e Inventario' : 'Registrar Nuevo Material'}
                </Text>
                <Text style={styles.modalSubtitle}>
                  {isEditing
                    ? `Modifica especificaciones, precios y existencias de ${materialToEdit?.code || 'insumo'}`
                    : 'Añade un insumo al catálogo con su precio y control de stock'}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={handleClose}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Form Scrollable */}
          <ScrollView
            style={styles.formScroll}
            contentContainerStyle={styles.formContent}
            showsVerticalScrollIndicator={true}
          >
            {/* Row 1: Código & Nombre */}
            <View style={styles.twoColRow}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>
                  Código del Material <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, errors.code && styles.inputError]}
                  placeholder="Ej: ALU-TUB-2X1"
                  placeholderTextColor="#94A3B8"
                  value={code}
                  onChangeText={(t) => {
                    setCode(t);
                    if (errors.code) setErrors((e) => ({ ...e, code: '' }));
                  }}
                  autoCapitalize="characters"
                />
                {errors.code ? (
                  <Text style={styles.errorText}>{errors.code}</Text>
                ) : null}
              </View>

              <View style={[styles.inputGroup, { flex: 2 }]}>
                <Text style={styles.inputLabel}>
                  Nombre del Insumo <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, errors.name && styles.inputError]}
                  placeholder="Ej: Tubo Rectangular 2x1 Aluminio"
                  placeholderTextColor="#94A3B8"
                  value={name}
                  onChangeText={(t) => {
                    setName(t);
                    if (errors.name) setErrors((e) => ({ ...e, name: '' }));
                  }}
                />
                {errors.name ? (
                  <Text style={styles.errorText}>{errors.name}</Text>
                ) : null}
              </View>
            </View>

            {/* Categoría Selector */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Categoría de Insumo</Text>
              <View style={styles.chipsRow}>
                {categoryOptions.map((opt) => (
                  <TouchableOpacity
                    key={opt.id}
                    style={[
                      styles.categoryChip,
                      category === opt.id && styles.categoryChipActive,
                    ]}
                    onPress={() => setCategory(opt.id)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        category === opt.id && styles.categoryChipTextActive,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Unidad de Medida Selector */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Unidad Principal de Medida</Text>
              <View style={styles.chipsRow}>
                {unitOptions.map((opt) => (
                  <TouchableOpacity
                    key={opt.id}
                    style={[
                      styles.unitChip,
                      unit === opt.id && styles.unitChipActive,
                    ]}
                    onPress={() => setUnit(opt.id)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.unitChipText,
                        unit === opt.id && styles.unitChipTextActive,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Row 2: Precio Unitario & Stock Actual */}
            <View style={styles.twoColRow}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>
                  Precio Unitario ($) <Text style={styles.required}>*</Text>
                </Text>
                <View style={styles.prefixInputWrapper}>
                  <Text style={styles.inputPrefix}>$</Text>
                  <TextInput
                    style={[
                      styles.inputWithPrefix,
                      errors.unitPrice && styles.inputError,
                    ]}
                    placeholder="0.00"
                    placeholderTextColor="#94A3B8"
                    value={unitPrice}
                    onChangeText={(t) => {
                      setUnitPrice(t);
                      if (errors.unitPrice)
                        setErrors((e) => ({ ...e, unitPrice: '' }));
                    }}
                    keyboardType="numeric"
                  />
                  <Text style={styles.inputSuffix}>/ {unit}</Text>
                </View>
                {errors.unitPrice ? (
                  <Text style={styles.errorText}>{errors.unitPrice}</Text>
                ) : null}
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>
                  Stock Total ({unit}) <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.stockQuantity && styles.inputError,
                  ]}
                  placeholder={unit === 'm' ? 'Ej: 120 (metros)' : 'Ej: 50'}
                  placeholderTextColor="#94A3B8"
                  value={stockQuantity}
                  onChangeText={(t) => {
                    setStockQuantity(t);
                    if (errors.stockQuantity)
                      setErrors((e) => ({ ...e, stockQuantity: '' }));
                  }}
                  keyboardType="numeric"
                />
                {errors.stockQuantity ? (
                  <Text style={styles.errorText}>{errors.stockQuantity}</Text>
                ) : null}
              </View>
            </View>

            {/* Row 3: Detalle de Empaque / Barras / Metraje & Umbral Mínimo */}
            <View style={styles.twoColRow}>
              <View style={[styles.inputGroup, { flex: 1.5 }]}>
                <Text style={styles.inputLabel}>
                  Detalle de Empaque / Metraje (Opcional)
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder={
                    unit === 'm'
                      ? 'Ej: 20 barras de 6.0 m'
                      : unit === 'm²'
                      ? 'Ej: 10 planchas de 3.6 m²'
                      : 'Ej: 5 cajas de 100 und'
                  }
                  placeholderTextColor="#94A3B8"
                  value={stockDetailLabel}
                  onChangeText={setStockDetailLabel}
                />
                <Text style={styles.fieldHelper}>
                  Permite saber cómo está embalado o cortado en bodega.
                </Text>
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>
                  Alerta Stock Mínimo ({unit})
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej: 15"
                  placeholderTextColor="#94A3B8"
                  value={minStockAlert}
                  onChangeText={setMinStockAlert}
                  keyboardType="numeric"
                />
                <Text style={styles.fieldHelper}>
                  Avisar cuando quede menos de este valor.
                </Text>
              </View>
            </View>

            {/* Descripción Técnica */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Descripción o Notas Técnicas (Opcional)
              </Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Especificaciones de aleación, espesor, acabado o aplicación recomendada..."
                placeholderTextColor="#94A3B8"
                value={description}
                onChangeText={setDescription}
                multiline={true}
                numberOfLines={3}
              />
            </View>
          </ScrollView>

          {/* Footer Actions */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={handleClose}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelBtnText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleSubmit}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name="check"
                size={18}
                color="#FFFFFF"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.saveBtnText}>
                {isEditing ? 'Actualizar Material' : 'Guardar Material'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    width: '100%',
    maxWidth: 640,
    maxHeight: '90%',
    borderWidth: 1.5,
    borderColor: '#F0F0F0',
    overflow: 'hidden',
    ...shadows.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#FAFAFA',
    backgroundColor: '#FFFFFF',
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  headerIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: colors.goldMuted,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.goldBorder,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formScroll: {
    flexGrow: 1,
  },
  formContent: {
    padding: 20,
    gap: 14,
  },
  twoColRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  inputGroup: {
    width: '100%',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  required: {
    color: '#EF4444',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 42,
    fontSize: 13,
    color: '#0F172A',
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  errorText: {
    fontSize: 10,
    color: '#EF4444',
    fontWeight: '600',
    marginTop: 4,
  },
  fieldHelper: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 4,
  },
  prefixInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 42,
  },
  inputPrefix: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
    marginRight: 4,
  },
  inputWithPrefix: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    paddingVertical: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  inputSuffix: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    marginLeft: 4,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  categoryChip: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1.5,
    borderColor: '#F0F0F0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  categoryChipActive: {
    backgroundColor: colors.goldLight,
    borderColor: colors.gold,
  },
  categoryChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  categoryChipTextActive: {
    color: colors.goldText,
    fontWeight: '700',
  },
  unitChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#F0F0F0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  unitChipActive: {
    backgroundColor: '#F0FDF4',
    borderColor: '#10B981',
  },
  unitChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  unitChipTextActive: {
    color: '#059669',
    fontWeight: '700',
  },
  textArea: {
    height: 72,
    paddingTop: 8,
    textAlignVertical: 'top',
  },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#FAFAFA',
    backgroundColor: '#FFFFFF',
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
  },
  cancelBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gold,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    ...shadows.sm,
  },
  saveBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
