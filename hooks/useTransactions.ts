import { useState, useEffect, useCallback } from 'react';
import { Transaction, TransactionWithCategory, Category } from '@/types/transaction';
import * as Storage from '@/utils/storage';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load transactions and categories
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [transactionsData, categoriesData] = await Promise.all([
        Storage.getTransactions(),
        Storage.getCategories()
      ]);
      
      setTransactions(transactionsData);
      setCategories(categoriesData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Add transaction
  const addTransaction = useCallback(async (
    amount: number,
    type: 'income' | 'expense',
    categoryId: string,
    date: Date,
    note?: string
  ) => {
    try {
      const now = new Date().toISOString();
      const newTransaction: Transaction = {
        id: uuidv4(),
        amount,
        type,
        categoryId,
        date: date.toISOString(),
        note,
        createdAt: now,
        updatedAt: now
      };

      const success = await Storage.addTransaction(newTransaction);
      if (success) {
        setTransactions(prev => [...prev, newTransaction]);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error adding transaction:', err);
      setError('Failed to add transaction. Please try again.');
      return false;
    }
  }, []);

  // Update transaction
  const updateTransaction = useCallback(async (updatedTransaction: Transaction) => {
    try {
      const now = new Date().toISOString();
      const transactionToUpdate = {
        ...updatedTransaction,
        updatedAt: now
      };

      const success = await Storage.updateTransaction(transactionToUpdate);
      if (success) {
        setTransactions(prev => 
          prev.map(t => t.id === updatedTransaction.id ? transactionToUpdate : t)
        );
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error updating transaction:', err);
      setError('Failed to update transaction. Please try again.');
      return false;
    }
  }, []);

  // Delete transaction
  const deleteTransaction = useCallback(async (id: string) => {
    try {
      const success = await Storage.deleteTransaction(id);
      if (success) {
        setTransactions(prev => prev.filter(t => t.id !== id));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error deleting transaction:', err);
      setError('Failed to delete transaction. Please try again.');
      return false;
    }
  }, []);

  // Add category
  const addCategory = useCallback(async (newCategory: Omit<Category, 'id'>) => {
    try {
      const category: Category = {
        ...newCategory,
        id: uuidv4()
      };

      const success = await Storage.addCategory(category);
      if (success) {
        setCategories(prev => [...prev, category]);
        return category.id;
      }
      return null;
    } catch (err) {
      console.error('Error adding category:', err);
      setError('Failed to add category. Please try again.');
      return null;
    }
  }, []);

  // Get transactions with category data
  const getTransactionsWithCategory = useCallback((): TransactionWithCategory[] => {
    return transactions.map(transaction => {
      const category = categories.find(c => c.id === transaction.categoryId) || {
        id: '',
        name: 'Unknown',
        icon: 'help-circle',
        color: '#808080',
        type: transaction.type
      };
      
      return {
        ...transaction,
        category
      };
    });
  }, [transactions, categories]);

  // Initial data load
  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    transactions,
    categories,
    loading,
    error,
    loadData,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    getTransactionsWithCategory
  };
}