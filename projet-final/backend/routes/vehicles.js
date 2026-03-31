const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const { trainLinearRegression, predict } = require('../linearRegression');


const {
    getAllVehicles,
    searchVehicles,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    predictVehiclePrice,
} = require('../controllers/vehicles'); // Import des fonctions du contrôleur

// Route pour les données de visualisation
router.get('/visualisation', async (req, res) => {
    try {
        const kmAnnee = await Vehicle.aggregate([
            { $group: { _id: "$année", avgKm: { $avg: "$kilométrage" } } },
            { $sort: { _id: 1 } } // Tri par année
        ]);

        const prixParAnnee = await Vehicle.aggregate([
            { $group: { _id: "$année", prices: { $push: "$prix_de_vente" } } },
            { $sort: { _id: 1 } }
        ]);

        const transmission = await Vehicle.aggregate([
            { $group: { _id: "$transmission", count: { $sum: 1 } } }
        ]);

        res.status(200).json({ kmAnnee, prixParAnnee, transmission });
    } catch (err) {
        console.error("Erreur dans /visualisation :", err.message);
        res.status(500).json({ error: "Erreur lors de la récupération des données de visualisation." });
    }
});

module.exports = router;



router.post('/predict', async (req, res) => {
    const { annee, kilometrage, marque } = req.body;

    if (!annee || !kilometrage || !marque) {
        return res.status(400).json({ error: "Veuillez fournir l'année, le kilométrage et la marque." });
    }

    try {
        const predictions = await predict([{ annee, kilometrage, marque }]);
        res.status(200).json({ predictions });
    } catch (err) {
        console.error('Erreur lors de la prédiction :', err.message);
        res.status(500).json({ error: "Erreur lors de la prédiction." });
    }
});

module.exports = router;



// Route pour récupérer tous les véhicules
router.get('/', getAllVehicles);

// Route pour rechercher des véhicules par critères
router.get('/search', searchVehicles);

// Route pour ajouter un véhicule
router.post('/', addVehicle);

// Route pour mettre à jour un véhicule
router.put('/:id', updateVehicle);

// Route pour supprimer un véhicule
router.delete('/:id', deleteVehicle);

// Route pour prédire le prix d'un véhicule
router.post('/predict', predictVehiclePrice);

module.exports = router;
