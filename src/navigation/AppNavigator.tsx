import React, { useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header, TabType } from '../shared/components/Header';
import { Toast } from '../shared/components/Toast';
import { DashboardScreen } from '../features/dashboard/screens/DashboardScreen';
import { CatalogScreen } from '../features/catalog/screens/CatalogScreen';
import { QuoteScreen } from '../features/quote/screens/QuoteScreen';
import { SettingsScreen } from '../features/settings/screens/SettingsScreen';
import { ManufacturingRecipesScreen } from '../features/manufacturing/screens/ManufacturingRecipesScreen';
import { BottomNavigator } from './components/BottomNavigator';
import { useQuote } from '../features/quote/context/QuoteContext';
import { colors } from '../shared/theme/colors';

export const AppNavigator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { items, totals, toast, hideToast } = useQuote();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
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
        onOpenProforma={() => setActiveTab('catalog')}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenContainerDashboard: {
    backgroundColor: '#FFFFFF',
  },
});
