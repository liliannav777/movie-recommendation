import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../components/Home.vue';
import MovieDetails from '../components/MovieDetails.vue';
import LoginPage from '../components/auth/Login.vue';
import RegisterPage from '../components/auth/Register.vue';
import Favorites from '../components/Favorites.vue';

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomePage,
    },
    {
        path: '/movie/:id',
        name: 'movie-details',
        component: MovieDetails,
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginPage,
    },
    {
        path: '/register',
        name: 'Register',
        component: RegisterPage,
    },
    {
        path: '/favorites',
        name: 'favorites',
        component: Favorites,
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
