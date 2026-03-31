from sklearn.linear_model import LinearRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
import numpy as np

def regression_lineaire(X_train, y_train, marque_length, modele_length, annee):
    # Modèle de régression linéaire
    model = LinearRegression()
    model.fit(X_train, y_train)

    # Prédiction
    prediction = model.predict([[marque_length, modele_length, annee]])
    return prediction[0]

def knn(X_train, y_train, modele_length, prix):
    # Modèle KNN
    knn_model = KNeighborsClassifier(n_neighbors=3)
    knn_model.fit(X_train, y_train)

    # Prédiction
    prediction = knn_model.predict([[modele_length, prix]])
    return prediction[0]

def arbre_decision(X_train, y_train, marque_length, modele_length):
    # Modèle d'Arbre de Décision
    tree_model = DecisionTreeClassifier()
    tree_model.fit(X_train, y_train)

    # Prédiction
    prediction = tree_model.predict([[marque_length, modele_length]])
    return prediction[0]
