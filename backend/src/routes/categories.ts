import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController';

const router = Router();

// Validações
const createCategoryValidation = [
  body('name').notEmpty().withMessage('Nome da categoria é obrigatório'),
  body('color').optional().isHexColor().withMessage('Cor deve ser um código hex válido'),
];

const updateCategoryValidation = [
  param('id').isString().withMessage('ID deve ser uma string'),
  body('name').optional().notEmpty().withMessage('Nome não pode estar vazio'),
  body('color').optional().isHexColor().withMessage('Cor deve ser um código hex válido'),
];

const idValidation = [
  param('id').isString().withMessage('ID deve ser uma string'),
];

// Rotas
router.get('/', getCategories);
router.post('/', createCategoryValidation, createCategory);
router.put('/:id', updateCategoryValidation, updateCategory);
router.delete('/:id', idValidation, deleteCategory);

export default router;