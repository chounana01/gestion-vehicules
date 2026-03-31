const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
    marque: { type: String, required: true },
    modèle: { type: String, required: true },
    année: { type: Number, required: true },
    kilométrage: { type: Number, required: true },
    prix_de_vente: { type: Number, required: true },
    type_de_carrosserie: String,
    transmission: String,
    couleur: String,
});

module.exports = mongoose.model('Vehicle', VehicleSchema);
