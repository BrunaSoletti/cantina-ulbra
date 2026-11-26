const express = require('express');
const app = express();

app.use(express.json());

const produtosRoutes = require('./routes/produtoRoutes');
const pedidosRoutes = require('./routes/pedidoRoutes');
const relatoriosRoutes = require('./routes/relatorioRoutes');

app.use('/api/produtos', produtosRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/relatorios', relatoriosRoutes);

app.use((req, res) => res.status(404).json({ erro: 'Rota não encontrada' }));

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Cantina API rodando em http://localhost:${PORT}`));