/**
 * DIGITAL-SOMITY DESIGN SYSTEM TOKENS (v1.2)
 * Premium Fintech | Minimal | Royal Blue & Deep Navy
 */

export const THEME_CONFIG = {
  dark: {
    background: '#000000',
    surface: '#09090D',
    primaryBrand: '#0F5BE4',
    brandVariant: '#6BBCE9',
    primaryText: '#FFFFFF',
    secondaryText: '#E5E0E4',
    success: '#10B981',
    error: '#EF4444',
    border: '#0F5BE4',
  },
  light: {
    background: '#FFFDFE',
    surface: '#FFFFFF',
    primaryBrand: '#0F5BE4',
    brandVariant: '#6BBCE9',
    primaryText: '#041B45',
    secondaryText: '#64748B',
    success: '#059669',
    error: '#DC2626',
    border: '#E5E0E4',
  },
  fonts: {
    logo: 'Caviler',
    heading: 'Sora',
    ui: 'Inter',
    bangla: 'Hind Siliguri',
  },
  weights: {
    regular: 400,
    medium: 500,
    semiBold: 600,
    bold: 700,
  },
} as const;

export type ThemeMode = 'dark' | 'light';
