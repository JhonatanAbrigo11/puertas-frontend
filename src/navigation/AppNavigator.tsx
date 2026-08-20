import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, Platform } from 'react-native';
import { Header, TabType } from '../shared/components/Header';
import { Toast } from '../shared/components/Toast';
import { DashboardScreen } from '../features/dashboard/screens/DashboardScreen';
import { CatalogScreen } from '../features/catalog/screens/CatalogScreen';
import { QuoteScreen } from '../features/quote/screens/QuoteScreen';
import { SettingsScreen } from '../features/settings/screens/SettingsScreen';
import { ManufacturingRecipesScreen } from '../features/manufacturing/screens/ManufacturingRecipesScreen';
import { CreateProductModal } from '../features/manufacturing/components/CreateProductModal';
import { BottomNavigator } from './components/BottomNavigator';
import { useQuote } from '../features/quote/context/QuoteContext';
import { mockProducts } from '../data/mock/products';
import { Product } from '../core/domain/entities/Product';
import { colors } from '../shared/theme/colors';

export const AppNavigator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isCreateProductModalOpen, setIsCreateProductModalOpen] = useState(false);
  const { items, totals, toast, hideToast, showToast } = useQuote();

  const handleSaveNewProduct = (newProduct: Product) => {
    // Add new product to the mock products list
    mockProducts.unshift(newProduct);
    setIsCreateProductModalOpen(false);
    showToast(
      'Producto Creado con Éxito',
      `"${newProduct.name}" se ha añadido al catálogo y fichas de fabricación.`,
      'success'
    );
    setActiveTab('catalog');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

      {/* Floating Global Toast for confirmation */}
      <Toast
        visible={toast.visible}
        message={toast.message}
        subMessage={toast.subMessage}
        type={toast.type}
        onDismiss={hideToast}
        actionLabel={activeTab !== 'catalog' ? 'Ver Proforma' : undefined}
        onAction={
          activeTab !== 'catalog'
            ? () => {
                setActiveTab('catalog');
              }
            : undefined
        }
      />

      {/* Top Application Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        quoteItemCount={items.length}
        totalProductsCount={totals.totalProductsCount}
        onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
      />

      {/* Main Active Screen */}
      <View
        style={[
          styles.screenContainer,
          activeTab === 'dashboard' && styles.screenContainerDashboard,
        ]}
      >
        {activeTab === 'dashboard' && (
          <DashboardScreen onNavigate={setActiveTab} />
        )}
        {activeTab === 'catalog' && (
          <CatalogScreen
            isMobileSidebarOpen={mobileSidebarOpen}
            onCloseMobileSidebar={() => setMobileSidebarOpen(false)}
          />
        )}
        {activeTab === 'quote' && (
          <QuoteScreen onGoToCatalog={() => setActiveTab('catalog')} />
        )}
        {activeTab === 'settings' && (
          <SettingsScreen onGoToQuote={() => setActiveTab('quote')} />
        )}
        {activeTab === 'manufacturing' && <ManufacturingRecipesScreen />}
      </View>

      {/* Bottom Navigation Bar */}
      <BottomNavigator
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        quoteItemCount={items.length}
        onCreateProduct={() => setIsCreateProductModalOpen(true)}
      />

      {/* Modal: Create New Product (Triggered by center '+' button) */}
      <CreateProductModal
        visible={isCreateProductModalOpen}
        onClose={() => setIsCreateProductModalOpen(false)}
        onSaveProduct={handleSaveNewProduct}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenContainerDashboard: {
    backgroundColor: '#FFFFFF',
  },
});
