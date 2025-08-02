export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  description?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpenseData {
  title: string;
  amount: number;
  category: string;
  description?: string;
  date?: string;
}

export interface UpdateExpenseData {
  title?: string;
  amount?: number;
  category?: string;
  description?: string;
  date?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface MonthlyStats {
  month: string;
  totalAmount: number;
  expenseCount: number;
  categories: CategoryStats[];
}

export interface CategoryStats {
  category: string;
  amount: number;
  count: number;
  percentage: number;
}

export interface RecommendationResponse {
  recommendations: string[];
  insights: {
    highestCategory: string;
    averageDaily: number;
    monthlyTotal: number;
    potentialSavings: number;
  };
}

export interface ExpenseFilter {
  category?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  expenses: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}