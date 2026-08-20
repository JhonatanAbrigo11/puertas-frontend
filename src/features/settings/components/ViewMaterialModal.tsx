import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Material } from '../../../core/domain/entities/Material';
import { colors } from '../../../shared/theme/colors';
import { typography } from '../../../shared/theme/typography';
import { borderRadius, spacing } from '../../../shared/theme/spacing';
import { shadows } from '../../../shared/theme/shadows';

interface ViewMaterialModalProps {
  visible: boolean;
  material: Material | null;
  onClose: () => void;
  onEdit: (material: Material) => void;
}

export const ViewMaterialModal: React.FC<ViewMaterialModalProps> = ({
  visible,
  material,
  onClose,
  onEdit,
}) => {
  if (!material) return null;

  const hasStock = (material.stockQuantity ?? 0) > 0;
  const isLowStock =
    material.minStockAlert !== undefined &&
    (material.stockQuantity ?? 0) <= material.minStockAlert;

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'aluminio':
        return 'Perfiles de Aluminio';
      case 'vidrio':
        return 'Vidrios y Cristales';
      case 'accesorios':
        return 'Herrajes & Accesorios';
      case 'sellantes':
        return 'Felpas & Sellantes';
      case 'tornilleria':
        return 'Tornillería y Fijación';
      case 'policarbonato':
        return 'Policarbonato';
      case 'acm':
        return 'Panel ACM';
      default:
        return 'Insumo';
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <View style={styles.headerLeft}>
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons
                  name="cube-scan"
                  size={22}
                  color="#0284C7"
                />
              </View>
              <View>
                <Text style={styles.modalTitle}>Detalle del Material</Text>
                <Text style={styles.modalCode}>{material.code || 'SIN CÓDIGO'}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Details Scroll */}
          <ScrollView
            style={styles.detailsScroll}
            contentContainerStyle={styles.detailsContent}
            showsVerticalScrollIndicator={true}
          >
            {/* Title & Category */}
            <View style={styles.mainInfoBlock}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>
                  {getCategoryLabel(material.category)}
                </Text>
              </View>
              <Text style={styles.materialName}>{material.name}</Text>
              {material.description ? (
                <Text style={styles.materialDescription}>
                  {material.description}
                </Text>
              ) : null}
            </View>

            {/* KPI Cards Grid (Price & Stock) */}
            <View style={styles.kpiGrid}>
              {/* Card 1: Precio Unitario */}
              <View style={styles.kpiCard}>
                <Text style={styles.kpiLabel}>PRECIO UNITARIO</Text>
                <Text style={styles.kpiPrice}>
                  ${material.unitPriceDemo.toFixed(2)}
                </Text>
                <Text style={styles.kpiSub}>por {material.unit}</Text>
              </View>

              {/* Card 2: Stock Actual */}
              <View style={styles.kpiCard}>
                <Text style={styles.kpiLabel}>STOCK EN BODEGA</Text>
                <Text style={styles.kpiStock}>
                  {material.stockQuantity ?? 0}{' '}
                  <Text style={{ fontSize: 13, fontWeight: '700' }}>
                    {material.unit}
                  </Text>
                </Text>
                <View
                  style={[
                    styles.statusBadge,
                    !hasStock
                      ? styles.badgeOut
                      : isLowStock
                      ? styles.badgeLow
                      : styles.badgeGood,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      !hasStock
                        ? styles.textOut
                        : isLowStock
                        ? styles.textLow
                        : styles.textGood,
                    ]}
                  >
                    {!hasStock
                      ? '✕ Sin Stock'
                      : isLowStock
                      ? '⚠ Stock Bajo'
                      : '✓ En Existencia'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Packaging / Metraje Detail Box */}
            <View style={styles.infoSection}>
              <Text style={styles.sectionHeader}>PRESENTACIÓN & METRAJE</Text>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons
                  name="package-variant"
                  size={18}
                  color="#2563EB"
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.detailTitle}>Formato de Almacenamiento</Text>
                  <Text style={styles.detailValue}>
                    {material.stockDetailLabel ||
                      `Empaque estándar (${material.stockQuantity} ${material.unit})`}
                  </Text>
                </View>
              </View>

              {material.minStockAlert !== undefined && (
                <View style={styles.detailRow}>
                  <MaterialCommunityIcons
                    name="bell-alert-outline"
                    size={18}
                    color="#D97706"
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.detailTitle}>Umbral Mínimo de Reabastecimiento</Text>
                    <Text style={styles.detailValue}>
                      {material.minStockAlert} {material.unit}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>

          {/* Footer Actions */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.closeActionBtn}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.closeActionBtnText}>Cerrar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.editActionBtn}
              onPress={() => {
                onClose();
                onEdit(material);
              }}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name="pencil"
                size={16}
                color="#FFFFFF"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.editActionBtnText}>Editar Material</Text>
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
    maxWidth: 520,
    maxHeight: '85%',
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F0F9FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalCode: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
    letterSpacing: 0.5,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsScroll: {
    flexGrow: 1,
  },
  detailsContent: {
    padding: 20,
    gap: 16,
  },
  mainInfoBlock: {
    gap: 6,
  },
  categoryBadge: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563EB',
    textTransform: 'uppercase',
  },
  materialName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 22,
  },
  materialDescription: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
  },
  kpiGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
  },
  kpiLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  kpiPrice: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F4C81',
  },
  kpiSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  kpiStock: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
  },
  statusBadge: {
    marginTop: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  badgeGood: {
    backgroundColor: '#ECFDF5',
  },
  badgeLow: {
    backgroundColor: '#FFFBEB',
  },
  badgeOut: {
    backgroundColor: '#FEF2F2',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  textGood: {
    color: '#059669',
  },
  textLow: {
    color: '#D97706',
  },
  textOut: {
    color: '#DC2626',
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  sectionHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  detailTitle: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 1,
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
  closeActionBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  closeActionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  editActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    ...shadows.sm,
  },
  editActionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
