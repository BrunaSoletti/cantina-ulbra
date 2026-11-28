# 🍔 Cantina ULBRA API

API desenvolvida para o gerenciamento de produtos, pedidos e estoque de uma cantina universitária.

## 👩‍💻 Integrante

- Bruna Alexsandra Soletti

**Disciplina:** Desenvolvimento Back-End — Aula 6  
**Professor:** Victor Costa Melo

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

Para iniciar a aplicação, execute o comando de inicialização configurado no arquivo `package.json`.

## 📦 Endpoints da API

### Produtos

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/produtos` | Lista os produtos |
| GET | `/api/produtos/:id` | Busca um produto pelo ID |
| POST | `/api/produtos` | Cadastra um novo produto |
| PUT | `/api/produtos/:id` | Atualiza um produto |
| DELETE | `/api/produtos/:id` | Exclui um produto |

### Pedidos

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/pedidos` | Lista os pedidos com paginação |
| GET | `/api/pedidos/:id` | Busca um pedido pelo ID |
| POST | `/api/pedidos` | Cria um novo pedido |
| DELETE | `/api/pedidos/:id` | Cancela um pedido |

### Relatórios

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/relatorios/vendas-por-categoria` | Exibe as vendas agrupadas por categoria |
| GET | `/api/relatorios/top-produtos` | Exibe os cinco produtos mais vendidos |
| GET | `/api/relatorios/faturamento` | Consulta o faturamento em um período |

## 📋 Regras de negócio

- O valor total do pedido é calculado pela API com base no preço do produto e na quantidade solicitada.
- Não é permitido realizar pedidos com quantidade superior ao estoque disponível.
- Produtos inativos não podem ser vendidos.
- Ao criar um pedido, o estoque do produto é reduzido.
- Ao cancelar um pedido, a quantidade correspondente é devolvida ao estoque.
- Produtos que possuem pedidos vinculados não podem ser excluídos.

## 🔄 Transações com Knex

As transações são utilizadas para garantir a integridade dos dados durante a criação de pedidos.

Nesse processo, o pedido é registrado e o estoque do produto é atualizado. A utilização de transações garante que as operações sejam realizadas em conjunto, evitando inconsistências no banco de dados caso ocorra algum erro durante a execução.

## 🎓 Trabalho acadêmico

Projeto desenvolvido como atividade prática da disciplina de Desenvolvimento Back-End — Aula 6, da ULBRA.
