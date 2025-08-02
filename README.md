# 💰 Sistema de Controle Financeiro

Um sistema completo de controle financeiro pessoal com frontend em Next.js/React TypeScript e backend em Node.js com PostgreSQL.

## 🚀 Funcionalidades

- ✅ **CRUD completo de gastos** - Criar, editar, visualizar e excluir gastos
- ✅ **Sistema de categorias** - Organizar gastos por categorias personalizáveis
- ✅ **Relatórios mensais** - Estatísticas detalhadas dos gastos por mês
- ✅ **Gráficos interativos** - Visualização em gráfico de pizza dos gastos por categoria
- ✅ **Recomendações inteligentes** - Sistema que analisa seus gastos e sugere melhorias
- ✅ **Interface moderna** - Design responsivo com Tailwind CSS
- ✅ **Validações robustas** - Validação tanto no frontend quanto no backend

## 🛠️ Tecnologias

### Frontend
- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Recharts** - Gráficos interativos
- **Lucide React** - Ícones

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **TypeScript** - Tipagem estática
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados

## 📋 Pré-requisitos

- Node.js 18+ 
- PostgreSQL 12+
- npm ou yarn

## 🔧 Instalação

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd financial-control-system
```

### 2. Instale as dependências
```bash
npm run install:all
```

### 3. Configure o banco de dados
```bash
# Crie um banco PostgreSQL
createdb financial_control

# Configure as variáveis de ambiente
cp backend/.env.example backend/.env
```

Edite o arquivo `backend/.env`:
```env
DATABASE_URL="postgresql://seu_usuario:sua_senha@localhost:5432/financial_control?schema=public"
PORT=3001
NODE_ENV=development
```

### 4. Execute as migrações e seed
```bash
cd backend
npm run generate
npm run migrate
npm run seed
```

### 5. Inicie os servidores

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Ou use o comando integrado:
```bash
npm run dev
```

## 🖥️ Uso

1. Acesse `http://localhost:3000` no seu navegador
2. O sistema já vem com dados de exemplo (categorias e alguns gastos)
3. Use o botão "Novo Gasto" para adicionar seus gastos
4. Visualize os gráficos e recomendações na página principal

## 📊 Funcionalidades Detalhadas

### Dashboard Principal
- **Resumo mensal**: Total gasto, número de transações e média diária
- **Gráfico de pizza**: Visualização dos gastos por categoria
- **Recomendações**: Sugestões personalizadas baseadas nos seus hábitos
- **Lista de gastos**: Últimos gastos com opções de editar/excluir

### Sistema de Recomendações
O sistema analisa automaticamente seus gastos e fornece:
- Comparação com mês anterior
- Alertas sobre categorias com alto gasto
- Sugestões específicas por tipo de categoria
- Estimativa de economia potencial

### Categorias Padrão
- Alimentação
- Transporte  
- Moradia
- Saúde
- Educação
- Entretenimento
- Compras
- Outros

## 🔌 API Endpoints

### Gastos
- `GET /api/expenses` - Listar gastos (com filtros)
- `POST /api/expenses` - Criar novo gasto
- `GET /api/expenses/:id` - Buscar gasto específico
- `PUT /api/expenses/:id` - Atualizar gasto
- `DELETE /api/expenses/:id` - Excluir gasto
- `GET /api/expenses/stats/monthly` - Estatísticas mensais

### Categorias
- `GET /api/categories` - Listar categorias
- `POST /api/categories` - Criar categoria
- `PUT /api/categories/:id` - Atualizar categoria
- `DELETE /api/categories/:id` - Excluir categoria

### Recomendações
- `GET /api/recommendations` - Obter recomendações do mês

## 🗂️ Estrutura do Projeto

```
financial-control-system/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── types/
│   │   └── server.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   └── types/
│   └── package.json
└── package.json
```

## 🚀 Deploy

### Backend (Railway/Heroku)
1. Configure as variáveis de ambiente de produção
2. Execute `npm run build` no backend
3. Configure a URL do banco PostgreSQL de produção

### Frontend (Vercel/Netlify)
1. Configure `NEXT_PUBLIC_API_URL` para a URL do backend em produção
2. Execute `npm run build` no frontend

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Se você tiver alguma dúvida ou problema, sinta-se à vontade para abrir uma issue no GitHub.

---

**Desenvolvido com ❤️ para ajudar no controle financeiro pessoal**