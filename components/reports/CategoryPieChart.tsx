import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { ChartData, CategoryTotal } from '@/types/transaction';
import ThemedText from '@/components/common/ThemedText';
import Card from '@/components/common/Card';
import { PieChart } from 'react-native-chart-kit';
import { formatCurrency } from '@/utils/calculations';
import Animated, { FadeIn } from 'react-native-reanimated';

interface CategoryPieChartProps {
  data: ChartData;
  categoryTotals: CategoryTotal[];
  title: string;
  totalAmount: number;
}

const CategoryPieChart: React.FC<CategoryPieChartProps> = ({
  data,
  categoryTotals,
  title,
  totalAmount,
}) => {
  const { colors, isDark } = useTheme();
  const screenWidth = Dimensions.get('window').width - 32; // Full width minus padding

  // If no data, show empty state
  if (data.data.length === 0) {
    return (
      <Card style={styles.card}>
        <ThemedText variant="subtitle" weight="semibold" center>
          {title}
        </ThemedText>
        <View style={styles.emptyState}>
          <ThemedText center>No data available</ThemedText>
        </View>
      </Card>
    );
  }

  // Prepare data for chart
  const chartData = data.data.map((amount, index) => {
    return {
      name: data.labels[index],
      amount,
      color: data.colors[index],
      legendFontColor: colors.text,
      legendFontSize: 12,
    };
  });

  return (
    <Card style={styles.card}>
      <ThemedText variant="subtitle" weight="semibold" center style={styles.title}>
        {title}
      </ThemedText>
      
      <Animated.View entering={FadeIn} style={styles.chartContainer}>
        <PieChart
          data={chartData}
          width={screenWidth - 32}
          height={200}
          chartConfig={{
            backgroundGradientFrom: isDark ? '#1E1E1E' : '#FFFFFF',
            backgroundGradientTo: isDark ? '#1E1E1E' : '#FFFFFF',
            color: (opacity = 1) => `rgba(${isDark ? '255, 255, 255' : '0, 0, 0'}, ${opacity})`,
          }}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="0"
          absolute
        />
      </Animated.View>
      
      <View style={styles.legendContainer}>
        <ThemedText weight="semibold" center style={styles.totalText}>
          Total: {formatCurrency(totalAmount)}
        </ThemedText>
        
        {categoryTotals.slice(0, 5).map((category, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: category.categoryColor }]} />
            <ThemedText style={styles.legendName} numberOfLines={1} ellipsizeMode="tail">
              {category.categoryName}
            </ThemedText>
            <View style={styles.legendValues}>
              <ThemedText weight="semibold">
                {formatCurrency(category.amount)}
              </ThemedText>
              <ThemedText variant="caption" color={colors.subtext}>
                {category.percentage.toFixed(1)}%
              </ThemedText>
            </View>
          </View>
        ))}
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
  legendContainer: {
    marginTop: 16,
  },
  totalText: {
    marginBottom: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendName: {
    flex: 1,
  },
  legendValues: {
    alignItems: 'flex-end',
  },
  emptyState: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CategoryPieChart;