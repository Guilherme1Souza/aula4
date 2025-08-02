'use client';

import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { CreateExpenseData, UpdateExpenseData, Expense, Category } from '@/types';
import { formatDateForInput } from '@/lib/utils';

interface ExpenseFormProps {
  expense?: Expense;
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateExpenseData | UpdateExpenseData) => Promise<void>;
}

export default function ExpenseForm({ 
  expense, 
  categories, 
  isOpen, 
  onClose, 
  onSubmit 
}: ExpenseFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    description: '',
    date: formatDateForInput(new Date()),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (expense) {
      setFormData({
        title: expense.title,
        amount: expense.amount.toString(),
        category: expense.category,
        description: expense.description || '',
        date: formatDateForInput(expense.date),
      });
    } else {
      setFormData({
        title: '',
        amount: '',
        category: '',
        description: '',
        date: formatDateForInput(new Date()),
      });
    }
  }, [expense, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = {
        title: formData.title,
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description || undefined,
        date: formData.date,
      };

      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar gasto:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {expense ? 'Editar Gasto' : 'Novo Gasto'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título *
            </label>
            <input
              type="text"
              required
              className="input w-full"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Supermercado"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor *
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              className="input w-full"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0,00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoria *
            </label>
            <select
              required
              className="input w-full"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data *
            </label>
            <input
              type="date"
              required
              className="input w-full"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              className="input w-full"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descrição opcional..."
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary flex-1 flex items-center justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                'Salvando...'
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  {expense ? 'Atualizar' : 'Adicionar'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}