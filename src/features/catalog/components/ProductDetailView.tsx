import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Product } from '../../../core/domain/entities/Product';
import { useProductConfigurator } from '../hooks/useProductConfigurator';
import { useQuote } from '../../quote/context/QuoteContext';
import { TechnicalIllustration } from '../../../shared/components/TechnicalIllustration';
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
                  <Text style={styles.viewBadgeText}>Vista frontal</Text>
                </View>
              </View>

              <TechnicalIllustration
                type={product.illustrationType}
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

              {/* Description */}
              <Text style={styles.descriptionText}>
                {product.fullDescription}
              </Text>

              {/* Beneficios Clave */}
              <View style={styles.benefitsSection}>
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
              </View>

              {/* Info Banner */}
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
            />
          </View>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  contentContainer: {
    padding: spacing.md,
    paddingBottom: spacing['4xl'],
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
  descriptionText: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 14,
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
  lowerRecipeSection: {
    width: '100%',
  },
});
