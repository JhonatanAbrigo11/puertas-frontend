import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Text,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Category, CategoryId } from '../../../core/domain/entities/Category';
import { Product } from '../../../core/domain/entities/Product';
import { mockProducts } from '../../../data/mock/products';
import { Sidebar } from '../components/Sidebar';
import { ProductDetailView } from '../components/ProductDetailView';
import { useResponsive } from '../../../shared/hooks/useResponsive';
import { colors } from '../../../shared/theme/colors';
import { typography } from '../../../shared/theme/typography';
import { borderRadius, spacing } from '../../../shared/theme/spacing';

interface CatalogScreenProps {
  isMobileSidebarOpen?: boolean;
  onCloseMobileSidebar?: () => void;
}

export const CatalogScreen: React.FC<CatalogScreenProps> = ({
  isMobileSidebarOpen = false,
  onCloseMobileSidebar,
}) => {
  const { isTablet, isDesktop } = useResponsive();
  const [selectedCategoryId, setSelectedCategoryId] =
    useState<CategoryId>('ventanas');
  const [selectedProduct, setSelectedProduct] = useState<Product>(
    mockProducts[0]
  );
  const [mobileDrawerVisible, setMobileDrawerVisible] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

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
    // Automatically collapse sidebar when product is chosen so workspace has maximum space
    setIsSidebarCollapsed(true);
    setMobileDrawerVisible(false);
    if (onCloseMobileSidebar) {
      onCloseMobileSidebar();
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
                  Catálogo de Productos
                </Text>
              </TouchableOpacity>
              <Text style={styles.currentProductBreadcrumb}>
                / {selectedProduct.name}
              </Text>
            </View>
          )}

          {selectedProduct ? (
            <ProductDetailView product={selectedProduct} />
          ) : (
            <View style={styles.emptySelection}>
              <Text>Selecciona un producto del panel izquierdo</Text>
            </View>
          )}
        </View>
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
              <Text style={styles.modalTitle}>Catálogo de Productos</Text>
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
  currentProductBreadcrumb: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
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
