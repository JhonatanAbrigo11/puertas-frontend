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
  Image,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Product } from '../../../core/domain/entities/Product';
import { CategoryId } from '../../../core/domain/entities/Category';
import { mockCategories } from '../../../data/mock/categories';
import { colors } from '../../../shared/theme/colors';
import { typography } from '../../../shared/theme/typography';
import { borderRadius, spacing } from '../../../shared/theme/spacing';
import { shadows } from '../../../shared/theme/shadows';

interface CreateProductModalProps {
  visible: boolean;
  onClose: () => void;
  onSaveProduct: (newProduct: Product) => void;
}

export const CreateProductModal: React.FC<CreateProductModalProps> = ({
  visible,
  onClose,
  onSaveProduct,
}) => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState<CategoryId>('ventanas');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const [aluminumSeries, setAluminumSeries] = useState('Línea Serie 20 / 25');
  const [glassType, setGlassType] = useState('Vidrio Templado Incoloro 6mm');
  const [fabricationType, setFabricationType] = useState('A Medida');
  const [defaultWidth, setDefaultWidth] = useState('120');
  const [defaultHeight, setDefaultHeight] = useState('100');
  const [minWidth, setMinWidth] = useState('50');
  const [maxWidth, setMaxWidth] = useState('300');
  const [minHeight, setMinHeight] = useState('40');
  const [maxHeight, setMaxHeight] = useState('220');
  const [illustrationType, setIllustrationType] = useState('window_sliding_2h');
  const [customImageUri, setCustomImageUri] = useState<string | null>(null);
  const [diagramMode, setDiagramMode] = useState<'upload' | 'preset'>('upload');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const productCategories = mockCategories.filter((c) => c.id !== 'all');
  const selectedCategoryObj = productCategories.find((c) => c.id === categoryId);

  const illustrationOptions = [
    { id: 'window_sliding_2h', label: 'Ventana Corrediza 2H', icon: 'window-shutter-open' },
    { id: 'window_sliding_3h', label: 'Ventana Corrediza 3H', icon: 'window-shutter' },
    { id: 'window_casement', label: 'Ventana Batiente', icon: 'window-closed-variant' },
    { id: 'window_projecting', label: 'Ventana Proyectable', icon: 'window-open-variant' },
    { id: 'door_single', label: 'Puerta Batiente', icon: 'door' },
    { id: 'door_sliding_glass', label: 'Mampara Corrediza', icon: 'door-sliding' },
    { id: 'facade_curtain', label: 'Fachada / Muro Cortina', icon: 'office-building' },
    { id: 'pergola_glass', label: 'Pérgola / Techo', icon: 'home-roof' },
  ];

  const handlePickImage = () => {
    if (Platform.OS === 'web') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e: any) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const base64Uri = event.target?.result as string;
            if (base64Uri) {
              setCustomImageUri(base64Uri);
            }
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    }
  };

  const handleRemoveImage = () => {
    setCustomImageUri(null);
  };

  const handleReset = () => {
    setCode('');
    setName('');
    setCategoryId('ventanas');
    setIsCategoryDropdownOpen(false);
    setAluminumSeries('Línea Serie 20 / 25');
    setGlassType('Vidrio Templado Incoloro 6mm');
    setFabricationType('A Medida');
    setDefaultWidth('120');
    setDefaultHeight('100');
    setMinWidth('50');
    setMaxWidth('300');
    setMinHeight('40');
    setMaxHeight('220');
    setIllustrationType('window_sliding_2h');
    setCustomImageUri(null);
    setDiagramMode('upload');
    setDescription('');
    setErrors({});
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!name.trim()) errs.name = 'El nombre del producto es obligatorio.';
    if (!code.trim()) errs.code = 'El código del modelo es obligatorio.';
    const defW = parseFloat(defaultWidth);
    const defH = parseFloat(defaultHeight);
    if (isNaN(defW) || defW <= 0) errs.defaultWidth = 'Ingresa un ancho válido.';
    if (isNaN(defH) || defH <= 0) errs.defaultHeight = 'Ingresa un alto válido.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const prodId = `prod-${Date.now()}`;
    const defW = parseFloat(defaultWidth) || 120;
    const defH = parseFloat(defaultHeight) || 100;
    const minW = parseFloat(minWidth) || 40;
    const maxW = parseFloat(maxWidth) || 300;
    const minH = parseFloat(minHeight) || 40;
    const maxH = parseFloat(maxHeight) || 240;

    // Create a starter parametric recipe for this new product
    const newProduct: Product = {
      id: prodId,
      code: code.trim().toUpperCase(),
      name: name.trim(),
      categoryId,
      shortDescription: `${name.trim()} con ${aluminumSeries} y ${glassType}.`,
      fullDescription:
        description.trim() ||
        `Producto arquitectónico fabricado a medida con perfilería de ${aluminumSeries} y ${glassType}.`,
      fabricationType: fabricationType as any,
      applications: ['Residencial', 'Comercial'],
      mainMaterial: `${aluminumSeries} + ${glassType}`,
      aluminumSeries,
      glassType,
      defaultWidthCm: defW,
      defaultHeightCm: defH,
      minWidthCm: minW,
      maxWidthCm: maxW,
      minHeightCm: minH,
      maxHeightCm: maxH,
      illustrationType: customImageUri || illustrationType,
      customImageUri: customImageUri || undefined,
      features: [
        `Perfilería ${aluminumSeries}`,
        `Cristal ${glassType}`,
        'Herrajes de fijación y deslizamiento suave',
        'Sellado perimetral con felpa y silicón hermético',
      ],
      recipe: {
        productId: prodId,
        items: [
          {
            materialId: 'perfil-aluminio-marco-20',
            formulaDescription: 'Marco perimetral: 2 × (Ancho + Alto)',
            calculate: ({ widthCm, heightCm, quantity }) =>
              ((2 * (widthCm + heightCm)) / 100) * quantity,
          },
          {
            materialId: 'vidrio-claro-6mm',
            formulaDescription: 'Área de cristal: Ancho × Alto',
            calculate: ({ widthCm, heightCm, quantity }) =>
              ((widthCm * heightCm) / 10000) * quantity,
          },
          {
            materialId: 'felpa-hermetica',
            formulaDescription: 'Felpa selladora: 2 × (Ancho + Alto)',
            calculate: ({ widthCm, heightCm, quantity }) =>
              ((2 * (widthCm + heightCm)) / 100) * quantity,
          },
          {
            materialId: 'tornillos-autoperforantes',
            formulaDescription: 'Tornillería inox: 12 por unidad',
            calculate: ({ quantity }) => 12 * quantity,
          },
          {
            materialId: 'silicona-neutra-estructural',
            formulaDescription: 'Sellado exterior: 1 tubo por producto',
            calculate: ({ quantity }) => 1 * quantity,
          },
        ],
      },
    };

    onSaveProduct(newProduct);
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
                  name="plus-box"
                  size={24}
                  color="#FE4648"
                />
              </View>
              <View>
                <Text style={styles.modalTitle}>Crear Nuevo Producto & Ficha</Text>
                <Text style={styles.modalSubtitle}>
                  Registra un nuevo modelo arquitectónico en el catálogo con su receta
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

          {/* Form Scroll */}
          <ScrollView
            style={styles.formScroll}
            contentContainerStyle={styles.formContent}
            showsVerticalScrollIndicator={true}
          >
            {/* Row 1: Code & Name */}
            <View style={styles.twoColRow}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>
                  Código del Modelo <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, errors.code && styles.inputError]}
                  placeholder="Ej: VEN-OSC-01"
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
                  Nombre del Producto <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, errors.name && styles.inputError]}
                  placeholder="Ej: Ventana Oscilobatiente Serie 30"
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

            {/* Categoría Dropdown Selector */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Categoría <Text style={styles.required}>*</Text>
              </Text>

              {/* Dropdown Trigger */}
              <TouchableOpacity
                style={[
                  styles.dropdownTrigger,
                  isCategoryDropdownOpen && styles.dropdownTriggerActive,
                ]}
                onPress={() =>
                  setIsCategoryDropdownOpen(!isCategoryDropdownOpen)
                }
                activeOpacity={0.7}
              >
                <View style={styles.dropdownTriggerLeft}>
                  <MaterialCommunityIcons
                    name={(selectedCategoryObj?.iconName as any) || 'window-maximize'}
                    size={18}
                    color="#FE4648"
                  />
                  <Text style={styles.dropdownTriggerText}>
                    {selectedCategoryObj?.name || 'Selecciona una categoría'}
                  </Text>
                </View>

                <MaterialCommunityIcons
                  name={isCategoryDropdownOpen ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#64748B"
                />
              </TouchableOpacity>

              {/* Dropdown Menu Items */}
              {isCategoryDropdownOpen && (
                <View style={styles.dropdownMenu}>
                  {productCategories.map((cat) => {
                    const isSelected = categoryId === cat.id;
                    return (
                      <TouchableOpacity
                        key={cat.id}
                        style={[
                          styles.dropdownItem,
                          isSelected && styles.dropdownItemSelected,
                        ]}
                        onPress={() => {
                          setCategoryId(cat.id);
                          setIsCategoryDropdownOpen(false);
                        }}
                        activeOpacity={0.7}
                      >
                        <View style={styles.dropdownItemLeft}>
                          <MaterialCommunityIcons
                            name={cat.iconName as any}
                            size={18}
                            color={isSelected ? '#FE4648' : '#64748B'}
                          />
                          <Text
                            style={[
                              styles.dropdownItemText,
                              isSelected && styles.dropdownItemTextSelected,
                            ]}
                          >
                            {cat.name}
                          </Text>
                        </View>

                        {isSelected && (
                          <MaterialCommunityIcons
                            name="check-circle"
                            size={18}
                            color="#FE4648"
                          />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>

            {/* Tipo de Ilustración / Diagrama o Imagen */}
            <View style={styles.inputGroup}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.inputLabel}>
                  Diagrama o Imagen del Producto
                </Text>

                {/* Segmented control for mode selection */}
                <View style={styles.modeTabs}>
                  <TouchableOpacity
                    style={[
                      styles.modeTab,
                      diagramMode === 'upload' && styles.modeTabActive,
                    ]}
                    onPress={() => setDiagramMode('upload')}
                    activeOpacity={0.7}
                  >
                    <MaterialCommunityIcons
                      name="image-plus"
                      size={15}
                      color={diagramMode === 'upload' ? '#FE4648' : '#64748B'}
                    />
                    <Text
                      style={[
                        styles.modeTabText,
                        diagramMode === 'upload' && styles.modeTabTextActive,
                      ]}
                    >
                      Subir Imagen
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.modeTab,
                      diagramMode === 'preset' && styles.modeTabActive,
                    ]}
                    onPress={() => setDiagramMode('preset')}
                    activeOpacity={0.7}
                  >
                    <MaterialCommunityIcons
                      name="vector-square"
                      size={15}
                      color={diagramMode === 'preset' ? '#FE4648' : '#64748B'}
                    />
                    <Text
                      style={[
                        styles.modeTabText,
                        diagramMode === 'preset' && styles.modeTabTextActive,
                      ]}
                    >
                      Diagramas 2D
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {diagramMode === 'upload' ? (
                /* Upload Mode */
                customImageUri ? (
                  /* Uploaded Image Preview Card */
                  <View style={styles.uploadedPreviewCard}>
                    <View style={styles.previewImageWrapper}>
                      <Image
                        source={{ uri: customImageUri }}
                        style={styles.previewImage}
                        resizeMode="contain"
                      />
                    </View>

                    <View style={styles.previewInfo}>
                      <View style={styles.previewStatusTag}>
                        <MaterialCommunityIcons
                          name="check-circle"
                          size={15}
                          color="#16A34A"
                        />
                        <Text style={styles.previewStatusText}>
                          Imagen lista para la ficha
                        </Text>
                      </View>
                      <Text style={styles.previewHint}>
                        Esta imagen se mostrará en el catálogo, ficha técnica y despiece.
                      </Text>

                      <View style={styles.previewActionsRow}>
                        <TouchableOpacity
                          style={styles.changeImageBtn}
                          onPress={handlePickImage}
                          activeOpacity={0.7}
                        >
                          <MaterialCommunityIcons
                            name="camera-flip-outline"
                            size={15}
                            color="#FE4648"
                          />
                          <Text style={styles.changeImageBtnText}>
                            Cambiar imagen
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.removeImageBtn}
                          onPress={handleRemoveImage}
                          activeOpacity={0.7}
                        >
                          <MaterialCommunityIcons
                            name="trash-can-outline"
                            size={15}
                            color="#DC2626"
                          />
                          <Text style={styles.removeImageBtnText}>Quitar</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ) : (
                  /* Dropzone / Upload Trigger Button */
                  <TouchableOpacity
                    style={styles.uploadDropzone}
                    onPress={handlePickImage}
                    activeOpacity={0.7}
                  >
                    <View style={styles.uploadIconCircle}>
                      <MaterialCommunityIcons
                        name="cloud-upload-outline"
                        size={28}
                        color="#FE4648"
                      />
                    </View>
                    <Text style={styles.uploadMainText}>
                      Toca aquí para seleccionar una imagen del producto
                    </Text>
                    <Text style={styles.uploadSubText}>
                      JPG, PNG, WebP — Foto real, render 3D o plano técnico
                    </Text>
                    <View style={styles.uploadBrowseBtn}>
                      <MaterialCommunityIcons
                        name="folder-image"
                        size={16}
                        color="#FE4648"
                      />
                      <Text style={styles.uploadBrowseBtnText}>
                        Explorar archivos
                      </Text>
                    </View>
                  </TouchableOpacity>
                )
              ) : (
                /* Preset Diagrams Grid */
                <View style={styles.illustrationsGrid}>
                  {illustrationOptions.map((opt) => (
                    <TouchableOpacity
                      key={opt.id}
                      style={[
                        styles.illuCard,
                        illustrationType === opt.id &&
                          !customImageUri &&
                          styles.illuCardSelected,
                      ]}
                      onPress={() => {
                        setIllustrationType(opt.id);
                        setCustomImageUri(null);
                      }}
                      activeOpacity={0.7}
                    >
                      <MaterialCommunityIcons
                        name={opt.icon as any}
                        size={20}
                        color={
                          illustrationType === opt.id && !customImageUri
                            ? '#FE4648'
                            : '#64748B'
                        }
                      />
                      <Text
                        style={[
                          styles.illuCardText,
                          illustrationType === opt.id &&
                            !customImageUri &&
                            styles.illuCardTextSelected,
                        ]}
                        numberOfLines={1}
                      >
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Row 2: Serie de Aluminio & Vidrio */}
            <View style={styles.twoColRow}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Serie de Aluminio</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej: Línea Serie 25 Anodizado"
                  placeholderTextColor="#94A3B8"
                  value={aluminumSeries}
                  onChangeText={setAluminumSeries}
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Tipo de Cristal / Vidrio</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej: Vidrio Templado 6mm"
                  placeholderTextColor="#94A3B8"
                  value={glassType}
                  onChangeText={setGlassType}
                />
              </View>
            </View>

            {/* Row 3: Medidas Estándar & Rango de Fabricación */}
            <View style={styles.twoColRow}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>
                  Ancho Estándar (cm) <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, errors.defaultWidth && styles.inputError]}
                  placeholder="120"
                  placeholderTextColor="#94A3B8"
                  value={defaultWidth}
                  onChangeText={setDefaultWidth}
                  keyboardType="numeric"
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>
                  Alto Estándar (cm) <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, errors.defaultHeight && styles.inputError]}
                  placeholder="100"
                  placeholderTextColor="#94A3B8"
                  value={defaultHeight}
                  onChangeText={setDefaultHeight}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Row 4: Rango Mínimo / Máximo */}
            <View style={styles.twoColRow}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Rango Ancho (Mín - Máx cm)</Text>
                <View style={{ flexDirection: 'row', gap: 6 }}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Mín: 50"
                    placeholderTextColor="#94A3B8"
                    value={minWidth}
                    onChangeText={setMinWidth}
                    keyboardType="numeric"
                  />
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Máx: 300"
                    placeholderTextColor="#94A3B8"
                    value={maxWidth}
                    onChangeText={setMaxWidth}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Rango Alto (Mín - Máx cm)</Text>
                <View style={{ flexDirection: 'row', gap: 6 }}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Mín: 40"
                    placeholderTextColor="#94A3B8"
                    value={minHeight}
                    onChangeText={setMinHeight}
                    keyboardType="numeric"
                  />
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Máx: 220"
                    placeholderTextColor="#94A3B8"
                    value={maxHeight}
                    onChangeText={setMaxHeight}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>

            {/* Descripción Técnica */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Descripción de la Tipología (Opcional)
              </Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Características del sistema de apertura, hermeticidad, estanqueidad y aplicaciones..."
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
                name="check-circle"
                size={18}
                color="#FFFFFF"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.saveBtnText}>Crear Ficha de Producto</Text>
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
    maxWidth: 680,
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
    height: 40,
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
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 42,
  },
  dropdownTriggerActive: {
    borderColor: '#FE4648',
    backgroundColor: '#EFF6FF',
  },
  dropdownTriggerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dropdownTriggerText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  dropdownMenu: {
    marginTop: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    overflow: 'hidden',
    ...shadows.md,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FAFAFA',
  },
  dropdownItemSelected: {
    backgroundColor: '#EFF6FF',
  },
  dropdownItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dropdownItemText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  dropdownItemTextSelected: {
    fontWeight: '700',
    color: '#FE4648',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
    flexWrap: 'wrap',
    gap: 8,
  },
  modeTabs: {
    flexDirection: 'row',
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    padding: 3,
    gap: 4,
  },
  modeTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  modeTabActive: {
    backgroundColor: '#FFFFFF',
    ...shadows.sm,
  },
  modeTabText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  modeTabTextActive: {
    color: '#FE4648',
    fontWeight: '700',
  },
  uploadDropzone: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#93C5FD',
    borderStyle: 'dashed',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  uploadIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  uploadMainText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
  },
  uploadSubText: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 3,
    marginBottom: 10,
  },
  uploadBrowseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  uploadBrowseBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FE4648',
  },
  uploadedPreviewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    borderRadius: 12,
    padding: 12,
  },
  previewImageWrapper: {
    width: 100,
    height: 90,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewInfo: {
    flex: 1,
  },
  previewStatusTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  previewStatusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#16A34A',
  },
  previewHint: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 10,
  },
  previewActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  changeImageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  changeImageBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FE4648',
  },
  removeImageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  removeImageBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
  },
  illustrationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  illuCard: {
    width: '48.5%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#F0F0F0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  illuCardSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#FE4648',
  },
  illuCardText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
    flex: 1,
  },
  illuCardTextSelected: {
    color: '#FE4648',
    fontWeight: '700',
  },
  textArea: {
    height: 64,
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
    backgroundColor: '#FE4648',
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
