const db = require('../database/connection');

exports.vendasPorCategoria = async (req, res) => {
  try {
    const dados = await db('pedidos')
      .join('produtos', 'pedidos.produto_id', '=', 'produtos.id')
      .select('produtos.categoria')
      .sum('pedidos.valor_total as total_vendido')
      .sum('pedidos.quantidade as total_itens')
      .groupBy('produtos.categoria');
    return res.status(200).json(dados);
  } catch (err) {
    return res.status(500).json({ erro: 'Erro no relatório' });
  }
};

exports.topProdutos = async (req, res) => {
  try {
    const dados = await db('pedidos')
      .join('produtos', 'pedidos.produto_id', '=', 'produtos.id')
      .select('produtos.nome')
      .sum('pedidos.quantidade as total_vendido')
      .sum('pedidos.valor_total as total_reais')
      .groupBy('produtos.id', 'produtos.nome')
      .orderBy('total_vendido', 'desc')
      .limit(5);
    return res.status(200).json(dados);
  } catch (err) {
    return res.status(500).json({ erro: 'Erro no relatório' });
  }
};

exports.faturamento = async (req, res) => {
  try {
    const { data_inicio, data_fim } = req.query;
    if (!data_inicio || !data_fim) return res.status(400).json({ erro: 'Informe data_inicio e data_fim (YYYY-MM-DD)' });

    const resultado = await db('pedidos')
      .whereBetween('created_at', [`${data_inicio} 00:00:00`, `${data_fim} 23:59:59`])
      .sum('valor_total as faturamento_total')
      .count('id as total_pedidos')
      .first();

    return res.status(200).json({
      periodo: { data_inicio, data_fim },
      faturamento_total: resultado.faturamento_total || 0,
      total_pedidos: resultado.total_pedidos || 0
    });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro no relatório' });
  }
};