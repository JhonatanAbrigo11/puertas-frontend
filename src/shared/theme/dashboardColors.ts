/** Paleta dashboard — Midnight Navy #0A192F & Warm Gold #C98A16 */
export const dashboardColors = {
  background: '#F8F9FA',
  surface: '#FFFFFF',
  surfaceMuted: '#FFFDF5',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',

  hero: '#FFFFFF',
  heroAccent: '#C98A16',
  heroAccentMuted: 'rgba(201, 138, 22, 0.12)',
  heroText: '#0A192F',
  heroTextMuted: '#6B7280',
  heroDateBg: '#FEF3C7',
  heroDateBorder: '#FDE68A',
  heroDateLabel: '#B45309',

  kpi: {
    proforma: { icon: '#C98A16', bg: '#FEF3C7', text: '#B45309' },
    units: { icon: '#0A192F', bg: '#F1F5F9', text: '#0A192F' },
    clients: { icon: '#C98A16', bg: '#FFFBEB', text: '#B45309' },
    catalog: { icon: '#0A192F', bg: '#F1F5F9', text: '#0A192F' },
    stockOk: { icon: '#16A34A', bg: '#F0FDF4', text: '#166534' },
    stockLow: { icon: '#DC2626', bg: '#FEF2F2', text: '#B91C1C' },
  },

  chart: {
    materials: '#C98A16',
    labor: '#0A192F',
    trend: '#D97706',
    grid: '#F3F4F6',
    badge: '#FEF3C7',
    badgeText: '#B45309',
  },

  category: {
    ventanas: '#C98A16',
    mamparas: '#0A192F',
    fachadas: '#4B5563',
    vitrinas: '#D97706',
    pergolas: '#16A34A',
    puertas: '#B45309',
  },

  accent: '#C98A16',
  accentBright: '#D97706',
  accentLink: '#B45309',
  headerIcon: '#C98A16',

  text: {
    primary: '#0A192F',
    secondary: '#4B5563',
    muted: '#6B7280',
    light: '#9CA3AF',
  },

  gauge: {
    healthy: '#16A34A',
    warning: '#F59E0B',
    danger: '#DC2626',
    neutral: '#9CA3AF',
  },

  bar: {
    primary: '#C98A16',
    secondary: '#0A192F',
  },
} as const;
