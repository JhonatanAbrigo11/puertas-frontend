import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Platform,
  LayoutChangeEvent,
  useWindowDimensions,
} from 'react-native';
import Svg, { Path, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TabType } from '../../shared/components/Header';
import { colors } from '../../shared/theme/colors';

interface BottomNavigatorProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  quoteItemCount: number;
  onOpenProforma?: () => void;
}

interface NavTabItem {
  id: TabType;
  slotIndex: number;
  label: string;
  iconInactive: keyof typeof MaterialCommunityIcons.glyphMap;
  iconActive: keyof typeof MaterialCommunityIcons.glyphMap;
  badgeCount?: number;
}

export const BottomNavigator: React.FC<BottomNavigatorProps> = ({
  activeTab,
  onSelectTab,
  quoteItemCount,
  onOpenProforma,
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // 4 tabs + centro Proforma (botón +)
  const leftTabs: NavTabItem[] = [
    {
      id: 'dashboard',
      slotIndex: 0,
      label: 'Inicio',
      iconInactive: 'view-dashboard-outline',
      iconActive: 'view-dashboard',
    },
    {
      id: 'quote',
      slotIndex: 1,
      label: 'Clientes',
      iconInactive: 'account-outline',
      iconActive: 'account',
    },
  ];

  const rightTabs: NavTabItem[] = [
    {
      id: 'settings',
      slotIndex: 3,
      label: 'Inventario',
      iconInactive: 'package-variant-closed',
      iconActive: 'package-variant',
    },
    {
      id: 'manufacturing',
      slotIndex: 4,
      label: 'Fichas',
      iconInactive: 'clipboard-text-play-outline',
      iconActive: 'clipboard-text-play',
    },
  ];

  const allTabs = [...leftTabs, ...rightTabs];

  const TOTAL_SLOTS = 5;
  const CENTER_SLOT_INDEX = 2;

  const getSlotIndexFromTab = (tab: TabType): number => {
    switch (tab) {
      case 'dashboard':
        return 0;
      case 'quote':
        return 1;
      case 'catalog':
        return CENTER_SLOT_INDEX;
      case 'settings':
        return 3;
      case 'manufacturing':
        return 4;
      default:
        return 0;
    }
  };

  const activeSlotIndex = getSlotIndexFromTab(activeTab);
  const isProformaActive = activeTab === 'catalog';

  // Dimensions
  const maxWidth = Math.min(windowWidth - 20, 600);
  const [barWidth, setBarWidth] = useState<number>(maxWidth);

  const BAR_HEIGHT = 74;
  const CORNER_RADIUS = 26;
  const BUBBLE_SIZE = 50;
  const CENTER_BUTTON_SIZE = 62;

  const slotWidth = barWidth / TOTAL_SLOTS;
  const notchWidth = Math.min(44, slotWidth * 0.46);
  const notchDepth = 28;

  // Animated values
  const animatedIndex = useRef(new Animated.Value(activeSlotIndex)).current;
  const tabDipAnim = useRef(new Animated.Value(0)).current;
  const centerDipAnim = useRef(new Animated.Value(0)).current;

  // Notch center X for dynamic SVG path
  const [notchCenterX, setNotchCenterX] = useState<number>(
    activeSlotIndex * slotWidth + slotWidth / 2
  );

  // Real-time listener for dynamic SVG curved notch following the active tab
  useEffect(() => {
    const listenerId = animatedIndex.addListener(({ value }) => {
      const currentSlotW = barWidth / TOTAL_SLOTS;
      setNotchCenterX(value * currentSlotW + currentSlotW / 2);
    });

    return () => {
      animatedIndex.removeListener(listenerId);
    };
  }, [barWidth]);

  // Animate tab bubble and notch on activeTab change
  useEffect(() => {
    const moveAnimation = Animated.spring(animatedIndex, {
      toValue: activeSlotIndex,
      damping: 16,
      mass: 0.8,
      stiffness: 140,
      useNativeDriver: false,
    });

    const dipAnimation = Animated.sequence([
      Animated.timing(tabDipAnim, {
        toValue: 1,
        duration: 120,
        easing: Easing.bezier(0.25, 1, 0.5, 1),
        useNativeDriver: true,
      }),
      Animated.spring(tabDipAnim, {
        toValue: 0,
        damping: 10,
        mass: 0.6,
        stiffness: 160,
        useNativeDriver: true,
      }),
    ]);

    moveAnimation.start();
    dipAnimation.start();
  }, [activeSlotIndex]);

  // Center "+" abre Proforma
  const handleCenterButtonPress = () => {
    Animated.sequence([
      Animated.timing(centerDipAnim, {
        toValue: 1,
        duration: 120,
        easing: Easing.bezier(0.25, 1, 0.5, 1),
        useNativeDriver: true,
      }),
      Animated.spring(centerDipAnim, {
        toValue: 0,
        damping: 10,
        mass: 0.6,
        stiffness: 160,
        useNativeDriver: true,
      }),
    ]).start();

    if (onOpenProforma) {
      onOpenProforma();
    }
  };

  const handleLayout = (e: LayoutChangeEvent) => {
    const newWidth = e.nativeEvent.layout.width;
    if (newWidth > 0 && Math.abs(newWidth - barWidth) > 1) {
      setBarWidth(newWidth);
      const newSlotW = newWidth / TOTAL_SLOTS;
      setNotchCenterX(activeSlotIndex * newSlotW + newSlotW / 2);
    }
  };

  // Generate SVG path for the bar with rounded corners and the active curved dip notch
  const generateBarPath = (
    w: number,
    h: number,
    cx: number,
    nw: number,
    nd: number,
    r: number
  ) => {
    const leftNotch = Math.max(r + 2, cx - nw);
    const rightNotch = Math.min(w - r - 2, cx + nw);
    const cpOffset = nw * 0.38;

    return `
      M 0 ${r}
      A ${r} ${r} 0 0 1 ${r} 0
      L ${leftNotch} 0
      C ${leftNotch + cpOffset} 0, ${cx - cpOffset} ${nd}, ${cx} ${nd}
      C ${cx + cpOffset} ${nd}, ${rightNotch - cpOffset} 0, ${rightNotch} 0
      L ${w - r} 0
      A ${r} ${r} 0 0 1 ${w} ${r}
      L ${w} ${h - r}
      A ${r} ${r} 0 0 1 ${w - r} ${h}
      L ${r} ${h}
      A ${r} ${r} 0 0 1 0 ${h - r}
      Z
    `;
  };

  // Generate top outline path for crisp architectural border
  const generateTopBorderPath = (
    w: number,
    cx: number,
    nw: number,
    nd: number,
    r: number
  ) => {
    const leftNotch = Math.max(r + 2, cx - nw);
    const rightNotch = Math.min(w - r - 2, cx + nw);
    const cpOffset = nw * 0.38;

    return `
      M 0 ${r}
      A ${r} ${r} 0 0 1 ${r} 0
      L ${leftNotch} 0
      C ${leftNotch + cpOffset} 0, ${cx - cpOffset} ${nd}, ${cx} ${nd}
      C ${cx + cpOffset} ${nd}, ${rightNotch - cpOffset} 0, ${rightNotch} 0
      L ${w - r} 0
      A ${r} ${r} 0 0 1 ${w} ${r}
    `;
  };

  const svgBarPath = generateBarPath(
    barWidth,
    BAR_HEIGHT,
    notchCenterX,
    notchWidth,
    notchDepth,
    CORNER_RADIUS
  );

  const svgTopBorderPath = generateTopBorderPath(
    barWidth,
    notchCenterX,
    notchWidth,
    notchDepth,
    CORNER_RADIUS
  );

  // Active Tab Bubble (Burbujita) horizontal translation
  const activeBubbleTranslateX = animatedIndex.interpolate({
    inputRange: [0, 1, 2, 3, 4],
    outputRange: [0, 1, 2, 3, 4].map(
      (i) => i * slotWidth + (slotWidth - BUBBLE_SIZE) / 2
    ),
  });

  // Active Tab Bubble vertical dip & bounce animation
  const activeBubbleTranslateY = tabDipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-14, 6], // Resting at -14 in the notch, dips to +6 on tap
  });

  const activeBubbleScale = tabDipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.92, 1.08],
  });

  // Center "+" Button vertical dip & bounce animation
  const centerButtonTranslateY = centerDipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-24, -6], // Elevated high at -24, dips to -6 on tap
  });

  const centerButtonScale = centerDipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.9, 1.08],
  });

  const bottomPadding = Math.max(insets.bottom, Platform.OS === 'ios' ? 16 : 8);

  const activeTabItem =
    allTabs.find((t) => t.id === activeTab) || leftTabs[0];

  const showSideActiveBubble = !isProformaActive;

  const renderTabButton = (tab: NavTabItem) => {
    const isCurrentActive = activeTab === tab.id && showSideActiveBubble;

    const iconOpacity = animatedIndex.interpolate({
      inputRange: [tab.slotIndex - 0.5, tab.slotIndex, tab.slotIndex + 0.5],
      outputRange: [1, 0, 1],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity
        key={tab.id}
        style={styles.tabButton}
        onPress={() => onSelectTab(tab.id)}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={tab.label}
        accessibilityState={{ selected: isCurrentActive }}
      >
        <Animated.View
          style={[styles.tabIconWrap, { opacity: iconOpacity }]}
          pointerEvents="none"
        >
          <MaterialCommunityIcons
            name={tab.iconInactive}
            size={24}
            color="#737373"
          />
          {tab.badgeCount !== undefined && tab.badgeCount > 0 && (
            <View style={styles.inactiveBadge}>
              <Text style={styles.inactiveBadgeText}>
                {tab.badgeCount > 99 ? '99+' : tab.badgeCount}
              </Text>
            </View>
          )}
        </Animated.View>

        <Text
          style={[styles.tabLabel, isCurrentActive && styles.tabLabelActive]}
          numberOfLines={1}
        >
          {tab.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[
        styles.outerContainer,
        {
          paddingBottom: bottomPadding,
        },
      ]}
      pointerEvents="box-none"
    >
      <View
        style={[styles.barWrapper, { maxWidth }]}
        onLayout={handleLayout}
      >
        {/* SVG Curved Bar Surface with Dynamic Notch */}
        <View style={styles.svgContainer}>
          <Svg width={barWidth} height={BAR_HEIGHT} style={styles.svg}>
            <Defs>
              <SvgGradient id="barWhiteGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={1} />
                <Stop offset="100%" stopColor="#FFFFFF" stopOpacity={1} />
              </SvgGradient>
            </Defs>

            {/* Filled White Curved Body */}
            <Path d={svgBarPath} fill="url(#barWhiteGrad)" />

            {/* Top Outline Architectural Border */}
            <Path
              d={svgTopBorderPath}
              fill="none"
              stroke="#F0F0F0"
              strokeWidth={1.5}
            />
          </Svg>
        </View>

        {/* Floating Active Tab Burbujita with Dynamic Glide & Dip */}
        {/* Outer: horizontal glide (JS driver — syncs SVG notch listener) */}
        <Animated.View
          style={[
            styles.activeBubbleWrapper,
            {
              width: BUBBLE_SIZE,
              height: BUBBLE_SIZE,
              transform: [{ translateX: activeBubbleTranslateX }],
              opacity: showSideActiveBubble ? 1 : 0,
            },
          ]}
          pointerEvents="none"
        >
          {/* Inner: vertical dip & bounce (native driver) */}
          <Animated.View
            style={{
              width: BUBBLE_SIZE,
              height: BUBBLE_SIZE,
              transform: [
                { translateY: activeBubbleTranslateY },
                { scale: activeBubbleScale },
              ],
            }}
          >
            <View style={styles.activeBubble}>
              <MaterialCommunityIcons
                name={activeTabItem.iconActive}
                size={24}
                color="#FFFFFF"
              />

              {/* Active Badge if applicable (e.g. Carrito count) */}
              {activeTabItem.badgeCount !== undefined &&
                activeTabItem.badgeCount > 0 && (
                  <View style={styles.activeBadge}>
                    <Text style={styles.activeBadgeText}>
                      {activeTabItem.badgeCount > 99
                        ? '99+'
                        : activeTabItem.badgeCount}
                    </Text>
                  </View>
                )}
            </View>
          </Animated.View>
        </Animated.View>

        {/* Tab Row: 2 Tabs Left | Center Proforma | 2 Tabs Right */}
        <View style={styles.tabsRow}>
          <View style={[styles.tabSection, styles.tabSectionLeft]}>
            {leftTabs.map(renderTabButton)}
          </View>

          <View style={[styles.centerSlot, { width: slotWidth }]} />

          <View style={[styles.tabSection, styles.tabSectionRight]}>
            {rightTabs.map(renderTabButton)}
          </View>
        </View>

        <View
          style={[
            styles.centerButtonContainer,
            {
              left:
                CENTER_SLOT_INDEX * slotWidth +
                (slotWidth - CENTER_BUTTON_SIZE) / 2,
            },
          ]}
          pointerEvents="box-none"
        >
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleCenterButtonPress}
            accessibilityRole="button"
            accessibilityLabel="Abrir proforma"
          >
            <Animated.View
              style={[
                styles.centerButtonCircle,
                isProformaActive && styles.centerButtonCircleActive,
                {
                  transform: [
                    { translateY: centerButtonTranslateY },
                    { scale: centerButtonScale },
                  ],
                },
              ]}
            >
              <MaterialCommunityIcons
                name="plus"
                size={34}
                color="#FFFFFF"
              />
              {quoteItemCount > 0 && (
                <View style={styles.centerBadge}>
                  <Text style={styles.centerBadgeText}>
                    {quoteItemCount > 99 ? '99+' : quoteItemCount}
                  </Text>
                </View>
              )}
            </Animated.View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    position: 'relative',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    paddingTop: 16,
    zIndex: 90,
  },
  barWrapper: {
    position: 'relative',
    width: '100%',
    height: 74,
    alignSelf: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#0A192F',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.14,
        shadowRadius: 16,
      },
      android: {
        elevation: 10,
      },
      web: {
        boxShadow:
          '0 12px 28px -4px rgba(15, 76, 129, 0.14), 0 8px 12px -6px rgba(15, 76, 129, 0.08)',
      } as any,
    }),
  },
  svgContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  svg: {
    alignSelf: 'center',
  },
  activeBubbleWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 15,
  },
  activeBubble: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
      },
      android: {
        elevation: 10,
      },
      web: {
        boxShadow:
          '0 10px 20px -2px rgba(10, 25, 47, 0.4), 0 4px 6px -2px rgba(10, 25, 47, 0.2)',
      } as any,
    }),
  },
  activeBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 17,
    height: 17,
    borderRadius: 8.5,
    backgroundColor: '#C98A16',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  activeBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 11,
  },
  tabsRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
    zIndex: 5,
  },
  tabSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: '100%',
  },
  tabSectionLeft: {
    flex: 2,
  },
  tabSectionRight: {
    flex: 2,
  },
  centerSlot: {
    height: '100%',
  },
  tabButton: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 8,
    position: 'relative',
  },
  tabIconWrap: {
    position: 'absolute',
    top: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
  },
  inactiveBadge: {
    position: 'absolute',
    top: -3,
    right: -6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#C98A16',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  inactiveBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 11,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#737373',
    textAlign: 'center',
    width: '100%',
    paddingHorizontal: 2,
  },
  tabLabelActive: {
    fontWeight: '800',
    color: colors.primary,
  },
  centerButtonContainer: {
    position: 'absolute',
    top: 0,
    width: 62,
    height: 62,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 25,
  },
  centerButtonCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3.5,
    borderColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#0A192F',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.28,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow:
          '0 10px 20px -2px rgba(10, 25, 47, 0.35), 0 4px 6px -2px rgba(10, 25, 47, 0.2)',
      } as any,
    }),
  },
  centerButtonCircleActive: {
    borderColor: '#E2E8F0',
  },
  centerBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  centerBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.primaryDark,
    lineHeight: 11,
  },
});
