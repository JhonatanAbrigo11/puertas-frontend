import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Product } from '../../../core/domain/entities/Product';
import { useProductConfigurator } from '../hooks/useProductConfigurator';
import { useQuote } from '../../quote/context/QuoteContext';
import { TechnicalIllustration } from '../../../shared/components/TechnicalIllustration';
import { getProductImageUri } from '../../../shared/utils/getProductImageUri';
import { DimensionConfigurator } from './DimensionConfigurator';
import { MaterialsTable } from './MaterialsTable';
import { Badge } from '../../../shared/components/Badge';
import { generateAndDownloadPdf } from '../../../core/domain/services/pdfGenerator';
import { Quote } from '../../../core/domain/entities/Quote';
import { useResponsive } from '../../../shared/hooks/useResponsive';
import { colors } from '../../../shared/theme/colors';
import { typography } from '../../../shared/theme/typography';
import { borderRadius, spacing } from '../../../shared/theme/spacing';
import { shadows } from '../../../shared/theme/shadows';

interface ProductDetailViewProps {
  product: Product;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
}) => {
  const { isTablet, isDesktop } = useResponsive();
  const {
    widthCm,
    heightCm,
    quantity,
    setWidthCm,
    setHeightCm,
    setQuantity,
    errors,
    isValid,
    calculatedMaterials,
    subtotalDemo,
    unitPriceDemo,
  } = useProductConfigurator(product);

  const { addItem, customer } = useQuote();
  const [isBenefitsModalOpen, setIsBenefitsModalOpen] = useState(false);

  useEffect(() => {
    setIsBenefitsModalOpen(false);
  }, [product.id]);

  const handleAddToQuote = () => {
    if (!isValid) return;
    addItem(product, widthCm, heightCm, quantity);
  };

  const handlePrintSheet = async () => {
    const singleItemQuote: Quote = {
      id: `FICHA-${product.code}`,
      quoteNumber: `FICHA-${product.code}`,
      customer,
      items: [
        {
          id: `item-${Date.now()}`,
          product,
          widthCm,
          heightCm,
          quantity,
          calculatedMaterials,
          unitPriceDemo,
          subtotalDemo,
          createdAt: new Date().toISOString(),
        },
      ],
      totalItemCount: 1,
      subtotalMaterialsDemo: subtotalDemo,
      estimatedLaborDemo: Math.round(subtotalDemo * 0.25 * 100) / 100,
      totalDemo: Math.round(subtotalDemo * 1.25 * 100) / 100,
      consolidatedMaterials: calculatedMaterials.map((m) => ({
        materialId: m.materialId,
        materialName: m.materialName,
        category: m.materialCategory,
        totalQuantity: m.quantity,
        unit: m.unit,
        unitPriceDemo: m.unitPriceDemo,
        totalPriceDemo: m.subtotalDemo,
        usedInProductsCount: 1,
        productNames: [product.name],
      })),
      createdAt: new Date().toISOString(),
      validUntil: new Date(Date.now() + 15 * 86400000).toISOString(),
    };

    await generateAndDownloadPdf(singleItemQuote, {
      itemCount: 1,
      totalProductsCount: quantity,
      subtotalMaterialsDemo: subtotalDemo,
      estimatedLaborDemo: Math.round(subtotalDemo * 0.25 * 100) / 100,
      totalDemo: Math.round(subtotalDemo * 1.25 * 100) / 100,
    });
  };

  return (
    <>
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={true}
    >
      {/* UNIFIED SINGLE WORKSPACE CARD */}
      <View style={styles.unifiedCard}>
        {/* UPPER ROW: Left Product Info & Graphic + Right Configurator */}
        <View
          style={[
            styles.upperRow,
            isTablet || isDesktop ? styles.upperRowDesktop : styles.upperRowMobile,
          ]}
        >
          {/* LEFT PANE: Preview + Specifications */}
          <View style={styles.leftPane}>
            {/* Technical Preview */}
            <View style={styles.previewContainer}>
              <View style={styles.previewBadgeWrapper}>
                <View style={styles.viewBadge}>
                  <Text style={styles.viewBadgeText}>Foto del producto</Text>
                </View>
              </View>

              <TechnicalIllustration
                type={product.illustrationType}
                imageUri={getProductImageUri(product)}
                height={260}
                widthDimension={widthCm}
                heightDimension={heightCm}
                showDimensions={true}
              />
            </View>

            {/* Product Meta & Description */}
            <View style={styles.productMetaBlock}>
              <Text style={styles.productCode}>{product.code}</Text>
              <Text style={styles.productTitle}>{product.name}</Text>

              {/* Badges Bar */}
              <View style={styles.badgesBar}>
                <Badge
                  label={product.fabricationType}
                  variant="primary"
                  icon={
                    <MaterialCommunityIcons
                      name="ruler-square"
                      size={14}
                      color="#2563EB"
                    />
                  }
                />
                <Badge
                  label={product.applications.join(' • ')}
                  variant="secondary"
                  icon={
                    <MaterialCommunityIcons
                      name="office-building"
                      size={14}
                      color="#475569"
                    />
                  }
                />
                <Badge
                  label={product.mainMaterial}
                  variant="glass"
                  icon={
                    <MaterialCommunityIcons
                      name="shield-check-outline"
                      size={14}
                      color="#0284C7"
                    />
                  }
                />
              </View>

              {/* Beneficios en modal (solo ícono foco) */}
              <TouchableOpacity
                style={styles.benefitsIconButton}
                onPress={() => setIsBenefitsModalOpen(true)}
                activeOpacity={0.8}
                accessibilityLabel="Más beneficios"
              >
                <MaterialCommunityIcons
                  name="lightbulb-on-outline"
                  size={22}
                  color="#D97706"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* RIGHT PANE: Integrated Configurator */}
          <View
            style={[
              styles.rightPane,
              (isTablet || isDesktop) && styles.rightPaneBorder,
            ]}
          >
            <DimensionConfigurator
              product={product}
              widthCm={widthCm}
              heightCm={heightCm}
              quantity={quantity}
              subtotalDemo={subtotalDemo}
              unitPriceDemo={unitPriceDemo}
              widthError={errors.width}
              heightError={errors.height}
              quantityError={errors.quantity}
              onWidthChange={setWidthCm}
              onHeightChange={setHeightCm}
              onQuantityChange={setQuantity}
              onAddToQuote={handleAddToQuote}
              onPrintSheet={handlePrintSheet}
              isValid={isValid}
              hideActions
              hideSummary
            />
          </View>
        </View>

        <View style={styles.fullWidthSummary}>
          <Text style={styles.fullWidthSummaryTitle}>RESUMEN</Text>

          <View style={styles.fullWidthSummaryGrid}>
            <View style={styles.fullWidthSummaryItem}>
              <Text style={styles.summaryLabel}>SERIE</Text>
              <Text style={styles.summaryValue} numberOfLines={2}>
                {product.aluminumSeries}
              </Text>
            </View>

            <View style={styles.fullWidthSummaryItem}>
              <Text style={styles.summaryLabel}>VIDRIO</Text>
              <Text style={styles.summaryValue} numberOfLines={2}>
                {product.glassType}
              </Text>
            </View>
          </View>

          <View style={styles.fullWidthSubtotalCard}>
            <Text style={styles.subtotalLabel}>SUBTOTAL ESTIMADO</Text>
            <Text style={styles.subtotalValue}>${subtotalDemo.toFixed(2)}</Text>
            <Text style={styles.subtotalPerUnit}>
              (${unitPriceDemo.toFixed(2)} / und)
            </Text>
          </View>
        </View>

        <View style={styles.fullWidthActions}>
          <TouchableOpacity
            style={[styles.primaryAddBtn, !isValid && styles.btnDisabled]}
            onPress={handleAddToQuote}
            disabled={!isValid}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name="cart-plus"
              size={18}
              color="#FFFFFF"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.primaryAddBtnText}>Agregar al Carrito</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryPrintBtn}
            onPress={handlePrintSheet}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name="printer-outline"
              size={18}
              color="#475569"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.secondaryPrintBtnText}>Imprimir Ficha</Text>
          </TouchableOpacity>
        </View>

        {/* HORIZONTAL DIVIDER */}
        <View style={styles.horizontalDivider} />

        {/* LOWER SECTION: Real-time Materials Recipe */}
        <View style={styles.lowerRecipeSection}>
          <MaterialsTable
            materials={calculatedMaterials}
            subtotalDemo={subtotalDemo}
            quantity={quantity}
          />
        </View>
      </View>
    </ScrollView>

    <Modal
      visible={isBenefitsModalOpen}
      transparent
      animationType="fade"
      onRequestClose={() => setIsBenefitsModalOpen(false)}
    >
      <View style={styles.benefitsModalOverlay}>
        <View style={styles.benefitsModalCard}>
          <View style={styles.benefitsModalHeader}>
            <View style={styles.benefitsModalTitleRow}>
              <MaterialCommunityIcons
                name="lightbulb-on-outline"
                size={20}
                color="#D97706"
              />
              <Text style={styles.benefitsModalTitle}>Más beneficios</Text>
            </View>
            <TouchableOpacity
              onPress={() => setIsBenefitsModalOpen(false)}
              style={styles.benefitsModalClose}
              accessibilityLabel="Cerrar"
            >
              <MaterialCommunityIcons
                name="close"
                size={22}
                color={colors.textPrimary}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.benefitsModalBody}
            contentContainerStyle={styles.benefitsModalBodyContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.benefitsDescription}>{product.fullDescription}</Text>

            <Text style={styles.benefitsTitle}>BENEFICIOS CLAVE</Text>
            <View style={styles.benefitsList}>
              <View style={styles.benefitItem}>
                <MaterialCommunityIcons
                  name="check-circle-outline"
                  size={16}
                  color="#10B981"
                />
                <Text style={styles.benefitText}>
                  Perfilería {product.aluminumSeries}
                </Text>
              </View>

              <View style={styles.benefitItem}>
                <MaterialCommunityIcons
                  name="check-circle-outline"
                  size={16}
                  color="#10B981"
                />
                <Text style={styles.benefitText}>{product.glassType}</Text>
              </View>

              {product.features.map((feat, idx) => (
                <View key={idx} style={styles.benefitItem}>
                  <MaterialCommunityIcons
                    name="check-circle-outline"
                    size={16}
                    color="#10B981"
                  />
                  <Text style={styles.benefitText}>{feat}</Text>
                </View>
              ))}
            </View>

            <View style={styles.infoBanner}>
              <MaterialCommunityIcons
                name="information-outline"
                size={16}
                color="#0284C7"
              />
              <Text style={styles.infoBannerText}>
                Producto fabricado a la medida según tus necesidades
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  contentContainer: {
    padding: spacing.md,
    paddingBottom: 120,
  },
  unifiedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#EDF2F7',
    padding: 20,
    ...shadows.sm,
  },
  upperRow: {
    width: '100%',
  },
  upperRowDesktop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
  },
  upperRowMobile: {
    flexDirection: 'column',
  },
  leftPane: {
    flex: 1.3,
    minWidth: 0,
    flexShrink: 1,
    paddingRight: 16,
    overflow: 'hidden',
  },
  rightPane: {
    flex: 1,
    minWidth: 280,
    maxWidth: 360,
    flexShrink: 0,
  },
  rightPaneBorder: {
    borderLeftWidth: 1.5,
    borderLeftColor: '#F1F5F9',
    paddingLeft: 12,
  },
  previewContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    position: 'relative',
    marginBottom: 14,
  },
  previewBadgeWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 6,
  },
  viewBadge: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },
  viewBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  productMetaBlock: {
    paddingHorizontal: 4,
    minWidth: 0,
    width: '100%',
  },
  productCode: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2563EB',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  productTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
  },
  badgesBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
    maxWidth: '100%',
  },
  benefitsIconButton: {
    alignSelf: 'flex-start',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 20,
    marginBottom: 14,
  },
  benefitsModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  benefitsModalCard: {
    width: '100%',
    maxWidth: 480,
    maxHeight: '80%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    overflow: 'hidden',
    ...shadows.md,
  },
  benefitsModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  benefitsModalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  benefitsModalTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.heavy,
    color: colors.textPrimary,
  },
  benefitsModalClose: {
    padding: 4,
  },
  benefitsModalBody: {
    maxHeight: 420,
  },
  benefitsModalBodyContent: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  benefitsDescription: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.xs,
  },
  benefitsSection: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
    marginBottom: 14,
  },
  benefitsTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  benefitsList: {
    gap: 6,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  benefitText: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '500',
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  infoBannerText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0284C7',
    flex: 1,
  },
  horizontalDivider: {
    height: 1.5,
    backgroundColor: '#F1F5F9',
    marginVertical: 20,
    width: '100%',
  },
  fullWidthSummary: {
    width: '100%',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1.5,
    borderTopColor: '#F1F5F9',
  },
  fullWidthSummaryTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: spacing.sm,
  },
  fullWidthSummaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  fullWidthSummaryItem: {
    flex: 1,
    minWidth: 180,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: spacing.sm,
  },
  summaryLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F4C81',
    marginTop: 4,
  },
  fullWidthSubtotalCard: {
    width: '100%',
    backgroundColor: '#FDF8ED',
    borderWidth: 1.5,
    borderColor: '#E8D28E',
    borderRadius: 10,
    padding: 14,
    marginBottom: spacing.sm,
  },
  subtotalLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#997316',
    letterSpacing: 0.5,
  },
  subtotalValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0A2540',
    marginVertical: 2,
  },
  subtotalPerUnit: {
    fontSize: 11,
    color: '#64748B',
  },
  fullWidthActions: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  primaryAddBtn: {
    flex: 1,
    minWidth: 200,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F4C81',
    borderWidth: 1,
    borderColor: '#D4AF37',
    paddingVertical: 14,
    borderRadius: 8,
    ...shadows.sm,
  },
  primaryAddBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryPrintBtn: {
    flex: 1,
    minWidth: 200,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    paddingVertical: 14,
    borderRadius: 8,
  },
  secondaryPrintBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  btnDisabled: {
    opacity: 0.5,
  },
  lowerRecipeSection: {
    width: '100%',
  },
});
