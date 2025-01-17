// server.js
const express = require('express');
const axios = require('axios');
require('dotenv').config();

// Créer l'application Express
const app = express();
const port = 3000;

// Importer le middleware CORS
const cors = require('cors');

// Appliquer CORS uniquement pour localhost:8080
const corsOptions = {
    origin: 'http://localhost:8080', // Permet seulement les requêtes depuis localhost:8080
};

app.use(cors(corsOptions));

// Middleware pour accepter les requêtes JSON
app.use(express.json());

app.get('/movies', async (req, res) => {
    console.log('Route /movies appelée'); // Log pour vérifier si la route est atteinte

    try {
        // Extraction des paramètres de filtrage
        const { genre, year, rating } = req.query;

        // Construction des paramètres pour l'API TMDB
        const filterParams = {
            api_key: process.env.TMDB_API_KEY,
            language: 'fr',
            sort_by: 'popularity.desc',
            include_adult: false,
        };

        // Utilisation de l'endpoint /discover pour appliquer les filtres
        if (genre) filterParams.with_genres = genre;  // Exemple: '28' pour action
        if (year) filterParams.primary_release_year = year;  // Exemple: '2023'
        if (rating) filterParams.vote_average_gte = rating; // Exemple: '7'

        // Envoi de la requête à l'API TMDB via l'endpoint /discover/movie
        const response = await axios.get(`https://api.themoviedb.org/3/discover/movie`, { params: filterParams });
        res.json(response.data.results);
    } catch (error) {
        console.error('Erreur détaillée:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Erreur lors de la récupération des films', details: error.message });
    }
});


// Route pour rechercher un film par nom
app.get('/search', async (req, res) => {
    const query = req.query.query;
    if (!query) {
        return res.status(400).json({ error: 'Le paramètre "query" est requis' });
    }

    console.log('Recherche de film pour:', query);

    try {
        const response = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
            params: {
                api_key: process.env.TMDB_API_KEY,
                query: query,
                language: 'fr',
            },
            timeout: 10000
        });

        res.json(response.data.results);
    } catch (error) {
        console.error('Erreur lors de la recherche du film:', error);
        res.status(500).json({ error: 'Erreur lors de la recherche du film', details: error.message });
    }
});

app.get('/movie/:id', async (req, res) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${req.params.id}`, {
            params: {
                api_key: process.env.TMDB_API_KEY,
                language: 'fr'
            },
            timeout: 10000
        });
        res.json(response.data);
    } catch (error) {
        console.error('Erreur lors de la récupération des détails du film:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des détails du film', details: error.message });
    }

});

app.get('/upcoming', async (req, res) => {
    console.log('Route /upcoming appelée'); // Log pour vérifier l'appel

    try {
        const currentDate = new Date().toISOString().split('T')[0]; // Date actuelle au format AAAA-MM-JJ
        const filterParams = {
            api_key: process.env.TMDB_API_KEY,
            language: 'fr',
            sort_by: 'release_date.asc', // Trier par date de sortie croissante
            'primary_release_date.gte': currentDate, // Date de sortie postérieure ou égale à aujourd'hui
        };

        const response = await axios.get('https://api.themoviedb.org/3/discover/movie', { params: filterParams });
        res.json(response.data.results);
    } catch (error) {
        console.error('Erreur lors de la récupération des films à venir', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des films à venir', details: error.message });
    }
});
app.get('/movie/:id/videos', async (req, res) => {
    const movieId = req.params.id;
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/videos`, {
            params: {
                api_key: process.env.TMDB_API_KEY,
                language: 'fr',
            },
        });
        res.json(response.data.results);
    } catch (error) {
        console.error('Erreur lors de la récupération de la bande-annonce', error);
        res.status(500).json({ error: 'Erreur lors de la récupération de la bande-annonce', details: error.message });
    }
});



// Middleware de gestion d'erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Une erreur est survenue sur le serveur');
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
