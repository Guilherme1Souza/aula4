'use client';

import { useState, useEffect } from 'react';
import { Plus, DollarSign, TrendingUp, Calendar, Lightbulb, Edit, Trash2 } from 'lucide-react';
import Header from '@/components/ui/Header';
import ExpenseForm from '@/components/forms/ExpenseForm';
import ExpenseChart from '@/components/charts/ExpenseChart';
import { expensesApi, categoriesApi, recommendationsApi } from '@/lib/api';
import { 
  Expense, 
  Category, 
  MonthlyStats, 
  RecommendationResponse,
  CreateExpenseData,
  UpdateExpenseData 
} from '@/types';
import { formatCurrency, formatDate, getCurrentMonth } from '@/lib/utils';

export default function Dashboard() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>();
  const [loading, setLoading] = useState(true);

  const currentDate = getCurrentMonth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [expensesRes, categoriesRes, statsRes, recommendationsRes] = await Promise.all([
        expensesApi.getAll({ limit: 10 }),
        categoriesApi.getAll(),
        expensesApi.getMonthlyStats(currentDate.year, currentDate.month),
        recommendationsApi.get(currentDate.year, currentDate.month),
      ]);

      setExpenses(expensesRes.expenses);
      setCategories(categoriesRes);
      setMonthlyStats(statsRes);
      setRecommendations(recommendationsRes);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: CreateExpenseData | UpdateExpenseData) => {
    try {
      if (editingExpense) {
        await expensesApi.update(editingExpense.id, data);
      } else {
        await expensesApi.create(data as CreateExpenseData);
      }
      await loadData();
      setEditingExpense(undefined);
    } catch (error) {
      console.error('Erro ao salvar gasto:', error);
      throw error;
    }
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este gasto?')) {
      try {
        await expensesApi.delete(id);
        await loadData();
      } catch (error) {
        console.error('Erro ao excluir gasto:', error);
      }
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingExpense(undefined);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estatísticas do mês */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total do Mês</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(monthlyStats?.totalAmount || 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Transações</p>
                <p className="text-2xl font-bold text-gray-900">
                  {monthlyStats?.expenseCount || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Média Diária</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(recommendations?.insights.averageDaily || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gráfico */}
          <ExpenseChart categories={monthlyStats?.categories || []} />

          {/* Recomendações */}
          <div className="card p-6">
            <div className="flex items-center mb-4">
              <Lightbulb className="h-5 w-5 text-yellow-500 mr-2" />
              <h3 className="text-lg font-semibold">Recomendações</h3>
            </div>
            <div className="space-y-3">
              {recommendations?.recommendations.map((rec, index) => (
                <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lista de gastos recentes */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Gastos Recentes</h2>
            <button
              onClick={() => setIsFormOpen(true)}
              className="btn-primary flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Gasto
            </button>
          </div>

          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Título
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {expense.title}
                          </div>
                          {expense.description && (
                            <div className="text-sm text-gray-500">
                              {expense.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {expense.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(expense.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(expense.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(expense)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(expense.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <ExpenseForm
        expense={editingExpense}
        categories={categories}
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
      />
    </div>
  );
}