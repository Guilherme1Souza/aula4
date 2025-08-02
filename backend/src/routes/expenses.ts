import { Router } from 'express';
import { body, param, query } from 'express-validator';
import {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getMonthlyStats,
} from '../controllers/expenseController';

const router = Router();

// Validações
const createExpenseValidation = [
  body('title').notEmpty().withMessage('Título é obrigatório'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Valor deve ser maior que 0'),
  body('category').notEmpty().withMessage('Categoria é obrigatória'),
  body('description').optional().isString(),
  body('date').optional().isISO8601().withMessage('Data deve estar em formato válido'),
];

const updateExpenseValidation = [
  param('id').isString().withMessage('ID deve ser uma string'),
  body('title').optional().notEmpty().withMessage('Título não pode estar vazio'),
  body('amount').optional().isFloat({ min: 0.01 }).withMessage('Valor deve ser maior que 0'),
  body('category').optional().notEmpty().withMessage('Categoria não pode estar vazia'),
  body('description').optional().isString(),
  body('date').optional().isISO8601().withMessage('Data deve estar em formato válido'),
];

const idValidation = [
  param('id').isString().withMessage('ID deve ser uma string'),
];

const monthlyStatsValidation = [
  query('year').isInt({ min: 2000, max: 3000 }).withMessage('Ano deve ser válido'),
  query('month').isInt({ min: 1, max: 12 }).withMessage('Mês deve ser entre 1 e 12'),
];

// Rotas
router.post('/', createExpenseValidation, createExpense);
router.get('/', getExpenses);
router.get('/stats/monthly', monthlyStatsValidation, getMonthlyStats);
router.get('/:id', idValidation, getExpenseById);
router.put('/:id', updateExpenseValidation, updateExpense);
router.delete('/:id', idValidation, deleteExpense);

export default router;