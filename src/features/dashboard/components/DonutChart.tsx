import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { dashboardColors as dc } from '../../../shared/theme/dashboardColors';
import { typography } from '../../../shared/theme/typography';

export interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  segments: DonutSegment[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerValue?: string;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  segments,
  size = 140,
  strokeWidth = 22,
  centerLabel,
  centerValue,
}) => {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const cx = size / 2;
  const cy = size / 2;

  let offset = 0;

  return (
    <View style={styles.wrap}>
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          <G rotation="-90" origin={`${cx}, ${cy}`}>
            {total === 0 ? (
              <Circle
                cx={cx}
                cy={cy}
                r={radius}
                stroke={dc.borderLight}
                strokeWidth={strokeWidth}
                fill="none"
              />
            ) : (
              segments.map((seg, i) => {
                const pct = seg.value / total;
                const dash = pct * circumference;
                const gap = circumference - dash;
                const el = (
                  <Circle
                    key={i}
                    cx={cx}
                    cy={cy}
                    r={radius}
                    stroke={seg.color}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={`${dash} ${gap}`}
                    strokeDashoffset={-offset}
                    strokeLinecap="butt"
                  />
                );
                offset += dash;
                return el;
              })
            )}
          </G>
        </Svg>
        {(centerLabel || centerValue) && (
          <View style={[styles.center, { width: size, height: size }]}>
            {centerValue ? (
              <Text style={styles.centerValue}>{centerValue}</Text>
            ) : null}
            {centerLabel ? (
              <Text style={styles.centerLabel}>{centerLabel}</Text>
            ) : null}
          </View>
        )}
      </View>
      <View style={styles.legend}>
        {segments.map((seg) => (
          <View key={seg.label} style={styles.legendRow}>
            <View style={[styles.dot, { backgroundColor: seg.color }]} />
            <Text style={styles.legendLabel} numberOfLines={1}>
              {seg.label}
            </Text>
            <Text style={styles.legendValue}>
              {total > 0 ? Math.round((seg.value / total) * 100) : 0}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
  },
  center: {
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerValue: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: dc.text.primary,
  },
  centerLabel: {
    fontSize: typography.fontSizes.xs,
    color: dc.text.muted,
  },
  legend: {
    flex: 1,
    minWidth: 120,
    gap: 8,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    flex: 1,
    fontSize: typography.fontSizes.sm,
    color: dc.text.secondary,
  },
  legendValue: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold,
    color: dc.text.primary,
  },
});
