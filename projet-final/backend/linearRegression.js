const tf = require('@tensorflow/tfjs');
const Vehicle = require('./models/Vehicle'); // Modèle MongoDB

let trainedModel = null;
let marquesMap = null;

// Fonction pour encoder les marques en one-hot
function encodeMarques(data) {
    const marques = Array.from(new Set(data.map(item => item.marque))); // Marques uniques
    const marqueMap = marques.reduce((acc, marque, index) => {
        acc[marque] = index;
        return acc;
    }, {});

    const oneHotMarques = data.map(item => {
        const oneHot = Array(marques.length).fill(0);
        oneHot[marqueMap[item.marque]] = 1;
        return oneHot;
    });

    return { oneHotMarques, marques };
}

// Fonction pour entraîner le modèle
async function trainModel() {
    const data = await Vehicle.find({}, { marque: 1, kilométrage: 1, année: 1, prix_de_vente: 1, _id: 0 });
    const { oneHotMarques, marques } = encodeMarques(data);

    // Préparation des données
    const inputs = data.map((item, index) => [...oneHotMarques[index], item.kilométrage, item.année]);
    const outputs = data.map(item => item.prix_de_vente);

    const xs = tf.tensor2d(inputs);
    const ys = tf.tensor1d(outputs);

    const model = tf.sequential();
    model.add(tf.layers.dense({ inputShape: [inputs[0].length], units: 1 }));

    model.compile({
        optimizer: tf.train.adam(),
        loss: 'meanSquaredError',
    });

    console.log('Entraînement du modèle...');
    await model.fit(xs, ys, { epochs: 100, batchSize: 10 });
    console.log('Modèle entraîné avec succès !');

    trainedModel = model;
    marquesMap = marques;
}

// Fonction pour prédire
async function predict(inputData) {
    if (!trainedModel || !marquesMap) {
        throw new Error("Le modèle n'est pas encore prêt. Entraînez-le d'abord.");
    }

    const marqueMap = marquesMap.reduce((acc, marque, index) => {
        acc[marque] = index;
        return acc;
    }, {});

    const inputs = inputData.map(item => {
        const oneHot = Array(marquesMap.length).fill(0);
        if (item.marque in marqueMap) {
            oneHot[marqueMap[item.marque]] = 1;
        } else {
            console.warn(`Marque inconnue : ${item.marque}. Utilisation de valeurs par défaut.`);
        }
        return [...oneHot, item.kilométrage, item.année];
    });

    const inputTensor = tf.tensor2d(inputs);
    const predictions = trainedModel.predict(inputTensor);

    return Array.from(await predictions.data());
}

module.exports = { trainModel, predict };
