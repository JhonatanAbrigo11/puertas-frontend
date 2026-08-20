import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Text,
  ScrollView,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Category, CategoryId } from '../../../core/domain/entities/Category';
import { Product } from '../../../core/domain/entities/Product';
import { Quote } from '../../../core/domain/entities/Quote';
import { mockProducts } from '../../../data/mock/products';
import { Sidebar } from '../components/Sidebar';
import { ProductDetailView } from '../components/ProductDetailView';
import { QuoteItemCard } from '../../quote/components/QuoteItemCard';
import { ConsolidatedMaterialsSummary } from '../../quote/components/ConsolidatedMaterialsSummary';
import { Button } from '../../../shared/components/Button';
import { useResponsive } from '../../../shared/hooks/useResponsive';
import { colors } from '../../../shared/theme/colors';
import { typography } from '../../../shared/theme/typography';
import { borderRadius, spacing } from '../../../shared/theme/spacing';
import { shadows } from '../../../shared/theme/shadows';
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

  const [activeSubTab, setActiveSubTab] = useState<'products' | 'quotes'>('products');
  const [selectedCategoryId, setSelectedCategoryId] =
    useState<CategoryId>('ventanas');
  const [selectedProduct, setSelectedProduct] = useState<Product>(
    mockProducts[0]
  );
  const [mobileDrawerVisible, setMobileDrawerVisible] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
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
    setActiveSubTab('products');
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

  // Reusable Segmented Tabs Header
  const renderSegmentedTabs = () => (
    <View style={styles.topTabBar}>
      <View style={styles.segmentedContainer}>
        {/* Tab 1: Selección de Productos */}
        <TouchableOpacity
          style={[
            styles.segmentButton,
            activeSubTab === 'products' && styles.segmentButtonActive,
          ]}
          onPress={() => setActiveSubTab('products')}
          activeOpacity={0.8}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeSubTab === 'products' }}
        >
          <Text
            style={[
              styles.segmentButtonText,
              activeSubTab === 'products' && styles.segmentButtonTextActive,
            ]}
          >
            Selección de Productos
          </Text>
        </TouchableOpacity>

        {/* Tab 2: Cotización */}
        <TouchableOpacity
          style={[
            styles.segmentButton,
            activeSubTab === 'quotes' && styles.segmentButtonActive,
          ]}
          onPress={() => setActiveSubTab('quotes')}
          activeOpacity={0.8}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeSubTab === 'quotes' }}
        >
          <Text
            style={[
              styles.segmentButtonText,
              activeSubTab === 'quotes' && styles.segmentButtonTextActive,
            ]}
          >
            Cotización
          </Text>
        </TouchableOpacity>
      </View>

      {/* Right Sun / Theme Toggle Button */}
      <TouchableOpacity style={styles.sunToggleBtn} activeOpacity={0.8}>
        <MaterialCommunityIcons
          name="white-balance-sunny"
          size={18}
          color="#111827"
        />
      </TouchableOpacity>
    </View>
  );

  // Full-width Cotizaciones Screen Content
  const renderQuotesView = () => {
    return (
      <ScrollView
        style={styles.quotesContainer}
        contentContainerStyle={styles.quotesContent}
        showsVerticalScrollIndicator={true}
      >
        {/* Header Row with Title & Quick Info */}
        <View style={styles.quotesHeaderCard}>
          <View style={styles.quotesHeaderLeft}>
            <View style={styles.quotesIconBubble}>
              <MaterialCommunityIcons
                name="clipboard-text"
                size={22}
                color="#0F4C81"
              />
            </View>
            <View>
              <View style={styles.quoteNumberRow}>
                <Text style={styles.quotesHeaderTitle}>Proforma & Cotización</Text>
                <View style={styles.quoteCodeBadge}>
                  <Text style={styles.quoteCodeText}>{quoteNumber}</Text>
                </View>
              </View>
              <Text style={styles.quotesHeaderSubtitle}>
                {items.length === 0
                  ? 'No hay productos en la cotización'
                  : `${items.length} ${
                      items.length === 1 ? 'producto configurado' : 'productos configurados'
                    } (${totals.totalProductsCount} unidades)`}
              </Text>
            </View>
          </View>

          {/* Client Selector Button */}
          <TouchableOpacity
            style={styles.clientSelectorTrigger}
            onPress={() => setIsClientSelectorOpen(true)}
            activeOpacity={0.8}
          >
            <View style={styles.clientTriggerInfo}>
              <Text style={styles.clientTriggerLabel}>CLIENTE DESTINO</Text>
              <Text style={styles.clientTriggerName} numberOfLines={1}>
                {selectedClient ? selectedClient.name : 'Seleccionar cliente...'}
              </Text>
            </View>
            <MaterialCommunityIcons
              name="account-edit-outline"
              size={20}
              color="#0F4C81"
            />
          </TouchableOpacity>
        </View>

        {items.length === 0 ? (
          /* Empty State */
          <View style={styles.emptyQuoteCard}>
            <View style={styles.emptyIconCircle}>
              <MaterialCommunityIcons
                name="cart-off"
                size={48}
                color="#94A3B8"
              />
            </View>
            <Text style={styles.emptyQuoteTitle}>Tu cotización está vacía</Text>
            <Text style={styles.emptyQuoteSub}>
              Configura tus ventanas, puertas o divisiones en la pestaña de Selección de Productos y agrégalas aquí para emitir tu proforma.
            </Text>
            <TouchableOpacity
              style={styles.goToProductsBtn}
              onPress={() => setActiveSubTab('products')}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name="layers-plus"
                size={18}
                color="#FFFFFF"
              />
              <Text style={styles.goToProductsBtnText}>
                Ir a Selección de Productos
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Full Quote Content with KPIs, Items, Consolidated Materials & Actions */
          <>
            {/* Financial KPI Summary Cards */}
            <View style={styles.kpiCardsRow}>
              {/* Total Products */}
              <View style={styles.kpiCardItem}>
                <View style={styles.kpiIconWrapper}>
                  <MaterialCommunityIcons
                    name="package-variant-closed"
                    size={20}
                    color="#0F4C81"
                  />
                </View>
                <View style={styles.kpiTextGroup}>
                  <Text style={styles.kpiLabel}>Total Unidades</Text>
                  <Text style={styles.kpiValue}>
                    {totals.totalProductsCount}{' '}
                    <Text style={styles.kpiSubValue}>({totals.itemCount} items)</Text>
                  </Text>
                </View>
              </View>

              {/* Subtotal Materials */}
              <View style={styles.kpiCardItem}>
                <View style={styles.kpiIconWrapper}>
                  <MaterialCommunityIcons
                    name="hammer-wrench"
                    size={20}
                    color="#0284C7"
                  />
                </View>
                <View style={styles.kpiTextGroup}>
                  <Text style={styles.kpiLabel}>Subtotal Insumos</Text>
                  <Text style={styles.kpiValue}>
                    ${totals.subtotalMaterialsDemo.toFixed(2)}
                  </Text>
                </View>
              </View>

              {/* Estimated Labor */}
              <View style={styles.kpiCardItem}>
                <View style={styles.kpiIconWrapper}>
                  <MaterialCommunityIcons
                    name="account-hard-hat-outline"
                    size={20}
                    color="#059669"
                  />
                </View>
                <View style={styles.kpiTextGroup}>
                  <Text style={styles.kpiLabel}>Mano de Obra Estimada</Text>
                  <Text style={styles.kpiValue}>
                    ${totals.estimatedLaborDemo.toFixed(2)}
                  </Text>
                </View>
              </View>

              {/* Grand Total Highlight */}
              <View style={[styles.kpiCardItem, styles.kpiCardHighlight]}>
                <View
                  style={[
                    styles.kpiIconWrapper,
                    styles.kpiIconWrapperHighlight,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="cash-check"
                    size={22}
                    color="#FFFFFF"
                  />
                </View>
                <View style={styles.kpiTextGroup}>
                  <Text style={styles.kpiLabelHighlight}>TOTAL PROFORMA</Text>
                  <Text style={styles.kpiValueHighlight}>
                    ${totals.totalDemo.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Main Action Buttons */}
            <View style={styles.topActionsBar}>
              <TouchableOpacity
                style={styles.clearCartButton}
                onPress={clearQuote}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons
                  name="trash-can-outline"
                  size={16}
                  color={colors.danger}
                />
                <Text style={styles.clearCartText}>Vaciar Carrito</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.downloadPdfButton,
                  isGeneratingPdf && styles.btnDisabled,
                ]}
                onPress={() => setIsClientSelectorOpen(true)}
                disabled={isGeneratingPdf}
                activeOpacity={0.85}
              >
                <MaterialCommunityIcons
                  name="file-pdf-box"
                  size={20}
                  color="#FFFFFF"
                />
                <Text style={styles.downloadPdfButtonText}>
                  {isGeneratingPdf
                    ? 'GENERANDO PDF...'
                    : `Descargar Proforma PDF ($${totals.totalDemo.toFixed(2)})`}
                </Text>
              </TouchableOpacity>
            </View>

            {/* List of Configured Products */}
            <View style={styles.quoteItemsSection}>
              <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionTitleText}>
                  PRODUCTOS EN LA COTIZACIÓN ({items.length})
                </Text>
                <TouchableOpacity
                  style={styles.addMoreLink}
                  onPress={() => setActiveSubTab('products')}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons
                    name="plus-circle-outline"
                    size={16}
                    color="#2563EB"
                  />
                  <Text style={styles.addMoreLinkText}>Configurar más productos</Text>
                </TouchableOpacity>
              </View>

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
            </View>

            {/* Consolidated Materials Breakdown Table */}
            <ConsolidatedMaterialsSummary materials={consolidatedMaterials} />

            {/* Bottom Actions Bar */}
            <View style={styles.bottomActionsBar}>
              <TouchableOpacity
                style={styles.clearCartButton}
                onPress={clearQuote}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons
                  name="trash-can-outline"
                  size={16}
                  color={colors.danger}
                />
                <Text style={styles.clearCartText}>Vaciar Carrito</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.downloadPdfButton,
                  isGeneratingPdf && styles.btnDisabled,
                ]}
                onPress={() => setIsClientSelectorOpen(true)}
                disabled={isGeneratingPdf}
                activeOpacity={0.85}
              >
                <MaterialCommunityIcons
                  name="file-pdf-box"
                  size={20}
                  color="#FFFFFF"
                />
                <Text style={styles.downloadPdfButtonText}>
                  {isGeneratingPdf
                    ? 'GENERANDO PDF...'
                    : `Descargar Proforma PDF ($${totals.totalDemo.toFixed(2)})`}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    );
  };

  // Tablet & Desktop Split / Full-Width Layout
  if (isTablet || isDesktop) {
    return (
      <View style={styles.screenContainer}>
        {/* Top Segmented Tab Navigation Header (Full Width) */}
        {renderSegmentedTabs()}

        {/* Tab Content */}
        {activeSubTab === 'quotes' ? (
          <View style={styles.quotesTabWrapper}>
            {renderQuotesView()}
          </View>
        ) : (
          <View style={styles.productsTabWrapper}>
            {/* Left Collapsible Sidebar: INSIDE 'Selección de Productos' tab */}
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

            {/* Product Detail Area */}
            <View style={styles.productDetailWrapper}>
              {selectedProduct ? (
                <ProductDetailView product={selectedProduct} />
              ) : (
                <View style={styles.emptySelection}>
                  <Text>Selecciona un producto del panel izquierdo</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Client Selector Modal */}
        <Modal
          visible={isClientSelectorOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setIsClientSelectorOpen(false)}
        >
          <View style={styles.selectorOverlay}>
            <View style={styles.selectorCard}>
              <View style={styles.selectorHeader}>
                <View style={styles.selectorTitleRow}>
                  <MaterialCommunityIcons
                    name="account-search-outline"
                    size={20}
                    color="#0F4C81"
                  />
                  <Text style={styles.selectorTitle}>Seleccionar Cliente Destino</Text>
                </View>
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
                        <Text style={styles.selectorItemName}>
                          {client.name || 'Sin nombre'}
                        </Text>
                        <Text style={styles.selectorItemMeta}>
                          {client.phone || client.email || 'Sin contacto'}
                        </Text>
                        {!!client.address && (
                          <Text style={styles.selectorItemAddress} numberOfLines={1}>
                            {client.address}
                          </Text>
                        )}
                      </View>
                      {isCurrentClient && (
                        <MaterialCommunityIcons
                          name="check-circle"
                          size={22}
                          color="#0F4C81"
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
                  <Text style={styles.cancelButtonText}>Cerrar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => {
                    setIsClientSelectorOpen(false);
                    if (items.length > 0) {
                      handleDownloadPdf();
                    }
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.saveButtonText}>
                    {items.length > 0 ? 'Confirmar y Generar PDF' : 'Guardar Selección'}
                  </Text>
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
      {/* Segmented Tab Navigation Header for Mobile */}
      {renderSegmentedTabs()}

      {/* Main Content */}
      {activeSubTab === 'quotes' ? (
        renderQuotesView()
      ) : (
        <View style={styles.mobileMainContent}>
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

          {/* Product Detail View */}
          {selectedProduct && <ProductDetailView product={selectedProduct} />}
        </View>
      )}

      {/* Mobile Modal Drawer for choosing products */}
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

      {/* Mobile Client Selector Modal */}
      <Modal
        visible={isClientSelectorOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsClientSelectorOpen(false)}
      >
        <View style={styles.selectorOverlay}>
          <View style={styles.selectorCard}>
            <View style={styles.selectorHeader}>
              <View style={styles.selectorTitleRow}>
                <MaterialCommunityIcons
                  name="account-search-outline"
                  size={20}
                  color="#0F4C81"
                />
                <Text style={styles.selectorTitle}>Seleccionar Cliente</Text>
              </View>
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
                      <Text style={styles.selectorItemName}>
                        {client.name || 'Sin nombre'}
                      </Text>
                      <Text style={styles.selectorItemMeta}>
                        {client.phone || client.email || 'Sin contacto'}
                      </Text>
                    </View>
                    {isCurrentClient && (
                      <MaterialCommunityIcons
                        name="check-circle"
                        size={20}
                        color="#0F4C81"
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
                <Text style={styles.cancelButtonText}>Cerrar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => {
                  setIsClientSelectorOpen(false);
                  if (items.length > 0) {
                    handleDownloadPdf();
                  }
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.saveButtonText}>
                  {items.length > 0 ? 'Generar Proforma' : 'Confirmar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F8FAFC',
    height: '100%',
    overflow: 'hidden',
  },
  productsTabWrapper: {
    flex: 1,
    flexDirection: 'row',
    height: '100%',
    overflow: 'hidden',
  },
  quotesTabWrapper: {
    flex: 1,
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
  },
  productDetailWrapper: {
    flex: 1,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
  },
  sidebarWrapper: {
    height: '100%',
    backgroundColor: '#E2E8F0',
    borderRightWidth: 1.5,
    borderRightColor: '#CBD5E1',
    transitionProperty: 'width',
    transitionDuration: '200ms',
  } as any,
  sidebarWrapperExpanded: {
    width: 280,
  },
  sidebarWrapperCollapsed: {
    width: 72,
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },
  mainContentWrapper: {
    flex: 1,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  topTabBar: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
      web: {
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
      } as any,
    }),
  },
  segmentedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    padding: 3,
    gap: 4,
  },
  segmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 11,
  },
  segmentButtonActive: {
    backgroundColor: '#1E3A2B', // Forest Green
    ...Platform.select({
      ios: {
        shadowColor: '#1E3A2B',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 2px 6px rgba(30, 58, 43, 0.2)',
      } as any,
    }),
  },
  segmentButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  segmentButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  sunToggleBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
      web: {
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
      } as any,
    }),
  },
  tabBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  tabBadgeActive: {
    backgroundColor: '#EF4444',
  },
  tabBadgeInactive: {
    backgroundColor: '#EF4444',
  },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    lineHeight: 12,
  },
  tabBadgeTextActive: {
    color: '#FFFFFF',
  },
  tabBadgeTextInactive: {
    color: '#FFFFFF',
  },
  clientBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0F6FD',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clientBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F4C81',
    maxWidth: 220,
  },
  quotesContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  quotesContent: {
    padding: spacing.lg,
    paddingBottom: spacing['5xl'],
  },
  quotesHeaderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  quotesHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
    minWidth: 260,
  },
  quotesIconBubble: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F0F6FD',
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quoteNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  quotesHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F2942',
  },
  quoteCodeBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  quoteCodeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2563EB',
    letterSpacing: 0.5,
  },
  quotesHeaderSubtitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 2,
  },
  clientSelectorTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    minWidth: 200,
  },
  clientTriggerInfo: {
    flex: 1,
  },
  clientTriggerLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  clientTriggerName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F4C81',
    marginTop: 1,
  },
  emptyQuoteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.xl,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: spacing['3xl'],
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    ...shadows.sm,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyQuoteTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  emptyQuoteSub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    maxWidth: 420,
    lineHeight: 19,
    marginBottom: spacing.xl,
  },
  goToProductsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0F4C81',
    borderWidth: 1,
    borderColor: '#D4AF37',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: borderRadius.md,
    ...shadows.sm,
  },
  goToProductsBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  kpiCardsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  kpiCardItem: {
    flex: 1,
    minWidth: 180,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    ...shadows.sm,
  },
  kpiCardHighlight: {
    backgroundColor: '#0F4C81',
    borderColor: '#D4AF37',
  },
  kpiIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  kpiIconWrapperHighlight: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  kpiTextGroup: {
    flex: 1,
  },
  kpiLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  kpiLabelHighlight: {
    fontSize: 10,
    color: '#E0EEF9',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  kpiValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  kpiValueHighlight: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 2,
  },
  kpiSubValue: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  topActionsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  bottomActionsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  clearCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
  },
  clearCartText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.danger,
  },
  downloadPdfButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0F4C81',
    borderWidth: 1,
    borderColor: '#D4AF37',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
    ...shadows.sm,
  },
  downloadPdfButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  btnDisabled: {
    opacity: 0.6,
  },
  quoteItemsSection: {
    marginBottom: spacing.md,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    paddingHorizontal: 2,
  },
  sectionTitleText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
  },
  addMoreLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  addMoreLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
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
    ...shadows.lg,
  },
  selectorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    backgroundColor: '#F8FAFC',
  },
  selectorTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  selectorTitle: {
    fontSize: typography.fontSizes.sm,
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
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
  },
  selectorItemActive: {
    borderColor: '#0F4C81',
    backgroundColor: '#F0F6FD',
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
  selectorItemAddress: {
    marginTop: 2,
    fontSize: 11,
    color: '#64748B',
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
  cancelButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.background,
  },
  cancelButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: borderRadius.md,
    backgroundColor: '#0F4C81',
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  saveButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
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
