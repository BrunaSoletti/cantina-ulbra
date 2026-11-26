const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/pedidoController');

router.get('/', ctrl.listar);
router.get('/:id', ctrl.buscarPorId);
router.post('/', ctrl.criar);
router.delete('/:id', ctrl.remover);

module.exports = router;