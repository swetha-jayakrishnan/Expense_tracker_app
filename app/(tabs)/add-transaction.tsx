import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { useTransactionsContext } from '@/context/TransactionsContext';
import TransactionForm from '@/components/transaction/TransactionForm';
import ThemedText from '@/components/common/ThemedText';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { router } from 'expo-router';

function AddTransactionScreen() {
  const { colors } = useTheme();
  const { categories, addTransaction } = useTransactionsContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (
    amount: number,
    type: 'income' | 'expense',
    categoryId: string,
    date: Date,
    note?: string
  ) => {
    setIsSubmitting(true);
    
    try {
      const success = await addTransaction(amount, type, categoryId, date, note);
      if (success) {
        router.replace('/');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error submitting transaction:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInDown.duration(300)}>
          <ThemedText variant="title" weight="bold" style={styles.heading}>
            Add Transaction
          </ThemedText>
          <ThemedText variant="body" color={colors.subtext} style={styles.subheading}>
            Record your income or expenses
          </ThemedText>
        </Animated.View>
        
        <TransactionForm 
          categories={categories} 
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
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
    flexGrow: 1,
  },
  heading: {
    marginBottom: 4,
  },
  subheading: {
    marginBottom: 24,
  },
});

export default AddTransactionScreen;