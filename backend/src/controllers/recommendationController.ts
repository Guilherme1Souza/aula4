import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { RecommendationResponse } from '../types';

const prisma = new PrismaClient();

export const getRecommendations = async (req: Request, res: Response) => {
  try {
    const { year, month } = req.query;

    if (!year || !month) {
      return res.status(400).json({ error: 'Ano e mês são obrigatórios' });
    }

    const startDate = new Date(parseInt(year.toString()), parseInt(month.toString()) - 1, 1);
    const endDate = new Date(parseInt(year.toString()), parseInt(month.toString()), 0);

    // Buscar gastos do mês atual
    const currentExpenses = await prisma.expense.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // Buscar gastos dos meses anteriores para comparação
    const previousMonthStart = new Date(parseInt(year.toString()), parseInt(month.toString()) - 2, 1);
    const previousMonthEnd = new Date(parseInt(year.toString()), parseInt(month.toString()) - 1, 0);

    const previousExpenses = await prisma.expense.findMany({
      where: {
        date: {
          gte: previousMonthStart,
          lte: previousMonthEnd,
        },
      },
    });

    const monthlyTotal = currentExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const previousMonthTotal = previousExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const averageDaily = monthlyTotal / new Date().getDate();

    // Análise por categoria
    const categoryStats = currentExpenses.reduce((acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = 0;
      }
      acc[expense.category] += expense.amount;
      return acc;
    }, {} as Record<string, number>);

    const highestCategory = Object.entries(categoryStats).sort((a, b) => b[1] - a[1])[0];
    const highestCategoryName = highestCategory ? highestCategory[0] : 'Nenhuma';
    const highestCategoryAmount = highestCategory ? highestCategory[1] : 0;

    // Gerar recomendações baseadas na análise
    const recommendations: string[] = [];

    // Recomendação baseada na comparação com mês anterior
    if (monthlyTotal > previousMonthTotal * 1.1) {
      recommendations.push(`Seus gastos aumentaram ${((monthlyTotal / previousMonthTotal - 1) * 100).toFixed(1)}% em relação ao mês anterior. Considere revisar seus hábitos de consumo.`);
    }

    // Recomendação baseada na categoria que mais gasta
    if (highestCategoryAmount > monthlyTotal * 0.4) {
      recommendations.push(`A categoria "${highestCategoryName}" representa ${((highestCategoryAmount / monthlyTotal) * 100).toFixed(1)}% dos seus gastos. Considere reduzi-la.`);
    }

    // Recomendação baseada na média diária
    if (averageDaily > monthlyTotal / 30 * 1.2) {
      recommendations.push(`Sua média diária de gastos está alta (R$ ${averageDaily.toFixed(2)}). Tente estabelecer um limite diário menor.`);
    }

    // Recomendações específicas por categoria
    Object.entries(categoryStats).forEach(([category, amount]) => {
      const percentage = (amount / monthlyTotal) * 100;
      
      switch (category.toLowerCase()) {
        case 'alimentação':
        case 'restaurante':
        case 'delivery':
          if (percentage > 30) {
            recommendations.push('Considere cozinhar mais em casa para reduzir gastos com alimentação.');
          }
          break;
        case 'transporte':
        case 'combustível':
        case 'uber':
          if (percentage > 20) {
            recommendations.push('Avalie usar transporte público ou caronas para economizar em transporte.');
          }
          break;
        case 'entretenimento':
        case 'lazer':
          if (percentage > 15) {
            recommendations.push('Procure atividades gratuitas ou mais baratas para entretenimento.');
          }
          break;
        case 'compras':
        case 'roupas':
          if (percentage > 15) {
            recommendations.push('Faça uma lista antes de comprar e evite compras por impulso.');
          }
          break;
      }
    });

    // Calcular economia potencial
    let potentialSavings = 0;
    if (highestCategoryAmount > monthlyTotal * 0.3) {
      potentialSavings = highestCategoryAmount * 0.2; // 20% de redução na categoria principal
    }

    // Recomendações gerais se não houver específicas
    if (recommendations.length === 0) {
      recommendations.push('Parabéns! Seus gastos estão controlados. Continue monitorando para manter o equilíbrio.');
      recommendations.push('Considere criar uma reserva de emergência se ainda não tem uma.');
    }

    // Adicionar recomendações de economia
    if (potentialSavings > 0) {
      recommendations.push(`Você pode economizar até R$ ${potentialSavings.toFixed(2)} reduzindo 20% dos gastos em "${highestCategoryName}".`);
    }

    const response: RecommendationResponse = {
      recommendations,
      insights: {
        highestCategory: highestCategoryName,
        averageDaily: parseFloat(averageDaily.toFixed(2)),
        monthlyTotal: parseFloat(monthlyTotal.toFixed(2)),
        potentialSavings: parseFloat(potentialSavings.toFixed(2)),
      },
    };

    res.json(response);
  } catch (error) {
    console.error('Erro ao gerar recomendações:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};