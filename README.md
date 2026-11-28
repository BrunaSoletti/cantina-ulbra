# 🍔 Cantina ULBRA API

API desenvolvida para o gerenciamento de produtos, pedidos e estoque de uma cantina universitária.

## 👩‍💻 Integrante

- Bruna Alexsandra Soletti

Disciplina: Desenvolvimento Back-End — Aula 6
Professor: Victor Costa Melo

## 🛠️ Tecnologias utilizadas

- Node.js
- Express
- Knex.js
- SQLite3

## 📌 Sobre o projeto

O projeto Cantina ULBRA API tem como objetivo desenvolver o back-end de um sistema para gerenciamento de uma cantina universitária.

A API permite realizar operações de cadastro, consulta, atualização e exclusão de produtos, além de criação e cancelamento de pedidos, controle de estoque e geração de relatórios de vendas.

## 📥 Instruções de instalação

### 1. Clone o repositório
```bash
git clone https://github.com/BrunaSoletti/cantina-ulbra.git
```

### 2. Acesse a pasta do projeto
```bash
cd cantina-ulbra
```

### 3. Instale as dependências
```bash
npm install
```

## 🗄️ Banco de dados

Para criar as tabelas do banco de dados, execute:
```bash
npx knex migrate:latest
```

Para inserir os dados de teste:
```bash
npx knex seed:run
```

## ▶️ Como executar

Para iniciar o servidor, execute:
```bash
npm start
```

O servidor será iniciado em `http://localhost:3000` (ou na porta definida em `process.env.PORT`).

> **Nota:** caso o script `start` não esteja configurado no `package.json`, utilize:
> ```bash
> node src/server.js
> ```

## 📦 Endpoints da API

Base URL: `http://localhost:3000`

### 🛒 Produtos

#### GET `/api/produtos`

Lista todos os produtos. Aceita filtros opcionais por `categoria` e `ativo`.

**Requisição:**
```
GET /api/produtos?categoria=Bebidas&ativo=true
```

**Resposta (200):**
```json
[
  {
    "id": 1,
    "nome": "Coca-Cola 350ml",
    "categoria": "Bebidas",
    "preco": "5.50",
    "estoque": 20,
    "ativo": true
  }
]
```

#### GET `/api/produtos/:id`

Retorna um produto específico. Retorna **404** se não existir.

**Requisição:**
```
GET /api/produtos/1
```

**Resposta (200):**
```json
{
  "id": 1,
  "nome": "Coca-Cola 350ml",
  "categoria": "Bebidas",
  "preco": "5.50",
  "estoque": 20,
  "ativo": true
}
```

**Resposta (404):**
```json
{ "erro": "Produto não encontrado" }
```

#### POST `/api/produtos`

Cria um novo produto. Valida campos obrigatórios (**400**) e nome duplicado (**409**).

**Requisição:**
```json
POST /api/produtos
Content-Type: application/json

{
  "nome": "Pão de Queijo",
  "categoria": "Salgados",
  "preco": 4.50,
  "estoque": 30
}
```

**Resposta (201):**
```json
{
  "id": 7,
  "nome": "Pão de Queijo",
  "categoria": "Salgados",
  "preco": "4.50",
  "estoque": 30,
  "ativo": true
}
```

**Resposta (400):**
```json
{ "erro": "Os campos nome, categoria, preco e estoque são obrigatórios" }
```

**Resposta (409):**
```json
{ "erro": "Já existe um produto com este nome" }
```

#### PUT `/api/produtos/:id`

Atualiza os dados do produto, incluindo o campo `ativo`.

**Requisição:**
```json
PUT /api/produtos/1
Content-Type: application/json

{
  "nome": "Coca-Cola 350ml",
  "categoria": "Bebidas",
  "preco": 6.00,
  "estoque": 18,
  "ativo": true
}
```

**Resposta (200):**
```json
{
  "id": 1,
  "nome": "Coca-Cola 350ml",
  "categoria": "Bebidas",
  "preco": "6.00",
  "estoque": 18,
  "ativo": true
}
```

**Resposta (404):**
```json
{ "erro": "Produto não encontrado" }
```

#### DELETE `/api/produtos/:id`

Remove o produto. Retorna **409** se houver pedidos vinculados (regra R5).

**Requisição:**
```
DELETE /api/produtos/1
```

**Resposta (204):** sem corpo.

**Resposta (409):**
```json
{ "erro": "Não é possível excluir produto com pedidos vinculados" }
```

**Resposta (404):**
```json
{ "erro": "Produto não encontrado" }
```

### 📋 Pedidos

#### GET `/api/pedidos`

Lista pedidos com **paginação obrigatória** (`limit` e `offset`) e filtro opcional por nome do aluno.

**Requisição:**
```
GET /api/pedidos?limit=5&offset=0&aluno_nome=Maria
```

**Resposta (200):**
```json
[
  {
    "id": 1,
    "aluno_nome": "Maria Silva",
    "produto_id": 1,
    "quantidade": 2,
    "valor_total": "11.00",
    "created_at": "2026-11-20T12:00:00.000Z"
  }
]
```

#### GET `/api/pedidos/:id`

Retorna um pedido específico com o **nome do produto** (via join). Retorna **404** se não existir.

**Requisição:**
```
GET /api/pedidos/1
```

**Resposta (200):**
```json
{
  "id": 1,
  "aluno_nome": "Maria Silva",
  "produto_id": 1,
  "produto_nome": "Coca-Cola 350ml",
  "quantidade": 2,
  "valor_total": "11.00",
  "created_at": "2026-11-20T12:00:00.000Z"
}
```

**Resposta (404):**
```json
{ "erro": "Pedido não encontrado" }
```

#### POST `/api/pedidos`

Cria um novo pedido aplicando as regras **R1, R2 e R4** dentro de uma transação. O `valor_total` é calculado pela API e **ignorado** se enviado no corpo.

**Requisição:**
```json
POST /api/pedidos
Content-Type: application/json

{
  "aluno_nome": "João Pereira",
  "produto_id": 2,
  "quantidade": 3
}
```

**Resposta (201):**
```json
{
  "id": 6,
  "aluno_nome": "João Pereira",
  "produto_id": 2,
  "quantidade": 3,
  "valor_total": "18.00",
  "created_at": "2026-11-26T14:00:00.000Z"
}
```

**Resposta (400) — produto inativo (R4):**
```json
{ "erro": "Produto inativo não pode ser vendido" }
```

**Resposta (409) — estoque insuficiente (R2):**
```json
{ "erro": "Estoque insuficiente para o produto solicitado" }
```

**Resposta (404) — produto inexistente:**
```json
{ "erro": "Produto não encontrado" }
```

#### DELETE `/api/pedidos/:id`

Cancela um pedido, devolvendo a quantidade ao estoque (regra R3) dentro de uma transação.

**Requisição:**
```
DELETE /api/pedidos/1
```

**Resposta (204):** sem corpo.

**Resposta (404):**
```json
{ "erro": "Pedido não encontrado" }
```

### 📊 Relatórios

#### GET `/api/relatorios/vendas-por-categoria`

Total vendido (em reais) e quantidade de itens agrupados por categoria.

**Requisição:**
```
GET /api/relatorios/vendas-por-categoria
```

**Resposta (200):**
```json
[
  {
    "categoria": "Bebidas",
    "total_vendido": "45.50",
    "quantidade_itens": 8
  }
]
```

#### GET `/api/relatorios/top-produtos`

Os **5 produtos mais vendidos**, com nome e total vendido.

**Requisição:**
```
GET /api/relatorios/top-produtos
```

**Resposta (200):**
```json
[
  { "nome": "Coca-Cola 350ml", "total_vendido": "27.50" },
  { "nome": "Pão de Queijo", "total_vendido": "22.50" }
]
```

#### GET `/api/relatorios/faturamento`

Soma do `valor_total` em um período, recebendo `data_inicio` e `data_fim` como parâmetros (usa `whereBetween`).

**Requisição:**
```
GET /api/relatorios/faturamento?data_inicio=2026-11-01&data_fim=2026-11-30
```

**Resposta (200):**
```json
{
  "data_inicio": "2026-11-01",
  "data_fim": "2026-11-30",
  "faturamento_total": "72.50"
}
```

**Resposta (400):**
```json
{ "erro": "Os parâmetros data_inicio e data_fim são obrigatórios" }
```

## 📋 Regras de negócio

- O valor total do pedido é calculado pela API com base no preço do produto e na quantidade solicitada.
- Não é permitido realizar pedidos com quantidade superior ao estoque disponível.
- Produtos inativos não podem ser vendidos.
- Ao criar um pedido, o estoque do produto é reduzido.
- Ao cancelar um pedido, a quantidade correspondente é devolvida ao estoque.
- Produtos que possuem pedidos vinculados não podem ser excluídos.

## 🔄 Transações com Knex

A transação do Knex (`db.transaction()`) foi utilizada em **dois endpoints**:

### 1. `POST /api/pedidos`

**Onde:** no controller de pedidos (`src/controllers/pedidoController.js`).

**Por quê:** a criação de um pedido exige **duas operações dependentes**: inserir o registro em `pedidos` e debitar a quantidade do `estoque` do produto. Se uma falhar, a outra não pode ser persistida — caso contrário, o banco ficaria inconsistente (pedido registrado sem baixa de estoque, ou estoque reduzido sem pedido correspondente).

**Como:** dentro da transação, a API busca o produto, valida estoque (R2) e `ativo` (R4), calcula `valor_total = preco * quantidade` (R1), insere o pedido e atualiza o estoque (`estoque - quantidade`). Se qualquer etapa lançar erro (ex.: estoque insuficiente → `409`), o `rollback` desfaz tudo.

### 2. `DELETE /api/pedidos/:id`

**Onde:** no controller de pedidos (`src/controllers/pedidoController.js`).

**Por quê:** o cancelamento (R3) exige **duas operações dependentes**: deletar o pedido e devolver a quantidade ao estoque do produto. Se uma falhar, haveria inconsistência (pedido removido sem devolução de estoque, ou estoque inflado sem remoção do pedido).

**Como:** dentro da transação, a API busca o pedido, busca o produto vinculado, devolve a quantidade ao estoque (`estoque + quantidade`) e deleta o pedido. Se o pedido não existir (`404`), a transação é revertida sem alterações.

### Benefício

O uso de transação garante **atomicidade**: ou as duas operações acontecem juntas, ou nenhuma acontece. Isso preserva a integridade referencial e as regras de negócio R2 e R3, mesmo em caso de falha no meio do processo.

## 🎓 Trabalho acadêmico

Projeto desenvolvido como atividade prática da disciplina de Desenvolvimento Back-End — Aula 6, da ULBRA.

Nesse processo, o pedido é registrado e o estoque do produto é atualizado. A utilização de transações garante que as operações sejam realizadas em conjunto, evitando inconsistências no banco de dados caso ocorra algum erro durante a execução.

## 🎓 Trabalho acadêmico

Projeto desenvolvido como atividade prática da disciplina de Desenvolvimento Back-End — Aula 6, da ULBRA.
