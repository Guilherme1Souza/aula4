import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { validationResult } from 'express-validator';
import { CreateExpenseDTO, UpdateExpenseDTO, ExpenseFilter } from '../types';

const prisma = new PrismaClient();

export const createExpense = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, amount, category, description, date }: CreateExpenseDTO = req.body;

    const expense = await prisma.expense.create({
      data: {
        title,
        amount,
        category,
        description,
        date: date ? new Date(date) : new Date(),
      },
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error('Erro ao criar gasto:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const getExpenses = async (req: Request, res: Response) => {
  try {
    const { category, startDate, endDate, minAmount, maxAmount, page = '1', limit = '10' }: ExpenseFilter & { page?: string; limit?: string } = req.query as any;

    const filters: any = {};
    
    if (category) filters.category = category;
    if (minAmount || maxAmount) {
      filters.amount = {};
      if (minAmount) filters.amount.gte = parseFloat(minAmount.toString());
      if (maxAmount) filters.amount.lte = parseFloat(maxAmount.toString());
    }
    if (startDate || endDate) {
      filters.date = {};
      if (startDate) filters.date.gte = new Date(startDate.toString());
      if (endDate) filters.date.lte = new Date(endDate.toString());
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const expenses = await prisma.expense.findMany({
      where: filters,
      orderBy: { date: 'desc' },
      skip,
      take: limitNum,
    });

    const total = await prisma.expense.count({ where: filters });

    res.json({
      expenses,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Erro ao buscar gastos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const getExpenseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const expense = await prisma.expense.findUnique({
      where: { id },
    });

    if (!expense) {
      return res.status(404).json({ error: 'Gasto não encontrado' });
    }

    res.json(expense);
  } catch (error) {
    console.error('Erro ao buscar gasto:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const updateExpense = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, amount, category, description, date }: UpdateExpenseDTO = req.body;

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (amount !== undefined) updateData.amount = amount;
    if (category !== undefined) updateData.category = category;
    if (description !== undefined) updateData.description = description;
    if (date !== undefined) updateData.date = new Date(date);

    const expense = await prisma.expense.update({
      where: { id },
      data: updateData,
    });

    res.json(expense);
  } catch (error) {
    console.error('Erro ao atualizar gasto:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Gasto não encontrado' });
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const deleteExpense = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.expense.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar gasto:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Gasto não encontrado' });
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const getMonthlyStats = async (req: Request, res: Response) => {
  try {
    const { year, month } = req.query;

    if (!year || !month) {
      return res.status(400).json({ error: 'Ano e mês são obrigatórios' });
    }

    const startDate = new Date(parseInt(year.toString()), parseInt(month.toString()) - 1, 1);
    const endDate = new Date(parseInt(year.toString()), parseInt(month.toString()), 0);

    const expenses = await prisma.expense.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const expenseCount = expenses.length;

    const categoryStats = expenses.reduce((acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = { amount: 0, count: 0 };
      }
      acc[expense.category].amount += expense.amount;
      acc[expense.category].count += 1;
      return acc;
    }, {} as Record<string, { amount: number; count: number }>);

    const categories = Object.entries(categoryStats).map(([category, stats]) => ({
      category,
      amount: stats.amount,
      count: stats.count,
      percentage: totalAmount > 0 ? (stats.amount / totalAmount) * 100 : 0,
    }));

    res.json({
      month: `${year}-${month.toString().padStart(2, '0')}`,
      totalAmount,
      expenseCount,
      categories: categories.sort((a, b) => b.amount - a.amount),
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas mensais:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};