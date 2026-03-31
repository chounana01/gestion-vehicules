from flask import Flask, request, jsonify
from ml_algorithms import regression_lineaire, knn, arbre_decision
import numpy as np
from pymongo import MongoClient

app = Flask(__name__)

# Configuration de MongoDB
client = MongoClient('mongodb://127.0.0.1:27017/')  # Modifier si nécessaire
db = client['gestion_vehicles']
collection = db['vehicles']
@app.route('/api/regression-lineaire', methods=['POST'])
def regression_lineaire_api():
    try:
        data = request.json
        if not all(k in data for k in ('marque', 'modele', 'annee')):
            return jsonify({'error': 'Les champs marque, modele et annee sont requis.'}), 400

        marque_length = len(data['marque'])
        modele_length = len(data['modele'])
        annee = int(data['annee'])

        vehicles = list(collection.find())
        if len(vehicles) == 0:
            return jsonify({'error': 'Aucune donnée trouvée dans la collection vehicles.'}), 400

        X_train = np.array([[len(v['marque']), len(v['modele']), v['annee']] for v in vehicles])
        y_train = np.array([v['prix'] for v in vehicles])

        prediction = regression_lineaire(X_train, y_train, marque_length, modele_length, annee)
        return jsonify({'prediction': prediction})
    except Exception as e:
        print(f"Erreur : {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/knn', methods=['POST'])
def knn_api():
    try:
        data = request.json
        if not all(k in data for k in ('modele', 'prix')):
            return jsonify({'error': 'Les champs modele et prix sont requis.'}), 400

        modele_length = len(data['modele'])
        prix = int(data['prix'])

        vehicles = list(collection.find())
        if len(vehicles) == 0:
            return jsonify({'error': 'Aucune donnée trouvée dans la collection vehicles.'}), 400

        X_train = np.array([[len(v['modele']), v['prix']] for v in vehicles])
        y_train = np.array([v['marque'] for v in vehicles])

        prediction = knn(X_train, y_train, modele_length, prix)
        return jsonify({'prediction': prediction})
    except Exception as e:
        print(f"Erreur : {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/arbre-decision', methods=['POST'])
def arbre_decision_api():
    try:
        data = request.json
        if not all(k in data for k in ('marque', 'modele')):
            return jsonify({'error': 'Les champs marque et modele sont requis.'}), 400

        marque_length = len(data['marque'])
        modele_length = len(data['modele'])

        vehicles = list(collection.find())
        if len(vehicles) == 0:
            return jsonify({'error': 'Aucune donnée trouvée dans la collection vehicles.'}), 400

        X_train = np.array([[len(v['marque']), len(v['modele'])] for v in vehicles])
        y_train = np.array([v['annee'] for v in vehicles])

        prediction = arbre_decision(X_train, y_train, marque_length, modele_length)
        return jsonify({'prediction': prediction})
    except Exception as e:
        print(f"Erreur : {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)
