// Material Design Theme Configuration
// This file contains the Material Design 3 theme setup for the app

import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6750a4',
    onPrimary: '#ffffff',
    primaryContainer: '#eaddff',
    onPrimaryContainer: '#21005e',
    secondary: '#625b71',
    onSecondary: '#ffffff',
    secondaryContainer: '#e8def8',
    onSecondaryContainer: '#1e192b',
    tertiary: '#7d5260',
    onTertiary: '#ffffff',
    tertiaryContainer: '#ffd8e4',
    onTertiaryContainer: '#31111d',
    error: '#b3261e',
    onError: '#ffffff',
    errorContainer: '#f9dedc',
    onErrorContainer: '#410e0b',
    background: '#fffbfe',
    onBackground: '#1c1b1f',
    surface: '#fffbfe',
    onSurface: '#1c1b1f',
    outlineVariant: '#cac7d0',
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#d0bcff',
    onPrimary: '#371e73',
    primaryContainer: '#4f378b',
    onPrimaryContainer: '#eaddff',
    secondary: '#ccc7db',
    onSecondary: '#312e45',
    secondaryContainer: '#4a4458',
    onSecondaryContainer: '#e8def8',
    tertiary: '#f0b8d8',
    onTertiary: '#492532',
    tertiaryContainer: '#633b48',
    onTertiaryContainer: '#ffd8e4',
    error: '#f9b4ae',
    onError: '#561514',
    errorContainer: '#73302b',
    onErrorContainer: '#f9dedc',
    background: '#1c1b1f',
    onBackground: '#e6e1e6',
    surface: '#1c1b1f',
    onSurface: '#e6e1e6',
    outlineVariant: '#49454e',
  },
};

// You can customize these colors according to your brand guidelines
// Visit https://m3.material.io/theme-builder to generate custom color palettes
