import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeType = 'light' | 'dark' | 'system';

interface ThemeColors {
  background: string;
  card: string;
  text: string;
  subtext: string;
  border: string;
  primary: string;
  secondary: string;
  accent: string;
  income: string;
  expense: string;
  success: string;
  warning: string;
  error: string;
}

interface ThemeContextType {
  theme: ThemeType;
  colors: ThemeColors;
  isDark: boolean;
  setTheme: (theme: ThemeType) => void;
}

const lightColors: ThemeColors = {
  background: '#F9FAFB',
  card: '#FFFFFF',
  text: '#1F2937',
  subtext: '#6B7280',
  border: '#E5E7EB',
  primary: '#4CAF50',
  secondary: '#2196F3',
  accent: '#9C27B0',
  income: '#4CAF50',
  expense: '#F44336',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
};

const darkColors: ThemeColors = {
  background: '#121212',
  card: '#1E1E1E',
  text: '#E5E7EB',
  subtext: '#9CA3AF',
  border: '#374151',
  primary: '#81C784',
  secondary: '#64B5F6',
  accent: '#CE93D8',
  income: '#81C784',
  expense: '#E57373',
  success: '#81C784',
  warning: '#FFB74D',
  error: '#E57373',
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  colors: lightColors,
  isDark: false,
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeType>('system');
  const systemTheme = useColorScheme();
  const isDark = theme === 'dark' || (theme === 'system' && systemTheme === 'dark');
  const colors = isDark ? darkColors : lightColors;

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme) {
          setThemeState(savedTheme as ThemeType);
        }
      } catch (error) {
        console.log('Error loading theme', error);
      }
    };

    loadTheme();
  }, []);

  const setTheme = async (newTheme: ThemeType) => {
    try {
      await AsyncStorage.setItem('theme', newTheme);
      setThemeState(newTheme);
    } catch (error) {
      console.log('Error saving theme', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, colors, isDark, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};