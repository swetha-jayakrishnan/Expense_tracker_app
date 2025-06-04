import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, ScrollView, Platform } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useTransactions } from '@/hooks/useTransactions';
import ThemedText from '@/components/common/ThemedText';
import Button from '@/components/common/Button';
import { formatCurrency, formatDate } from '@/utils/calculations';
import { CircleArrowDown as ArrowDownCircle, CircleArrowUp as ArrowUpCircle, Calendar, CreditCard as Edit, Trash, X } from 'lucide-react-native';
import Card from '@/components/common/Card';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function TransactionModal() {
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();
  const { transactions, categories, deleteTransaction, loading } = useTransactions();
  const [transaction, setTransaction] = useState<any>(null);
  const [category, setCategory] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id && transactions.length > 0) {
      const tx = transactions.find(t => t.id === id);
      if (tx) {
        setTransaction(tx);
        const cat = categories.find(c => c.id === tx.categoryId);
        setCategory(cat);
      } else {
        // Transaction not found
        Alert.alert('Error', 'Transaction not found');
        router.back();
      }
    }
  }, [id, transactions, categories]);

  const handleDelete = () => {
    if (Platform.OS === 'web') {
      if (confirm('Are you sure you want to delete this transaction?')) {
        confirmDelete();
      }
    } else {
      Alert.alert(
        'Delete Transaction',
        'Are you sure you want to delete this transaction?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Delete', 
            style: 'destructive',
            onPress: confirmDelete
          }
        ]
      );
    }
  };

  const confirmDelete = async () => {
    if (!transaction) return;
    
    setIsDeleting(true);
    const success = await deleteTransaction(transaction.id);
    setIsDeleting(false);
    
    if (success) {
      router.back();
    } else {
      Alert.alert('Error', 'Failed to delete transaction');
    }
  };

  if (!transaction || !category) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ThemedText>Loading...</ThemedText>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <X size={24} color={colors.text} />
        </TouchableOpacity>
        <ThemedText variant="subtitle" weight="semibold">
          Transaction Details
        </ThemedText>
        <View style={{ width: 24 }} /> {/* Empty view for spacing */}
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View 
          style={[styles.amountContainer, { backgroundColor: transaction.type === 'income' ? colors.income + '20' : colors.expense + '20' }]}
          entering={FadeIn.duration(300)}
        >
          {transaction.type === 'income' ? (
            <ArrowUpCircle size={32} color={colors.income} />
          ) : (
            <ArrowDownCircle size={32} color={colors.expense} />
          )}
          <ThemedText 
            variant="title" 
            weight="bold" 
            color={transaction.type === 'income' ? colors.income : colors.expense}
            style={styles.amount}
          >
            {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
          </ThemedText>
        </Animated.View>
        
        <Card style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <ThemedText color={colors.subtext}>Category</ThemedText>
            <View style={styles.categoryContainer}>
              <View 
                style={[
                  styles.categoryDot, 
                  { backgroundColor: category.color }
                ]} 
              />
              <ThemedText weight="medium">{category.name}</ThemedText>
            </View>
          </View>
          
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          
          <View style={styles.detailRow}>
            <ThemedText color={colors.subtext}>Date</ThemedText>
            <View style={styles.dateContainer}>
              <Calendar size={16} color={colors.text} style={styles.dateIcon} />
              <ThemedText weight="medium">
                {formatDate(transaction.date, 'EEEE, MMMM d, yyyy')}
              </ThemedText>
            </View>
          </View>
          
          {transaction.note && (
            <>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <View style={styles.noteContainer}>
                <ThemedText color={colors.subtext}>Note</ThemedText>
                <ThemedText style={styles.note}>{transaction.note}</ThemedText>
              </View>
            </>
          )}
        </Card>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Delete Transaction"
            onPress={handleDelete}
            variant="danger"
            loading={isDeleting}
            fullWidth
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  content: {
    padding: 16,
  },
  amountContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
  },
  amount: {
    marginTop: 8,
    textAlign: 'center',
  },
  detailsCard: {
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateIcon: {
    marginRight: 6,
  },
  divider: {
    height: 1,
    width: '100%',
  },
  noteContainer: {
    paddingVertical: 12,
  },
  note: {
    marginTop: 8,
  },
  buttonContainer: {
    marginTop: 24,
  },
});