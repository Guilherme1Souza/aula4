import { Router } from 'express';
import { query } from 'express-validator';
import { getRecommendations } from '../controllers/recommendationController';

const router = Router();

// Validações
const recommendationsValidation = [
  query('year').isInt({ min: 2000, max: 3000 }).withMessage('Ano deve ser válido'),
  query('month').isInt({ min: 1, max: 12 }).withMessage('Mês deve ser entre 1 e 12'),
];

// Rotas
router.get('/', recommendationsValidation, getRecommendations);

export default router;