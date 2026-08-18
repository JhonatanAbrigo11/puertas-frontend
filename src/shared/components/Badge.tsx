import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { borderRadius, spacing } from '../theme/spacing';

export type BadgeVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'info'
  | 'outline'
  | 'glass';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'secondary',
  icon,
  style,
  textStyle,
  size = 'md',
}) => {
  const getContainerStyle = (): ViewStyle => {
    const base: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: borderRadius.full,
      alignSelf: 'flex-start',
      gap: spacing.xs,
      maxWidth: '100%',
      flexShrink: 1,
    };

    if (size === 'sm') {
      base.paddingHorizontal = 8;
      base.paddingVertical = 2;
    } else {
      base.paddingHorizontal = 10;
      base.paddingVertical = 4;
    }

    switch (variant) {
      case 'primary':
        base.backgroundColor = colors.primaryTint;
        base.borderWidth = 1;
        base.borderColor = colors.primaryBorder;
        break;
      case 'success':
        base.backgroundColor = colors.successBg;
        base.borderWidth = 1;
        base.borderColor = colors.successBorder;
        break;
      case 'warning':
        base.backgroundColor = colors.warningBg;
        base.borderWidth = 1;
        base.borderColor = colors.warningBorder;
        break;
      case 'info':
        base.backgroundColor = colors.infoBg;
        base.borderWidth = 1;
        base.borderColor = '#BFDBFE';
        break;
      case 'glass':
        base.backgroundColor = colors.accentGlassBg;
        base.borderWidth = 1;
        base.borderColor = '#BAE6FD';
        break;
      case 'outline':
        base.backgroundColor = 'transparent';
        base.borderWidth = 1;
        base.borderColor = colors.borderMedium;
        break;
      case 'secondary':
      default:
        base.backgroundColor = colors.surfaceActive;
        base.borderWidth = 1;
        base.borderColor = colors.borderLight;
        break;
    }

    return base;
  };

  const getTextStyle = (): TextStyle => {
    const base: TextStyle = {
      fontSize: size === 'sm' ? 10 : 11,
      fontWeight: typography.fontWeights.bold,
      flexShrink: 1,
    };

    switch (variant) {
      case 'primary':
        base.color = colors.primary;
        break;
      case 'success':
        base.color = colors.success;
        break;
      case 'warning':
        base.color = '#B45309';
        break;
      case 'info':
        base.color = colors.primaryLight;
        break;
      case 'glass':
        base.color = colors.accentGlass;
        break;
      case 'outline':
      case 'secondary':
      default:
        base.color = colors.textSecondary;
        break;
    }

    return base;
  };

  return (
    <View style={[getContainerStyle(), style]}>
      {icon}
      <Text
        style={[getTextStyle(), textStyle]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {label}
      </Text>
    </View>
  );
};
