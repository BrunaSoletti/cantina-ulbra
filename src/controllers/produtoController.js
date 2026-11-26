const db = require('../database/connection');

exports.listar = async (req, res) => {
  try {
    const { categoria, ativo } = req.query;
    const query = db('produtos').select('*');
    if (categoria) query.where('categoria', categoria);
    if (ativo !== undefined) query.where('ativo', ativo === 'true');
    const produtos = await query;
    return res.status(200).json(produtos);
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao listar produtos' });
  }
};

exports.buscarPorId = async (req, res) => {
  try {
    const produto = await db('produtos').where({ id: req.params.id }).first();
    if (!produto) return res.status(404).json({ erro: 'Produto não encontrado' });
    return res.status(200).json(produto);
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao buscar produto' });
  }
};

exports.criar = async (req, res) => {
  try {
    const { nome, categoria, preco, estoque, ativo } = req.body;
    if (!nome || !categoria || preco == null || estoque == null) {
      return res.status(400).json({ erro: 'Campos obrigatórios: nome, categoria, preco, estoque' });
    }
    if (estoque < 0) return res.status(400).json({ erro: 'Estoque não pode ser negativo' });

    const existente = await db('produtos').where({ nome }).first();
    if (existente) return res.status(409).json({ erro: 'Já existe produto com esse nome' });

    const [id] = await db('produtos').insert({ nome, categoria, preco, estoque, ativo: ativo !== undefined ? ativo : true });
    const produto = await db('produtos').where({ id }).first();
    return res.status(201).json(produto);
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao criar produto' });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, categoria, preco, estoque, ativo } = req.body;
    const produto = await db('produtos').where({ id }).first();
    if (!produto) return res.status(404).json({ erro: 'Produto não encontrado' });

    if (estoque !== undefined && estoque < 0) return res.status(400).json({ erro: 'Estoque não pode ser negativo' });
    if (nome && nome !== produto.nome) {
      const duplicado = await db('produtos').where({ nome }).first();
      if (duplicado) return res.status(409).json({ erro: 'Nome já usado por outro produto' });
    }

    await db('produtos').where({ id }).update({
      nome: nome ?? produto.nome,
      categoria: categoria ?? produto.categoria,
      preco: preco ?? produto.preco,
      estoque: estoque ?? produto.estoque,
      ativo: ativo ?? produto.ativo
    });
    const atualizado = await db('produtos').where({ id }).first();
    return res.status(200).json(atualizado);
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao atualizar produto' });
  }
};

exports.remover = async (req, res) => {
  try {
    const { id } = req.params;
    const produto = await db('produtos').where({ id }).first();
    if (!produto) return res.status(404).json({ erro: 'Produto não encontrado' });

    const pedidosVinculados = await db('pedidos').where({ produto_id: id }).first();
    if (pedidosVinculados) return res.status(409).json({ erro: 'Produto possui pedidos e não pode ser removido' });

    await db('produtos').where({ id }).del();
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao remover produto' });
  }
};