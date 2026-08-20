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
import { useResponsive } from '../../../shared/hooks/useResponsive';

interface QuoteItemCardProps {
  item: QuoteItem;
  index: number;
  onUpdateQuantity: (newQty: number) => void;
  onDownloadPdf?: () => void;
  onGenerateWarehouseOrder?: () => void;
  onSelectClient?: () => void;
}

export const QuoteItemCard: React.FC<QuoteItemCardProps> = ({
  item,
  index,
  onUpdateQuantity,
  onDownloadPdf,
  onGenerateWarehouseOrder,
  onSelectClient,
}) => {
  const [expanded, setExpanded] = useState(false);
  const { isMobile } = useResponsive();

  return (
    <View style={[styles.card, isMobile && styles.cardMobile]}>
      <View style={[styles.mainRow, isMobile && styles.mainRowMobile]}>
        <TouchableOpacity
          style={[styles.leftSection, isMobile && styles.leftSectionMobile]}
          onPress={onSelectClient}
          activeOpacity={onSelectClient ? 0.75 : 1}
          disabled={!onSelectClient}
          accessibilityRole="button"
          accessibilityLabel="Seleccionar cliente para esta cotización"
        >
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
          <View style={[styles.detailsContainer, isMobile && styles.detailsContainerMobile]}>
            <Text style={styles.productCode} numberOfLines={1}>
              {item.product.code}
            </Text>
            <Text style={styles.productName} numberOfLines={2}>
              {item.product.name}
            </Text>

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
            {onSelectClient && (
              <Text style={styles.selectClientHint}>
                Toca para elegir cliente
              </Text>
            )}
          </View>
        </TouchableOpacity>

        {/* Right Side: Quantity Stepper (Row 1) & Actions (Row 2) */}
        <View style={[styles.rightSection, isMobile && styles.rightSectionMobile]}>
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
        <View style={[styles.toggleLeft, isMobile && styles.toggleLeftMobile]}>
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
    width: '100%',
    alignSelf: 'stretch',
    overflow: 'hidden',
    ...shadows.sm,
  },
  cardMobile: {
    padding: spacing.sm,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: spacing.md,
    width: '100%',
  },
  mainRowMobile: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    minWidth: 0,
    gap: spacing.md,
  },
  leftSectionMobile: {
    width: '100%',
    flexGrow: 0,
    minWidth: 0,
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
    flexShrink: 0,
  },
  indexText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
  },
  thumbnailContainer: {
    width: 72,
    height: 64,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.background,
    flexShrink: 0,
  },
  detailsContainer: {
    flex: 1,
    minWidth: 0,
  },
  detailsContainerMobile: {
    minWidth: 0,
    flexShrink: 1,
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
    alignItems: 'flex-start',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
    maxWidth: '100%',
    gap: 4,
    marginTop: 2,
  },
  dimensionsText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#B45309',
    flex: 1,
    flexShrink: 1,
    flexWrap: 'wrap',
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
    flexWrap: 'wrap',
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
  selectClientHint: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: '600',
    color: colors.goldText,
  },
  rightSection: {
    alignItems: 'stretch',
    justifyContent: 'center',
    width: 280,
    maxWidth: '100%',
    gap: 8,
    flexShrink: 1,
  },
  rightSectionMobile: {
    width: '100%',
    alignSelf: 'stretch',
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
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C98A16',
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
    flexShrink: 1,
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
    flexShrink: 1,
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
    flex: 1,
    minWidth: 0,
    paddingRight: 8,
  },
  toggleLeftMobile: {
    flex: 1,
    minWidth: 0,
  },
  toggleText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.semibold,
    color: colors.primary,
    flex: 1,
    flexShrink: 1,
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
