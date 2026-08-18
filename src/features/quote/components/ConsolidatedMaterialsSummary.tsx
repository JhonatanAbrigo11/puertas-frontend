import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ConsolidatedMaterial } from '../../../core/domain/entities/Quote';
import { colors } from '../../../shared/theme/colors';
import { typography } from '../../../shared/theme/typography';
import { borderRadius, spacing } from '../../../shared/theme/spacing';
import { shadows } from '../../../shared/theme/shadows';

interface ConsolidatedMaterialsSummaryProps {
  materials: ConsolidatedMaterial[];
}

export const ConsolidatedMaterialsSummary: React.FC<
  ConsolidatedMaterialsSummaryProps
> = ({ materials }) => {
  const [selectedCategoryFilter, setSelectedCategoryFilter] =
    useState<string>('all');

  const categories = [
    { id: 'all', label: 'Todos' },
    { id: 'aluminio', label: 'Aluminio' },
    { id: 'vidrio', label: 'Vidrio' },
    { id: 'accesorios', label: 'Accesorios' },
    { id: 'sellantes', label: 'Sellantes' },
    { id: 'tornilleria', label: 'Fijaciones' },
  ];

  const filteredMaterials =
    selectedCategoryFilter === 'all'
      ? materials
      : materials.filter((m) => m.category === selectedCategoryFilter);

  const totalConsolidatedCost = materials.reduce(
    (sum, m) => sum + m.totalPriceDemo,
    0
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons
              name="cube-unfolded"
              size={22}
              color={colors.primary}
            />
          </View>
          <View>
            <Text style={styles.title}>RESUMEN CONSOLIDADO DE MATERIALES</Text>
            <Text style={styles.subtitle}>
              Requisición acumulada para Bodega, Despiece y Orden de Fabricación
            </Text>
          </View>
        </View>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {materials.length} TIPOS DE MATERIALES
          </Text>
        </View>
      </View>

      {/* Category Filter Pills */}
      <View style={styles.filterBar}>
        {categories.map((cat) => {
          const isActive = selectedCategoryFilter === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.filterChip,
                isActive && styles.filterChipActive,
              ]}
              onPress={() => setSelectedCategoryFilter(cat.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterChipText,
                  isActive && styles.filterChipTextActive,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Consolidated Table */}
      <View style={styles.table}>
        <View style={styles.tableHeaderRow}>
          <Text style={[styles.columnHeader, styles.colMaterial]}>
            Material / Insumo Consolidado
          </Text>
          <Text style={[styles.columnHeader, styles.colQuantity]}>
            Cant. Total
          </Text>
          <Text style={[styles.columnHeader, styles.colUnit]}>Unidad</Text>
          <Text style={[styles.columnHeader, styles.colUnitPrice]}>
            P. Unit (Demo)
          </Text>
          <Text style={[styles.columnHeader, styles.colTotal]}>
            Total Demo
          </Text>
        </View>

        {filteredMaterials.map((item, index) => {
          const isEven = index % 2 === 0;
          return (
            <View
              key={item.materialId}
              style={[styles.tableRow, isEven && styles.tableRowEven]}
            >
              <View style={styles.colMaterial}>
                <Text style={styles.materialName}>{item.materialName}</Text>
                <Text style={styles.usedInText} numberOfLines={1}>
                  Usado en: {item.productNames.join(', ')} (
                  {item.usedInProductsCount}{' '}
                  {item.usedInProductsCount === 1 ? 'producto' : 'productos'})
                </Text>
              </View>

              <View style={styles.colQuantity}>
                <Text style={styles.quantityText}>
                  {item.totalQuantity.toFixed(
                    item.unit === 'und' || item.unit === 'juego' ? 0 : 2
                  )}
                </Text>
              </View>

              <View style={styles.colUnit}>
                <View style={styles.unitChip}>
                  <Text style={styles.unitChipText}>{item.unit}</Text>
                </View>
              </View>

              <View style={styles.colUnitPrice}>
                <Text style={styles.priceText}>
                  ${item.unitPriceDemo.toFixed(2)}
                </Text>
              </View>

              <View style={styles.colTotal}>
                <Text style={styles.totalPriceText}>
                  ${item.totalPriceDemo.toFixed(2)}
                </Text>
              </View>
            </View>
          );
        })}

        {/* Total Cost Summary Footer */}
        <View style={styles.tableFooter}>
          <View style={styles.footerInfo}>
            <MaterialCommunityIcons
              name="information-outline"
              size={16}
              color={colors.primary}
            />
            <Text style={styles.footerInfoText}>
              Cantidades consolidadas de perfiles lineales, m² de vidrio y
              herrajes listas para despiece y compras.
            </Text>
          </View>

          <View style={styles.footerTotal}>
            <Text style={styles.footerTotalLabel}>
              Total Insumos Materiales:
            </Text>
            <Text style={styles.footerTotalAmount}>
              ${totalConsolidatedCost.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
    ...shadows.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
    minWidth: 260,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryTint,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.heavy,
    color: colors.textPrimary,
    letterSpacing: 0.8,
  },
  subtitle: {
    fontSize: typography.fontSizes.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  badge: {
    backgroundColor: colors.surfaceActive,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  filterBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceActive,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
  },
  filterChipText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.semibold,
    color: colors.textSecondary,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  table: {
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceActive,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderMedium,
  },
  columnHeader: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  tableRowEven: {
    backgroundColor: colors.background,
  },
  colMaterial: {
    flex: 3.5,
    paddingRight: spacing.sm,
  },
  colQuantity: {
    flex: 1.2,
    alignItems: 'flex-end',
    paddingRight: spacing.sm,
  },
  colUnit: {
    flex: 0.8,
    alignItems: 'center',
  },
  colUnitPrice: {
    flex: 1.2,
    alignItems: 'flex-end',
    paddingRight: spacing.sm,
  },
  colTotal: {
    flex: 1.3,
    alignItems: 'flex-end',
  },
  materialName: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
  },
  usedInText: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
  quantityText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.heavy,
    color: colors.primary,
  },
  unitChip: {
    backgroundColor: colors.surfaceActive,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  unitChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  priceText: {
    fontSize: typography.fontSizes.xs,
    color: colors.textMuted,
  },
  totalPriceText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.heavy,
    color: colors.primary,
  },
  tableFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primaryTint,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  footerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
    minWidth: 200,
  },
  footerInfoText: {
    fontSize: 10,
    color: colors.textSecondary,
    lineHeight: 14,
  },
  footerTotal: {
    alignItems: 'flex-end',
  },
  footerTotalLabel: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.semibold,
    color: colors.textSecondary,
  },
  footerTotalAmount: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.heavy,
    color: colors.primary,
  },
});
