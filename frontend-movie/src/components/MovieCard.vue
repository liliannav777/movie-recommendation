<template>
  <div class="movie-card">
    <div class="movie-card-inner">
      <img :src="getMoviePoster(movie.poster_path)" :alt="movie.title" class="movie-poster" />
      <div class="movie-overlay">
        <div class="movie-details">
          <h3 class="movie-title">{{ movie.title }}</h3>
          <div class="movie-meta">
            <span class="movie-rating">⭐ {{ movie.vote_average.toFixed(1) }}</span>
            <span class="movie-year">{{ movie.release_date.split('-')[0] }}</span>
          </div>
          <p class="movie-overview">{{ truncateOverview(movie.overview) }}</p>
          <div class="button-group">
            <router-link :to="{ name: 'movie-details', params: { id: movie.id } }" class="details-button">
              Voir détails
            </router-link>
            <button @click="toggleFavorite" class="favorite-button" :class="{ 'is-favorite': isFavorite }">
              <span class="star">&#9733;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'MovieCard',
  props: {
    movie: {
      type: Object,
      required: true
    },
    upcoming: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isFavorite: false
    };
  },
  mounted() {
    this.checkIfFavorite();
  },
  methods: {
    getMoviePoster(posterPath) {
      return posterPath
          ? `https://image.tmdb.org/t/p/w500${posterPath}`
          : 'https://via.placeholder.com/500x750?text=No+Poster';
    },
    truncateOverview(overview) {
      return overview && overview.length > 100
          ? `${overview.slice(0, 100)}...`
          : overview || 'Aucune description disponible';
    },
    async checkIfFavorite() {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await axios.get('http://localhost:3000/favorites', {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.isFavorite = response.data.includes(this.movie.id.toString());
      } catch (error) {
        console.error('Erreur lors de la vérification des favoris', error);
      }
    },
    async toggleFavorite() {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Veuillez vous connecter pour ajouter des favoris');
        return;
      }

      try {
        const response = await axios.post('http://localhost:3000/favorites',
            { movieId: this.movie.id },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 200) {
          this.isFavorite = !this.isFavorite;
          this.$emit('favorite-toggled', this.movie.id, this.isFavorite);
        }
      } catch (error) {
        console.error('Erreur lors de la modification des favoris', error);
        alert('Erreur lors de la modification des favoris');
      }
    },
  },
};
</script>

  <style scoped>
  .movie-card {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    box-shadow: var(--card-shadow);
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .movie-card:hover {
    transform: translateY(-8px);
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
    background-color: rgba(0, 0, 0, 0.6);
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
    opacity: 1;
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

  .button-group {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
  }

  .favorite-button {
    background-color: transparent;
    border: none;
    color: #fff;
    font-size: 1.5rem;
    cursor: pointer;
    transition: transform 0.2s ease;
  }

  .favorite-button:hover {
    transform: scale(1.2);
  }

  .favorite-button.is-favorite {
    color: var(--primary-color);
  }

  .star {
    display: inline-block;
  }

  </style>

