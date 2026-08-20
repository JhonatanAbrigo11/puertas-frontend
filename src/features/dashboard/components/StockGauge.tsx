import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { dashboardColors as dc } from '../../../shared/theme/dashboardColors';
import { typography } from '../../../shared/theme/typography';

interface StockGaugeProps {
  healthyCount: number;
  totalCount: number;
  lowCount: number;
  size?: number;
}

export const StockGauge: React.FC<StockGaugeProps> = ({
  healthyCount,
  totalCount,
  lowCount,
  size = 100,
}) => {
  const pct = totalCount > 0 ? healthyCount / totalCount : 0;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = pct * circumference;
  const cx = size / 2;
  const cy = size / 2;

  const healthColor =
    pct >= 0.8
      ? dc.gauge.healthy
      : pct >= 0.5
        ? dc.gauge.warning
        : dc.gauge.danger;

  return (
    <View style={styles.wrap}>
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          <Circle
            cx={cx}
            cy={cy}
            r={radius}
            stroke={dc.borderLight}
            strokeWidth={strokeWidth}
            fill="none"
          />
          <Circle
            cx={cx}
            cy={cy}
            r={radius}
            stroke={healthColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeLinecap="round"
            rotation="-90"
            origin={`${cx}, ${cy}`}
          />
        </Svg>
        <View style={[styles.center, { width: size, height: size }]}>
          <Text style={[styles.pct, { color: healthColor }]}>
            {Math.round(pct * 100)}%
          </Text>
          <Text style={styles.sub}>Saludable</Text>
        </View>
      </View>
      <View style={styles.stats}>
        <View style={styles.statRow}>
          <View style={[styles.dot, { backgroundColor: dc.gauge.healthy }]} />
          <Text style={styles.statLabel}>Stock OK</Text>
          <Text style={styles.statVal}>{healthyCount}</Text>
        </View>
        <View style={styles.statRow}>
          <View style={[styles.dot, { backgroundColor: dc.gauge.danger }]} />
          <Text style={styles.statLabel}>Stock bajo</Text>
          <Text style={styles.statVal}>{lowCount}</Text>
        </View>
        <View style={styles.statRow}>
          <View style={[styles.dot, { backgroundColor: dc.gauge.neutral }]} />
          <Text style={styles.statLabel}>Total insumos</Text>
          <Text style={styles.statVal}>{totalCount}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  center: {
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pct: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.heavy,
  },
  sub: {
    fontSize: typography.fontSizes.xs,
    color: dc.text.muted,
  },
  stats: {
    flex: 1,
    gap: 8,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statLabel: {
    flex: 1,
    fontSize: typography.fontSizes.sm,
    color: dc.text.secondary,
  },
  statVal: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold,
    color: dc.text.primary,
  },
});
