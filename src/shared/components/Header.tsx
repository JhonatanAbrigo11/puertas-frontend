import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { borderRadius, spacing } from '../theme/spacing';
import { shadows } from '../theme/shadows';
import { useResponsive } from '../hooks/useResponsive';

export type TabType =
  | 'dashboard'
  | 'catalog'
  | 'quote'
  | 'settings'
  | 'manufacturing';

interface HeaderProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  quoteItemCount: number;
  totalProductsCount: number;
  onOpenMobileSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onOpenMobileSidebar,
}) => {
  const { isMobile } = useResponsive();

  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Panel de Control';
      case 'catalog':
        return 'Proforma';
      case 'quote':
        return 'Lista de Clientes';
      case 'settings':
        return 'Inventario & Control de Stock';
      case 'manufacturing':
        return 'Fichas de Fabricación & Recetas de Corte';
      default:
        return 'ALUX';
    }
  };

  return (
    <View style={styles.header}>
      {/* Left: Brand & Mobile Menu */}
      <View style={styles.brandContainer}>
        {isMobile && onOpenMobileSidebar && (
          <TouchableOpacity
            style={styles.mobileMenuButton}
            onPress={onOpenMobileSidebar}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="menu"
              size={24}
              color={colors.textPrimary}
            />
          </TouchableOpacity>
        )}

        {/* Brand Logo with Blue Background Container */}
        <View style={styles.logoBadgeContainer}>
          <Image
            source={require('../../../assets/icon copy.png')}
            style={styles.brandLogoImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.brandTextWrapper}>
          <Text style={styles.brandTitle}>{getTabTitle()}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 64,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1.5,
    borderBottomColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    ...shadows.sm,
    zIndex: 100,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  mobileMenuButton: {
    padding: spacing.xs,
    marginRight: spacing.xs,
  },
  logoBadgeContainer: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#FE4648',
    borderWidth: 1.5,
    borderColor: '#D4AF37',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
    ...shadows.sm,
  },
  brandLogoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 7,
  },
  brandTextWrapper: {
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F2942',
    letterSpacing: -0.2,
    fontFamily: Platform.select({
      web: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
      ios: 'System',
      android: 'sans-serif-medium',
      default: 'normal',
    }),
  },
});
