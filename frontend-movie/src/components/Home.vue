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

      <select v-model="selectedGenre" @change="fetchTopRatedMovies" class="genre-select">
        <option value="">Genre</option>
        <option v-for="(name, id) in genres" :key="id" :value="id">{{ name }}</option>
      </select>

      <select v-model="selectedYear" @change="fetchTopRatedMovies" class="year-select">
        <option value="">Année</option>
        <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
      </select>

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
      <movie-card v-for="movie in movies" :key="movie.id" :movie="movie" />
    </div>

    <h4 class="title">Films à venir</h4>
    <div v-if="upcomingMovies.length === 0" class="no-results">Aucun film à venir</div>
    <div v-else class="movie-grid upcoming-movies">
      <movie-card v-for="movie in upcomingMovies" :key="movie.id" :movie="movie" :upcoming="true" />
    </div>

    <button @click="goToUpcomingMoviesPage" class="view-more-button">Voir plus</button>
  </div>
</template>

<script>
import axios from 'axios';
import debounce from 'lodash/debounce';
import MovieCard from './MovieCard.vue';


export default {
  name: 'HomePage',
  components : {
    MovieCard
  },
  data() {
    return {
      genres: {
        28: 'Action',
        12: 'Aventure',
        16: 'Animation',
        35: 'Comédie',
        80: 'Crime',
        99: 'Documentaire',
        18: 'Drame',
        10751: 'Famille',
        14: 'Fantastique',
        36: 'Histoire',
        27: 'Horreur',
        10402: 'Musique',
        9648: 'Mystère',
        10749: 'Romance',
        878: 'Science-Fiction',
        10770: 'Téléfilm',
        53: 'Thriller',
        10752: 'Guerre',
        37: 'Western'
      },
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
  --primary-color: #FF4081;
  --secondary-color: #1DE9B6;
  --background-color: #121212;
  --text-color: #FFFFFF;
  --accent-color: #00E5FF;
  --highlight-color: #FFEB3B;
  --card-shadow: rgba(0, 0, 0, 0.2);
}

body {
  background: linear-gradient(135deg, #121212, #222222);
  color: var(--text-color);
  font-family: 'Raleway', sans-serif;
  line-height: 1.6;
  margin: 0;
  padding: 0;
  min-height: 100vh;
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
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 3rem;
  padding: 1rem;
  background-color: rgba(255,255,255, 0.05);
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.search-input, select {
  padding: 15px 20px;
  border-radius: 30px;
  border: 2px solid var(--accent-color);
  background-color: #222222;
  color: var(--text-color);
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

.search-input {
  width: 450px;
}

.search-input:focus, select:focus {
  border-color: var(--primary-color);
  background-color: #333333;
  outline: none;
}

select {
  flex: 1;
  min-width: 150px;
}

.search-button {
  padding: 16px 20px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
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

.loading, .no-results {
  text-align: center;
  font-size: 1.2rem;
  margin-top: 2rem;
}

.spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

.view-more-button {
  display: block;
  margin: 2rem auto;
  padding: 12px 24px;
  background-color: var(--accent-color);
  color: var(--background-color);
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.view-more-button:hover {
  background-color: var(--primary-color);
  transform: scale(1.05);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .search-container {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input, select, .search-button {
    width: 100%;
    margin: 0.5rem 0;
  }

  .search-button {
    border-radius: 25px;
  }

  .movie-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}
</style>



