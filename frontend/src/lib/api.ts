import {
  Expense,
  CreateExpenseData,
  UpdateExpenseData,
  Category,
  MonthlyStats,
  RecommendationResponse,
  ExpenseFilter,
  PaginatedResponse,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
    throw new ApiError(response.status, errorData.error || 'Erro na requisição');
  }

  return response.json();
}

// Expenses API
export const expensesApi = {
  async getAll(filters?: ExpenseFilter): Promise<PaginatedResponse<Expense>> {
    const searchParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    const query = searchParams.toString();
    return fetchApi<PaginatedResponse<Expense>>(`/expenses${query ? `?${query}` : ''}`);
  },

  async getById(id: string): Promise<Expense> {
    return fetchApi<Expense>(`/expenses/${id}`);
  },

  async create(data: CreateExpenseData): Promise<Expense> {
    return fetchApi<Expense>('/expenses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: UpdateExpenseData): Promise<Expense> {
    return fetchApi<Expense>(`/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async delete(id: string): Promise<void> {
    await fetchApi<void>(`/expenses/${id}`, {
      method: 'DELETE',
    });
  },

  async getMonthlyStats(year: number, month: number): Promise<MonthlyStats> {
    return fetchApi<MonthlyStats>(`/expenses/stats/monthly?year=${year}&month=${month}`);
  },
};

// Categories API
export const categoriesApi = {
  async getAll(): Promise<Category[]> {
    return fetchApi<Category[]>('/categories');
  },

  async create(name: string, color?: string): Promise<Category> {
    return fetchApi<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify({ name, color }),
    });
  },

  async update(id: string, name?: string, color?: string): Promise<Category> {
    return fetchApi<Category>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name, color }),
    });
  },

  async delete(id: string): Promise<void> {
    await fetchApi<void>(`/categories/${id}`, {
      method: 'DELETE',
    });
  },
};

// Recommendations API
export const recommendationsApi = {
  async get(year: number, month: number): Promise<RecommendationResponse> {
    return fetchApi<RecommendationResponse>(`/recommendations?year=${year}&month=${month}`);
  },
};