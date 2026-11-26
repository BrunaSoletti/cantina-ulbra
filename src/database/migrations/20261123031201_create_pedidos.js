exports.up = function(knex) {
  return knex.schema.createTable('pedidos', (table) => {
    table.increments('id').primary();
    table.string('aluno_nome', 100).notNullable();
    table
      .integer('produto_id')
      .notNullable()
      .references('id')
      .inTable('produtos')
      .onDelete('RESTRICT'); // protege a regra R5
    table.integer('quantidade').notNullable();
    table.decimal('valor_total', 8, 2).notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('pedidos');
};