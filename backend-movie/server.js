const express = require('express');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();


const app = express();
const port = 3000;
const corsOptions = { origin: 'http://localhost:8080' };

app.use(cors(corsOptions));
app.use(express.json());


mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connexion à MongoDB réussie');
}).catch((error) => {
    console.error('Erreur de connexion à MongoDB:', error.message);
});


app.get('/movies', async (req, res) => {
    try {
        const { genre, year, rating } = req.query;
        const filterParams = {
            api_key: process.env.TMDB_API_KEY,
            language: 'fr',
            sort_by: 'popularity.desc',
            include_adult: false,
            ...(genre && { with_genres: genre }),
            ...(year && { primary_release_year: year }),
            ...(rating && { vote_average_gte: rating }),
        };
        const response = await axios.get('https://api.themoviedb.org/3/discover/movie', { params: filterParams });
        res.json(response.data.results);
    } catch (error) {
        console.error('Erreur lors de la récupération des films:', error.response?.data || error.message);
        res.status(500).json({ error: 'Erreur lors de la récupération des films', details: error.message });
    }
});

app.get('/search', async (req, res) => {
    const query = req.query.query;
    if (!query) return res.status(400).json({ error: 'Le paramètre "query" est requis' });
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
            params: { api_key: process.env.TMDB_API_KEY, query, language: 'fr' },
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
            params: { api_key: process.env.TMDB_API_KEY, language: 'fr' },
            timeout: 10000
        });
        res.json(response.data);
    } catch (error) {
        console.error('Erreur lors de la récupération des détails du film:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des détails du film', details: error.message });
    }
});

app.get('/upcoming', async (req, res) => {
    try {
        const currentDate = new Date().toISOString().split('T')[0];
        const filterParams = {
            api_key: process.env.TMDB_API_KEY,
            language: 'fr',
            sort_by: 'release_date.asc',
            'primary_release_date.gte': currentDate,
        };
        const response = await axios.get('https://api.themoviedb.org/3/discover/movie', { params: filterParams });
        res.json(response.data.results);
    } catch (error) {
        console.error('Erreur lors de la récupération des films à venir:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des films à venir', details: error.message });
    }
});

app.get('/movie/:id/videos', async (req, res) => {
    const movieId = req.params.id;
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/videos`, {
            params: { api_key: process.env.TMDB_API_KEY, language: 'fr' },
        });
        res.json(response.data.results);
    } catch (error) {
        console.error('Erreur lors de la récupération de la bande-annonce:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération de la bande-annonce', details: error.message });
    }
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "Nom d'utilisateur et mot de passe requis" });
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ error: 'Utilisateur déjà existant' });
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'Inscription réussie' });
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        res.status(500).json({ error: 'Erreur lors de l\'inscription', details: error.message });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Nom d\'utilisateur ou mot de passe incorrect' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, message: 'Connexion réussie' });
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ error: 'Erreur lors de la connexion' });
    }
});


const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Accès non autorisé' });
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Token invalide' });
        req.user = user;
        next();
    });
};


app.post('/favorites', authenticateToken, async (req, res) => {
    const { movieId } = req.body;
    const userId = req.user.id;
    try {
        const user = await User.findById(userId);
        if (!user.favorites.includes(movieId)) {
            user.favorites.push(movieId);
            await user.save();
            res.status(200).json({ message: 'Film ajouté aux favoris' });
        } else {
            res.status(400).json({ error: 'Film déjà dans les favoris' });
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajout aux favoris:', error);
        res.status(500).json({ error: 'Erreur lors de l\'ajout aux favoris' });
    }
});

app.get('/favorites', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await User.findById(userId);
        res.json(user.favorites);
    } catch (error) {
        console.error('Erreur lors de la récupération des favoris:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des favoris' });
    }
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Une erreur est survenue sur le serveur');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
