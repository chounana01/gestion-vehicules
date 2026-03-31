const tf = require('@tensorflow/tfjs-node');
const Vehicle = require('./models/Vehicle'); // Modèle Mongoose

// Préparer les données d'entraînement
async function prepareData() {
    try {
        const vehicles = await Vehicle.find();

        if (vehicles.length === 0) {
            throw new Error("Aucune donnée disponible pour entraîner le modèle.");
        }

        const inputs = vehicles.map(v => [v.année, v.kilométrage, v.prix_de_vente]); // Entrées : Année, Kilométrage, Prix
        const labels = vehicles.map(v => {
            // Classification en trois catégories
            if (v.prix_de_vente <= 10000) return 0; // Bas
            if (v.prix_de_vente <= 30000) return 1; // Moyen
            return 2; // Élevé
        });

        return {
            inputs: tf.tensor2d(inputs),
            labels: tf.tensor1d(labels, 'int32'),
        };
    } catch (error) {
        console.error("Erreur lors de la préparation des données :", error);
        throw error;
    }
}

// Fonction pour trouver la distance entre deux points
function calculateDistance(point1, point2) {
    return Math.sqrt(
        point1.reduce((sum, val, index) => sum + Math.pow(val - point2[index], 2), 0)
    );
}

// Fonction pour effectuer une classification KNN
async function classifyWithKNN(data, k = 5) {
    const { annee, kilometrage, prix } = data;
    const targetPoint = [annee, kilometrage, prix];

    try {
        const vehicles = await Vehicle.find();

        if (vehicles.length === 0) {
            throw new Error("Aucune donnée disponible pour la classification.");
        }

        // Préparer les données d'entraînement
        const trainingData = vehicles.map(v => ({
            inputs: [v.année, v.kilométrage, v.prix_de_vente],
            label: v.prix_de_vente <= 10000 ? 0 : v.prix_de_vente <= 30000 ? 1 : 2, // 0: Bas, 1: Moyen, 2: Élevé
        }));

        // Calculer les distances
        const distances = trainingData.map(item => ({
            ...item,
            distance: calculateDistance(item.inputs, targetPoint),
        }));

        // Trier par distance croissante
        distances.sort((a, b) => a.distance - b.distance);

        // Sélectionner les k plus proches voisins
        const kNearest = distances.slice(0, k);

        // Compter les labels des k voisins
        const labelCounts = kNearest.reduce((counts, item) => {
            counts[item.label] = (counts[item.label] || 0) + 1;
            return counts;
        }, {});

        // Trouver la catégorie avec le maximum de votes
        const predictedLabel = Object.keys(labelCounts).reduce((a, b) =>
            labelCounts[a] > labelCounts[b] ? a : b
        );

        // Retourner la catégorie correspondante
        const categories = ["Bas", "Moyen", "Élevé"];
        return categories[predictedLabel];
    } catch (error) {
        console.error("Erreur lors de la classification KNN :", error);
        throw error;
    }
}

module.exports = { classifyWithKNN };
