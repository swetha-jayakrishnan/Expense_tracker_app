import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { useTransactions } from '@/hooks/useTransactions';
import { 
  getDatePeriods, 
  filterTransactionsByDateRange, 
  calculateTotalsByCategory,
  preparePieChartData,
  prepareMonthlyComparisonData,
  calculateBalance
} from '@/utils/calculations';
import { Period } from '@/types/transaction';
import DateRangeSelector from '@/components/history/DateRangeSelector';
import CategoryPieChart from '@/components/reports/CategoryPieChart';
import MonthlyComparisonChart from '@/components/reports/MonthlyComparisonChart';
import ThemedText from '@/components/common/ThemedText';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function ReportsScreen() {
  const { colors } = useTheme();
  const { getTransactionsWithCategory } = useTransactions();
  
  const datePeriods = getDatePeriods();
  const [selectedPeriod, setSelectedPeriod] = useState<Period>(datePeriods[4]); // Last 3 Months
  
  const transactionsWithCategory = getTransactionsWithCategory();
  const filteredTransactions = filterTransactionsByDateRange(
    transactionsWithCategory,
    selectedPeriod.startDate,
    selectedPeriod.endDate
  );
  
  // Calculate summary data
  const { income: totalIncome, expense: totalExpense } = calculateBalance(filteredTransactions);
  
  // Get category totals
  const expenseCategoryTotals = calculateTotalsByCategory(filteredTransactions, 'expense');
  const incomeCategoryTotals = calculateTotalsByCategory(filteredTransactions, 'income');
  
  // Prepare chart data
  const expensePieData = preparePieChartData(expenseCategoryTotals);
  const incomePieData = preparePieChartData(incomeCategoryTotals);
  
  // Monthly comparison data
  const monthlyData = prepareMonthlyComparisonData(transactionsWithCategory, 6);
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View 
          entering={FadeInDown.delay(100).duration(300)}
          style={styles.headerContainer}
        >
          <ThemedText variant="title" weight="bold">
            Financial Reports
          </ThemedText>
          <ThemedText variant="body" color={colors.subtext}>
            Visualize your spending habits
          </ThemedText>
        </Animated.View>
        
        <DateRangeSelector
          periods={datePeriods}
          selectedPeriod={selectedPeriod}
          onSelectPeriod={setSelectedPeriod}
        />
        
        <Animated.View entering={FadeInDown.delay(200).duration(300)}>
          <MonthlyComparisonChart
            labels={monthlyData.labels}
            income={monthlyData.income}
            expense={monthlyData.expense}
          />
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(300).duration(300)}>
          <CategoryPieChart 
            data={expensePieData}
            categoryTotals={expenseCategoryTotals}
            title="Expense Breakdown"
            totalAmount={totalExpense}
          />
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(400).duration(300)}>
          <CategoryPieChart 
            data={incomePieData}
            categoryTotals={incomeCategoryTotals}
            title="Income Sources"
            totalAmount={totalIncome}
          />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  headerContainer: {
    marginBottom: 16,
  },
});