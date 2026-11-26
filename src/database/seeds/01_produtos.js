exports.seed = async function(knex) {
  // Limpa a tabela de pedidos primeiro (por causa da chave estrangeira)
  await knex('pedidos').del();
  // Limpa a tabela de produtos
  await knex('produtos').del();

  // Insere os produtos (mínimo 6, em 2 categorias)
  await knex('produtos').insert([
    { nome: 'Coxinha', categoria: 'Salgados', preco: 6.50, estoque: 30, ativo: true },
    { nome: 'Pastel', categoria: 'Salgados', preco: 7.00, estoque: 25, ativo: true },
    { nome: 'Pão de Queijo', categoria: 'Salgados', preco: 4.50, estoque: 40, ativo: true },
    { nome: 'Refrigerante', categoria: 'Bebidas', preco: 5.00, estoque: 50, ativo: true },
    { nome: 'Suco Natural', categoria: 'Bebidas', preco: 6.00, estoque: 20, ativo: true },
    { nome: 'Bolo de Pote', categoria: 'Doces', preco: 8.00, estoque: 15, ativo: true },
    { nome: 'Chocolate', categoria: 'Doces', preco: 3.50, estoque: 0, ativo: false }
  ]);
};
