import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction, Category } from '@/types/transaction';
import { defaultCategories } from './defaultData';

// Storage keys
const TRANSACTIONS_KEY = 'expenseTracker_transactions';
const CATEGORIES_KEY = 'expenseTracker_categories';

// Get all transactions
export async function getTransactions(): Promise<Transaction[]> {
  try {
    const data = await AsyncStorage.getItem(TRANSACTIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to get transactions', error);
    return [];
  }
}

// Add a new transaction
export async function addTransaction(transaction: Transaction): Promise<boolean> {
  try {
    const transactions = await getTransactions();
    transactions.push(transaction);
    await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
    return true;
  } catch (error) {
    console.error('Failed to add transaction', error);
    return false;
  }
}

// Update a transaction
export async function updateTransaction(updatedTransaction: Transaction): Promise<boolean> {
  try {
    let transactions = await getTransactions();
    transactions = transactions.map(t => 
      t.id === updatedTransaction.id ? updatedTransaction : t
    );
    await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
    return true;
  } catch (error) {
    console.error('Failed to update transaction', error);
    return false;
  }
}

// Delete a transaction
export async function deleteTransaction(id: string): Promise<boolean> {
  try {
    let transactions = await getTransactions();
    transactions = transactions.filter(t => t.id !== id);
    await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
    return true;
  } catch (error) {
    console.error('Failed to delete transaction', error);
    return false;
  }
}

// Get all categories
export async function getCategories(): Promise<Category[]> {
  try {
    const data = await AsyncStorage.getItem(CATEGORIES_KEY);
    if (data) {
      return JSON.parse(data);
    } else {
      // Initialize with default categories if none exist
      await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(defaultCategories));
      return defaultCategories;
    }
  } catch (error) {
    console.error('Failed to get categories', error);
    return defaultCategories;
  }
}

// Add a new category
export async function addCategory(category: Category): Promise<boolean> {
  try {
    const categories = await getCategories();
    categories.push(category);
    await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    return true;
  } catch (error) {
    console.error('Failed to add category', error);
    return false;
  }
}

// Update a category
export async function updateCategory(updatedCategory: Category): Promise<boolean> {
  try {
    let categories = await getCategories();
    categories = categories.map(c => 
      c.id === updatedCategory.id ? updatedCategory : c
    );
    await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    return true;
  } catch (error) {
    console.error('Failed to update category', error);
    return false;
  }
}

// Delete a category
export async function deleteCategory(id: string): Promise<boolean> {
  try {
    let categories = await getCategories();
    categories = categories.filter(c => c.id !== id);
    await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    return true;
  } catch (error) {
    console.error('Failed to delete category', error);
    return false;
  }
}

// Reset all data (for development/testing)
export async function resetAllData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([TRANSACTIONS_KEY, CATEGORIES_KEY]);
    await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(defaultCategories));
  } catch (error) {
    console.error('Failed to reset data', error);
  }
}