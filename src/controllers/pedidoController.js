const db = require('../database/connection');

exports.listar = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const { aluno } = req.query;

    const query = db('pedidos').select('*').limit(limit).offset(offset);
    if (aluno) query.where('aluno_nome', 'like', `%${aluno}%`);

    const pedidos = await query;
    return res.status(200).json({ limit, offset, dados: pedidos });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao listar pedidos' });
  }
};

exports.buscarPorId = async (req, res) => {
  try {
    const pedido = await db('pedidos')
      .join('produtos', 'pedidos.produto_id', '=', 'produtos.id')
      .select('pedidos.*', 'produtos.nome as produto_nome', 'produtos.categoria as produto_categoria')
      .where('pedidos.id', req.params.id)
      .first();

    if (!pedido) return res.status(404).json({ erro: 'Pedido não encontrado' });
    return res.status(200).json(pedido);
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao buscar pedido' });
  }
};

exports.criar = async (req, res) => {
  try {
    const { aluno_nome, produto_id, quantidade } = req.body;
    if (!aluno_nome || !produto_id || !quantidade || quantidade < 1) {
      return res.status(400).json({ erro: 'Campos obrigatórios: aluno_nome, produto_id, quantidade (>=1)' });
    }

    const resultado = await db.transaction(async (trx) => {
      const produto = await trx('produtos').where({ id: produto_id }).first();
      if (!produto) throw { status: 404, msg: 'Produto não encontrado' };
      if (!produto.ativo) throw { status: 400, msg: 'Produto inativo não pode ser vendido' };
      if (produto.estoque < quantidade) throw { status: 409, msg: `Estoque insuficiente. Disponível: ${produto.estoque}` };

      const valor_total = Number((produto.preco * quantidade).toFixed(2));

      const [pedidoId] = await trx('pedidos').insert({ aluno_nome, produto_id, quantidade, valor_total });
      await trx('produtos').where({ id: produto_id }).update({ estoque: produto.estoque - quantidade });
      
      return await trx('pedidos').where({ id: pedidoId }).first();
    });

    return res.status(201).json(resultado);
  } catch (err) {
    if (err.status) return res.status(err.status).json({ erro: err.msg });
    return res.status(500).json({ erro: 'Erro ao criar pedido' });
  }
};

exports.remover = async (req, res) => {
  try {
    const { id } = req.params;
    await db.transaction(async (trx) => {
      const pedido = await trx('pedidos').where({ id }).first();
      if (!pedido) throw { status: 404, msg: 'Pedido não encontrado' };

      await trx('produtos').where({ id: pedido.produto_id }).increment('estoque', pedido.quantidade);
      await trx('pedidos').where({ id }).del();
    });
    return res.status(204).send();
  } catch (err) {
    if (err.status) return res.status(err.status).json({ erro: err.msg });
    return res.status(500).json({ erro: 'Erro ao cancelar pedido' });
  }
};