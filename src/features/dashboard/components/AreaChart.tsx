import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
  Circle,
  Line,
} from 'react-native-svg';
import { colors } from '../../../shared/theme/colors';
import { typography } from '../../../shared/theme/typography';

interface AreaChartProps {
  labels: string[];
  values: number[];
  height?: number;
  color?: string;
  gridColor?: string;
}

export const AreaChart: React.FC<AreaChartProps> = ({
  labels,
  values,
  height = 100,
  color = colors.primary,
  gridColor = colors.borderLight,
}) => {
  const width = 280;
  const padX = 8;
  const padY = 12;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;

  const points = values.map((v, i) => {
    const x = padX + (i / Math.max(values.length - 1, 1)) * innerW;
    const y = padY + innerH - ((v - min) / range) * innerH;
    return { x, y, v };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padY + innerH} L ${points[0].x} ${padY + innerH} Z`;

  return (
    <View>
      <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        <Defs>
          <LinearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <Stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </LinearGradient>
        </Defs>
        {[0.25, 0.5, 0.75].map((t) => (
          <Line
            key={t}
            x1={padX}
            y1={padY + innerH * (1 - t)}
            x2={width - padX}
            y2={padY + innerH * (1 - t)}
            stroke={gridColor}
            strokeWidth={1}
            strokeDasharray="3,3"
          />
        ))}
        <Path d={areaPath} fill="url(#areaGrad)" />
        <Path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {points.map((p, i) => (
          <Circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={4}
            fill={color}
            stroke="#FFF"
            strokeWidth={2}
          />
        ))}
      </Svg>
      <View style={styles.labels}>
        {labels.map((lbl) => (
          <Text key={lbl} style={styles.label}>
            {lbl}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginTop: 4,
  },
  label: {
    fontSize: typography.fontSizes.xs,
    color: colors.textMuted,
  },
});
