<template>
  <div class="register">
    <h2 class="title">Inscription</h2>
    <form @submit.prevent="register" class="auth-form">
      <div class="input-group">
        <label for="username">Nom d'utilisateur :</label>
        <input type="text" v-model="username" class="input-field" required />
      </div>
      <div class="input-group">
        <label for="password">Mot de passe :</label>
        <input type="password" v-model="password" class="input-field" required />
      </div>
      <button type="submit" class="auth-button">S'inscrire</button>
      <p>Déjà un compte ? <router-link to="/login" class="link">Se connecter</router-link></p>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'RegisterPage',
  data() {
    return {
      username: '',
      password: ''
    };
  },
  methods: {
    async register() {
      try {
        const response = await axios.post('http://localhost:3000/register', {
          username: this.username,
          password: this.password
        });
        alert(response.data.message);
        this.$router.push('/login');
      } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        alert('Erreur lors de l\'inscription');
      }
    }
  }
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
}

body {
  background: linear-gradient(135deg, #121212, #222222);
  color: var(--text-color);
  font-family: 'Raleway', sans-serif;
}

.register {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 5rem;
}

.title {
  font-family: 'Comfortaa', cursive;
  font-size: 3rem;
  letter-spacing: 1px;
  color: var(--highlight-color);
  margin-bottom: 2rem;
}

.auth-form {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 300px;
}

.input-group {
  margin-bottom: 1.5rem;
}

.input-field {
  width: 100%;
  max-width: 100%;
  padding: 15px;
  border-radius: 30px;
  border: 2px solid var(--accent-color);
  background-color: #222222;
  color: var(--text-color);
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.input-field:focus {
  border-color: var(--primary-color);
  background-color: #333333;
  outline: none;
}

.auth-button {
  width: 100%;
  padding: 15px;
  border-radius: 30px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.auth-button:hover {
  background-color: var(--accent-color);
}

.link {
  color: var(--primary-color);
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}
</style>
