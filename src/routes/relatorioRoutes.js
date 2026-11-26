const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/relatorioController');

router.get('/vendas-por-categoria', ctrl.vendasPorCategoria);
router.get('/top-produtos', ctrl.topProdutos);
router.get('/faturamento', ctrl.faturamento);

module.exports = router;