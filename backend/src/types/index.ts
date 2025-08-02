export interface CreateExpenseDTO {
  title: string;
  amount: number;
  category: string;
  description?: string;
  date?: string;
}

export interface UpdateExpenseDTO {
  title?: string;
  amount?: number;
  category?: string;
  description?: string;
  date?: string;
}

export interface ExpenseFilter {
  category?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
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