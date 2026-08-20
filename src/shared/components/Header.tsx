import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
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
        return 'Inventario';
      case 'manufacturing':
        return 'Fabricación';
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
              color="#FFFFFF"
            />
          </TouchableOpacity>
        )}

        {/* Brand Logo */}
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

      {/* Right: Notifications Bell */}
      <TouchableOpacity style={styles.bellButton} activeOpacity={0.7}>
        <MaterialCommunityIcons
          name="bell-outline"
          size={22}
          color="#FFFFFF"
        />
        <View style={styles.bellDot} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: '#0A192F', // Deep Midnight Navy
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 100,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mobileMenuButton: {
    padding: 4,
    marginRight: 4,
  },
  logoBadgeContainer: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#C98A16', // Gold Accent
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  brandLogoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
  brandTextWrapper: {
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  bellButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bellDot: {
    position: 'absolute',
    top: 6,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#C98A16', // Gold Amber Dot
    borderWidth: 1,
    borderColor: '#0A192F',
  },
});
