/** Paleta dashboard — #FE4648 + blanco */
export const dashboardColors = {
  background: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceMuted: '#FFF8F8',
  border: '#F0F0F0',
  borderLight: '#F5F5F5',

  hero: '#FFFFFF',
  heroAccent: '#FE4648',
  heroAccentMuted: 'rgba(254, 70, 72, 0.12)',
  heroText: '#1A1A1A',
  heroTextMuted: '#737373',
  heroDateBg: '#FFF0F0',
  heroDateBorder: '#FFCACA',
  heroDateLabel: '#FE4648',

  kpi: {
    proforma: { icon: '#FE4648', bg: '#FFF0F0', text: '#D93638' },
    units: { icon: '#FF7072', bg: '#FFF5F5', text: '#D93638' },
    clients: { icon: '#D93638', bg: '#FFE8E8', text: '#B91C1C' },
    catalog: { icon: '#FE4648', bg: '#FFF0F0', text: '#D93638' },
    stockOk: { icon: '#16A34A', bg: '#F0FDF4', text: '#166534' },
    stockLow: { icon: '#DC2626', bg: '#FEF2F2', text: '#B91C1C' },
  },

  chart: {
    materials: '#FE4648',
    labor: '#FF7072',
    trend: '#D93638',
    grid: '#F5F5F5',
    badge: '#FFF0F0',
    badgeText: '#D93638',
  },

  category: {
    ventanas: '#FE4648',
    mamparas: '#FF7072',
    fachadas: '#737373',
    vitrinas: '#D93638',
    pergolas: '#16A34A',
    puertas: '#FF5859',
  },

  accent: '#FE4648',
  accentBright: '#FF7072',
  accentLink: '#D93638',
  headerIcon: '#FE4648',

  text: {
    primary: '#1A1A1A',
    secondary: '#525252',
    muted: '#737373',
    light: '#A3A3A3',
  },

  gauge: {
    healthy: '#16A34A',
    warning: '#F59E0B',
    danger: '#FE4648',
    neutral: '#A3A3A3',
  },

  bar: {
    primary: '#FE4648',
    secondary: '#FF7072',
  },
} as const;
