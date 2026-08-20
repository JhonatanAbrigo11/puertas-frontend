import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { QuoteItem } from '../../../core/domain/entities/QuoteItem';
import { TechnicalIllustration } from '../../../shared/components/TechnicalIllustration';
import { getProductImageUri } from '../../../shared/utils/getProductImageUri';
import { Stepper } from '../../../shared/components/Stepper';
import { colors } from '../../../shared/theme/colors';
import { typography } from '../../../shared/theme/typography';
import { borderRadius, spacing } from '../../../shared/theme/spacing';
import { shadows } from '../../../shared/theme/shadows';

interface QuoteItemCardProps {
  item: QuoteItem;
  index: number;
  onUpdateQuantity: (newQty: number) => void;
  onRemove: () => void;
  onDownloadPdf?: () => void;
  onGenerateWarehouseOrder?: () => void;
}

export const QuoteItemCard: React.FC<QuoteItemCardProps> = ({
  item,
  index,
  onUpdateQuantity,
  onRemove,
  onDownloadPdf,
  onGenerateWarehouseOrder,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.card}>
      {/* Top Main Row */}
      <View style={styles.mainRow}>
        {/* Left Side: Badge + Thumbnail + Details + Price */}
        <View style={styles.leftSection}>
          {/* Index Badge */}
          <View style={styles.indexBadge}>
            <Text style={styles.indexText}>#{index + 1}</Text>
          </View>

          {/* Thumbnail */}
          <View style={styles.thumbnailContainer}>
            <TechnicalIllustration
              type={item.product.illustrationType}
              imageUri={getProductImageUri(item.product)}
              height={72}
              isThumbnail={true}
            />
          </View>

          {/* Product Details */}
          <View style={styles.detailsContainer}>
            <Text style={styles.productCode}>{item.product.code}</Text>
            <Text style={styles.productName}>{item.product.name}</Text>

            {/* Dimensions Badge */}
            <View style={styles.dimensionsBadge}>
              <MaterialCommunityIcons
                name="ruler"
                size={14}
                color={colors.primary}
              />
              <Text style={styles.dimensionsText}>
                Medidas: {item.widthCm} × {item.heightCm} cm (
                {((item.widthCm * item.heightCm) / 10000).toFixed(2)} m²)
              </Text>
            </View>

            {/* Price Information */}
            <View style={styles.priceBlock}>
              <Text style={styles.priceSubtotalLabel}>SUBTOTAL DEMO:</Text>
              <View style={styles.priceValuesRow}>
                <Text style={styles.priceSubtotal}>
                  ${item.subtotalDemo.toFixed(2)}
                </Text>
                <Text style={styles.priceUnit}>
                  (${item.unitPriceDemo.toFixed(2)} c/u)
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Right Side: Quantity Stepper (Row 1) & Actions (Row 2) */}
        <View style={styles.rightSection}>
          {/* Row 1: Quantity Stepper */}
          <View style={styles.quantityContainer}>
            <Stepper
              value={item.quantity}
              onChange={onUpdateQuantity}
              min={1}
              max={999}
              unitLabel="und"
              style={styles.stepperOverride}
            />
          </View>

          {/* Row 2: Actions Buttons (Proforma PDF + Eliminar in 1 line) */}
          <View style={styles.actionsRow}>
            {onDownloadPdf && (
              <TouchableOpacity
                style={styles.downloadPdfButton}
                onPress={onDownloadPdf}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons
                  name="file-pdf-box"
                  size={18}
                  color="#FFFFFF"
                />
                <Text
                  style={styles.downloadPdfButtonText}
                  numberOfLines={1}
                  ellipsizeMode="clip"
                >
                  Proforma PDF
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={onRemove}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="trash-can-outline"
                size={18}
                color={colors.danger}
              />
              <Text
                style={styles.deleteText}
                numberOfLines={1}
                ellipsizeMode="clip"
              >
                Eliminar
              </Text>
            </TouchableOpacity>
          </View>

          {onGenerateWarehouseOrder && (
            <TouchableOpacity
              style={styles.warehouseOrderButton}
              onPress={onGenerateWarehouseOrder}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name="warehouse"
                size={18}
                color="#FFFFFF"
              />
              <Text
                style={styles.warehouseOrderButtonText}
                numberOfLines={1}
                ellipsizeMode="clip"
              >
                Generar orden de bodega
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Materials Toggle Button */}
      <TouchableOpacity
        style={styles.toggleMaterialsButton}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <View style={styles.toggleLeft}>
          <MaterialCommunityIcons
            name="format-list-bulleted-type"
            size={16}
            color={colors.primary}
          />
          <Text style={styles.toggleText}>
            {expanded ? 'Ocultar materiales' : 'Ver desglose de materiales'} (
            {item.calculatedMaterials.length} componentes)
          </Text>
        </View>
        <MaterialCommunityIcons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={colors.primary}
        />
      </TouchableOpacity>

      {/* Expanded Materials Breakdown List */}
      {expanded && (
        <View style={styles.expandedSection}>
          <View style={styles.materialsHeader}>
            <Text style={styles.materialsHeaderCol1}>Material</Text>
            <Text style={styles.materialsHeaderCol2}>Cantidad</Text>
            <Text style={styles.materialsHeaderCol3}>Unidad</Text>
            <Text style={styles.materialsHeaderCol4}>P. Demo</Text>
            <Text style={styles.materialsHeaderCol5}>Subtotal</Text>
          </View>

          {item.calculatedMaterials.map((mat) => (
            <View key={mat.materialId} style={styles.materialRow}>
              <Text style={styles.matCol1}>{mat.materialName}</Text>
              <Text style={styles.matCol2}>
                {mat.quantity.toFixed(
                  mat.unit === 'und' || mat.unit === 'juego' ? 0 : 2
                )}
              </Text>
              <Text style={styles.matCol3}>{mat.unit}</Text>
              <Text style={styles.matCol4}>
                ${mat.unitPriceDemo.toFixed(2)}
              </Text>
              <Text style={styles.matCol5}>
                ${mat.subtotalDemo.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    minWidth: 280,
    gap: spacing.md,
  },
  indexBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primaryTint,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  indexText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
  },
  thumbnailContainer: {
    width: 82,
    height: 72,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.background,
  },
  detailsContainer: {
    flex: 1,
    minWidth: 160,
  },
  productCode: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  productName: {
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    marginVertical: 2,
  },
  dimensionsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
    gap: 4,
    marginTop: 2,
  },
  dimensionsText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#B45309',
  },
  priceBlock: {
    marginTop: 6,
  },
  priceSubtotalLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  priceValuesRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginTop: 1,
  },
  priceSubtotal: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.heavy,
    color: '#0A192F',
  },
  priceUnit: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    width: 280,
    gap: 8,
  },
  quantityContainer: {
    width: '100%',
  },
  stepperOverride: {
    marginBottom: 0,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    width: '100%',
  },
  downloadPdfButton: {
    flex: 1.35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C98A16', // Warm Gold
    borderWidth: 1,
    borderColor: '#B45309',
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderRadius: borderRadius.md,
    gap: 6,
    ...shadows.sm,
  },
  downloadPdfButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    flexShrink: 0,
  },
  deleteButton: {
    flex: 0.9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingHorizontal: 8,
    paddingVertical: 9,
    borderRadius: borderRadius.md,
    gap: 4,
  },
  deleteText: {
    fontSize: 12,
    color: colors.danger,
    fontWeight: '700',
    flexShrink: 0,
  },
  warehouseOrderButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gold,
    borderWidth: 1,
    borderColor: colors.goldDark,
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderRadius: borderRadius.md,
    gap: 6,
    ...shadows.sm,
  },
  warehouseOrderButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    flexShrink: 0,
  },
  toggleMaterialsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  toggleText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.semibold,
    color: colors.primary,
  },
  expandedSection: {
    marginTop: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  materialsHeader: {
    flexDirection: 'row',
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    marginBottom: 4,
  },
  materialsHeaderCol1: {
    flex: 3,
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
  },
  materialsHeaderCol2: {
    flex: 1.2,
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    textAlign: 'right',
  },
  materialsHeaderCol3: {
    flex: 0.8,
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    textAlign: 'center',
  },
  materialsHeaderCol4: {
    flex: 1.2,
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    textAlign: 'right',
  },
  materialsHeaderCol5: {
    flex: 1.2,
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    textAlign: 'right',
  },
  materialRow: {
    flexDirection: 'row',
    paddingVertical: 3,
  },
  matCol1: {
    flex: 3,
    fontSize: 11,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  matCol2: {
    flex: 1.2,
    fontSize: 11,
    color: colors.textPrimary,
    fontWeight: '700',
    textAlign: 'right',
  },
  matCol3: {
    flex: 0.8,
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  matCol4: {
    flex: 1.2,
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'right',
  },
  matCol5: {
    flex: 1.2,
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
    textAlign: 'right',
  },
});
