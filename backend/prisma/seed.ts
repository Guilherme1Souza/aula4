import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Criar categorias padrão
  const categories = [
    { name: 'Alimentação', color: '#22C55E' },
    { name: 'Transporte', color: '#3B82F6' },
    { name: 'Moradia', color: '#F59E0B' },
    { name: 'Saúde', color: '#EF4444' },
    { name: 'Educação', color: '#8B5CF6' },
    { name: 'Entretenimento', color: '#EC4899' },
    { name: 'Compras', color: '#06B6D4' },
    { name: 'Outros', color: '#6B7280' },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  // Criar alguns gastos de exemplo
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const sampleExpenses = [
    {
      title: 'Supermercado',
      amount: 150.50,
      category: 'Alimentação',
      description: 'Compras da semana',
      date: new Date(currentYear, currentMonth, 5),
    },
    {
      title: 'Uber',
      amount: 25.00,
      category: 'Transporte',
      description: 'Viagem ao trabalho',
      date: new Date(currentYear, currentMonth, 7),
    },
    {
      title: 'Academia',
      amount: 89.90,
      category: 'Saúde',
      description: 'Mensalidade',
      date: new Date(currentYear, currentMonth, 10),
    },
    {
      title: 'Cinema',
      amount: 45.00,
      category: 'Entretenimento',
      description: 'Filme com amigos',
      date: new Date(currentYear, currentMonth, 12),
    },
    {
      title: 'Restaurante',
      amount: 78.50,
      category: 'Alimentação',
      description: 'Jantar especial',
      date: new Date(currentYear, currentMonth, 15),
    },
  ];

  for (const expense of sampleExpenses) {
    await prisma.expense.create({
      data: expense,
    });
  }

  console.log('Seed executado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });