const express = require('express');
const axios = require('axios');

const router = express.Router();

router.post('/regression-lineaire', async (req, res) => {
    try {
        const response = await axios.post('http://127.0.0.1:5000/api/regression-lineaire', req.body);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/knn', async (req, res) => {
    try {
        const response = await axios.post('http://127.0.0.1:5000/api/knn', req.body);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/arbre-decision', async (req, res) => {
    try {
        const response = await axios.post('http://127.0.0.1:5000/api/arbre-decision', req.body);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
