import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Material } from '../../../core/domain/entities/Material';
import { mockMaterials } from '../../../data/mock/materials';
import { CreateMaterialModal } from '../components/CreateMaterialModal';
import { ViewMaterialModal } from '../components/ViewMaterialModal';
import { Toast } from '../../../shared/components/Toast';
import { colors } from '../../../shared/theme/colors';
import { typography } from '../../../shared/theme/typography';
import { borderRadius, spacing } from '../../../shared/theme/spacing';
import { shadows } from '../../../shared/theme/shadows';

interface SettingsScreenProps {
  onGoToQuote?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = () => {
  const [materialsList, setMaterialsList] = useState<Material[]>(mockMaterials);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [viewingMaterial, setViewingMaterial] = useState<Material | null>(null);
  const [materialToDelete, setMaterialToDelete] = useState<Material | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'Todos los Insumos' },
    { id: 'aluminio', label: 'Perfiles de Aluminio' },
    { id: 'vidrio', label: 'Vidrios y Cristales' },
    { id: 'accesorios', label: 'Herrajes & Accesorios' },
    { id: 'sellantes', label: 'Felpas & Sellantes' },
    { id: 'tornilleria', label: 'Tornillería' },
    { id: 'policarbonato', label: 'Policarbonato' },
    { id: 'acm', label: 'ACM' },
  ];

  const filteredMaterials = useMemo(() => {
    return materialsList.filter((mat) => {
      const matchesCategory =
        selectedCategory === 'all' || mat.category === selectedCategory;

      const matchesSearch =
        searchQuery.trim() === '' ||
        mat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (mat.code && mat.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (mat.description &&
          mat.description.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [materialsList, selectedCategory, searchQuery]);

  const handleOpenCreate = () => {
    setEditingMaterial(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (material: Material) => {
    setEditingMaterial(material);
    setIsFormModalOpen(true);
  };

  const handleOpenView = (material: Material) => {
    setViewingMaterial(material);
  };

  const handlePromptDelete = (material: Material) => {
    setMaterialToDelete(material);
  };

  const handleConfirmDelete = () => {
    if (materialToDelete) {
      setMaterialsList((prev) =>
        prev.filter((m) => m.id !== materialToDelete.id)
      );
      setToastMessage(`✓ Insumo "${materialToDelete.name}" eliminado.`);
      setMaterialToDelete(null);
    }
  };

  const handleSaveMaterial = (savedMaterial: Material) => {
    if (editingMaterial) {
      // Update existing material
      setMaterialsList((prev) =>
        prev.map((item) =>
          item.id === savedMaterial.id ? savedMaterial : item
        )
      );
      setToastMessage(`✓ Material "${savedMaterial.name}" actualizado.`);
    } else {
      // Add new material
      setMaterialsList((prev) => [savedMaterial, ...prev]);
      setToastMessage(`✓ Material "${savedMaterial.name}" registrado.`);
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'aluminio':
        return 'Aluminio';
      case 'vidrio':
        return 'Vidrio';
      case 'accesorios':
        return 'Herrajes';
      case 'sellantes':
        return 'Sellado';
      case 'tornilleria':
        return 'Fijación';
      case 'policarbonato':
        return 'Policarbonato';
      case 'acm':
        return 'Panel ACM';
      default:
        return 'Insumo';
    }
  };

  const totalStockItems = useMemo(() => {
    return materialsList.length;
  }, [materialsList]);

  return (
    <View style={styles.screenWrapper}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
      >
        {/* 1. Filters & Action Button Card */}
        <View style={styles.headerCard}>
          {/* Top Row: Search Input + New Material Button */}
          <View style={styles.filterActionRow}>
            <View style={styles.searchBox}>
              <MaterialCommunityIcons
                name="magnify"
                size={18}
                color="#94A3B8"
                style={{ marginRight: 6 }}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar por nombre, código o especificación..."
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <MaterialCommunityIcons
                    name="close-circle"
                    size={16}
                    color="#94A3B8"
                  />
                </TouchableOpacity>
              )}
            </View>

            {/* "+ NUEVO MATERIAL" Button */}
            <TouchableOpacity
              style={styles.createBtn}
              onPress={handleOpenCreate}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="plus" size={18} color="#FFFFFF" />
              <Text style={styles.createBtnText}>Nuevo Material</Text>
            </TouchableOpacity>
          </View>

          {/* Category Filter Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryChipsContainer}
          >
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryChip,
                    isSelected && styles.categoryChipSelected,
                  ]}
                  onPress={() => setSelectedCategory(cat.id)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      isSelected && styles.categoryChipTextSelected,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* 2. Materials List Table Card */}
        <View style={styles.tableCard}>
          <View style={styles.tableCardHeader}>
            <Text style={styles.tableCardTitle}>
              INVENTARIO DE INSUMOS ({filteredMaterials.length} de {totalStockItems})
            </Text>
          </View>

          <View style={styles.materialsList}>
            {filteredMaterials.map((mat, index) => {
              const isEven = index % 2 === 0;
              const hasStock = (mat.stockQuantity ?? 0) > 0;
              const isLowStock =
                mat.minStockAlert !== undefined &&
                (mat.stockQuantity ?? 0) <= mat.minStockAlert;

              return (
                <View
                  key={mat.id}
                  style={[styles.materialRow, isEven && styles.materialRowEven]}
                >
                  {/* Left: Info */}
                  <View style={styles.materialMain}>
                    <View style={styles.codeRow}>
                      {mat.code ? (
                        <Text style={styles.materialCode}>{mat.code}</Text>
                      ) : null}
                      <View style={styles.categoryBadge}>
                        <Text style={styles.categoryBadgeText}>
                          {getCategoryLabel(mat.category)}
                        </Text>
                      </View>

                      {/* Stock Status Badge */}
                      {hasStock ? (
                        <View
                          style={[
                            styles.stockStatusBadge,
                            isLowStock
                              ? styles.stockBadgeLow
                              : styles.stockBadgeGood,
                          ]}
                        >
                          <MaterialCommunityIcons
                            name={
                              isLowStock ? 'alert-circle-outline' : 'check-circle'
                            }
                            size={12}
                            color={isLowStock ? '#D97706' : '#059669'}
                          />
                          <Text
                            style={[
                              styles.stockStatusText,
                              isLowStock
                                ? styles.stockTextLow
                                : styles.stockTextGood,
                            ]}
                          >
                            {isLowStock
                              ? `Stock Bajo: ${mat.stockQuantity} ${mat.unit}`
                              : `Stock: ${mat.stockQuantity} ${mat.unit}`}
                          </Text>
                        </View>
                      ) : (
                        <View
                          style={[
                            styles.stockStatusBadge,
                            styles.stockBadgeOut,
                          ]}
                        >
                          <MaterialCommunityIcons
                            name="close-circle-outline"
                            size={12}
                            color="#DC2626"
                          />
                          <Text style={styles.stockTextOut}>Sin Stock</Text>
                        </View>
                      )}
                    </View>

                    <Text style={styles.materialName}>{mat.name}</Text>

                    {/* Stock Metraje / Packaging Detail */}
                    {mat.stockDetailLabel ? (
                      <View style={styles.packagingRow}>
                        <MaterialCommunityIcons
                          name="package-variant"
                          size={14}
                          color="#64748B"
                        />
                        <Text style={styles.packagingText}>
                          {mat.stockDetailLabel}
                        </Text>
                      </View>
                    ) : null}

                    {mat.description ? (
                      <Text style={styles.materialDesc}>{mat.description}</Text>
                    ) : null}
                  </View>

                  {/* Right: Price & 3 Action Icons (Ver, Editar, Eliminar) */}
                  <View style={styles.materialRightBlock}>
                    <View style={styles.priceContainer}>
                      <Text style={styles.priceValue}>
                        ${mat.unitPriceDemo.toFixed(2)}
                      </Text>
                      <Text style={styles.unitLabel}>por {mat.unit}</Text>
                    </View>

                    {/* 3 Action Icons Group */}
                    <View style={styles.actionIconsRow}>
                      {/* Icon 1: Ver Detalle */}
                      <TouchableOpacity
                        style={styles.iconBtnView}
                        onPress={() => handleOpenView(mat)}
                        activeOpacity={0.7}
                        accessibilityLabel={`Ver detalle de ${mat.name}`}
                      >
                        <MaterialCommunityIcons
                          name="eye-outline"
                          size={18}
                          color="#0284C7"
                        />
                      </TouchableOpacity>

                      {/* Icon 2: Editar */}
                      <TouchableOpacity
                        style={styles.iconBtnEdit}
                        onPress={() => handleOpenEdit(mat)}
                        activeOpacity={0.7}
                        accessibilityLabel={`Editar ${mat.name}`}
                      >
                        <MaterialCommunityIcons
                          name="pencil-outline"
                          size={18}
                          color="#2563EB"
                        />
                      </TouchableOpacity>

                      {/* Icon 3: Eliminar */}
                      <TouchableOpacity
                        style={styles.iconBtnDelete}
                        onPress={() => handlePromptDelete(mat)}
                        activeOpacity={0.7}
                        accessibilityLabel={`Eliminar ${mat.name}`}
                      >
                        <MaterialCommunityIcons
                          name="trash-can-outline"
                          size={18}
                          color="#DC2626"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Modal 1: Create / Edit Material */}
      <CreateMaterialModal
        visible={isFormModalOpen}
        materialToEdit={editingMaterial}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingMaterial(null);
        }}
        onSave={handleSaveMaterial}
      />

      {/* Modal 2: View Material Details */}
      <ViewMaterialModal
        visible={!!viewingMaterial}
        material={viewingMaterial}
        onClose={() => setViewingMaterial(null)}
        onEdit={(mat) => {
          setViewingMaterial(null);
          handleOpenEdit(mat);
        }}
      />

      {/* Modal 3: Delete Confirmation Dialog */}
      <Modal
        visible={!!materialToDelete}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setMaterialToDelete(null)}
      >
        <View style={styles.deleteModalOverlay}>
          <View style={styles.deleteModalCard}>
            <View style={styles.deleteIconCircle}>
              <MaterialCommunityIcons
                name="trash-can-outline"
                size={28}
                color="#DC2626"
              />
            </View>

            <Text style={styles.deleteModalTitle}>¿Eliminar Insumo?</Text>
            <Text style={styles.deleteModalDesc}>
              ¿Estás seguro de que deseas eliminar{' '}
              <Text style={{ fontWeight: '800', color: '#0F172A' }}>
                "{materialToDelete?.name}"
              </Text>{' '}
              del catálogo de materiales?
            </Text>

            <View style={styles.deleteModalActions}>
              <TouchableOpacity
                style={styles.deleteCancelBtn}
                onPress={() => setMaterialToDelete(null)}
                activeOpacity={0.7}
              >
                <Text style={styles.deleteCancelBtnText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteConfirmBtn}
                onPress={handleConfirmDelete}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons
                  name="trash-can"
                  size={16}
                  color="#FFFFFF"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.deleteConfirmBtnText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Toast Feedback */}
      <Toast
        message={toastMessage || ''}
        visible={!!toastMessage}
        onDismiss={() => setToastMessage(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    position: 'relative',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
    paddingBottom: spacing['5xl'],
    gap: spacing.lg,
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 16,
    gap: 12,
    ...shadows.sm,
  },
  filterActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F4C81',
    borderWidth: 1,
    borderColor: '#D4AF37',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 8,
    gap: 6,
    ...shadows.sm,
  },
  createBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  searchBox: {
    flex: 1,
    minWidth: 260,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    paddingVertical: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  categoryChipsContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },
  categoryChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryChipSelected: {
    backgroundColor: '#FDF8ED',
    borderColor: '#D4AF37',
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  categoryChipTextSelected: {
    color: '#997316',
    fontWeight: '800',
  },
  tableCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    ...shadows.sm,
  },
  tableCardHeader: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tableCardTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.8,
  },
  materialsList: {
    width: '100%',
  },
  materialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  materialRowEven: {
    backgroundColor: '#FAFAFA',
  },
  materialMain: {
    flex: 1,
    paddingRight: 16,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  materialCode: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F4C81',
    letterSpacing: 0.5,
  },
  categoryBadge: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
  },
  stockStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 4,
  },
  stockBadgeGood: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  stockBadgeLow: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  stockBadgeOut: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  stockStatusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  stockTextGood: {
    color: '#059669',
  },
  stockTextLow: {
    color: '#D97706',
  },
  stockTextOut: {
    fontSize: 10,
    fontWeight: '700',
    color: '#DC2626',
  },
  materialName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 3,
  },
  packagingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 3,
  },
  packagingText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  materialDesc: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
  },
  materialRightBlock: {
    alignItems: 'flex-end',
    minWidth: 130,
    gap: 8,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F4C81',
  },
  unitLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 1,
  },
  actionIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconBtnView: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnEdit: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnDelete: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  deleteModalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    ...shadows.lg,
  },
  deleteIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  deleteModalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  deleteModalDesc: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  deleteModalActions: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  deleteCancelBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteCancelBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  deleteConfirmBtn: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteConfirmBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
