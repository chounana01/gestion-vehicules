const Vehicle = require('../models/Vehicle'); // Import du modèle Vehicle
const { predictLinearRegression } = require('../linearRegression'); // Import de la fonction de prédiction

// Fonction pour récupérer tous les véhicules
const getAllVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find(); // Récupérer tous les véhicules
        res.status(200).json(vehicles); // Envoyer les données au client
    } catch (err) {
        console.error("Erreur lors de la récupération des véhicules :", err.message);
        res.status(500).json({ error: "Erreur interne lors de la récupération des véhicules." });
    }
};

// Fonction pour rechercher des véhicules par critères
const searchVehicles = async (req, res) => {
    const { année, marque, modèle, type_de_carrosserie, transmission, couleur } = req.query;

    try {
        const searchCriteria = {
            ...(année && { année: parseInt(année) }),
            ...(marque && { marque: { $regex: marque, $options: 'i' } }),
            ...(modèle && { modèle: { $regex: modèle, $options: 'i' } }),
            ...(type_de_carrosserie && { type_de_carrosserie: { $regex: type_de_carrosserie, $options: 'i' } }),
            ...(transmission && { transmission: { $regex: transmission, $options: 'i' } }),
            ...(couleur && { couleur: { $regex: couleur, $options: 'i' } }),
        };

        console.log("Critères de recherche :", searchCriteria);

        const vehicles = await Vehicle.find(searchCriteria); // Recherche des véhicules
        if (vehicles.length === 0) {
            return res.status(404).json({ message: "Aucun véhicule trouvé avec ces critères." });
        }
        res.status(200).json(vehicles);
    } catch (err) {
        console.error("Erreur lors de la recherche :", err.message);
        res.status(500).json({ error: "Erreur interne lors de la recherche." });
    }
};

// Fonction pour ajouter un véhicule
const addVehicle = async (req, res) => {
    const { marque, modèle, année, kilométrage, prix_de_vente } = req.body;

    if (!marque || !modèle || !année || !kilométrage || !prix_de_vente) {
        return res.status(400).json({ error: "Tous les champs sont requis." });
    }

    try {
        const newVehicle = new Vehicle({
            marque,
            modèle,
            année,
            kilométrage,
            prix_de_vente,
        });

        const savedVehicle = await newVehicle.save();
        res.status(201).json(savedVehicle);
    } catch (err) {
        console.error("Erreur lors de l'ajout d'un véhicule :", err.message);
        res.status(500).json({ error: "Erreur interne lors de l'ajout du véhicule." });
    }
};

// Fonction pour mettre à jour un véhicule
const updateVehicle = async (req, res) => {
    try {
        const updatedVehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedVehicle) {
            return res.status(404).json({ error: "Véhicule non trouvé." });
        }
        res.status(200).json(updatedVehicle);
    } catch (err) {
        console.error("Erreur lors de la mise à jour :", err.message);
        res.status(500).json({ error: "Erreur interne lors de la mise à jour." });
    }
};

// Fonction pour supprimer un véhicule
const deleteVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
        if (!vehicle) {
            return res.status(404).json({ error: "Véhicule non trouvé." });
        }
        res.status(200).json({ message: "Véhicule supprimé avec succès." });
    } catch (err) {
        console.error("Erreur lors de la suppression :", err.message);
        res.status(500).json({ error: "Erreur interne lors de la suppression." });
    }
};

// Fonction pour prédire le prix d'un véhicule
const predictVehiclePrice = async (req, res) => {
    const { annee, kilometrage, modele } = req.body;

    if (!annee || !kilometrage || !modele) {
        return res.status(400).json({ error: "Année, kilométrage et modèle sont requis." });
    }

    try {
        const prediction = await predictLinearRegression({ annee, kilometrage, modele });
        res.status(200).json({ prediction });
    } catch (err) {
        console.error("Erreur lors de la prédiction :", err.message);
        res.status(500).json({ error: "Erreur interne lors de la prédiction." });
    }
};

module.exports = {
    getAllVehicles,
    searchVehicles,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    predictVehiclePrice,
};
