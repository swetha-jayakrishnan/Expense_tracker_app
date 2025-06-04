import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import Animated, { FadeIn } from 'react-native-reanimated';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

const Card: React.FC<CardProps> = ({ children, style, onPress }) => {
  const { colors } = useTheme();
  
  const cardStyles = [
    styles.card,
    { 
      backgroundColor: colors.card,
      borderColor: colors.border,
    },
    style,
  ];
  
  const AnimatedView = Animated.createAnimatedComponent(View);

  return (
    <AnimatedView entering={FadeIn.duration(300)} style={cardStyles}>
      {children}
    </AnimatedView>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
  },
});

export default Card;