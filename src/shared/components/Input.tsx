import React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { borderRadius, spacing } from '../theme/spacing';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  unitSuffix?: string;
  error?: string;
  helperText?: string;
  containerStyle?: ViewStyle;
  inputContainerStyle?: ViewStyle;
  isLarge?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  unitSuffix,
  error,
  helperText,
  containerStyle,
  inputContainerStyle,
  isLarge = false,
  ...textInputProps
}) => {
  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          isLarge && styles.inputContainerLarge,
          error ? styles.inputContainerError : null,
          inputContainerStyle,
        ]}
      >
        <TextInput
          placeholderTextColor={colors.textLight}
          style={[styles.input, isLarge && styles.inputLarge]}
          {...textInputProps}
        />
        {unitSuffix && (
          <View style={styles.unitBadge}>
            <Text style={styles.unitText}>{unitSuffix}</Text>
          </View>
        )}
      </View>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
};

import { Platform } from 'react-native';

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.borderMedium,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  inputContainerLarge: {
    borderRadius: borderRadius.lg,
  },
  inputContainerError: {
    borderColor: colors.danger,
    backgroundColor: colors.dangerBg,
  },
  input: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontSize: typography.fontSizes.base,
    color: colors.textPrimary,
    fontWeight: typography.fontWeights.medium,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  inputLarge: {
    paddingVertical: 12,
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
  },
  unitBadge: {
    backgroundColor: colors.surfaceActive,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    borderLeftWidth: 1,
    borderLeftColor: colors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unitText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold,
    color: colors.textSecondary,
  },
  errorText: {
    fontSize: typography.fontSizes.xs,
    color: colors.danger,
    marginTop: spacing.xs,
    fontWeight: typography.fontWeights.medium,
  },
  helperText: {
    fontSize: typography.fontSizes.xs,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
});
