import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { useTransactionsContext } from '@/context/TransactionsContext';
import { getDatePeriods, filterTransactionsByDateRange } from '@/utils/calculations';
import TransactionList from '@/components/history/TransactionList';
import DateRangeSelector from '@/components/history/DateRangeSelector';
import ThemedText from '@/components/common/ThemedText';
import { Period, TransactionWithCategory } from '@/types/transaction';
import { Search } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function HistoryScreen() {
  const { colors } = useTheme();
  const { getTransactionsWithCategory } = useTransactionsContext();
  
  const [searchQuery, setSearchQuery] = useState('');
  const datePeriods = getDatePeriods();
  const [selectedPeriod, setSelectedPeriod] = useState<Period>(datePeriods[3]); // Last 30 days
  // Memoize allTransactions to avoid infinite update loop
  const allTransactions = React.useMemo(() => getTransactionsWithCategory(), [getTransactionsWithCategory]);
  
  // Filter transactions based on date range and search query
  const filteredTransactions = useCallback((
    transactions: TransactionWithCategory[],
    period: Period,
    query: string
  ): TransactionWithCategory[] => {
    // First filter by date
    const dateFiltered = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= period.startDate && transactionDate <= period.endDate;
    });
    // Then filter by search query if provided
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      return dateFiltered.filter(transaction => 
        transaction.category.name.toLowerCase().includes(lowerQuery) ||
        transaction.note?.toLowerCase().includes(lowerQuery)
      );
    }
    return dateFiltered;
  }, []);
  
  const [displayedTransactions, setDisplayedTransactions] = useState<TransactionWithCategory[]>([]);
  
  useEffect(() => {
    setDisplayedTransactions(
      filteredTransactions(allTransactions, selectedPeriod, searchQuery)
    );
  }, [allTransactions, selectedPeriod, searchQuery, filteredTransactions]);
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerContainer}>
        <ThemedText variant="title" weight="bold">
          Transaction History
        </ThemedText>
      </View>
      
      <Animated.View 
        style={[styles.searchContainer, { backgroundColor: colors.card, borderColor: colors.border }]}
        entering={FadeIn}
      >
        <Search size={20} color={colors.subtext} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search transactions..."
          placeholderTextColor={colors.subtext}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </Animated.View>
      
      <DateRangeSelector
        periods={datePeriods}
        selectedPeriod={selectedPeriod}
        onSelectPeriod={setSelectedPeriod}
      />
      
      <ThemedText weight="medium" style={styles.resultCount}>
        {displayedTransactions.length} {displayedTransactions.length === 1 ? 'transaction' : 'transactions'} found
      </ThemedText>
      
      <TransactionList
        transactions={displayedTransactions}
        groupByDate={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerContainer: {
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    paddingVertical: 8,
  },
  resultCount: {
    marginVertical: 8,
  },
});