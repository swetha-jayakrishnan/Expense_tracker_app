import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface ThemedTextProps extends TextProps {
  variant?: 'title' | 'subtitle' | 'body' | 'caption' | 'label';
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  color?: string;
  center?: boolean;
}

const ThemedText: React.FC<ThemedTextProps> = ({
  variant = 'body',
  weight = 'regular',
  style,
  color,
  center = false,
  ...props
}) => {
  const { colors } = useTheme();
  
  const getFontFamily = () => {
    switch (weight) {
      case 'medium':
        return 'Inter-Medium';
      case 'semibold':
        return 'Inter-SemiBold';
      case 'bold':
        return 'Inter-Bold';
      default:
        return 'Inter-Regular';
    }
  };
  
  const textStyles = [
    styles[variant],
    { 
      fontFamily: getFontFamily(),
      color: color || colors.text,
      textAlign: center ? 'center' : undefined,
    },
    style,
  ];
  
  return <Text style={textStyles} {...props} />;
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    lineHeight: 20,
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
  },
});

export default ThemedText;