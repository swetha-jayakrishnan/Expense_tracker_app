import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { formatCurrency } from '@/utils/calculations';
import Card from '@/components/common/Card';
import ThemedText from '@/components/common/ThemedText';
import { CircleArrowDown as ArrowDownCircle, CircleArrowUp as ArrowUpCircle, IndianRupee } from 'lucide-react-native';
import Animated, { FadeInUp, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface BalanceCardProps {
  total: number;
  income: number;
  expense: number;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ total, income, expense }) => {
  const { colors } = useTheme();
  const opacity = useSharedValue(0.7);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(opacity.value, { duration: 500 }),
    };
  });

  React.useEffect(() => {
    opacity.value = 1;
  }, []);

  return (
    <Card style={styles.card}>
      <Animated.View 
        style={[styles.totalContainer, animatedStyle]} 
        entering={FadeInUp.duration(300).delay(100)}
      >
        <View style={styles.iconContainer}>
          <IndianRupee size={28} color={colors.primary} />
        </View>
        <View style={styles.balanceTextContainer}>
          <ThemedText variant="caption" weight="medium" color={colors.subtext}>
            Current Balance
          </ThemedText>
          <ThemedText variant="title" weight="bold">
            {formatCurrency(total)}
          </ThemedText>
        </View>
      </Animated.View>

      <View style={styles.detailsContainer}>
        <Animated.View 
          style={styles.detailItem} 
          entering={FadeInUp.duration(300).delay(200)}
        >
          <View style={[styles.iconSmall, { backgroundColor: colors.income + '20' }]}>
            <ArrowUpCircle size={18} color={colors.income} />
          </View>
          <View>
            <ThemedText variant="caption" color={colors.subtext}>
              Income
            </ThemedText>
            <ThemedText variant="body" weight="semibold" color={colors.income}>
              {formatCurrency(income)}
            </ThemedText>
          </View>
        </Animated.View>

        <Animated.View 
          style={styles.detailItem} 
          entering={FadeInUp.duration(300).delay(300)}
        >
          <View style={[styles.iconSmall, { backgroundColor: colors.expense + '20' }]}>
            <ArrowDownCircle size={18} color={colors.expense} />
          </View>
          <View>
            <ThemedText variant="caption" color={colors.subtext}>
              Expense
            </ThemedText>
            <ThemedText variant="body" weight="semibold" color={colors.expense}>
              {formatCurrency(expense)}
            </ThemedText>
          </View>
        </Animated.View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 16,
  },
  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  balanceTextContainer: {
    flex: 1,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconSmall: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
});

export default BalanceCard;