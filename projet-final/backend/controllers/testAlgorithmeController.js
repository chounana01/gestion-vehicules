const KNN = require('ml-knn'); // KNN
const { LinearRegression } = require('ml-regression'); // Régression Linéaire
const { DecisionTreeClassifier } = require('ml-cart'); // Arbre de Décision
const { getVehiclesData } = require('../models/vehiclesModel'); // Vos données

// Régression Linéaire
async function regressionLineaire(req, res) {
    try {
        const { marque, modele, annee } = req.body;

        // Charger les données
        const data = await getVehiclesData();
        const X = data.map(d => [d.marque.length, d.modele.length, d.annee]);
        const y = data.map(d => d.prix_de_vente);

        const regression = new LinearRegression(X, y);

        // Prédiction
        const prediction = regression.predict([marque.length, modele.length, annee]);

        res.json({ prediction });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// KNN
async function knn(req, res) {
    try {
        const { modele, prix } = req.body;

        // Charger les données
        const data = await getVehiclesData();
        const X = data.map(d => [d.modele.length, d.prix_de_vente]);
        const y = data.map(d => (d.prix_de_vente < 20000 ? 'Economique' : 'Luxueux'));

        const knn = new KNN(X, y, { k: 3 });

        // Prédiction
        const prediction = knn.predict([modele.length, prix]);

        res.json({ prediction });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Arbre de Décision
async function arbreDecision(req, res) {
    try {
        const { marque, modele } = req.body;

        // Charger les données
        const data = await getVehiclesData();
        const X = data.map(d => [d.marque.length, d.modele.length]);
        const y = data.map(d => d.type_de_carrosserie);

        const tree = new DecisionTreeClassifier();
        tree.train(X, y);

        // Prédiction
        const prediction = tree.predict([marque.length, modele.length]);

        res.json({ prediction });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = { regressionLineaire, knn, arbreDecision };
