const express = require('express');
const {
    regressionLineaire,
    knn,
    arbreDecision,
} = require('../controllers/testAlgorithmeController');

const router = express.Router();

// Définir les routes pour les algorithmes
router.post('/regression-lineaire', regressionLineaire);
router.post('/knn', knn);
router.post('/arbre-decision', arbreDecision);

module.exports = router;
