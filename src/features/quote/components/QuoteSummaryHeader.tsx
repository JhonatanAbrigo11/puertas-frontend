import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { QuoteTotals } from '../../../core/domain/services/quoteCalculator';
import { QuoteCustomer } from '../../../core/domain/entities/Quote';
import { colors } from '../../../shared/theme/colors';
import { typography } from '../../../shared/theme/typography';
import { borderRadius, spacing } from '../../../shared/theme/spacing';
import { shadows } from '../../../shared/theme/shadows';

interface QuoteSummaryHeaderProps {
  quoteNumber: string;
  customer: QuoteCustomer;
  totals: QuoteTotals;
  onClear: () => void;
  onEditCustomer?: () => void;
  onDownloadPdf?: () => void;
  isGeneratingPdf?: boolean;
}

export const QuoteSummaryHeader: React.FC<QuoteSummaryHeaderProps> = ({
  quoteNumber,
  customer,
  totals,
  onClear,
  onEditCustomer,
  onDownloadPdf,
  isGeneratingPdf = false,
}) => {
  return (
    <View style={styles.container}>
      {/* Top Meta Bar */}
      <View style={styles.metaRow}>
        <View style={styles.quoteNumberWrapper}>
          <Text style={styles.quoteNumberLabel}>COTIZACIÓN / PROFORMA</Text>
          <Text style={styles.quoteNumberValue}>{quoteNumber}</Text>
        </View>

        <View style={styles.actionsGroup}>
          {onDownloadPdf && (
            <TouchableOpacity
              style={styles.pdfButton}
              onPress={onDownloadPdf}
              disabled={isGeneratingPdf}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="file-pdf-box"
                size={18}
                color="#FFFFFF"
              />
              <Text style={styles.pdfButtonText}>
                {isGeneratingPdf ? 'Generando...' : 'Descargar PDF'}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.clearButton}
            onPress={onClear}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={16}
              color={colors.danger}
            />
            <Text style={styles.clearButtonText}>Vaciar Carrito</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Customer Info Card */}
      <View style={styles.customerBox}>
        <View style={styles.customerHeader}>
          <View style={styles.customerLeft}>
            <MaterialCommunityIcons
              name="account-tie-outline"
              size={18}
              color={colors.primary}
            />
            <Text style={styles.customerTitle}>DATOS DEL CLIENTE / PROYECTO</Text>
          </View>
          {onEditCustomer && (
            <TouchableOpacity onPress={onEditCustomer}>
              <Text style={styles.editCustomerText}>Editar</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.customerDetailsGrid}>
          <View style={styles.customerDetailItem}>
            <Text style={styles.detailLabel}>Cliente:</Text>
            <Text style={styles.detailValue}>{customer.name}</Text>
          </View>
          <View style={styles.customerDetailItem}>
            <Text style={styles.detailLabel}>Contacto:</Text>
            <Text style={styles.detailValue}>{customer.phone}</Text>
          </View>
          <View style={styles.customerDetailItem}>
            <Text style={styles.detailLabel}>Dirección / Obra:</Text>
            <Text style={styles.detailValue}>{customer.address}</Text>
          </View>
        </View>
      </View>

      {/* KPI Stats Cards (Total products, Subtotal, Labor, Total) */}
      <View style={styles.kpiGrid}>
        {/* Card 1: Total Products */}
        <View style={styles.kpiCard}>
          <View style={styles.kpiIconWrapper}>
            <MaterialCommunityIcons
              name="package-variant-closed"
              size={20}
              color={colors.primary}
            />
          </View>
          <View>
            <Text style={styles.kpiLabel}>Total Productos</Text>
            <Text style={styles.kpiValue}>
              {totals.totalProductsCount}{' '}
              <Text style={styles.kpiSubValue}>({totals.itemCount} items)</Text>
            </Text>
          </View>
        </View>

        {/* Card 2: Subtotal Materials */}
        <View style={styles.kpiCard}>
          <View style={styles.kpiIconWrapper}>
            <MaterialCommunityIcons
              name="hammer-wrench"
              size={20}
              color={colors.accentGlass}
            />
          </View>
          <View>
            <Text style={styles.kpiLabel}>Subtotal Materiales</Text>
            <Text style={styles.kpiValue}>
              ${totals.subtotalMaterialsDemo.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Card 3: Labor Estimate */}
        <View style={styles.kpiCard}>
          <View style={styles.kpiIconWrapper}>
            <MaterialCommunityIcons
              name="account-hard-hat-outline"
              size={20}
              color={colors.accentTeal}
            />
          </View>
          <View>
            <Text style={styles.kpiLabel}>Mano de Obra (Demo)</Text>
            <Text style={styles.kpiValue}>
              ${totals.estimatedLaborDemo.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Card 4: Total Estimate Highlight */}
        <View style={[styles.kpiCard, styles.kpiCardHighlight]}>
          <View
            style={[styles.kpiIconWrapper, styles.kpiIconWrapperHighlight]}
          >
            <MaterialCommunityIcons
              name="cash-check"
              size={22}
              color="#FFFFFF"
            />
          </View>
          <View>
            <Text style={styles.kpiLabelHighlight}>TOTAL ESTIMADO DEMO</Text>
            <Text style={styles.kpiValueHighlight}>
              ${totals.totalDemo.toFixed(2)}
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
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  quoteNumberWrapper: {
    justifyContent: 'center',
  },
  quoteNumberLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 1,
  },
  quoteNumberValue: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.heavy,
    color: colors.textPrimary,
  },
  actionsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  pdfButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FE4648',
    borderWidth: 1,
    borderColor: '#FE4648',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
    gap: 6,
    ...shadows.sm,
  },
  pdfButtonText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold,
    color: '#FFFFFF',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dangerBg,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
    gap: 4,
  },
  clearButtonText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold,
    color: colors.danger,
  },
  customerBox: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.md,
  },
  customerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  customerLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D93638',
    letterSpacing: 0.8,
  },
  customerName: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.heavy,
    color: '#1A1A1A',
  },
  customerLocation: {
    fontSize: typography.fontSizes.xs,
    color: colors.textMuted,
  },
  customerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  customerTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  editCustomerText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: '600',
    color: colors.primary,
  },
  customerDetailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  customerDetailItem: {
    minWidth: 160,
  },
  detailLabel: {
    fontSize: 10,
    color: colors.textMuted,
  },
  detailValue: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  kpiCard: {
    flex: 1,
    minWidth: 160,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  kpiCardHighlight: {
    backgroundColor: '#FE4648',
    borderWidth: 1.5,
    borderColor: '#FE4648',
  },
  kpiIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surfaceActive,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiIconWrapperHighlight: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  kpiLabel: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  kpiLabelHighlight: {
    fontSize: 10,
    color: '#E0EEF9',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  kpiValue: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.heavy,
    color: colors.textPrimary,
  },
  kpiValueHighlight: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.heavy,
    color: '#FFFFFF',
  },
  kpiSubValue: {
    fontSize: typography.fontSizes.xs,
    fontWeight: '500',
    color: colors.textSecondary,
  },
});
