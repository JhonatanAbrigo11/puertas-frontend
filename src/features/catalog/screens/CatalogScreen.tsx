import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Category, CategoryId } from '../../../core/domain/entities/Category';
import { Product } from '../../../core/domain/entities/Product';
import { Quote } from '../../../core/domain/entities/Quote';
import { mockProducts } from '../../../data/mock/products';
import { Sidebar } from '../components/Sidebar';
import { ProductDetailView } from '../components/ProductDetailView';
import { QuoteItemCard } from '../../quote/components/QuoteItemCard';
import { Button } from '../../../shared/components/Button';
import { useResponsive } from '../../../shared/hooks/useResponsive';
import { colors } from '../../../shared/theme/colors';
import { typography } from '../../../shared/theme/typography';
import { borderRadius, spacing } from '../../../shared/theme/spacing';
import { useQuote } from '../../quote/context/QuoteContext';
import { consolidateMaterials } from '../../../core/domain/services/materialConsolidator';
import { generateAndDownloadPdf } from '../../../core/domain/services/pdfGenerator';

interface CatalogScreenProps {
  isMobileSidebarOpen?: boolean;
  onCloseMobileSidebar?: () => void;
}

export const CatalogScreen: React.FC<CatalogScreenProps> = ({
  isMobileSidebarOpen = false,
  onCloseMobileSidebar,
}) => {
  const { isTablet, isDesktop } = useResponsive();
  const {
    items,
    totals,
    removeItem,
    updateItemQuantity,
    clearQuote,
    customer,
    clients,
    selectedClientId,
    selectClient,
    quoteNumber,
    consolidatedMaterials,
  } = useQuote();
  const [selectedCategoryId, setSelectedCategoryId] =
    useState<CategoryId>('ventanas');
  const [selectedProduct, setSelectedProduct] = useState<Product>(
    mockProducts[0]
  );
  const [mobileDrawerVisible, setMobileDrawerVisible] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [showQuotesView, setShowQuotesView] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isClientSelectorOpen, setIsClientSelectorOpen] = useState(false);
  const selectedClient =
    clients.find((client) => client.id === selectedClientId) || null;

  const handleSelectCategory = (cat: Category) => {
    setSelectedCategoryId(cat.id);
    const firstProd =
      cat.id === 'all'
        ? mockProducts[0]
        : mockProducts.find((p) => p.categoryId === cat.id);
    if (firstProd) {
      setSelectedProduct(firstProd);
    }
  };

  const handleSelectProduct = (prod: Product) => {
    setSelectedProduct(prod);
    setShowQuotesView(false);
    // Automatically collapse sidebar when product is chosen so workspace has maximum space
    setIsSidebarCollapsed(true);
    setMobileDrawerVisible(false);
    if (onCloseMobileSidebar) {
      onCloseMobileSidebar();
    }
  };

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

  // Tablet & Desktop Split View Layout
  if (isTablet || isDesktop) {
    return (
      <View style={styles.container}>
        {/* Left Collapsible Sidebar */}
        <View
          style={[
            styles.sidebarWrapper,
            isSidebarCollapsed
              ? styles.sidebarWrapperCollapsed
              : styles.sidebarWrapperExpanded,
          ]}
        >
          <Sidebar
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={handleSelectCategory}
            selectedProduct={selectedProduct}
            onSelectProduct={handleSelectProduct}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
        </View>

        {/* Right Main Content Area */}
        <View style={styles.mainContentWrapper}>
          {isSidebarCollapsed && (
            <View style={styles.topToolbar}>
              <TouchableOpacity
                style={styles.expandCatalogBtn}
                onPress={() => setIsSidebarCollapsed(false)}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons
                  name="format-list-bulleted"
                  size={16}
                  color="#2563EB"
                />
                <Text style={styles.expandCatalogText}>
                  Selección de Productos
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cartTabButton}
                onPress={() => setShowQuotesView(true)}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons
                  name="cart-outline"
                  size={14}
                  color="#FE4648"
                />
                <Text style={styles.cartTabText}>Cotizaciones</Text>
                {items.length > 0 && (
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>
                      {items.length > 99 ? '99+' : items.length}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          )}

          {showQuotesView ? (
            <ScrollView
              style={styles.quotesInlineContainer}
              contentContainerStyle={styles.quotesInlineContent}
            >
              <View style={styles.quotesInlineHeader}>
                <Text style={styles.quotesInlineTitle}>
                  Productos en el Carrito ({items.length})
                </Text>
                <TouchableOpacity
                  style={styles.backToCatalogBtn}
                  onPress={() => setShowQuotesView(false)}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons
                    name="arrow-left"
                    size={14}
                    color={colors.primary}
                  />
                  <Text style={styles.backToCatalogText}>Volver al catálogo</Text>
                </TouchableOpacity>
              </View>

              {items.length === 0 ? (
                <View style={styles.emptySelection}>
                  <Text style={styles.quotesEmptyText}>
                    No hay cotizaciones en el carrito todavía.
                  </Text>
                </View>
              ) : (
                <>
                  {items.map((item, index) => (
                    <QuoteItemCard
                      key={item.id}
                      item={item}
                      index={index}
                      onUpdateQuantity={(newQty) =>
                        updateItemQuantity(item.id, newQty)
                      }
                      onRemove={() => removeItem(item.id)}
                      onDownloadPdf={() => handleDownloadItemPdf(item)}
                    />
                  ))}

                  <View style={styles.quoteActionsRow}>
                    <Button
                      title="Vaciar Carrito"
                      onPress={clearQuote}
                      variant="outline"
                      size="md"
                    />
                    <Button
                      title={
                        isGeneratingPdf
                          ? 'GENERANDO PDF...'
                          : `Descargar Proforma PDF ($${totals.totalDemo.toFixed(2)})`
                      }
                      onPress={() => setIsClientSelectorOpen(true)}
                      loading={isGeneratingPdf}
                      disabled={isGeneratingPdf}
                      variant="primary"
                      size="md"
                    />
                  </View>
                </>
              )}
            </ScrollView>
          ) : selectedProduct ? (
            <ProductDetailView product={selectedProduct} />
          ) : (
            <View style={styles.emptySelection}>
              <Text>Selecciona un producto del panel izquierdo</Text>
            </View>
          )}
        </View>

        <Modal
          visible={isClientSelectorOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setIsClientSelectorOpen(false)}
        >
          <View style={styles.selectorOverlay}>
            <View style={styles.selectorCard}>
              <View style={styles.selectorHeader}>
                <Text style={styles.selectorTitle}>Seleccionar cliente</Text>
                <TouchableOpacity
                  onPress={() => setIsClientSelectorOpen(false)}
                  style={styles.closeButton}
                >
                  <MaterialCommunityIcons
                    name="close"
                    size={20}
                    color={colors.textPrimary}
                  />
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.selectorList}
                contentContainerStyle={styles.selectorListContent}
              >
                {clients.map((client) => {
                  const isCurrentClient = client.id === selectedClientId;
                  return (
                    <TouchableOpacity
                      key={client.id}
                      style={[
                        styles.selectorItem,
                        isCurrentClient && styles.selectorItemActive,
                      ]}
                      onPress={() => {
                        selectClient(client.id);
                      }}
                      activeOpacity={0.8}
                    >
                      <View style={styles.selectorItemInfo}>
                        <Text style={styles.selectorItemName}>{client.name || 'Sin nombre'}</Text>
                        <Text style={styles.selectorItemMeta}>
                          {client.phone || client.email || 'Sin contacto'}
                        </Text>
                      </View>
                      {isCurrentClient && (
                        <MaterialCommunityIcons
                          name="check-circle"
                          size={20}
                          color={colors.primary}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <View style={styles.selectorActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setIsClientSelectorOpen(false)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => {
                    setIsClientSelectorOpen(false);
                    handleDownloadPdf();
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.saveButtonText}>Generar Proforma</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  // Mobile Adaptive Layout
  return (
    <View style={styles.mobileContainer}>
      {/* Mobile Top Sub-bar with Product Switcher button */}
      <View style={styles.mobileBar}>
        <TouchableOpacity
          style={styles.mobileProductPickerButton}
          onPress={() => setMobileDrawerVisible(true)}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="layers-outline"
            size={18}
            color={colors.primary}
          />
          <Text style={styles.mobileProductPickerText} numberOfLines={1}>
            {selectedProduct.name}
          </Text>
          <View style={styles.changeBadge}>
            <Text style={styles.changeBadgeText}>Cambiar</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.mobileMainContent}>
        {selectedProduct && <ProductDetailView product={selectedProduct} />}
      </View>

      {/* Mobile Modal Drawer */}
      <Modal
        visible={mobileDrawerVisible || isMobileSidebarOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setMobileDrawerVisible(false);
          if (onCloseMobileSidebar) onCloseMobileSidebar();
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selección de Productos</Text>
              <TouchableOpacity
                onPress={() => {
                  setMobileDrawerVisible(false);
                  if (onCloseMobileSidebar) onCloseMobileSidebar();
                }}
                style={styles.closeButton}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={colors.textPrimary}
                />
              </TouchableOpacity>
            </View>

            {/* Sidebar inside modal */}
            <View style={styles.modalSidebarWrapper}>
              <Sidebar
                selectedCategoryId={selectedCategoryId}
                onSelectCategory={handleSelectCategory}
                selectedProduct={selectedProduct}
                onSelectProduct={handleSelectProduct}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
  },
  sidebarWrapper: {
    height: '100%',
    transitionProperty: 'width',
    transitionDuration: '200ms',
  } as any,
  sidebarWrapperExpanded: {
    width: 280,
  },
  sidebarWrapperCollapsed: {
    width: 64,
  },
  mainContentWrapper: {
    flex: 1,
    height: '100%',
  },
  topToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    gap: 8,
  },
  expandCatalogBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 6,
  },
  expandCatalogText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  cartTabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    backgroundColor: '#EFF6FF',
  },
  cartTabText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FE4648',
  },
  cartBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 11,
  },
  quotesInlineContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  quotesInlineContent: {
    padding: spacing.md,
    gap: spacing.md,
  },
  quotesInlineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  quotesInlineTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.heavy,
    color: colors.textPrimary,
  },
  backToCatalogBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    borderRadius: borderRadius.md,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  backToCatalogText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold,
    color: colors.primary,
  },
  quotesEmptyText: {
    fontSize: typography.fontSizes.sm,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
  quoteItemRow: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
  },
  quoteItemTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: 4,
  },
  quoteItemIndex: {
    fontSize: typography.fontSizes.xs,
    color: colors.primary,
    fontWeight: typography.fontWeights.heavy,
  },
  quoteItemName: {
    flex: 1,
    fontSize: typography.fontSizes.sm,
    color: colors.textPrimary,
    fontWeight: typography.fontWeights.bold,
  },
  quoteItemMeta: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
  },
  quoteItemPrice: {
    marginTop: 2,
    fontSize: typography.fontSizes.xs,
    color: colors.primary,
    fontWeight: typography.fontWeights.bold,
  },
  quoteActionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  selectorOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  selectorCard: {
    width: '100%',
    maxWidth: 520,
    maxHeight: '75%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    overflow: 'hidden',
  },
  selectorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  selectorTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.heavy,
    color: colors.textPrimary,
  },
  selectorList: {
    flexGrow: 0,
  },
  selectorListContent: {
    padding: spacing.md,
    gap: spacing.sm,
    paddingBottom: spacing.sm,
  },
  selectorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
  },
  selectorItemActive: {
    borderColor: colors.primaryBorder,
    backgroundColor: colors.primaryTint,
  },
  selectorItemInfo: {
    flex: 1,
  },
  selectorItemName: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
  },
  selectorItemMeta: {
    marginTop: 2,
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
  },
  selectorActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    backgroundColor: colors.surface,
  },
  emptySelection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mobileBar: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  mobileProductPickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryTint,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    gap: spacing.sm,
  },
  mobileProductPickerText: {
    flex: 1,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold,
    color: colors.primary,
  },
  changeBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  changeBadgeText: {
    fontSize: typography.fontSizes.xs,
    color: '#FFFFFF',
    fontWeight: typography.fontWeights.bold,
  },
  mobileMainContent: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    height: '85%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  modalTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  modalSidebarWrapper: {
    flex: 1,
  },
});
