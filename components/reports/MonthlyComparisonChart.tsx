import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import ThemedText from '@/components/common/ThemedText';
import Card from '@/components/common/Card';
import { BarChart } from 'react-native-chart-kit';
import { formatCurrency } from '@/utils/calculations';
import Animated, { FadeIn } from 'react-native-reanimated';

interface MonthlyComparisonProps {
  labels: string[];
  income: number[];
  expense: number[];
}

const MonthlyComparisonChart: React.FC<MonthlyComparisonProps> = ({
  labels,
  income,
  expense,
}) => {
  const { colors, isDark } = useTheme();
  const screenWidth = Dimensions.get('window').width - 32;

  if (labels.length === 0) {
    return (
      <Card style={styles.card}>
        <ThemedText variant="subtitle" weight="semibold" center>
          Monthly Income vs Expense
        </ThemedText>
        <View style={styles.emptyState}>
          <ThemedText center>No data available</ThemedText>
        </View>
      </Card>
    );
  }

  const data = {
    labels,
    datasets: [
      {
        data: income,
        color: () => colors.income,
        strokeWidth: 2,
      },
      {
        data: expense,
        color: () => colors.expense,
        strokeWidth: 2,
      },
    ],
    legend: ['Income', 'Expense'],
  };

  const chartConfig = {
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(${isDark ? '255, 255, 255' : '0, 0, 0'}, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(${isDark ? '255, 255, 255' : '0, 0, 0'}, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
    },
  };

  const totalIncome = income.reduce((sum, val) => sum + val, 0);
  const totalExpense = expense.reduce((sum, val) => sum + val, 0);
  const netSavings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

  return (
    <Card style={styles.card}>
      <ThemedText variant="subtitle" weight="semibold" center style={styles.title}>
        Monthly Income vs Expense
      </ThemedText>
      
      <Animated.View entering={FadeIn} style={styles.chartContainer}>
        <BarChart
          data={data}
          width={screenWidth - 32}
          height={220}
          chartConfig={chartConfig}
          style={styles.chart}
          fromZero
          showValuesOnTopOfBars={false}
          withInnerLines={false}
          yAxisLabel="$"
        />
      </Animated.View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <ThemedText variant="caption" color={colors.subtext}>
              Total Income
            </ThemedText>
            <ThemedText weight="semibold" color={colors.income}>
              {formatCurrency(totalIncome)}
            </ThemedText>
          </View>
          
          <View style={styles.statItem}>
            <ThemedText variant="caption" color={colors.subtext}>
              Total Expense
            </ThemedText>
            <ThemedText weight="semibold" color={colors.expense}>
              {formatCurrency(totalExpense)}
            </ThemedText>
          </View>
        </View>
        
        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <ThemedText variant="caption" color={colors.subtext}>
              Net Savings
            </ThemedText>
            <ThemedText 
              weight="semibold" 
              color={netSavings >= 0 ? colors.success : colors.error}
            >
              {formatCurrency(netSavings)}
            </ThemedText>
          </View>
          
          <View style={styles.statItem}>
            <ThemedText variant="caption" color={colors.subtext}>
              Savings Rate
            </ThemedText>
            <ThemedText 
              weight="semibold"
              color={savingsRate >= 0 ? colors.success : colors.error}
            >
              {savingsRate.toFixed(1)}%
            </ThemedText>
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 12,
  },
  title: {
    marginBottom: 16,
  },
  chartContainer: {
    alignItems: 'center',
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
  },
  statsContainer: {
    marginTop: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statItem: {
    flex: 1,
    padding: 8,
  },
  emptyState: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MonthlyComparisonChart;