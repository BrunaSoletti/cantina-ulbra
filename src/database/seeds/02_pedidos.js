exports.seed = async function(knex) {
  await knex('pedidos').del();

  await knex('pedidos').insert([
    { aluno_nome: 'Ana Souza', produto_id: 1, quantidade: 2, valor_total: 13.00, created_at: '2025-01-10 12:00:00' },
    { aluno_nome: 'Bruno Lima', produto_id: 4, quantidade: 1, valor_total: 5.00, created_at: '2025-01-11 13:00:00' },
    { aluno_nome: 'Carla Dias', produto_id: 6, quantidade: 3, valor_total: 24.00, created_at: '2025-01-12 15:30:00' },
    { aluno_nome: 'Diego Alves', produto_id: 2, quantidade: 2, valor_total: 14.00, created_at: '2025-01-13 10:15:00' },
    { aluno_nome: 'Eva Martins', produto_id: 3, quantidade: 5, valor_total: 22.50, created_at: '2025-01-14 09:00:00' }
  ]);
};
