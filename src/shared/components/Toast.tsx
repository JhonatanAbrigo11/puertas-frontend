import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { borderRadius, spacing } from '../theme/spacing';
import { shadows } from '../theme/shadows';

interface ToastProps {
  visible: boolean;
  message: string;
  subMessage?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
  onDismiss: () => void;
  actionLabel?: string;
  onAction?: () => void;
  durationMs?: number;
}

export const Toast: React.FC<ToastProps> = ({
  visible,
  message,
  subMessage,
  type = 'success',
  onDismiss,
  actionLabel,
  onAction,
  durationMs = 3500,
}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          friction: 6,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        handleDismiss();
      }, durationMs);

      return () => clearTimeout(timer);
    } else {
      opacity.setValue(0);
      translateY.setValue(-20);
    }
  }, [visible]);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -20,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss();
    });
  };

  if (!visible) return null;

  const getIcon = () => {
    switch (type) {
      case 'error':
        return (
          <MaterialCommunityIcons
            name="alert-circle"
            size={22}
            color={colors.danger}
          />
        );
      case 'warning':
        return (
          <MaterialCommunityIcons
            name="alert"
            size={22}
            color={colors.warning}
          />
        );
      case 'info':
        return (
          <MaterialCommunityIcons
            name="information"
            size={22}
            color={colors.primaryLight}
          />
        );
      case 'success':
      default:
        return (
          <MaterialCommunityIcons
            name="check-circle"
            size={22}
            color={colors.success}
          />
        );
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <View style={styles.content}>
        {getIcon()}
        <View style={styles.textContainer}>
          <Text style={styles.messageText}>{message}</Text>
          {subMessage && (
            <Text style={styles.subMessageText}>{subMessage}</Text>
          )}
        </View>

        {actionLabel && onAction && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              onAction();
              handleDismiss();
            }}
          >
            <Text style={styles.actionText}>{actionLabel}</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={handleDismiss} style={styles.closeButton}>
          <MaterialCommunityIcons
            name="close"
            size={18}
            color={colors.textMuted}
          />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 75,
    right: 20,
    zIndex: 9999,
    maxWidth: 420,
    minWidth: 320,
    backgroundColor: '#0F172A',
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...shadows.xl,
    borderWidth: 1,
    borderColor: '#334155',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: spacing.md,
    marginRight: spacing.sm,
  },
  messageText: {
    color: '#FFFFFF',
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold,
  },
  subMessageText: {
    color: '#94A3B8',
    fontSize: typography.fontSizes.xs,
    marginTop: 2,
  },
  actionButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
    marginRight: spacing.xs,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold,
  },
  closeButton: {
    padding: 4,
  },
});
