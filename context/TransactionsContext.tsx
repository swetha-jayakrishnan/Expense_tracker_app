import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Transaction, TransactionWithCategory, Category } from '@/types/transaction';
import * as Storage from '@/utils/storage';
import { v4 as uuidv4 } from 'uuid';

interface TransactionsContextType {
  transactions: Transaction[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  loadData: () => Promise<void>;
  addTransaction: (
    amount: number,
    type: 'income' | 'expense',
    categoryId: string,
    date: Date,
    note?: string
  ) => Promise<boolean>;
  updateTransaction: (updatedTransaction: Transaction) => Promise<boolean>;
  deleteTransaction: (id: string) => Promise<boolean>;
  addCategory: (newCategory: Omit<Category, 'id'>) => Promise<string | null>;
  getTransactionsWithCategory: () => TransactionWithCategory[];
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

export const TransactionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

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
      setError('Failed to add transaction. Please try again.');
      return false;
    }
  }, []);

  const updateTransaction = useCallback(async (updatedTransaction: Transaction) => {
    try {
      const now = new Date().toISOString();
      const transactionToUpdate = {
        ...updatedTransaction,
        updatedAt: now
      };
      const success = await Storage.updateTransaction(transactionToUpdate);
      if (success) {
        setTransactions(prev => prev.map(t => t.id === updatedTransaction.id ? transactionToUpdate : t));
        return true;
      }
      return false;
    } catch (err) {
      setError('Failed to update transaction. Please try again.');
      return false;
    }
  }, []);

  const deleteTransaction = useCallback(async (id: string) => {
    try {
      const success = await Storage.deleteTransaction(id);
      if (success) {
        setTransactions(prev => prev.filter(t => t.id !== id));
        return true;
      }
      return false;
    } catch (err) {
      setError('Failed to delete transaction. Please try again.');
      return false;
    }
  }, []);

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
      setError('Failed to add category. Please try again.');
      return null;
    }
  }, []);

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

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <TransactionsContext.Provider value={{
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
    }}>
      {children}
    </TransactionsContext.Provider>
  );
};

export function useTransactionsContext() {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error('useTransactionsContext must be used within a TransactionsProvider');
  }
  return context;
}
