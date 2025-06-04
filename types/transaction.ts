export type TransactionType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  date: string; // ISO string
  note?: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface TransactionWithCategory extends Transaction {
  category: Category;
}

export interface Period {
  startDate: Date;
  endDate: Date;
  label: string;
}

export interface Balance {
  total: number;
  income: number;
  expense: number;
}

export interface ChartData {
  labels: string[];
  data: number[];
  colors: string[];
}

export interface CategoryTotal {
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  amount: number;
  percentage: number;
}