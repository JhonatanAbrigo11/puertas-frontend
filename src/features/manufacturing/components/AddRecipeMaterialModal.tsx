import React, { useState } from 'react';
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
import { Material } from '../../../core/domain/entities/Material';
import { RecipeItem } from '../../../core/domain/entities/Recipe';
import { mockMaterials } from '../../../data/mock/materials';
import { colors } from '../../../shared/theme/colors';
import { typography } from '../../../shared/theme/typography';
import { borderRadius, spacing } from '../../../shared/theme/spacing';
import { shadows } from '../../../shared/theme/shadows';

interface AddRecipeMaterialModalProps {
  visible: boolean;
  onClose: () => void;
  onAddMaterial: (item: RecipeItem) => void;
}

export const AddRecipeMaterialModal: React.FC<AddRecipeMaterialModalProps> = ({
  visible,
  onClose,
  onAddMaterial,
}) => {
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>(
    mockMaterials[0]?.id || ''
  );
  const [searchMaterial, setSearchMaterial] = useState('');
  const [formulaType, setFormulaType] = useState<
    'perimeter' | 'double_perimeter' | 'area' | 'fixed' | 'width_based' | 'height_based' | 'custom'
  >('perimeter');
  const [fixedQty, setFixedQty] = useState('1');
  const [customMultiplier, setCustomMultiplier] = useState('2');
  const [customDescription, setCustomDescription] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const selectedMaterial = mockMaterials.find(
    (m) => m.id === selectedMaterialId
  );

  const filteredMaterials = mockMaterials.filter(
    (m) =>
      m.name.toLowerCase().includes(searchMaterial.toLowerCase()) ||
      (m.code && m.code.toLowerCase().includes(searchMaterial.toLowerCase()))
  );

  const formulaPresets = [
    {
      id: 'perimeter',
      label: '2 × (Ancho + Alto)',
      desc: 'Marco perimetral estándar',
      unitType: 'm',
    },
    {
      id: 'double_perimeter',
      label: '2 × Ancho + 4 × Alto',
      desc: 'Hojas corredizas (2 hojas)',
      unitType: 'm',
    },
    {
      id: 'width_based',
      label: 'Ancho total (W)',
      desc: 'Rieles sup/inf o travesaños',
      unitType: 'm',
    },
    {
      id: 'height_based',
      label: 'Alto total (H)',
      desc: 'Parantes laterales o columnas',
      unitType: 'm',
    },
    {
      id: 'area',
      label: 'Área (Ancho × Alto)',
      desc: 'Planchas de vidrio, ACM o policarbonato',
      unitType: 'm²',
    },
    {
      id: 'fixed',
      label: 'Cantidad fija por unidad',
      desc: 'Herrajes, rodamientos, cerraduras',
      unitType: 'und',
    },
    {
      id: 'custom',
      label: 'Fórmula personalizada',
      desc: 'Multiplicador específico de corte',
      unitType: 'otro',
    },
  ];

  const handleClose = () => {
    setSearchMaterial('');
    setCustomDescription('');
    setFixedQty('1');
    setErrors({});
    onClose();
  };

  const handleSubmit = () => {
    if (!selectedMaterial) {
      setErrors({ material: 'Selecciona un material del catálogo.' });
      return;
    }

    let calculateFn: (params: {
      widthCm: number;
      heightCm: number;
      quantity: number;
    }) => number;
    let formulaDesc = '';

    switch (formulaType) {
      case 'perimeter':
        formulaDesc = customDescription.trim() || 'Marco perimetral: 2 × (Ancho + Alto)';
        calculateFn = ({ widthCm, heightCm, quantity }) =>
          ((2 * (widthCm + heightCm)) / 100) * quantity;
        break;
      case 'double_perimeter':
        formulaDesc =
          customDescription.trim() || 'Hojas dobles: (2 × Ancho + 4 × Alto)';
        calculateFn = ({ widthCm, heightCm, quantity }) =>
          ((2 * widthCm + 4 * heightCm) / 100) * quantity;
        break;
      case 'width_based':
        formulaDesc =
          customDescription.trim() || 'Corte longitudinal: Ancho total (W)';
        calculateFn = ({ widthCm, quantity }) => (widthCm / 100) * quantity;
        break;
      case 'height_based':
        formulaDesc =
          customDescription.trim() || 'Corte vertical: Alto total (H)';
        calculateFn = ({ heightCm, quantity }) => (heightCm / 100) * quantity;
        break;
      case 'area':
        formulaDesc = customDescription.trim() || 'Área de cristal/panel: Ancho × Alto';
        calculateFn = ({ widthCm, heightCm, quantity }) =>
          ((widthCm * heightCm) / 10000) * quantity;
        break;
      case 'fixed': {
        const qtyNum = parseFloat(fixedQty) || 1;
        formulaDesc =
          customDescription.trim() ||
          `${qtyNum} ${selectedMaterial.unit} por producto`;
        calculateFn = ({ quantity }) => qtyNum * quantity;
        break;
      }
      case 'custom':
      default: {
        const mult = parseFloat(customMultiplier) || 1;
        formulaDesc =
          customDescription.trim() ||
          `Regla con factor (${mult} × Ancho/Alto)`;
        calculateFn = ({ widthCm, heightCm, quantity }) =>
          ((mult * (widthCm + heightCm)) / 100) * quantity;
        break;
      }
    }

    const newItem: RecipeItem = {
      materialId: selectedMaterial.id,
      formulaDescription: formulaDesc,
      calculate: calculateFn,
    };

    onAddMaterial(newItem);
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
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons
                  name="puzzle-plus-outline"
                  size={24}
                  color="#2563EB"
                />
              </View>
              <View>
                <Text style={styles.modalTitle}>
                  Agregar Insumo a la Ficha de Fabricación
                </Text>
                <Text style={styles.modalSubtitle}>
                  Selecciona un material del catálogo y define su fórmula de corte
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

          {/* Form Content */}
          <ScrollView
            style={styles.formScroll}
            contentContainerStyle={styles.formContent}
            showsVerticalScrollIndicator={true}
          >
            {/* Step 1: Material Picker from Catalogue */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                1. Selecciona el Material / Componente <Text style={styles.required}>*</Text>
              </Text>

              {/* Material Search Filter */}
              <View style={styles.searchBox}>
                <MaterialCommunityIcons
                  name="magnify"
                  size={16}
                  color="#94A3B8"
                  style={{ marginRight: 6 }}
                />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Filtrar materiales por nombre o código..."
                  placeholderTextColor="#94A3B8"
                  value={searchMaterial}
                  onChangeText={setSearchMaterial}
                />
              </View>

              {/* Material Chips List */}
              <ScrollView
                style={styles.materialPickerList}
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={true}
              >
                {filteredMaterials.map((mat) => {
                  const isSelected = selectedMaterialId === mat.id;
                  return (
                    <TouchableOpacity
                      key={mat.id}
                      style={[
                        styles.matOption,
                        isSelected && styles.matOptionSelected,
                      ]}
                      onPress={() => setSelectedMaterialId(mat.id)}
                      activeOpacity={0.7}
                    >
                      <View style={{ flex: 1 }}>
                        <View style={styles.matOptionTop}>
                          <Text style={styles.matOptionCode}>
                            {mat.code || 'SIN CÓDIGO'}
                          </Text>
                          <Text style={styles.matOptionUnit}>
                            por {mat.unit}
                          </Text>
                        </View>
                        <Text style={styles.matOptionName}>{mat.name}</Text>
                      </View>

                      <Text style={styles.matOptionPrice}>
                        ${mat.unitPriceDemo.toFixed(2)}
                      </Text>

                      {isSelected && (
                        <MaterialCommunityIcons
                          name="check-circle"
                          size={18}
                          color="#2563EB"
                          style={{ marginLeft: 6 }}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Step 2: Formula & Calculation Type */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                2. Regla de Cálculo / Fórmula de Corte <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.presetsGrid}>
                {formulaPresets.map((preset) => {
                  const isSelected = formulaType === preset.id;
                  return (
                    <TouchableOpacity
                      key={preset.id}
                      style={[
                        styles.presetCard,
                        isSelected && styles.presetCardSelected,
                      ]}
                      onPress={() => setFormulaType(preset.id as any)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.presetTop}>
                        <Text
                          style={[
                            styles.presetLabel,
                            isSelected && styles.presetLabelSelected,
                          ]}
                        >
                          {preset.label}
                        </Text>
                        <View style={styles.presetUnitBadge}>
                          <Text style={styles.presetUnitText}>
                            {preset.unitType}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.presetDesc}>{preset.desc}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Step 3: Fixed Quantity input if formula is fixed */}
            {formulaType === 'fixed' && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  Cantidad de piezas por producto ({selectedMaterial?.unit || 'und'})
                </Text>
                <TextInput
                  style={styles.input}
                  value={fixedQty}
                  onChangeText={setFixedQty}
                  placeholder="Ej: 4"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                />
              </View>
            )}

            {/* Step 4: Custom Multiplier if formula is custom */}
            {formulaType === 'custom' && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  Multiplicador sobre (Ancho + Alto)
                </Text>
                <TextInput
                  style={styles.input}
                  value={customMultiplier}
                  onChangeText={setCustomMultiplier}
                  placeholder="Ej: 3"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                />
              </View>
            )}

            {/* Step 5: Custom Formula Note / Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Nota de Taller / Explicación del Despiece (Opcional)
              </Text>
              <TextInput
                style={styles.input}
                value={customDescription}
                onChangeText={setCustomDescription}
                placeholder="Ej: Travesaño intermedio de refuerzo o cortaviento"
                placeholderTextColor="#94A3B8"
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
                name="plus-circle"
                size={18}
                color="#FFFFFF"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.saveBtnText}>Agregar Insumos a la Ficha</Text>
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
    maxWidth: 650,
    maxHeight: '90%',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
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
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
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
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formScroll: {
    flexGrow: 1,
  },
  formContent: {
    padding: 20,
    gap: 16,
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
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 36,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: '#0F172A',
    paddingVertical: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  materialPickerList: {
    maxHeight: 160,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
  },
  matOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  matOptionSelected: {
    backgroundColor: '#EFF6FF',
  },
  matOptionTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  matOptionCode: {
    fontSize: 10,
    fontWeight: '800',
    color: '#2563EB',
  },
  matOptionUnit: {
    fontSize: 10,
    color: '#94A3B8',
  },
  matOptionName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  matOptionPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FE4648',
  },
  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetCard: {
    width: '48.5%',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 10,
  },
  presetCardSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  presetTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  presetLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1E293B',
    flex: 1,
  },
  presetLabelSelected: {
    color: '#2563EB',
  },
  presetUnitBadge: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  presetUnitText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#475569',
  },
  presetDesc: {
    fontSize: 10,
    color: '#64748B',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    fontSize: 13,
    color: '#0F172A',
  },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  cancelBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
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
