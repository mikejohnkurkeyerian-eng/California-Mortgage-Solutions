/**
 * Color palette for Loan Automation Platform
 * Modern, professional design system
 */

export const colors = {
  // Primary colors
  primary: '#2563eb', // Blue
  primaryDark: '#1d4ed8',
  primaryLight: '#3b82f6',
  primaryLighter: '#60a5fa',
  primaryLightest: '#dbeafe',

  // Secondary colors
  secondary: '#7c3aed', // Purple
  secondaryDark: '#6d28d9',
  secondaryLight: '#8b5cf6',
  secondaryLighter: '#a78bfa',
  secondaryLightest: '#ede9fe',

  // Success colors
  success: '#10b981',
  successDark: '#059669',
  successLight: '#34d399',
  successLightest: '#d1fae5',

  // Warning colors
  warning: '#f59e0b',
  warningDark: '#d97706',
  warningLight: '#fbbf24',
  warningLightest: '#fef3c7',

  // Error/Danger colors
  error: '#ef4444',
  errorDark: '#dc2626',
  errorLight: '#f87171',
  errorLightest: '#fee2e2',

  // Neutral colors
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',

  // Background colors
  background: '#f9fafb',
  backgroundSecondary: '#ffffff',
  surface: '#ffffff',
  surfaceElevated: '#ffffff',

  // Text colors
  textPrimary: '#111827',
  textSecondary: '#6b7280',
  textTertiary: '#9ca3af',
  textInverse: '#ffffff',

  // Border colors
  border: '#e5e7eb',
  borderLight: '#f3f4f6',
  borderDark: '#d1d5db',

  // Stage-specific colors
  stageDraft: '#6b7280', // gray500
  stageSubmitted: '#3b82f6', // primaryLight
  stagePreUnderwriting: '#f59e0b', // warning
  stageUnderwriting: '#8b5cf6', // secondary (purple)
  stageConditional: '#f97316', // Orange
  stageClearToClose: '#10b981', // success
  stageClosed: '#059669', // successDark
};

export const gradients = {
  primary: ['#2563eb', '#1d4ed8'],
  secondary: ['#7c3aed', '#6d28d9'],
  success: ['#10b981', '#059669'],
  purpleBlue: ['#7c3aed', '#2563eb'],
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  xlarge: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  h4: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
};

