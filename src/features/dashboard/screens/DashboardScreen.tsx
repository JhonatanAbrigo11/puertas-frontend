import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TabType } from '../../../shared/components/Header';
import { useQuote } from '../../quote/context/QuoteContext';
import { mockProducts } from '../../../data/mock/products';
import { mockMaterials } from '../../../data/mock/materials';
import { mockCategories } from '../../../data/mock/categories';
import { useResponsive } from '../../../shared/hooks/useResponsive';
import { colors } from '../../../shared/theme/colors';
import { typography } from '../../../shared/theme/typography';
import { borderRadius, spacing } from '../../../shared/theme/spacing';
import { shadows } from '../../../shared/theme/shadows';

interface DashboardScreenProps {
  onNavigate: (tab: TabType) => void;
  onCreateProduct?: () => void;
}

const formatMoney = (value: number) =>
  `$${value.toLocaleString('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onNavigate,
  onCreateProduct,
}) => {
  const { isTablet, isDesktop } = useResponsive();
  const {
    items,
    totals,
    clients,
    selectedClientId,
    quoteNumber,
    consolidatedMaterials,
  } = useQuote();

  const selectedClient = clients.find((c) => c.id === selectedClientId);

  const lowStockMaterials = useMemo(
    () =>
      mockMaterials.filter(
        (m) =>
          m.stockQuantity !== undefined &&
          m.minStockAlert !== undefined &&
          m.stockQuantity <= m.minStockAlert
      ),
    []
  );

  const catalogCategories = mockCategories.filter((c) => c.id !== 'all');
  const columnCount = isDesktop ? 4 : isTablet ? 2 : 2;

  const kpis = [
    {
      id: 'total',
      label: 'Total Proforma',
      value: formatMoney(totals.totalDemo),
      hint: totals.itemCount > 0 ? `${totals.itemCount} líneas` : 'Sin ítems',
      icon: 'file-document-outline' as const,
      color: colors.primary,
      bg: colors.primaryMuted,
    },
    {
      id: 'products',
      label: 'Unidades Cotizadas',
      value: String(totals.totalProductsCount),
      hint: 'En proforma activa',
      icon: 'cube-outline' as const,
      color: colors.accentGlass,
      bg: colors.accentGlassBg,
    },
    {
      id: 'clients',
      label: 'Clientes',
      value: String(clients.length),
      hint: selectedClient ? selectedClient.name.split(' ')[0] : 'Sin selección',
      icon: 'account-group-outline' as const,
      color: colors.accentTeal,
      bg: colors.accentTealBg,
    },
    {
      id: 'catalog',
      label: 'Productos Catálogo',
      value: String(mockProducts.length),
      hint: `${catalogCategories.length} categorías`,
      icon: 'view-grid-outline' as const,
      color: colors.goldText,
      bg: colors.goldLight,
    },
  ];

  const quickActions = [
    {
      id: 'catalog',
      tab: 'catalog' as TabType,
      label: 'Proforma',
      sub: 'Catálogo y cotización',
      icon: 'clipboard-text-outline' as const,
    },
    {
      id: 'quote',
      tab: 'quote' as TabType,
      label: 'Clientes',
      sub: 'Gestionar clientes',
      icon: 'account-outline' as const,
    },
    {
      id: 'settings',
      tab: 'settings' as TabType,
      label: 'Inventario',
      sub: 'Materiales y stock',
      icon: 'package-variant-closed' as const,
    },
    {
      id: 'manufacturing',
      tab: 'manufacturing' as TabType,
      label: 'Fabricación',
      sub: 'Recetas y fichas',
      icon: 'clipboard-text-play-outline' as const,
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        isDesktop && styles.contentDesktop,
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Banner principal */}
      <View style={styles.heroCard}>
        <View style={styles.heroTop}>
          <View style={styles.heroBadge}>
            <MaterialCommunityIcons
              name="view-dashboard-outline"
              size={18}
              color={colors.primary}
            />
            <Text style={styles.heroBadgeText}>Panel de Control</Text>
          </View>
          <Text style={styles.heroDate}>
            {new Date().toLocaleDateString('es-EC', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </Text>
        </View>
        <Text style={styles.heroTitle}>Resumen de operaciones</Text>
        <Text style={styles.heroSubtitle}>
          Proforma {quoteNumber}
          {selectedClient ? ` · ${selectedClient.name}` : ''}
        </Text>
      </View>

      {/* KPIs */}
      <View
        style={[
          styles.kpiGrid,
          columnCount === 4 && styles.kpiGridDesktop,
        ]}
      >
        {kpis.map((kpi) => (
          <View key={kpi.id} style={styles.kpiCard}>
            <View style={[styles.kpiIconWrap, { backgroundColor: kpi.bg }]}>
              <MaterialCommunityIcons
                name={kpi.icon}
                size={22}
                color={kpi.color}
              />
            </View>
            <Text style={styles.kpiLabel}>{kpi.label}</Text>
            <Text style={styles.kpiValue}>{kpi.value}</Text>
            <Text style={styles.kpiHint} numberOfLines={1}>
              {kpi.hint}
            </Text>
          </View>
        ))}
      </View>

      {/* Proforma activa */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons
            name="cart-outline"
            size={20}
            color={colors.primary}
          />
          <Text style={styles.sectionTitle}>Proforma en curso</Text>
        </View>

        {items.length === 0 ? (
          <View style={styles.emptyBlock}>
            <MaterialCommunityIcons
              name="clipboard-plus-outline"
              size={36}
              color={colors.textLight}
            />
            <Text style={styles.emptyTitle}>Sin productos en la proforma</Text>
            <Text style={styles.emptyText}>
              Agrega productos desde el catálogo para calcular materiales y total.
            </Text>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => onNavigate('catalog')}
              activeOpacity={0.85}
            >
              <MaterialCommunityIcons name="plus" size={18} color="#FFF" />
              <Text style={styles.primaryBtnText}>Ir al Catálogo</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.quoteSummaryRow}>
              <View style={styles.quoteSummaryItem}>
                <Text style={styles.quoteSummaryLabel}>Materiales</Text>
                <Text style={styles.quoteSummaryValue}>
                  {formatMoney(totals.subtotalMaterialsDemo)}
                </Text>
              </View>
              <View style={styles.quoteSummaryDivider} />
              <View style={styles.quoteSummaryItem}>
                <Text style={styles.quoteSummaryLabel}>Mano de obra est.</Text>
                <Text style={styles.quoteSummaryValue}>
                  {formatMoney(totals.estimatedLaborDemo)}
                </Text>
              </View>
              <View style={styles.quoteSummaryDivider} />
              <View style={styles.quoteSummaryItem}>
                <Text style={styles.quoteSummaryLabel}>Total</Text>
                <Text style={[styles.quoteSummaryValue, styles.quoteTotal]}>
                  {formatMoney(totals.totalDemo)}
                </Text>
              </View>
            </View>

            <View style={styles.quoteItemsList}>
              {items.slice(0, 4).map((item) => (
                <View key={item.id} style={styles.quoteItemRow}>
                  <View style={styles.quoteItemLeft}>
                    <Text style={styles.quoteItemCode}>{item.product.code}</Text>
                    <Text style={styles.quoteItemName} numberOfLines={1}>
                      {item.product.name}
                    </Text>
                    <Text style={styles.quoteItemDims}>
                      {item.widthCm}×{item.heightCm} cm · {item.quantity} und.
                    </Text>
                  </View>
                  <Text style={styles.quoteItemPrice}>
                    {formatMoney(item.subtotalDemo)}
                  </Text>
                </View>
              ))}
              {items.length > 4 && (
                <Text style={styles.moreItems}>
                  +{items.length - 4} productos más en la proforma
                </Text>
              )}
            </View>

            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => onNavigate('catalog')}
              activeOpacity={0.85}
            >
              <Text style={styles.secondaryBtnText}>Ver / Editar Proforma</Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={20}
                color={colors.primary}
              />
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Alertas de inventario */}
      {lowStockMaterials.length > 0 && (
        <View style={[styles.sectionCard, styles.alertCard]}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={20}
              color={colors.warning}
            />
            <Text style={styles.sectionTitle}>
              Stock bajo ({lowStockMaterials.length})
            </Text>
          </View>
          {lowStockMaterials.slice(0, 5).map((mat) => (
            <View key={mat.id} style={styles.alertRow}>
              <View style={styles.alertRowLeft}>
                <Text style={styles.alertCode}>{mat.code}</Text>
                <Text style={styles.alertName} numberOfLines={1}>
                  {mat.name}
                </Text>
              </View>
              <View style={styles.alertBadge}>
                <Text style={styles.alertBadgeText}>
                  {mat.stockQuantity} {mat.unit}
                </Text>
              </View>
            </View>
          ))}
          <TouchableOpacity
            style={styles.linkBtn}
            onPress={() => onNavigate('settings')}
            activeOpacity={0.85}
          >
            <Text style={styles.linkBtnText}>Revisar inventario</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Materiales consolidados de la proforma */}
      {consolidatedMaterials.length > 0 && (
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="format-list-bulleted"
              size={20}
              color={colors.primary}
            />
            <Text style={styles.sectionTitle}>Materiales requeridos</Text>
          </View>
          {consolidatedMaterials.slice(0, 5).map((mat) => (
            <View key={mat.materialId} style={styles.materialRow}>
              <Text style={styles.materialName} numberOfLines={1}>
                {mat.materialName}
              </Text>
              <Text style={styles.materialQty}>
                {mat.totalQuantity.toFixed(2)} {mat.unit}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Accesos rápidos */}
      <Text style={styles.quickTitle}>Accesos rápidos</Text>
      <View
        style={[
          styles.quickGrid,
          (isTablet || isDesktop) && styles.quickGridWide,
        ]}
      >
        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={styles.quickCard}
            onPress={() => onNavigate(action.tab)}
            activeOpacity={0.85}
          >
            <View style={styles.quickIconWrap}>
              <MaterialCommunityIcons
                name={action.icon}
                size={22}
                color={colors.primary}
              />
            </View>
            <Text style={styles.quickLabel}>{action.label}</Text>
            <Text style={styles.quickSub}>{action.sub}</Text>
          </TouchableOpacity>
        ))}

        {onCreateProduct && (
          <TouchableOpacity
            style={[styles.quickCard, styles.quickCardAccent]}
            onPress={onCreateProduct}
            activeOpacity={0.85}
          >
            <View style={[styles.quickIconWrap, styles.quickIconWrapAccent]}>
              <MaterialCommunityIcons name="plus" size={24} color="#FFF" />
            </View>
            <Text style={[styles.quickLabel, styles.quickLabelAccent]}>
              Nuevo Producto
            </Text>
            <Text style={[styles.quickSub, styles.quickSubAccent]}>
              Agregar al catálogo
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Resumen operativo */}
      <View style={styles.footerStats}>
        <View style={styles.footerStat}>
          <Text style={styles.footerStatValue}>{mockMaterials.length}</Text>
          <Text style={styles.footerStatLabel}>Insumos</Text>
        </View>
        <View style={styles.footerStatDivider} />
        <View style={styles.footerStat}>
          <Text style={styles.footerStatValue}>{mockProducts.length}</Text>
          <Text style={styles.footerStatLabel}>Fichas fabricación</Text>
        </View>
        <View style={styles.footerStatDivider} />
        <View style={styles.footerStat}>
          <Text style={styles.footerStatValue}>{catalogCategories.length}</Text>
          <Text style={styles.footerStatLabel}>Líneas producto</Text>
        </View>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
    paddingTop: spacing.sm,
  },
  contentDesktop: {
    maxWidth: 1100,
    alignSelf: 'center',
    width: '100%',
  },
  heroCard: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  heroBadgeText: {
    fontSize: typography.fontSizes.xs,
    color: '#FFF',
    fontWeight: typography.fontWeights.semibold,
  },
  heroDate: {
    fontSize: typography.fontSizes.xs,
    color: 'rgba(255,255,255,0.75)',
    textTransform: 'capitalize',
  },
  heroTitle: {
    fontSize: typography.fontSizes['2xl'],
    fontWeight: typography.fontWeights.heavy,
    color: '#FFF',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: typography.fontSizes.sm,
    color: 'rgba(255,255,255,0.85)',
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  kpiGridDesktop: {
    flexWrap: 'nowrap',
  },
  kpiCard: {
    flex: 1,
    minWidth: '46%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  kpiIconWrap: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  kpiLabel: {
    fontSize: typography.fontSizes.xs,
    color: colors.textMuted,
    marginBottom: 2,
  },
  kpiValue: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  kpiHint: {
    fontSize: typography.fontSizes.xs,
    color: colors.textLight,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  alertCard: {
    borderColor: colors.warningBorder,
    backgroundColor: colors.warningBg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
  },
  emptyBlock: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  emptyTitle: {
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.semibold,
    color: colors.textPrimary,
  },
  emptyText: {
    fontSize: typography.fontSizes.sm,
    color: colors.textMuted,
    textAlign: 'center',
    maxWidth: 280,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    marginTop: spacing.sm,
  },
  primaryBtnText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold,
    color: '#FFF',
  },
  quoteSummaryRow: {
    flexDirection: 'row',
    backgroundColor: colors.primaryTint,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  quoteSummaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  quoteSummaryDivider: {
    width: 1,
    backgroundColor: colors.primaryBorder,
    marginHorizontal: 4,
  },
  quoteSummaryLabel: {
    fontSize: typography.fontSizes.xs,
    color: colors.textMuted,
    marginBottom: 4,
  },
  quoteSummaryValue: {
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
  },
  quoteTotal: {
    color: colors.primary,
    fontSize: 16,
  },
  quoteItemsList: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  quoteItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  quoteItemLeft: {
    flex: 1,
    marginRight: spacing.sm,
  },
  quoteItemCode: {
    fontSize: typography.fontSizes.xs,
    color: colors.primary,
    fontWeight: typography.fontWeights.bold,
  },
  quoteItemName: {
    fontSize: typography.fontSizes.sm,
    color: colors.textPrimary,
    fontWeight: typography.fontWeights.semibold,
  },
  quoteItemDims: {
    fontSize: typography.fontSizes.xs,
    color: colors.textMuted,
  },
  quoteItemPrice: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
  },
  moreItems: {
    fontSize: typography.fontSizes.xs,
    color: colors.textMuted,
    textAlign: 'center',
    paddingTop: 4,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    backgroundColor: colors.primaryMuted,
  },
  secondaryBtnText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold,
    color: colors.primary,
  },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.warningBorder,
  },
  alertRowLeft: {
    flex: 1,
    marginRight: spacing.sm,
  },
  alertCode: {
    fontSize: typography.fontSizes.xs,
    color: colors.warning,
    fontWeight: typography.fontWeights.bold,
  },
  alertName: {
    fontSize: typography.fontSizes.sm,
    color: colors.textPrimary,
  },
  alertBadge: {
    backgroundColor: colors.dangerBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
  },
  alertBadgeText: {
    fontSize: typography.fontSizes.xs,
    color: colors.danger,
    fontWeight: typography.fontWeights.bold,
  },
  linkBtn: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
  },
  linkBtnText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold,
    color: colors.primary,
  },
  materialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  materialName: {
    fontSize: typography.fontSizes.sm,
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.sm,
  },
  materialQty: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.semibold,
    color: colors.textSecondary,
  },
  quickTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  quickGridWide: {
    flexWrap: 'nowrap',
  },
  quickCard: {
    flex: 1,
    minWidth: '46%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  quickCardAccent: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
  },
  quickIconWrap: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  quickIconWrapAccent: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  quickLabel: {
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
  },
  quickLabelAccent: {
    color: '#FFF',
  },
  quickSub: {
    fontSize: typography.fontSizes.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  quickSubAccent: {
    color: 'rgba(255,255,255,0.8)',
  },
  footerStats: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.md,
  },
  footerStat: {
    flex: 1,
    alignItems: 'center',
  },
  footerStatDivider: {
    width: 1,
    backgroundColor: colors.borderLight,
  },
  footerStatValue: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
    color: colors.primary,
  },
  footerStatLabel: {
    fontSize: typography.fontSizes.xs,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
