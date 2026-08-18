import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { borderRadius, spacing } from '../theme/spacing';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'danger'
  | 'ghost'
  | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
}) => {
  const getContainerStyle = (): ViewStyle => {
    const base: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: borderRadius.md,
      gap: spacing.sm,
    };

    // Size
    switch (size) {
      case 'sm':
        base.paddingVertical = 6;
        base.paddingHorizontal = spacing.md;
        break;
      case 'lg':
        base.paddingVertical = 14;
        base.paddingHorizontal = spacing.xl;
        break;
      case 'md':
      default:
        base.paddingVertical = 10;
        base.paddingHorizontal = spacing.lg;
        break;
    }

    // Variant
    switch (variant) {
      case 'secondary':
        base.backgroundColor = colors.surfaceActive;
        break;
      case 'outline':
        base.backgroundColor = 'transparent';
        base.borderWidth = 1.5;
        base.borderColor = colors.primary;
        break;
      case 'danger':
        base.backgroundColor = colors.danger;
        break;
      case 'success':
        base.backgroundColor = colors.success;
        break;
      case 'ghost':
        base.backgroundColor = 'transparent';
        break;
      case 'primary':
      default:
        base.backgroundColor = colors.primary;
        break;
    }

    if (disabled || loading) {
      base.opacity = 0.5;
    }

    return base;
  };

  const getTextStyle = (): TextStyle => {
    const base: TextStyle = {
      fontWeight: typography.fontWeights.semibold,
    };

    switch (size) {
      case 'sm':
        base.fontSize = typography.fontSizes.sm;
        break;
      case 'lg':
        base.fontSize = typography.fontSizes.lg;
        break;
      case 'md':
      default:
        base.fontSize = typography.fontSizes.base;
        break;
    }

    switch (variant) {
      case 'secondary':
        base.color = colors.textPrimary;
        break;
      case 'outline':
        base.color = colors.primary;
        break;
      case 'ghost':
        base.color = colors.textSecondary;
        break;
      case 'primary':
      case 'danger':
      case 'success':
      default:
        base.color = colors.textInverse;
        break;
    }

    return base;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      disabled={disabled || loading}
      style={[getContainerStyle(), style]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' ? colors.primary : colors.textInverse}
        />
      ) : (
        <>
          {icon}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};
