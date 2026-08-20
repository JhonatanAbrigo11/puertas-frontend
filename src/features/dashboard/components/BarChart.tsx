import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Line } from 'react-native-svg';
import { colors } from '../../../shared/theme/colors';
import { typography } from '../../../shared/theme/typography';

export interface BarChartItem {
  label: string;
  value: number;
  color: string;
}

interface BarChartProps {
  data: BarChartItem[];
  height?: number;
  barWidth?: number;
  gridColor?: string;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  height = 120,
  barWidth = 28,
  gridColor = colors.borderLight,
}) => {
  const max = Math.max(...data.map((d) => d.value), 1);
  const gap = 12;
  const chartWidth = data.length * (barWidth + gap) + gap;
  const padTop = 8;
  const padBottom = 24;
  const innerH = height - padTop - padBottom;

  return (
    <View>
      <Svg width={chartWidth} height={height}>
        {[0, 0.5, 1].map((t) => {
          const y = padTop + innerH * (1 - t);
          return (
            <Line
              key={t}
              x1={0}
              y1={y}
              x2={chartWidth}
              y2={y}
              stroke={gridColor}
              strokeWidth={1}
              strokeDasharray="4,4"
            />
          );
        })}
        {data.map((item, i) => {
          const barH = (item.value / max) * innerH;
          const x = gap + i * (barWidth + gap);
          const y = padTop + innerH - barH;
          return (
            <Rect
              key={item.label}
              x={x}
              y={y}
              width={barWidth}
              height={Math.max(barH, 4)}
              rx={6}
              fill={item.color}
            />
          );
        })}
      </Svg>
      <View style={[styles.labels, { width: chartWidth }]}>
        {data.map((item) => (
          <View
            key={item.label}
            style={[styles.labelCell, { width: barWidth + gap }]}
          >
            <Text style={styles.labelText} numberOfLines={1}>
              {item.label}
            </Text>
            <Text style={styles.valueText}>{item.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  labels: {
    flexDirection: 'row',
    paddingLeft: 12,
    marginTop: 4,
  },
  labelCell: {
    alignItems: 'center',
  },
  labelText: {
    fontSize: typography.fontSizes.xs,
    color: colors.textMuted,
    textAlign: 'center',
  },
  valueText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
  },
});
