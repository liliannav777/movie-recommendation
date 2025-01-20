<template>
  <nav class="navbar">
    <router-link to="/" class="navbar-logo">Movie App</router-link>
    <div class="navbar-links">
      <router-link to="/" class="navbar-link">Accueil</router-link>
      <router-link v-if="isAuthenticated" to="/favorites" class="navbar-link">Favoris</router-link>
      <router-link v-if="!isAuthenticated" to="/login" class="navbar-link">Se connecter</router-link>
      <button v-if="isAuthenticated" @click="logout" class="navbar-link">Se déconnecter</button>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'AppNavbar',
  data() {
    return {
      isAuthenticated: !!localStorage.getItem('token'),
    };
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      this.isAuthenticated = false;
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #121212;
  color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.navbar-logo {
  font-size: 1.8rem;
  color: var(--primary-color);
  text-decoration: none;
}

.navbar-links {
  display: flex;
  gap: 1rem;
}

.navbar-link {
  color: #fff;
  text-decoration: none;
  font-size: 1.2rem;
  transition: color 0.3s ease;
}

.navbar-link:hover {
  color: var(--primary-color);
}

button {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
  transition: color 0.3s ease;
}

button:hover {
  color: var(--primary-color);
}
</style>
