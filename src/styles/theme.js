// ============================================================
// APP THEME & DESIGN TOKENS — DEUTSCH QUEST 🇩🇪
// Dark & Light Mode Support with High-Contrast Typography
// ============================================================

export const LIGHT_PALETTE = {
  // Canvas & Surfaces
  bg: '#F3F6FA',
  bgLight: '#FFFFFF',
  bgCard: '#FFFFFF',
  bgCardHover: '#F8FAFC',
  bgElevated: '#F0F4F9',
  bgGlass: 'rgba(255, 255, 255, 0.94)',

  // Borders & Dividers
  border: '#E8EEF5',
  borderLight: '#F1F5F9',
  borderGlow: 'rgba(255, 107, 85, 0.25)',

  // Vibrant Candy Accents
  coral: '#FF6B55',
  coralLight: '#FF8A78',
  coralBg: '#FFF0ED',

  yellow: '#F9B845',
  yellowLight: '#FFCA64',
  yellowBg: '#FEF8EA',

  mint: '#36C5A0',
  mintLight: '#57DDB9',
  mintBg: '#EBF9F5',

  lavender: '#7D72FA',
  lavenderLight: '#9990FB',
  lavenderBg: '#F1F0FE',

  skyBlue: '#4AA9FF',
  skyBlueBg: '#EDF6FF',

  // Primary Brand
  primary: '#FF6B55',
  primaryLight: '#FF8A78',
  primaryDark: '#E0533E',
  primaryShadow: '#C8402D',

  accent: '#F9B845',
  accentLight: '#FFCA64',
  accentDark: '#D49527',
  accentShadow: '#B27B1C',

  success: '#36C5A0',
  successLight: '#57DDB9',
  successDark: '#269E7E',
  successShadow: '#1D8267',

  danger: '#FF4D4F',
  dangerLight: '#FF7875',
  dangerDark: '#D9363E',
  dangerShadow: '#BA262F',

  purple: '#7D72FA',
  purpleLight: '#9990FB',
  purpleDark: '#6256E0',
  purpleShadow: '#4C41C4',

  cases: {
    nominativ: '#3B82F6',
    akkusativ: '#36C5A0',
    dativ: '#7D72FA',
    genitiv: '#F9B845',
  },

  gender: {
    der: '#3B82F6',
    die: '#EC4899',
    das: '#10B981',
  },

  // High-Contrast Typography
  text: '#1E2638',
  textSecondary: '#475569',
  textMuted: '#64748B',
  textWhite: '#FFFFFF',
};

export const DARK_PALETTE = {
  // Canvas & Surfaces (Deep modern midnight slate)
  bg: '#0B1120',
  bgLight: '#152136',
  bgCard: '#1E293B',
  bgCardHover: '#283548',
  bgElevated: '#152136',
  bgGlass: 'rgba(30, 41, 59, 0.92)',

  // Glowing Borders
  border: '#334155',
  borderLight: '#1E293B',
  borderGlow: 'rgba(255, 107, 85, 0.4)',

  // Accents tailored for dark backgrounds
  coral: '#FF7B65',
  coralLight: '#FFA494',
  coralBg: 'rgba(255, 107, 85, 0.18)',

  yellow: '#FBBF24',
  yellowLight: '#FDE047',
  yellowBg: 'rgba(251, 191, 36, 0.18)',

  mint: '#34D399',
  mintLight: '#6EE7B7',
  mintBg: 'rgba(52, 211, 153, 0.18)',

  lavender: '#818CF8',
  lavenderLight: '#A5B4FC',
  lavenderBg: 'rgba(129, 140, 248, 0.18)',

  skyBlue: '#38BDF8',
  skyBlueBg: 'rgba(56, 189, 248, 0.18)',

  primary: '#FF7B65',
  primaryLight: '#FFA494',
  primaryDark: '#E0533E',
  primaryShadow: '#000000',

  accent: '#FBBF24',
  accentLight: '#FDE047',
  accentDark: '#D97706',
  accentShadow: '#000000',

  success: '#34D399',
  successLight: '#6EE7B7',
  successDark: '#059669',
  successShadow: '#000000',

  danger: '#F87171',
  dangerLight: '#FCA5A5',
  dangerDark: '#DC2626',
  dangerShadow: '#000000',

  purple: '#818CF8',
  purpleLight: '#A5B4FC',
  purpleDark: '#6366F1',
  purpleShadow: '#000000',

  cases: {
    nominativ: '#60A5FA',
    akkusativ: '#34D399',
    dativ: '#A78BFA',
    genitiv: '#FBBF24',
  },

  gender: {
    der: '#60A5FA',
    die: '#F472B6',
    das: '#34D399',
  },

  // High-Contrast Light Typography for Dark Mode
  text: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textMuted: '#94A3B8',
  textWhite: '#FFFFFF',
};

export const THEME = {
  light: LIGHT_PALETTE,
  dark: DARK_PALETTE,
  colors: LIGHT_PALETTE, // default for static access

  shadows: {
    softCard: {
      shadowColor: '#8FA6C1',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 4,
    },
    softPill: {
      shadowColor: '#788FA8',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.10,
      shadowRadius: 10,
      elevation: 3,
    },
    dockShadow: {
      shadowColor: '#607590',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 10,
    },
  },

  shadowsDark: {
    softCard: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.45,
      shadowRadius: 16,
      elevation: 6,
    },
    softPill: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 8,
      elevation: 4,
    },
    dockShadow: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.6,
      shadowRadius: 24,
      elevation: 16,
    },
  },

  gradients: {
    coral: ['#FF6B55', '#FF8A78'],
    yellow: ['#F9B845', '#FFD17A'],
    mint: ['#36C5A0', '#5CE3BF'],
    lavender: ['#7D72FA', '#9C94FB'],
    sky: ['#38BDF8', '#60A5FA'],
    purple: ['#8B5CF6', '#A78BFA'],
    emerald: ['#10B981', '#34D399'],
    cardDark: ['#1E293B', '#0F172A'],
    cardLight: ['#FFFFFF', '#F8FAFC'],
  },

  fonts: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
    heavy: 'System',
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 14,
    lg: 20,
    xl: 28,
    xxl: 36,
  },

  radius: {
    sm: 10,
    md: 16,
    lg: 24,
    xl: 32,
    full: 9999,
  },
};

export const getRtlStyle = (isRTL) => ({
  flexDirection: isRTL ? 'row-reverse' : 'row',
  textAlign: isRTL ? 'right' : 'left',
});

export const colors = THEME.colors;
export default THEME;
