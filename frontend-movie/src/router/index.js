import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../components/Home.vue'; // Importez le nouveau composant Home
import MovieDetails from '../components/MovieDetails.vue'; // Page des détails d'un film

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomePage, // Utilisez Home comme composant pour la page d'accueil
    },
    {
        path: '/movie/:id',
        name: 'movie-details',
        component: MovieDetails, // Composant pour les détails d'un film
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
