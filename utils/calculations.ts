import { format, parseISO, isWithinInterval, startOfDay, endOfDay, startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfYear, endOfYear, subMonths, subWeeks, subYears } from 'date-fns';
import { Transaction, Balance, Period, CategoryTotal, TransactionWithCategory, Category, ChartData } from '@/types/transaction';

// Calculate total balance from transactions
export function calculateBalance(transactions: Transaction[]): Balance {
  const balance = {
    total: 0,
    income: 0,
    expense: 0
  };

  transactions.forEach(transaction => {
    if (transaction.type === 'income') {
      balance.income += transaction.amount;
      balance.total += transaction.amount;
    } else {
      balance.expense += transaction.amount;
      balance.total -= transaction.amount;
    }
  });

  return balance;
}

// Filter transactions by date range
export function filterTransactionsByDateRange(
  transactions: Transaction[],
  startDate: Date,
  endDate: Date
): Transaction[] {
  return transactions.filter(transaction => {
    const transactionDate = parseISO(transaction.date);
    return isWithinInterval(transactionDate, {
      start: startOfDay(startDate),
      end: endOfDay(endDate)
    });
  });
}

// Get predefined date periods
export function getDatePeriods(): Period[] {
  const now = new Date();
  
  return [
    {
      startDate: startOfDay(now),
      endDate: endOfDay(now),
      label: 'Today'
    },
    {
      startDate: startOfWeek(now),
      endDate: endOfWeek(now),
      label: 'This Week'
    },
    {
      startDate: startOfMonth(now),
      endDate: endOfMonth(now),
      label: 'This Month'
    },
    {
      startDate: startOfDay(subMonths(now, 1)),
      endDate: endOfDay(now),
      label: 'Last 30 Days'
    },
    {
      startDate: startOfDay(subMonths(now, 3)),
      endDate: endOfDay(now),
      label: 'Last 3 Months'
    },
    {
      startDate: startOfYear(now),
      endDate: endOfYear(now),
      label: 'This Year'
    },
    {
      startDate: startOfDay(subYears(now, 1)),
      endDate: endOfDay(now),
      label: 'Last 12 Months'
    }
  ];
}

// Calculate totals by category
export function calculateTotalsByCategory(
  transactions: TransactionWithCategory[],
  type: 'income' | 'expense'
): CategoryTotal[] {
  const filteredTransactions = transactions.filter(t => t.type === type);
  const totalAmount = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
  
  const categoryMap = new Map<string, { 
    amount: number; 
    name: string; 
    color: string;
  }>();
  
  filteredTransactions.forEach(transaction => {
    const { categoryId, amount, category } = transaction;
    if (!categoryMap.has(categoryId)) {
      categoryMap.set(categoryId, { 
        amount: 0, 
        name: category.name, 
        color: category.color 
      });
    }
    
    const current = categoryMap.get(categoryId)!;
    current.amount += amount;
    categoryMap.set(categoryId, current);
  });
  
  const result: CategoryTotal[] = [];
  
  categoryMap.forEach((value, categoryId) => {
    result.push({
      categoryId,
      categoryName: value.name,
      categoryColor: value.color,
      amount: value.amount,
      percentage: totalAmount > 0 ? (value.amount / totalAmount) * 100 : 0
    });
  });
  
  return result.sort((a, b) => b.amount - a.amount);
}

// Prepare data for pie chart
export function preparePieChartData(categoryTotals: CategoryTotal[]): ChartData {
  return {
    labels: categoryTotals.map(ct => ct.categoryName),
    data: categoryTotals.map(ct => ct.amount),
    colors: categoryTotals.map(ct => ct.categoryColor)
  };
}

// Prepare data for bar chart (monthly income vs expense)
export function prepareMonthlyComparisonData(
  transactions: Transaction[],
  months: number = 6
): {
  labels: string[];
  income: number[];
  expense: number[];
} {
  const now = new Date();
  const result = {
    labels: [] as string[],
    income: [] as number[],
    expense: [] as number[]
  };
  
  for (let i = months - 1; i >= 0; i--) {
    const currentMonth = subMonths(now, i);
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    
    const monthTransactions = filterTransactionsByDateRange(transactions, start, end);
    const { income, expense } = calculateBalance(monthTransactions);
    
    result.labels.push(format(currentMonth, 'MMM'));
    result.income.push(income);
    result.expense.push(expense);
  }
  
  return result;
}

// Format currency
export function formatCurrency(amount: number): string {
  // Always prefix with the rupee symbol and a space for clarity
  return '₹ ' + new Intl.NumberFormat('en-IN', { 
    style: 'decimal', 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2 
  }).format(amount);
}

// Format date
export function formatDate(dateString: string, formatString: string = 'MMM dd, yyyy'): string {
  try {
    return format(parseISO(dateString), formatString);
  } catch (error) {
    console.error('Date formatting error:', error);
    return dateString;
  }
}