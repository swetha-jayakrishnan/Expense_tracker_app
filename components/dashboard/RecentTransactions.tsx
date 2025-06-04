import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { formatDate, formatCurrency } from '@/utils/calculations';
import { TransactionWithCategory } from '@/types/transaction';
import ThemedText from '@/components/common/ThemedText';
import Card from '@/components/common/Card';
import { CircleArrowDown as ArrowDownCircle, CircleArrowUp as ArrowUpCircle, ChevronRight, ShoppingBag } from 'lucide-react-native';
import { router } from 'expo-router';
import Animated, { FadeInRight } from 'react-native-reanimated';

interface RecentTransactionsProps {
  transactions: TransactionWithCategory[];
  limit?: number;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions, limit = 5 }) => {
  const { colors } = useTheme();
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);

  if (recentTransactions.length === 0) {
    return (
      <Card>
        <ThemedText center weight="medium">No recent transactions</ThemedText>
        <TouchableOpacity 
          style={[styles.emptyStateButton, { borderColor: colors.primary }]}
          onPress={() => router.push('/add-transaction')}
        >
          <ThemedText color={colors.primary} weight="medium">Add Transaction</ThemedText>
        </TouchableOpacity>
      </Card>
    );
  }

  const viewAllTransactions = () => {
    router.push('/history');
  };

  const renderItem = ({ item, index }: { item: TransactionWithCategory; index: number }) => (
    <Animated.View entering={FadeInRight.delay(index * 100).duration(300)}>
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
            {formatDate(item.date)}
          </ThemedText>
        </View>
        
        <ThemedText 
          weight="semibold" 
          color={item.type === 'income' ? colors.income : colors.expense}
        >
          {item.type === 'income' ? '+' : '-'} {formatCurrency(item.amount)}
        </ThemedText>
      </TouchableOpacity>
      
      {index < recentTransactions.length - 1 && (
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
      )}
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText variant="subtitle" weight="semibold">Recent Transactions</ThemedText>
        <TouchableOpacity onPress={viewAllTransactions}>
          <ThemedText color={colors.primary} weight="medium">
            View All
          </ThemedText>
        </TouchableOpacity>
      </View>

      <Card>
        <FlatList
          data={recentTransactions}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          scrollEnabled={false}
        />
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
  divider: {
    height: 1,
    width: '100%',
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

export default RecentTransactions;