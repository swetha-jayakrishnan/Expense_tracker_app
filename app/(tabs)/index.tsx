import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { useTransactionsContext } from '@/context/TransactionsContext';
import { calculateBalance } from '@/utils/calculations';
import BalanceCard from '@/components/dashboard/BalanceCard';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import ThemedText from '@/components/common/ThemedText';
import Animated, { FadeInDown } from 'react-native-reanimated';

function DashboardScreen() {
  const { colors } = useTheme();
  const {
    transactions,
    categories,
    loading,
    getTransactionsWithCategory
  } = useTransactionsContext();
  
  const [refreshing, setRefreshing] = React.useState(false);

  const transactionsWithCategory = getTransactionsWithCategory();
  const balance = calculateBalance(transactions);
  
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    // Optionally, you can call loadData from context if needed
    setRefreshing(false);
  }, []);
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Animated.View 
          entering={FadeInDown.delay(100).duration(300)}
          style={styles.headerContainer}
        >
          <ThemedText variant="title" weight="bold">
            Expense Tracker
          </ThemedText>
          <ThemedText variant="body" color={colors.subtext}>
            {new Date().toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </ThemedText>
        </Animated.View>
        
        <BalanceCard 
          total={balance.total} 
          income={balance.income} 
          expense={balance.expense} 
        />
        
        <RecentTransactions 
          transactions={transactionsWithCategory} 
          limit={5} 
        />
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

export default DashboardScreen;