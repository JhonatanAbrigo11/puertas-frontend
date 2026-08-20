import { colors } from './colors';
import { dashboardColors } from './dashboardColors';
import { typography } from './typography';
import { spacing, borderRadius } from './spacing';
import { shadows } from './shadows';

export const theme = {
  colors,
  dashboardColors,
  typography,
  spacing,
  borderRadius,
  shadows,
};

export type Theme = typeof theme;
export { colors, dashboardColors, typography, spacing, borderRadius, shadows };
