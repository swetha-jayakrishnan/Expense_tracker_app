import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, SectionList } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { TransactionWithCategory } from '@/types/transaction';
import { formatCurrency, formatDate } from '@/utils/calculations';
import ThemedText from '@/components/common/ThemedText';
import { CircleArrowDown as ArrowDownCircle, CircleArrowUp as ArrowUpCircle } from 'lucide-react-native';
import { router } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';

interface TransactionListProps {
  transactions: TransactionWithCategory[];
  groupByDate?: boolean;
}

interface TransactionSection {
  title: string;
  data: TransactionWithCategory[];
}

const TransactionList: React.FC<TransactionListProps> = ({ 
  transactions,
  groupByDate = true
}) => {
  const { colors } = useTheme();
  
  const renderItem = ({ item }: { item: TransactionWithCategory }) => (
    <TouchableOpacity 
      style={styles.transactionItem}
      onPress={() => router.push({ pathname: '/modal', params: { id: item.id } })}
    >
      <View style={[styles.iconContainer, { backgroundColor: item.category.color + '20' }]}>
        {item.type === 'income' ? (
          <ArrowUpCircle size={20} color={colors.income} />
        ) : (
          <ArrowDownCircle size={20} color={colors.expense} />
        )}
      </View>
      
      <View style={styles.transactionInfo}>
        <ThemedText weight="medium">
          {item.category.name}
        </ThemedText>
        <ThemedText variant="caption" color={colors.subtext}>
          {item.note ? item.note : 'No note'}
        </ThemedText>
      </View>
      
      <View style={styles.amountContainer}>
        <ThemedText 
          weight="semibold" 
          color={item.type === 'income' ? colors.income : colors.expense}
        >
          {item.type === 'income' ? '+' : '-'} {formatCurrency(item.amount)}
        </ThemedText>
        <ThemedText variant="caption" color={colors.subtext}>
          {formatDate(item.date, 'MMM dd')}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
  
  if (transactions.length === 0) {
    return (
      <Animated.View 
        style={[styles.emptyContainer, { backgroundColor: colors.card }]}
        entering={FadeIn}
      >
        <ThemedText center weight="medium">No transactions found</ThemedText>
        <TouchableOpacity 
          style={[styles.emptyStateButton, { borderColor: colors.primary }]}
          onPress={() => router.push('/add-transaction')}
        >
          <ThemedText color={colors.primary} weight="medium">Add Transaction</ThemedText>
        </TouchableOpacity>
      </Animated.View>
    );
  }
  
  if (!groupByDate) {
    return (
      <FlatList
        data={transactions}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={() => (
          <View style={[styles.separator, { backgroundColor: colors.border }]} />
        )}
        style={[styles.list, { backgroundColor: colors.card }]}
        contentContainerStyle={styles.listContent}
      />
    );
  }
  
  // Group transactions by date
  const groupedTransactions: TransactionSection[] = React.useMemo(() => {
    const groups: { [key: string]: TransactionWithCategory[] } = {};
    
    transactions.forEach(transaction => {
      const dateFormatted = formatDate(transaction.date, 'yyyy-MM-dd');
      if (!groups[dateFormatted]) {
        groups[dateFormatted] = [];
      }
      groups[dateFormatted].push(transaction);
    });
    
    return Object.entries(groups)
      .map(([date, items]) => ({
        title: formatDate(items[0].date, 'EEEE, MMMM d, yyyy'),
        data: items,
      }))
      .sort((a, b) => {
        const dateA = new Date(a.data[0].date);
        const dateB = new Date(b.data[0].date);
        return dateB.getTime() - dateA.getTime(); // Sort by most recent
      });
  }, [transactions]);

  return (
    <SectionList
      sections={groupedTransactions}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      renderSectionHeader={({ section: { title } }) => (
        <View style={[styles.sectionHeader, { backgroundColor: colors.background }]}>
          <ThemedText weight="semibold" color={colors.subtext}>
            {title}
          </ThemedText>
        </View>
      )}
      ItemSeparatorComponent={() => (
        <View style={[styles.separator, { backgroundColor: colors.border }]} />
      )}
      style={[styles.list, { backgroundColor: colors.card }]}
      contentContainerStyle={styles.listContent}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    borderRadius: 16,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  listContent: {
    paddingBottom: 8,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  separator: {
    height: 1,
    marginLeft: 68,
  },
  emptyContainer: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  emptyStateButton: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
  },
});

export default TransactionList;