fetch('http://localhost:5000/api/vehicles/visualisation')
    .then((response) => response.json())
    .then((data) => {
        console.log('Données reçues pour les graphiques :', data);

        const { kmAnnee, prixParAnnee, transmission } = data;

        // Kilométrage par année
        const labelsKmAnnee = kmAnnee.map((item) => item._id);
        const valuesKmAnnee = kmAnnee.map((item) => item.avgKm);

        const ctxKmAnnee = document.getElementById('kmAnneeChart').getContext('2d');
        new Chart(ctxKmAnnee, {
            type: 'line',
            data: {
                labels: labelsKmAnnee,
                datasets: [{
                    label: 'Kilométrage Moyen',
                    data: valuesKmAnnee,
                    fill: false,
                    borderColor: 'blue',
                    tension: 0.1
                }]
            }
        });

        // Histogramme : Plages de Prix par Année
        const labelsPrixParAnnee = prixParAnnee.map((item) => item._id);
        const datasetsPrixParAnnee = prixParAnnee.map((item) => ({
            label: `${item._id}`,
            data: item.prices,
            backgroundColor: 'rgba(75, 192, 192, 0.2)'
        }));

        const ctxPrixParAnnee = document.getElementById('prixParAnneeChart').getContext('2d');
        new Chart(ctxPrixParAnnee, {
            type: 'bar',
            data: {
                labels: labelsPrixParAnnee,
                datasets: datasetsPrixParAnnee
            }
        });

        // Répartition par transmission
        const labelsTransmission = transmission.map((item) => item._id);
        const valuesTransmission = transmission.map((item) => item.count);

        const ctxTransmission = document.getElementById('transmissionChart').getContext('2d');
        new Chart(ctxTransmission, {
            type: 'bar',
            data: {
                labels: labelsTransmission,
                datasets: [{
                    label: 'Nombre de Véhicules',
                    data: valuesTransmission,
                    backgroundColor: 'rgba(153, 102, 255, 0.2)'
                }]
            }
        });
    })
    .catch((err) => console.error('Erreur lors de la récupération des données :', err));
