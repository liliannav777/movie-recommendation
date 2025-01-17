<template>
  <div class="movie-details-page">
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      Chargement des détails du film...
    </div>
    <div v-else-if="movie" class="movie-details">
      <h2 class="movie-title">{{ movie.title }}</h2>
      <div class="movie-content">
        <img :src="getMoviePoster(movie?.poster_path)" :alt="movie.title" class="movie-poster" />
        <div class="movie-info">
          <p class="movie-overview">{{ movie?.overview }}</p>
          <p class="movie-release-date">Date de sortie : {{ movie?.release_date }}</p>
          <p class="movie-rating">Note : {{ movie?.vote_average?.toFixed(1) }}/10</p>
          <p class="movie-genres">Genres : {{ movie?.genres?.map(genre => genre.name).join(', ') }}</p>
          <router-link to="/" class="back-button">Retour à la liste</router-link>
        </div>
      </div>
    </div>
      <div v-if="trailer" class="trailer-container">
        <iframe :src="trailerUrl" width="100%" height="400" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
      </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      trailer: null,
      movie: null,
      loading: true,
    };
  },
  mounted() {
    this.fetchMovieDetails();
    this.fetchTrailer();
  },
  computed: {
    trailerUrl() {
      return this.trailer ? `https://www.youtube.com/embed/${this.trailer}` : '';
    },
  },
  methods: {
    async fetchTrailer() {
      const movieId = this.$route.params.id;
      try {
        const response = await axios.get(`http://localhost:3000/movie/${movieId}/videos`);
        const trailer = response.data.find(video => video.type === 'Trailer');
        this.trailer = trailer ? trailer.key : null;
      } catch (error) {
        console.error('Erreur lors de la récupération de la bande-annonce', error);
      }
    },
    async fetchMovieDetails() {
      const id = this.$route.params.id;
      try {
        const response = await axios.get(`http://localhost:3000/movie/${id}`);
        this.movie = response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des détails du film', error);
      } finally {
        this.loading = false;
      }
    },
    getMoviePoster(posterPath) {
      return posterPath
          ? `https://image.tmdb.org/t/p/w500${posterPath}`
          : 'https://via.placeholder.com/500x750?text=No+Poster';
    },
  },
};

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@300;400;600&family=Raleway:wght@400;500;600&display=swap');

:root {
  --primary-color: #FF4081; /* Rose vif */
  --secondary-color: #1DE9B6; /* Teal clair */
  --background-color: #121212; /* Fond sombre */
  --text-color: #FFFFFF; /* Blanc pur */
  --accent-color: #00E5FF; /* Bleu électrique */
  --highlight-color: #FFEB3B; /* Jaune éclatant */
  --card-shadow: rgba(0, 0, 0, 0.2); /* Ombre douce */
}

body {
  background: linear-gradient(135deg, #121212, #222222); /* Dégradé sombre */
  color: var(--text-color);
  font-family: 'Raleway', sans-serif;
  line-height: 1.6;
  margin: 0;
  padding: 0;
  height: 100vh;
}

.movie-details-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem;
  color: var(--text-color);
}

.movie-title {
  font-family: 'Comfortaa', cursive;
  font-size: 3rem;
  color: var(--highlight-color);
  margin-bottom: 2rem;
  text-align: center;
}

.movie-content {
  display: flex;
  gap: 3rem;
  align-items: flex-start;
  justify-content: center;
  transition: transform 0.3s ease;
}

.movie-poster {
  width: 350px;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.4);
  transition: transform 0.3s ease;
}

.movie-poster:hover {
  transform: scale(1.05);
}

.movie-info {
  flex: 1;
}

.movie-overview {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  color: var(--text-color);
  line-height: 1.6;
}

.movie-release-date,
.movie-rating,
.movie-genres {
  font-size: 1.1rem;
  margin-bottom: 0.8rem;
  color: var(--secondary-color);
}

.back-button {
  display: inline-block;
  margin-top: 2rem;
  padding: 0.8rem 1.5rem;
  background-color: var(--primary-color);
  color: var(--text-color);
  text-decoration: none;
  border-radius: 30px;
  font-weight: bold;
  text-transform: uppercase;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.back-button:hover {
  background-color: var(--accent-color);
  transform: scale(1.1);
}

@media (max-width: 768px) {
  .movie-content {
    flex-direction: column;
    text-align: center;
  }

  .movie-poster {
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  color: var(--text-color);
  margin-top: 5rem;
}

.spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.trailer-container {
  margin-top: 2rem;
  padding: 1rem;
  background-color: var(--background-color);
  border-radius: 12px;
  box-shadow: 0 4px 12px var(--card-shadow);
  text-align: center;
}

.trailer-container iframe {
  border-radius: 12px;
  border: 3px solid var(--accent-color);
  max-width: 100%;
  transition: transform 0.3s ease;
}

.trailer-container iframe:hover {
  transform: scale(1.02);
}

</style>
