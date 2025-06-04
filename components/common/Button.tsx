import React from 'react';
import { 
  TouchableOpacity, 
  StyleSheet, 
  ViewStyle, 
  TextStyle, 
  StyleProp,
  ActivityIndicator,
  Platform 
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import ThemedText from './ThemedText';
import Animated, { FadeIn } from 'react-native-reanimated';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  fullWidth = false,
}) => {
  const { colors, isDark } = useTheme();
  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
  
  const getButtonStyles = (): StyleProp<ViewStyle> => {
    let variantStyle: ViewStyle = {};
    
    switch (variant) {
      case 'primary':
        variantStyle = {
          backgroundColor: colors.primary,
          borderColor: colors.primary,
        };
        break;
      case 'secondary':
        variantStyle = {
          backgroundColor: colors.secondary,
          borderColor: colors.secondary,
        };
        break;
      case 'outline':
        variantStyle = {
          backgroundColor: 'transparent',
          borderColor: colors.primary,
          borderWidth: 1,
        };
        break;
      case 'danger':
        variantStyle = {
          backgroundColor: colors.error,
          borderColor: colors.error,
        };
        break;
    }
    
    let sizeStyle: ViewStyle = {};
    
    switch (size) {
      case 'small':
        sizeStyle = {
          paddingVertical: 6,
          paddingHorizontal: 12,
          borderRadius: 8,
        };
        break;
      case 'medium':
        sizeStyle = {
          paddingVertical: 10,
          paddingHorizontal: 16,
          borderRadius: 10,
        };
        break;
      case 'large':
        sizeStyle = {
          paddingVertical: 14,
          paddingHorizontal: 24,
          borderRadius: 12,
        };
        break;
    }
    
    return [
      styles.button,
      variantStyle,
      sizeStyle,
      fullWidth && styles.fullWidth,
      disabled && {
        opacity: 0.6,
        backgroundColor: isDark ? '#555' : '#ccc',
        borderColor: isDark ? '#555' : '#ccc',
      },
      style,
    ];
  };
  
  const getTextColor = (): string => {
    if (disabled) {
      return isDark ? '#aaa' : '#666';
    }
    
    switch (variant) {
      case 'outline':
        return colors.primary;
      default:
        return '#fff';
    }
  };
  
  const getTextSize = (): number => {
    switch (size) {
      case 'small':
        return 12;
      case 'large':
        return 16;
      default:
        return 14;
    }
  };

  return (
    <AnimatedTouchable
      entering={FadeIn}
      onPress={onPress}
      style={getButtonStyles()}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <ThemedText 
          style={[
            { color: getTextColor(), fontSize: getTextSize() }, 
            textStyle
          ]}
          weight="medium"
        >
          {title}
        </ThemedText>
      )}
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        outlineStyle: 'none',
      }
    }),
  },
  fullWidth: {
    width: '100%',
  },
});

export default Button;