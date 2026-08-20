/**
 * Paleta del panel de control — ALUX carpintería aluminio & vidrio.
 * Tonos cálidos suaves, sin contrastes fuertes.
 */
export const dashboardColors = {
  background: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceMuted: '#F8FAFC',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',

  // Hero claro — sin bloque oscuro pesado
  hero: '#FFFFFF',
  heroAccent: '#C9A87C',
  heroAccentMuted: 'rgba(201, 168, 124, 0.35)',
  heroText: '#3D3835',
  heroTextMuted: '#78716C',
  heroDateBg: '#F8FAFC',
  heroDateBorder: '#E2E8F0',
  heroDateLabel: '#9A7B4F',

  kpi: {
    proforma: { icon: '#B45309', bg: '#FFF7ED', text: '#92400E' },
    units: { icon: '#0369A1', bg: '#F0F9FF', text: '#075985' },
    clients: { icon: '#7C3AED', bg: '#F5F3FF', text: '#6D28D9' },
    catalog: { icon: '#A16207', bg: '#FEFCE8', text: '#854D0E' },
    stockOk: { icon: '#15803D', bg: '#F0FDF4', text: '#166534' },
    stockLow: { icon: '#DC2626', bg: '#FEF2F2', text: '#B91C1C' },
  },

  chart: {
    materials: '#D97706',
    labor: '#7C3AED',
    trend: '#B45309',
    grid: '#F1F5F9',
    badge: '#FEF9EE',
    badgeText: '#92400E',
  },

  category: {
    ventanas: '#3B82F6',
    mamparas: '#0891B2',
    fachadas: '#78716C',
    vitrinas: '#D97706',
    pergolas: '#059669',
    puertas: '#7C3AED',
  },

  accent: '#B8956A',
  accentBright: '#C9A87C',
  accentLink: '#92400E',
  headerIcon: '#9A7B4F',

  text: {
    primary: '#3D3835',
    secondary: '#57534E',
    muted: '#78716C',
    light: '#A8A29E',
  },

  gauge: {
    healthy: '#16A34A',
    warning: '#D97706',
    danger: '#DC2626',
    neutral: '#A8A29E',
  },

  bar: {
    primary: '#B8956A',
    secondary: '#C9A87C',
  },
} as const;
