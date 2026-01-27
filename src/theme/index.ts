/**
 * Leikille Design System
 * 
 * A warm, modern theme for a kids playdate app.
 * Soft colors, rounded corners, and friendly typography.
 */

export const colors = {
  // Primary - Warm coral/peach for friendly, playful feel
  primary: '#E8715B',
  primaryLight: '#FFF0ED',
  primaryDark: '#C95A47',
  
  // Secondary - Soft teal for balance and trust
  secondary: '#5BBAA8',
  secondaryLight: '#E8F6F3',
  secondaryDark: '#489B8B',
  
  // Accent - Warm golden for highlights
  accent: '#F4B860',
  accentLight: '#FEF5E7',
  
  // Neutrals - Warm grays for a cozy feel
  text: '#2D3436',
  textSecondary: '#636E72',
  textMuted: '#9CA3AF',
  
  // Backgrounds
  background: '#FAFAFA',
  backgroundWarm: '#FDF8F6',
  surface: '#FFFFFF',
  
  // Borders
  border: '#E8E8E8',
  borderLight: '#F3F3F3',
  
  // States
  success: '#5BBAA8',
  successLight: '#E8F6F3',
  error: '#E8715B',
  errorLight: '#FFF0ED',
  warning: '#F4B860',
  warningLight: '#FEF5E7',
  
  // Overlays
  overlay: 'rgba(45, 52, 54, 0.4)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const typography = {
  // Font sizes
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 22,
    xxl: 28,
    xxxl: 34,
  },
  
  // Font weights (as string literals for RN)
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  
  // Line heights
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.7,
  },
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
};

// Common style patterns
export const commonStyles = {
  // Card base style
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    ...shadows.sm,
  },
  
  // Section container
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  // Screen content padding
  screenPadding: {
    paddingHorizontal: spacing.xl,
  },
};

const theme = {
  colors,
  spacing,
  borderRadius,
  typography,
  shadows,
  commonStyles,
};

export default theme;
