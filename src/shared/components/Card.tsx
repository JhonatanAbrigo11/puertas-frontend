import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { colors } from '../theme/colors';
import { borderRadius, spacing } from '../theme/spacing';
import { shadows } from '../theme/shadows';

interface CardProps {
  children: React.ReactNode;
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  variant?: 'elevated' | 'outlined' | 'flat';
  padding?: keyof typeof spacing;
}

export const Card: React.FC<CardProps> = ({
  children,
  selected = false,
  onPress,
  style,
  contentStyle,
  variant = 'outlined',
  padding = 'lg',
}) => {
  const getContainerStyle = (): ViewStyle => {
    const base: ViewStyle = {
      backgroundColor: selected ? colors.primaryTint : colors.surfaceCard,
      borderRadius: borderRadius.lg,
      padding: spacing[padding],
    };

    if (variant === 'elevated') {
      Object.assign(base, selected ? shadows.cardSelected : shadows.md);
      base.borderWidth = selected ? 2 : 1;
      base.borderColor = selected ? colors.primary : colors.borderLight;
    } else if (variant === 'outlined') {
      base.borderWidth = selected ? 2 : 1;
      base.borderColor = selected ? colors.primary : colors.borderMedium;
      if (selected) {
        Object.assign(base, shadows.sm);
      }
    } else {
      // flat
      base.backgroundColor = colors.surfaceHover;
    }

    return base;
  };

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={onPress}
        style={[getContainerStyle(), style]}
      >
        <View style={contentStyle}>{children}</View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[getContainerStyle(), style]}>
      <View style={contentStyle}>{children}</View>
    </View>
  );
};
