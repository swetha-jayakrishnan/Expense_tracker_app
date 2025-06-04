import 'react-native-get-random-values';
import { Category } from '@/types/transaction';
import { v4 as uuidv4 } from 'uuid';

export const defaultCategories: Category[] = [
  // Income categories
  {
    id: uuidv4(),
    name: 'Salary',
    icon: 'briefcase',
    color: '#4CAF50',
    type: 'income',
  },
  {
    id: uuidv4(),
    name: 'Business',
    icon: 'trending-up',
    color: '#2196F3',
    type: 'income',
  },
  {
    id: uuidv4(),
    name: 'Investments',
    icon: 'bar-chart',
    color: '#9C27B0',
    type: 'income',
  },
  {
    id: uuidv4(),
    name: 'Gifts',
    icon: 'gift',
    color: '#FF9800',
    type: 'income',
  },
  {
    id: uuidv4(),
    name: 'Other Income',
    icon: 'plus-circle',
    color: '#607D8B',
    type: 'income',
  },
  
  // Expense categories
  {
    id: uuidv4(),
    name: 'Food',
    icon: 'coffee',
    color: '#F44336',
    type: 'expense',
  },
  {
    id: uuidv4(),
    name: 'Housing',
    icon: 'home',
    color: '#3F51B5',
    type: 'expense',
  },
  {
    id: uuidv4(),
    name: 'Transportation',
    icon: 'car',
    color: '#FF5722',
    type: 'expense',
  },
  {
    id: uuidv4(),
    name: 'Shopping',
    icon: 'shopping-bag',
    color: '#E91E63',
    type: 'expense',
  },
  {
    id: uuidv4(),
    name: 'Entertainment',
    icon: 'film',
    color: '#673AB7',
    type: 'expense',
  },
  {
    id: uuidv4(),
    name: 'Health',
    icon: 'activity',
    color: '#00BCD4',
    type: 'expense',
  },
  {
    id: uuidv4(),
    name: 'Education',
    icon: 'book',
    color: '#8BC34A',
    type: 'expense',
  },
  {
    id: uuidv4(),
    name: 'Bills',
    icon: 'file-text',
    color: '#FFC107',
    type: 'expense',
  },
  {
    id: uuidv4(),
    name: 'Other',
    icon: 'more-horizontal',
    color: '#607D8B',
    type: 'expense',
  }
];