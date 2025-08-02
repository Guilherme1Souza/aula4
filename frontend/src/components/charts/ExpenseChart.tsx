'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { CategoryStats } from '@/types';
import { formatCurrency, getCategoryColor } from '@/lib/utils';

interface ExpenseChartProps {
  categories: CategoryStats[];
}

export default function ExpenseChart({ categories }: ExpenseChartProps) {
  const data = categories.map((category) => ({
    name: category.category,
    value: category.amount,
    percentage: category.percentage,
    count: category.count,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{data.name}</p>
          <p className="text-blue-600">
            Valor: {formatCurrency(data.value)}
          </p>
          <p className="text-gray-600">
            {data.percentage.toFixed(1)}% do total
          </p>
          <p className="text-gray-600">
            {data.count} transação{data.count !== 1 ? 'ões' : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  if (categories.length === 0) {
    return (
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Gastos por Categoria</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          <p>Nenhum gasto encontrado para este período</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold mb-4">Gastos por Categoria</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getCategoryColor(entry.name)} 
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 space-y-2">
        {categories.slice(0, 5).map((category) => (
          <div 
            key={category.category} 
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getCategoryColor(category.category) }}
              />
              <span>{category.category}</span>
            </div>
            <div className="text-right">
              <div className="font-semibold">
                {formatCurrency(category.amount)}
              </div>
              <div className="text-gray-500">
                {category.percentage.toFixed(1)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}