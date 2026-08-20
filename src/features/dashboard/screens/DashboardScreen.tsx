import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TabType } from '../../../shared/components/Header';
import { useQuote } from '../../quote/context/QuoteContext';
import { mockProducts } from '../../../data/mock/products';
import { mockMaterials } from '../../../data/mock/materials';
import { mockCategories } from '../../../data/mock/categories';
import { DonutChart } from '../components/DonutChart';
import { BarChart } from '../components/BarChart';
import { AreaChart } from '../components/AreaChart';
import { StockGauge } from '../components/StockGauge';
import { useResponsive } from '../../../shared/hooks/useResponsive';
import { dashboardColors as dc } from '../../../shared/theme/dashboardColors';
import { typography } from '../../../shared/theme/typography';
import { borderRadius, spacing } from '../../../shared/theme/spacing';
import { shadows } from '../../../shared/theme/shadows';

interface DashboardScreenProps {
  onNavigate: (tab: TabType) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  ventanas: dc.category.ventanas,
  mamparas: dc.category.mamparas,
  fachadas: dc.category.fachadas,
  vitrinas: dc.category.vitrinas,
  pergolas: dc.category.pergolas,
  puertas: dc.category.puertas,
};

const formatMoney = (value: number) =>
  `$${value.toLocaleString('es-EC', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

const formatMoneyFull = (value: number) =>
  `$${value.toLocaleString('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onNavigate,
}) => {
  const { isTablet, isDesktop } = useResponsive();
  const isWide = isTablet || isDesktop;
  const chartHeight = isWide ? 150 : 120;
  const gaugeSize = isWide ? 130 : 110;

  const {
    items,
    totals,
    clients,
    selectedClientId,
    quoteNumber,
    consolidatedMaterials,
  } = useQuote();

  const selectedClient = clients.find((c) => c.id === selectedClientId);
  const catalogCategories = mockCategories.filter((c) => c.id !== 'all');

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

  const healthyStockCount = mockMaterials.length - lowStockMaterials.length;

  const categoryBarData = useMemo(() => {
    return catalogCategories.map((cat) => ({
      label: cat.shortName,
      value: mockProducts.filter((p) => p.categoryId === cat.id).length,
      color: CATEGORY_COLORS[cat.id] || dc.accent,
    }));
  }, [catalogCategories]);

  const proformaDonut = useMemo(() => {
    if (totals.totalDemo <= 0) {
      return [
        { label: 'Materiales', value: 1, color: dc.chart.materials },
        { label: 'Mano de obra', value: 1, color: dc.chart.labor },
      ];
    }
    return [
      {
        label: 'Materiales',
        value: totals.subtotalMaterialsDemo,
        color: dc.chart.materials,
      },
      {
        label: 'Mano de obra',
        value: totals.estimatedLaborDemo,
        color: dc.chart.labor,
      },
    ];
  }, [totals]);

  const trendLabels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Hoy'];
  const trendValues = useMemo(() => {
    const base = totals.totalDemo || 2400;
    return [base * 0.4, base * 0.55, base * 0.48, base * 0.7, base * 0.62, base * 0.85, base];
  }, [totals.totalDemo]);

  const topMaterials = useMemo(() => {
    if (consolidatedMaterials.length > 0) {
      return [...consolidatedMaterials]
        .sort((a, b) => b.totalQuantity - a.totalQuantity)
        .slice(0, 4);
    }
    return mockMaterials.slice(0, 4).map((m) => ({
      materialId: m.id,
      materialName: m.name,
      totalQuantity: m.stockQuantity || 0,
      unit: m.unit,
    }));
  }, [consolidatedMaterials]);

  const maxMaterialQty = Math.max(...topMaterials.map((m) => m.totalQuantity), 1);

  const kpiItems = [
    {
      icon: 'cash-multiple' as const,
      label: 'Total Proforma',
      value: formatMoneyFull(totals.totalDemo),
      delta: totals.itemCount > 0 ? `${totals.itemCount} líneas` : 'Vacía',
      color: dc.kpi.proforma.icon,
      bg: dc.kpi.proforma.bg,
      deltaColor: dc.kpi.proforma.text,
    },
    {
      icon: 'cube-outline' as const,
      label: 'Unidades',
      value: String(totals.totalProductsCount),
      delta: 'En cotización',
      color: dc.kpi.units.icon,
      bg: dc.kpi.units.bg,
      deltaColor: dc.kpi.units.text,
    },
    {
      icon: 'account-group' as const,
      label: 'Clientes',
      value: String(clients.length),
      delta: selectedClient?.name.split(' ')[0] || '—',
      color: dc.kpi.clients.icon,
      bg: dc.kpi.clients.bg,
      deltaColor: dc.kpi.clients.text,
    },
    {
      icon: 'view-grid' as const,
      label: 'Catálogo',
      value: String(mockProducts.length),
      delta: `${catalogCategories.length} líneas`,
      color: dc.kpi.catalog.icon,
      bg: dc.kpi.catalog.bg,
      deltaColor: dc.kpi.catalog.text,
    },
    {
      icon: 'alert-circle-outline' as const,
      label: 'Stock bajo',
      value: String(lowStockMaterials.length),
      delta: lowStockMaterials.length > 0 ? 'Revisar' : 'Todo OK',
      color:
        lowStockMaterials.length > 0 ? dc.kpi.stockLow.icon : dc.kpi.stockOk.icon,
      bg: lowStockMaterials.length > 0 ? dc.kpi.stockLow.bg : dc.kpi.stockOk.bg,
      deltaColor:
        lowStockMaterials.length > 0 ? dc.kpi.stockLow.text : dc.kpi.stockOk.text,
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        styles.contentFill,
        isDesktop && styles.contentDesktop,
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Hero ── */}
      <View style={styles.hero}>
        <View style={styles.heroAccentBar} />
        <View style={styles.heroLeft}>
          <Text style={styles.heroGreet}>Bienvenido</Text>
          <Text style={styles.heroTitle}>Panel de Control</Text>
          <Text style={styles.heroSub} numberOfLines={2}>
            {quoteNumber}
            {selectedClient ? ` · ${selectedClient.name}` : ''}
          </Text>
        </View>
        <View style={styles.heroRight}>
          <View style={styles.heroDatePill}>
            <Text style={styles.heroDateLabel}>Hoy</Text>
            <Text style={styles.heroDate}>
              {new Date().toLocaleDateString('es-EC', {
                day: 'numeric',
                month: 'short',
              })}
            </Text>
          </View>
        </View>
      </View>

      {/* ── KPI Grid ── */}
      <View style={[styles.kpiGrid, isWide && styles.kpiGridWide]}>
        {kpiItems.map((kpi, index) => (
          <View
            key={kpi.label}
            style={[
              styles.kpiCard,
              isWide ? styles.kpiCardWide : styles.kpiCardMobile,
              !isWide && index === kpiItems.length - 1 && styles.kpiCardLast,
            ]}
          >
            <View style={[styles.kpiIcon, { backgroundColor: kpi.bg }]}>
              <MaterialCommunityIcons name={kpi.icon} size={22} color={kpi.color} />
            </View>
            <View style={styles.kpiBody}>
              <Text style={styles.kpiLabel}>{kpi.label}</Text>
              <Text style={styles.kpiValue} numberOfLines={1}>
                {kpi.value}
              </Text>
              <Text style={[styles.kpiDelta, { color: kpi.deltaColor }]} numberOfLines={1}>
                {kpi.delta}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.bodyFill}>
      {/* ── Charts Row ── */}
      <View style={[styles.chartsRow, isWide && styles.chartsRowWide, isWide && styles.chartsRowGrow]}>
        {/* Composición proforma */}
        <View style={[styles.chartCard, isWide && styles.chartHalf]}>
          <View style={styles.chartHeader}>
            <MaterialCommunityIcons name="chart-donut" size={18} color={dc.headerIcon} />
            <Text style={styles.chartTitle}>Composición de costos</Text>
          </View>
          {totals.totalDemo > 0 ? (
            <DonutChart
              segments={proformaDonut}
              centerValue={formatMoney(totals.totalDemo)}
              centerLabel="Total"
              size={isWide ? 150 : 130}
            />
          ) : (
            <View style={styles.chartEmpty}>
              <DonutChart
                segments={[
                  { label: 'Sin datos', value: 1, color: dc.border },
                ]}
                centerValue="$0"
                centerLabel="Agrega productos"
                size={110}
              />
            </View>
          )}
        </View>

        {/* Catálogo por categoría */}
        <View style={[styles.chartCard, isWide && styles.chartHalf]}>
          <View style={styles.chartHeader}>
            <MaterialCommunityIcons name="chart-bar" size={18} color={dc.headerIcon} />
            <Text style={styles.chartTitle}>Productos por categoría</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <BarChart data={categoryBarData} height={chartHeight} barWidth={isWide ? 36 : 28} gridColor={dc.chart.grid} />
          </ScrollView>
        </View>
      </View>

      {/* ── Second charts row ── */}
      <View style={[styles.chartsRow, isWide && styles.chartsRowWide, isWide && styles.chartsRowGrow]}>
        {/* Tendencia semanal */}
        <View style={[styles.chartCard, isWide && styles.chartHalf]}>
          <View style={styles.chartHeader}>
            <MaterialCommunityIcons name="chart-line" size={18} color={dc.headerIcon} />
            <Text style={styles.chartTitle}>Actividad semanal</Text>
            <View style={styles.chartBadge}>
              <Text style={styles.chartBadgeText}>Demo</Text>
            </View>
          </View>
          <AreaChart labels={trendLabels} values={trendValues} height={chartHeight} color={dc.chart.trend} gridColor={dc.chart.grid} />
          <Text style={styles.chartFootnote}>
            Valor estimado de proformas · últimos 7 días
          </Text>
        </View>

        {/* Salud inventario */}
        <View style={[styles.chartCard, isWide && styles.chartHalf]}>
          <View style={styles.chartHeader}>
            <MaterialCommunityIcons name="warehouse" size={18} color={dc.headerIcon} />
            <Text style={styles.chartTitle}>Salud del inventario</Text>
          </View>
          <StockGauge
            healthyCount={healthyStockCount}
            totalCount={mockMaterials.length}
            lowCount={lowStockMaterials.length}
            size={gaugeSize}
          />
          {lowStockMaterials.length > 0 && (
            <TouchableOpacity
              onPress={() => onNavigate('settings')}
              style={styles.alertLink}
            >
              <Text style={styles.alertLinkText}>
                Ver {lowStockMaterials.length} insumos con stock bajo →
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ── Proforma + Materiales ── */}
      <View style={[styles.bottomRow, isWide && styles.bottomRowWide, styles.bottomRowFill]}>
        <View style={[styles.panel, isWide && styles.panelWide, styles.panelFill]}>
          <View style={styles.panelHeader}>
            <MaterialCommunityIcons name="clipboard-list-outline" size={18} color={dc.headerIcon} />
            <Text style={styles.panelTitle}>Proforma activa</Text>
            {items.length > 0 && (
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{items.length}</Text>
              </View>
            )}
          </View>

          {items.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <MaterialCommunityIcons name="clipboard-plus-outline" size={32} color={dc.accent} />
              </View>
              <Text style={styles.emptyTitle}>Sin productos cotizados</Text>
              <Text style={styles.emptyDesc}>
                Selecciona productos del catálogo para generar la proforma.
              </Text>
              <TouchableOpacity
                style={styles.ctaBtn}
                onPress={() => onNavigate('catalog')}
              >
                <Text style={styles.ctaBtnText}>Ir al catálogo</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {items.slice(0, 3).map((item) => (
                <View key={item.id} style={styles.quoteRow}>
                  <View style={styles.quoteRowLeft}>
                    <Text style={styles.quoteCode}>{item.product.code}</Text>
                    <Text style={styles.quoteName} numberOfLines={1}>
                      {item.product.name}
                    </Text>
                    <Text style={styles.quoteMeta}>
                      {item.widthCm}×{item.heightCm} cm · ×{item.quantity}
                    </Text>
                  </View>
                  <Text style={styles.quotePrice}>
                    {formatMoneyFull(item.subtotalDemo)}
                  </Text>
                </View>
              ))}
              <TouchableOpacity
                style={styles.viewAllBtn}
                onPress={() => onNavigate('catalog')}
              >
                <Text style={styles.viewAllText}>Ver proforma completa</Text>
                <MaterialCommunityIcons name="arrow-right" size={16} color={dc.accentLink} />
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={[styles.panel, isWide && styles.panelWide, styles.panelFill]}>
          <View style={styles.panelHeader}>
            <MaterialCommunityIcons name="format-list-bulleted" size={18} color={dc.headerIcon} />
            <Text style={styles.panelTitle}>
              {consolidatedMaterials.length > 0
                ? 'Top materiales requeridos'
                : 'Stock destacado'}
            </Text>
          </View>
          {topMaterials.map((mat) => {
            const pct = (mat.totalQuantity / maxMaterialQty) * 100;
            return (
              <View key={mat.materialId} style={styles.hBarRow}>
                <Text style={styles.hBarLabel} numberOfLines={1}>
                  {mat.materialName}
                </Text>
                <View style={styles.hBarTrack}>
                  <View
                    style={[
                      styles.hBarFill,
                      {
                        width: `${pct}%`,
                        backgroundColor:
                          consolidatedMaterials.length > 0
                            ? dc.bar.primary
                            : dc.bar.secondary,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.hBarVal}>
                  {mat.totalQuantity.toFixed(1)} {mat.unit}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: dc.background,
  },
  content: {
    padding: spacing.md,
    paddingTop: spacing.sm,
  },
  contentFill: {
    flexGrow: 1,
    ...Platform.select({
      web: { minHeight: '100%' as unknown as number },
      default: {},
    }),
  },
  contentDesktop: {
    maxWidth: 1140,
    alignSelf: 'center',
    width: '100%',
  },

  /* Hero */
  hero: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: dc.hero,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: dc.border,
    overflow: 'hidden',
    ...shadows.sm,
  },
  heroAccentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: dc.heroAccent,
    opacity: 0.65,
  },
  heroLeft: {
    flex: 1,
    marginRight: spacing.md,
  },
  heroGreet: {
    fontSize: typography.fontSizes.sm,
    color: dc.heroTextMuted,
    marginBottom: 2,
  },
  heroTitle: {
    fontSize: typography.fontSizes['2xl'],
    fontWeight: typography.fontWeights.heavy,
    color: dc.heroText,
    marginBottom: 6,
  },
  heroSub: {
    fontSize: typography.fontSizes.xs,
    color: dc.heroTextMuted,
    lineHeight: 18,
  },
  heroRight: {
    alignItems: 'flex-end',
  },
  heroDatePill: {
    backgroundColor: dc.heroDateBg,
    borderWidth: 1,
    borderColor: dc.heroDateBorder,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    alignItems: 'center',
    gap: 2,
  },
  heroDateLabel: {
    fontSize: typography.fontSizes.xs,
    color: dc.heroDateLabel,
    fontWeight: typography.fontWeights.semibold,
  },
  heroDate: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: dc.heroText,
  },

  /* KPI grid */
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  kpiGridWide: {
    flexWrap: 'nowrap',
  },
  kpiCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: dc.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: dc.borderLight,
    gap: spacing.sm,
    ...shadows.sm,
  },
  kpiCardMobile: {
    flexBasis: '48%',
    flexGrow: 1,
    maxWidth: '48%',
  },
  kpiCardWide: {
    flex: 1,
    minWidth: 0,
  },
  kpiCardLast: {
    flexBasis: '100%',
    maxWidth: '100%',
  },
  kpiBody: {
    flex: 1,
    minWidth: 0,
  },
  kpiIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  kpiLabel: {
    fontSize: typography.fontSizes.xs,
    color: dc.text.muted,
    marginBottom: 2,
  },
  kpiValue: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.heavy,
    color: dc.text.primary,
  },
  kpiDelta: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.semibold,
    marginTop: 2,
  },

  bodyFill: {
    flex: 1,
    justifyContent: 'space-between',
    gap: spacing.sm,
  },

  /* Charts */
  chartsRow: {
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  chartsRowWide: {
    flexDirection: 'row',
  },
  chartsRowGrow: {
    flex: 1,
  },
  chartCard: {
    backgroundColor: dc.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: dc.borderLight,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  chartHalf: {
    flex: 1,
    marginBottom: 0,
    minHeight: 0,
    justifyContent: 'space-between',
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: spacing.md,
  },
  chartTitle: {
    flex: 1,
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.bold,
    color: dc.text.primary,
  },
  chartBadge: {
    backgroundColor: dc.chart.badge,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  chartBadgeText: {
    fontSize: typography.fontSizes.xs,
    color: dc.chart.badgeText,
    fontWeight: typography.fontWeights.bold,
  },
  chartEmpty: {
    alignItems: 'center',
    opacity: 0.7,
  },
  chartFootnote: {
    fontSize: typography.fontSizes.xs,
    color: dc.text.light,
    marginTop: 6,
    textAlign: 'center',
  },
  alertLink: {
    marginTop: spacing.sm,
  },
  alertLinkText: {
    fontSize: typography.fontSizes.sm,
    color: dc.kpi.stockLow.icon,
    fontWeight: typography.fontWeights.semibold,
  },

  /* Bottom panels */
  bottomRow: {
    gap: spacing.sm,
  },
  bottomRowWide: {
    flexDirection: 'row',
  },
  bottomRowFill: {
    flex: 1,
    minHeight: 220,
  },
  panel: {
    backgroundColor: dc.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: dc.borderLight,
    ...shadows.sm,
  },
  panelWide: {
    flex: 1,
    marginBottom: 0,
  },
  panelFill: {
    flex: 1,
    minHeight: 200,
    justifyContent: 'flex-start',
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: spacing.md,
  },
  panelTitle: {
    flex: 1,
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.bold,
    color: dc.text.primary,
  },
  countBadge: {
    backgroundColor: dc.accentBright,
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  countBadgeText: {
    fontSize: typography.fontSizes.xs,
    color: dc.text.primary,
    fontWeight: typography.fontWeights.bold,
  },

  /* Empty state */
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    gap: 8,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: dc.kpi.proforma.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.bold,
    color: dc.text.primary,
  },
  emptyDesc: {
    fontSize: typography.fontSizes.sm,
    color: dc.text.muted,
    textAlign: 'center',
    maxWidth: 240,
  },
  ctaBtn: {
    backgroundColor: dc.accentBright,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    marginTop: spacing.sm,
  },
  ctaBtnText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold,
    color: dc.text.primary,
  },

  /* Quote rows */
  quoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: dc.borderLight,
  },
  quoteRowLeft: {
    flex: 1,
    marginRight: spacing.sm,
  },
  quoteCode: {
    fontSize: typography.fontSizes.xs,
    color: dc.accentLink,
    fontWeight: typography.fontWeights.bold,
  },
  quoteName: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.semibold,
    color: dc.text.primary,
  },
  quoteMeta: {
    fontSize: typography.fontSizes.xs,
    color: dc.text.muted,
  },
  quotePrice: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold,
    color: dc.text.primary,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingTop: spacing.md,
  },
  viewAllText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold,
    color: dc.accentLink,
  },

  /* Horizontal bars */
  hBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  hBarLabel: {
    width: 90,
    fontSize: typography.fontSizes.xs,
    color: dc.text.secondary,
  },
  hBarTrack: {
    flex: 1,
    height: 8,
    backgroundColor: dc.borderLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  hBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  hBarVal: {
    width: 52,
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold,
    color: dc.text.primary,
    textAlign: 'right',
  },
});
