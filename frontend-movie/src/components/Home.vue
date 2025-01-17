<template>
  <div class="home">
    <div class="search-container">
      <input
          v-model="searchQuery"
          @input="debounceSearch"
          type="text"
          placeholder="Recherchez un film..."
          class="search-input"
      />

      <!-- Filtres par genre -->
      <select v-model="selectedGenre" @change="fetchTopRatedMovies" class="genre-select">
        <option value="">Genre</option>
        <option value="28">Action</option>
        <option value="12">Aventure</option>
        <option value="16">Animation</option>
        <option value="35">Comédie</option>
        <option value="80">Crime</option>
        <option value="99">Documentaire</option>
        <option value="18">Drame</option>
        <option value="10751">Famille</option>
        <option value="14">Fantastique</option>
        <option value="36">Histoire</option>
        <option value="27">Horreur</option>
        <option value="10402">Musique</option>
        <option value="9648">Mystère</option>
        <option value="10749">Romance</option>
        <option value="878">Science-Fiction</option>
        <option value="10770">Téléfilm</option>
        <option value="53">Thriller</option>
        <option value="10752">Guerre</option>
        <option value="37">Western</option>
      </select>

      <!-- Filtres par année -->
      <select v-model="selectedYear" @change="fetchTopRatedMovies" class="year-select">
        <option value="">Année</option>
        <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
      </select>

      <!-- Filtres par note -->
      <select v-model="selectedRating" @change="fetchTopRatedMovies" class="rating-select">
        <option value="">Note minimale</option>
        <option v-for="rating in availableRatings" :key="rating" :value="rating">{{ rating }}+</option>
      </select>

      <button @click="fetchTopRatedMovies" class="search-button">🔍</button>
    </div>

    <h4 class="title">{{ searchQuery ? 'Résultats de recherche' : 'Découvrez des films' }}</h4>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      Chargement de vos films...
    </div>

    <div v-else-if="movies.length === 0" class="no-results">
      Aucun film trouvé
    </div>

    <div v-else class="movie-grid">
      <div v-for="movie in movies" :key="movie.id" class="movie-card">
        <div class="movie-card-inner">
          <img
              :src="getMoviePoster(movie.poster_path)"
              :alt="movie.title"
              class="movie-poster"
          />
          <div class="movie-overlay">
            <div class="movie-details">
              <h3 class="movie-title">{{ movie.title }}</h3>
              <div class="movie-meta">
                <span class="movie-rating">⭐ {{ movie.vote_average.toFixed(1) }}</span>
                <span class="movie-year">{{ movie.release_date.split('-')[0] }}</span>
              </div>
              <p class="movie-overview">{{ truncateOverview(movie.overview) }}</p>
              <router-link :to="{ name: 'movie-details', params: { id: movie.id } }" class="details-button">
                Voir détails
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <h4 class="title">Films à venir</h4>
    <div v-if="upcomingMovies.length === 0" class="no-results">Aucun film à venir</div>
    <div v-else class="movie-grid">
      <div v-for="movie in upcomingMovies" :key="movie.id" class="movie-card">
        <img :src="getMoviePoster(movie.poster_path)" :alt="movie.title" class="movie-poster" />
        <div class="movie-details">
          <h3>{{ movie.title }}</h3>
          <span>{{ movie.release_date.split('-')[0] }}</span>
          <router-link :to="{ name: 'movie-details', params: { id: movie.id } }" class="details-button">
            Voir détails
          </router-link>
        </div>
      </div>
    </div>
    <button @click="goToUpcomingMoviesPage" class="view-more-button">Voir plus</button>
  </div>
</template>

<script>
import axios from 'axios';
import debounce from 'lodash/debounce';

export default {
  name: 'HomePage',
  data() {
    return {
      movies: [],
      upcomingMovies: [],
      searchQuery: '',
      selectedGenre: '',
      selectedYear: '',
      selectedRating: '',
      availableYears: Array.from({ length: new Date().getFullYear() - 1970 + 1 }, (_, i) => 1970 + i).reverse(),
      availableRatings: Array.from({ length: 11 }, (_, i) => i),
      loading: false,
    };
  },
  mounted() {
    this.fetchTopRatedMovies();
    this.fetchUpcomingMovies();
  },
  methods: {
    async fetchUpcomingMovies() {
      try {
        const response = await axios.get('http://localhost:3000/upcoming');
        this.upcomingMovies = response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des films à venir', error);
      }
    },
    async fetchTopRatedMovies() {
      this.loading = true;
      try {
        const response = await axios.get('http://localhost:3000/movies', {
          params: {
            genre: this.selectedGenre,
            year: this.selectedYear,
            rating: this.selectedRating,
          },
        });
        this.movies = response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des films', error);
      } finally {
        this.loading = false;
      }
    },
    async searchMovies() {
      if (!this.searchQuery.trim()) {
        this.fetchTopRatedMovies();
        return;
      }
      this.loading = true;
      try {
        const response = await axios.get('http://localhost:3000/search', {
          params: { query: this.searchQuery },
        });
        this.movies = response.data;
      } catch (error) {
        console.error('Erreur lors de la recherche de films', error);
      } finally {
        this.loading = false;
      }
    },
    debounceSearch: debounce(function () {
      this.searchMovies();
    }, 300),
    getMoviePoster(posterPath) {
      return posterPath
          ? `https://image.tmdb.org/t/p/w500${posterPath}`
          : 'https://via.placeholder.com/500x750?text=No+Poster';
    },
    truncateOverview(overview) {
      return overview.length > 100 ? overview.slice(0, 100) + '...' : overview;
    },
    goToUpcomingMoviesPage() {
      this.$router.push('/upcoming');
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

.title {
  font-family: 'Comfortaa', cursive;
  font-size: 3rem;
  letter-spacing: 1px;
  text-align: center;
  text-transform: uppercase;
  color: var(--highlight-color);
  margin-bottom: 2rem;
  animation: fadeIn 1s ease-in-out;
}

.search-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 3rem;
  position: relative;
}

.search-input {
  width: 450px;
  padding: 15px 20px;
  border-radius: 30px;
  border: 2px solid var(--accent-color);
  background-color: #222222;
  color: var(--text-color);
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: var(--primary-color);
  background-color: #333333;
  outline: none;
}

.search-button {
  padding: 16px 20px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  position: absolute;
  right: -2px;
  border: none;
  cursor: pointer;
  transition: transform 0.3s ease, background-color 0.3s ease;
}

.search-button:hover {
  background-color: var(--accent-color);
  transform: scale(1.1);
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.8rem;
  padding: 2rem;
  justify-items: center;
}

.movie-card {
  background-color: rgba(255, 255, 255, 0.1); /* Fond transparent */
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.movie-card:hover {
  transform: translateY(-8px); /* Animation au survol */
  box-shadow: rgba(0, 0, 0, 0.5) 0px 12px 24px;
}

.movie-card-inner {
  position: relative;
}

.movie-poster {
  width: 100%;
  height: auto;
  border-radius: 12px 12px 0 0;
}

.movie-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6); /* Overlay sombre */
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  padding: 1rem;
  border-radius: 12px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.movie-card:hover .movie-overlay {
  opacity: 1; /* Apparition au survol */
}

.movie-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: var(--highlight-color);
  text-align: center;
}

.movie-meta {
  font-size: 1rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
  gap: 0.8rem;
  color: var(--secondary-color);
}

.movie-rating {
  font-size: 1.1rem;
}

.details-button {
  padding: 10px 20px;
  border-radius: 50px;
  background-color: var(--secondary-color);
  color: var(--background-color);
  text-transform: uppercase;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.details-button:hover {
  background-color: var(--primary-color);
  transform: scale(1.05);
}

/* Ajout d'animations */
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
  font-size: 1.2rem;
  color: var(--text-color);
}

.spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  width: 40px;
  height: 40px;
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

.no-results {
  color: var(--text-color);
  text-align: center;
  font-size: 1.5rem;
  margin-top: 2rem;
}

/* Style général des listes déroulantes */
select {
  padding: 10px;
  font-size: 1rem;
  border-radius: 8px;
  border: 2px solid var(--accent-color);
  background-color: #222222;
  color: var(--text-color);
  width: 180px;
  margin: 0 10px;  /* Espacement entre les listes */
  transition: all 0.3s ease;
}

/* Style des listes déroulantes au survol */
select:hover {
  background-color: #333333;
  border-color: var(--primary-color);
}

/* Style des options de sélection */
select option {
  background-color: #333333;
  color: var(--text-color);
  padding: 10px;
}

/* Style des options au survol */
select option:hover {
  background-color: var(--primary-color);
  color: var(--background-color);
}

/* Centrer les éléments dans le conteneur de recherche */
.search-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 3rem;
  position: relative;
  flex-wrap: wrap; /* Permet aux éléments de se réorganiser si l'écran est trop petit */
}

/* Ajout d'un espacement entre les listes et le bouton de recherche */
.search-button {
  margin-left: 10px;
  padding: 16px 20px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  position: absolute;
  right: -2px;
  border: none;
  cursor: pointer;
  transition: transform 0.3s ease, background-color 0.3s ease;
}

</style>


