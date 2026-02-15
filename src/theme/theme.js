// src/theme/theme.js
import { Platform } from 'react-native';

export const theme = {
  colors: {
    // Primary Brand Colors
    primary: '#4F46E5',        // Indigo 600
    primaryLight: '#818CF8',   // Indigo 400
    primaryDark: '#3730A3',    // Indigo 800

    // Background & Surfaces
    background: '#F9FAFB',     // Gray 50
    surface: '#FFFFFF',        // White
    surfaceSecondary: '#F3F4F6', // Gray 100

    // Text Colors
    text: '#111827',           // Gray 900
    textSecondary: '#4B5563',  // Gray 600
    textLight: '#9CA3AF',      // Gray 400

    // Semantic Colors
    success: '#10B981',        // Emerald 500
    error: '#EF4444',          // Red 500
    warning: '#F59E0B',        // Amber 500
    info: '#3B82F6',           // Blue 500

    // Others
    accent: '#8B5CF6',         // Violet 500
    border: '#E5E7EB',         // Gray 200
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },

  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    round: 9999,
  },

  shadows: {
    small: Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
    medium: Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
    large: Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
      },
      android: {
        elevation: 8,
      },
    }),
  },
};

export default theme;
