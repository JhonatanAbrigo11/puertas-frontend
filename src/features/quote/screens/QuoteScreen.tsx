import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuote } from '../context/QuoteContext';
import { QuoteItemCard } from '../components/QuoteItemCard';
import { Button } from '../../../shared/components/Button';
import { colors } from '../../../shared/theme/colors';
import { typography } from '../../../shared/theme/typography';
import { borderRadius, spacing } from '../../../shared/theme/spacing';
import { shadows } from '../../../shared/theme/shadows';

import { generateAndDownloadPdf } from '../../../core/domain/services/pdfGenerator';
import { consolidateMaterials } from '../../../core/domain/services/materialConsolidator';
import { Quote } from '../../../core/domain/entities/Quote';

interface QuoteScreenProps {
  onGoToCatalog: () => void;
}

export const QuoteScreen: React.FC<QuoteScreenProps> = ({ onGoToCatalog }) => {
  const {
    items,
    removeItem,
    updateItemQuantity,
    clearQuote,
    consolidatedMaterials,
    totals,
    customer,
    quoteNumber,
  } = useQuote();

  const [isGeneratingPdf, setIsGeneratingPdf] = React.useState(false);

  const handleDownloadPdf = async () => {
    if (items.length === 0) return;

    setIsGeneratingPdf(true);
    try {
      const fullQuote: Quote = {
        id: quoteNumber,
        quoteNumber,
        customer,
        items,
        totalItemCount: items.length,
        subtotalMaterialsDemo: totals.subtotalMaterialsDemo,
        estimatedLaborDemo: totals.estimatedLaborDemo,
        totalDemo: totals.totalDemo,
        consolidatedMaterials,
        createdAt: new Date().toISOString(),
        validUntil: new Date(Date.now() + 15 * 86400000).toISOString(),
      };

      const result = await generateAndDownloadPdf(fullQuote, totals);

      if (!result.success && result.error) {
        alert(`Error al generar el PDF: ${result.error}`);
      }
    } catch (err: any) {
      console.error(err);
      alert('Ocurrió un error al preparar el documento PDF.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDownloadItemPdf = async (item: typeof items[0]) => {
    try {
      const singleItemQuote: Quote = {
        id: `${quoteNumber}-${item.id.slice(0, 4)}`,
        quoteNumber: `${quoteNumber}-${item.product.code}`,
        customer,
        items: [item],
        totalItemCount: item.quantity,
        subtotalMaterialsDemo: item.subtotalDemo,
        estimatedLaborDemo: Math.round(item.subtotalDemo * 0.25 * 100) / 100,
        totalDemo: Math.round(item.subtotalDemo * 1.25 * 100) / 100,
        consolidatedMaterials: consolidateMaterials([item]),
        createdAt: new Date().toISOString(),
        validUntil: new Date(Date.now() + 15 * 86400000).toISOString(),
      };

      const singleTotals = {
        itemCount: 1,
        totalProductsCount: item.quantity,
        subtotalMaterialsDemo: item.subtotalDemo,
        estimatedLaborDemo: Math.round(item.subtotalDemo * 0.25 * 100) / 100,
        totalDemo: Math.round(item.subtotalDemo * 1.25 * 100) / 100,
      };

      const result = await generateAndDownloadPdf(singleItemQuote, singleTotals);
      if (!result.success && result.error) {
        alert(`Error al generar el PDF: ${result.error}`);
      }
    } catch (err: any) {
      console.error(err);
      alert('Ocurrió un error al preparar el documento PDF.');
    }
  };

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyCard}>
          <View style={styles.emptyIconCircle}>
            <MaterialCommunityIcons
              name="clipboard-text-off-outline"
              size={48}
              color={colors.primary}
            />
          </View>
          <Text style={styles.emptyTitle}>Tu Carrito está vacío</Text>
          <Text style={styles.emptyDescription}>
            Aún no has agregado ningún producto a la cotización actual. Selecciona
            un producto en el catálogo, ingresa las medidas de ancho y alto, y
            agrégalo al carrito.
          </Text>

          <Button
            title="IR AL CATÁLOGO DE PRODUCTOS"
            onPress={onGoToCatalog}
            variant="primary"
            size="lg"
            icon={
              <MaterialCommunityIcons
                name="view-grid-plus"
                size={20}
                color="#FFFFFF"
              />
            }
            style={styles.emptyButton}
          />
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={true}
    >
      {/* 1. Header Toolbar Bar */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeaderLeft}>
          <MaterialCommunityIcons
            name="cart-outline"
            size={22}
            color="#0F4C81"
          />
          <Text style={styles.sectionTitle}>
            PRODUCTOS EN EL CARRITO ({items.length})
          </Text>
        </View>

        <View style={styles.headerActionsRight}>
          <TouchableOpacity
            style={styles.clearCartBtn}
            onPress={clearQuote}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={16}
              color={colors.danger}
            />
            <Text style={styles.clearCartText}>Vaciar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addMoreButton}
            onPress={onGoToCatalog}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="plus"
              size={16}
              color="#FFFFFF"
            />
            <Text style={styles.addMoreText}>Agregar más</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. Quote Item Cards List */}
      {items.map((item, index) => (
        <QuoteItemCard
          key={item.id}
          item={item}
          index={index}
          onUpdateQuantity={(newQty) => updateItemQuantity(item.id, newQty)}
          onRemove={() => removeItem(item.id)}
          onDownloadPdf={() => handleDownloadItemPdf(item)}
        />
      ))}

      {/* 4. Final Action Card */}
      <View style={styles.finalActionCard}>
        <View style={styles.finalActionInfo}>
          <Text style={styles.finalActionTitle}>
            ¿Listo para emitir la cotización?
          </Text>
          <Text style={styles.finalActionSubtitle}>
            Se generará el archivo PDF formal con especificaciones técnicas,
            despiece consolidado de corte para taller y presupuesto final.
          </Text>
        </View>

        <View style={styles.finalActionButtons}>
          <Button
            title="AGREGAR MÁS PRODUCTOS"
            onPress={onGoToCatalog}
            variant="outline"
            size="lg"
            icon={
              <MaterialCommunityIcons
                name="view-grid"
                size={20}
                color={colors.primary}
              />
            }
          />

          <Button
            title={
              isGeneratingPdf
                ? 'GENERANDO DOCUMENTO PDF...'
                : `DESCARGAR COTIZACIÓN PDF ($${totals.totalDemo.toFixed(2)})`
            }
            onPress={handleDownloadPdf}
            loading={isGeneratingPdf}
            disabled={isGeneratingPdf}
            variant="primary"
            size="lg"
            icon={
              <MaterialCommunityIcons
                name="file-pdf-box"
                size={22}
                color="#FFFFFF"
              />
            }
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: spacing.lg,
    paddingBottom: spacing['5xl'],
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing['3xl'],
    maxWidth: 480,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    ...shadows.md,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryTint,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.heavy,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  emptyDescription: {
    fontSize: typography.fontSizes.sm,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: typography.lineHeights.base,
    marginBottom: spacing.xl,
  },
  emptyButton: {
    width: '100%',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.heavy,
    color: colors.textPrimary,
    letterSpacing: 0.8,
  },
  headerActionsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  clearCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: borderRadius.md,
    gap: 4,
  },
  clearCartText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold,
    color: colors.danger,
  },
  addMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F4C81',
    borderWidth: 1,
    borderColor: '#D4AF37',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.md,
    gap: 4,
    ...shadows.sm,
  },
  addMoreText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold,
    color: '#FFFFFF',
  },
  finalActionCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    borderWidth: 1.5,
    borderColor: colors.primaryBorder,
    marginTop: spacing.md,
    ...shadows.md,
  },
  finalActionInfo: {
    marginBottom: spacing.lg,
  },
  finalActionTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.heavy,
    color: colors.textPrimary,
  },
  finalActionSubtitle: {
    fontSize: typography.fontSizes.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  finalActionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
});
