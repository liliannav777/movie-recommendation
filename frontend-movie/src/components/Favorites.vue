<template>
  <div class="favorites">
    <h2 class="title">Mes Favoris</h2>
    <div v-if="favoriteMovies.length" class="favorites-list">
      <MovieCard
          v-for="movie in favoriteMovies"
          :key="movie.id"
          :movie="movie"
      />
    </div>
    <p v-else>Vous n'avez pas encore de favoris.</p>
    <div v-if="loading" class="loading">Chargement...</div>
  </div>
</template>

<script>
import axios from 'axios';
import MovieCard from './MovieCard.vue';

export default {
  name: 'FavoritesPage',
  components: {
    MovieCard
  },
  data() {
    return {
      favoriteMovies: [],
      loading: false,
    };
  },
  mounted() {
    this.fetchFavorites();
  },
  methods: {
    async fetchFavorites() {
      this.loading = true;
      try {
        const token = localStorage.getItem('token');
        const favoritesResponse = await axios.get('http://localhost:3000/favorites', {
          headers: {Authorization: `Bearer ${token}`}
        });

        const movieIds = favoritesResponse.data;

        // Récupérer les détails de chaque film favori individuellement
        const moviePromises = movieIds.map(id =>
            axios.get(`http://localhost:3000/movie/${id}`)
        );

        const movieResponses = await Promise.all(moviePromises);
        this.favoriteMovies = movieResponses.map(response => response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des favoris:', error);
      } finally {
        this.loading = false;
      }
    },
    getMoviePoster(posterPath) {
      return posterPath
          ? `https://image.tmdb.org/t/p/w500${posterPath}`
          : 'https://via.placeholder.com/500x750?text=No+Poster';
    },
    truncateOverview(overview) {
      return overview && overview.length > 100 ? overview.slice(0, 100) + '...' : overview;
    },
  }
};
</script>

<style scoped>
.favorites {
  padding: 2rem;
}

.title {
  font-family: 'Comfortaa', cursive;
  font-size: 2.5rem;
  color: var(--highlight-color);
  margin-bottom: 2rem;
  text-align: center;
}

.favorites-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
}

.loading {
  text-align: center;
  font-size: 1.2rem;
  margin-top: 2rem;
  color: var(--text-color);
}
</style>
