import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });

    res.json(categories);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, color } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Nome da categoria é obrigatório' });
    }

    const category = await prisma.category.create({
      data: {
        name,
        color: color || '#3B82F6',
      },
    });

    res.status(201).json(category);
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Categoria já existe' });
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, color } = req.body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (color !== undefined) updateData.color = color;

    const category = await prisma.category.update({
      where: { id },
      data: updateData,
    });

    res.json(category);
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Nome da categoria já existe' });
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.category.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar categoria:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};