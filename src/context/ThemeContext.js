// ============================================================
// THEME CONTEXT — DEUTSCH QUEST 🇩🇪
// Backed by central Zustand store for zero-latency switching
// ============================================================

import React, { createContext, useContext } from 'react';
import { THEME } from '../styles/theme';
import { useAppStore } from '../store/useAppStore';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const themeMode = useAppStore((s) => s.themeMode);
  const setThemeMode = useAppStore((s) => s.setThemeMode);
  const toggleTheme = useAppStore((s) => s.toggleTheme);

  const isDark = themeMode === 'dark';
  const activeColors = isDark ? THEME.dark : THEME.light;

  const currentTheme = {
    mode: themeMode,
    isDark,
    colors: activeColors,
    shadows: isDark ? THEME.shadowsDark : THEME.shadows,
    gradients: THEME.gradients,
    spacing: THEME.spacing,
    radius: THEME.radius,
  };

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        setThemeMode,
        toggleTheme,
        isDark,
        theme: currentTheme,
        colors: activeColors,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return context;
}
