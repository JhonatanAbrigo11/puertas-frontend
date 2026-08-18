import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ViewStyle,
  Platform,
} from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { borderRadius, spacing } from '../theme/spacing';

interface StepperProps {
  value: number;
  onChange: (newValue: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  unitLabel?: string;
  style?: ViewStyle;
}

export const Stepper: React.FC<StepperProps> = ({
  value,
  onChange,
  min = 1,
  max = 999,
  step = 1,
  label,
  unitLabel = 'unidades',
  style,
}) => {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - step);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + step);
    }
  };

  const handleTextChange = (text: string) => {
    const numeric = parseInt(text.replace(/[^0-9]/g, ''), 10);
    if (isNaN(numeric)) {
      onChange(min);
    } else {
      const clamped = Math.min(Math.max(numeric, min), max);
      onChange(clamped);
    }
  };

  return (
    <View style={[styles.wrapper, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.container}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleDecrement}
          disabled={value <= min}
          style={[styles.button, value <= min && styles.buttonDisabled]}
        >
          <Text style={[styles.buttonText, value <= min && styles.buttonTextDisabled]}>
            −
          </Text>
        </TouchableOpacity>

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={value.toString()}
            keyboardType="number-pad"
            onChangeText={handleTextChange}
          />
          {unitLabel && <Text style={styles.unitText}>{unitLabel}</Text>}
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleIncrement}
          disabled={value >= max}
          style={[styles.button, value >= max && styles.buttonDisabled]}
        >
          <Text style={[styles.buttonText, value >= max && styles.buttonTextDisabled]}>
            +
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.borderMedium,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    height: 48,
  },
  button: {
    width: 48,
    height: '100%',
    backgroundColor: colors.surfaceActive,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: colors.surfaceHover,
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
    lineHeight: 24,
  },
  buttonTextDisabled: {
    color: colors.textLight,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  input: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    minWidth: 40,
    paddingVertical: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  unitText: {
    fontSize: typography.fontSizes.xs,
    color: colors.textMuted,
    marginLeft: spacing.xs,
    fontWeight: typography.fontWeights.medium,
  },
});
