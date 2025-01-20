<template>
  <div class="app">
    <div class="gradient-overlay"></div>
    <div class="content">
      <AppNavbar />
      <h1 class="title">🎬 Ciné Passion</h1>
      <router-view></router-view>
      <AppFooter />
    </div>
  </div>
</template>

<script>
import AppNavbar from './components/Navbar.vue';
import AppFooter from './components/Footer.vue';

export default {
  name: 'App',
  components: {
    AppNavbar,
    AppFooter
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@300;400;600&family=Righteous&display=swap');

:root {
  --primary-color: #FF5722; /* Orange vif */
  --secondary-color: #FFC107; /* Jaune doré */
  --background-color: #4E342E; /* Brun chaud */
  --text-color: #FFFFFF; /* Blanc */
  --accent-color: #FF7043; /* Orange clair */
  --highlight-color: #FFD54F; /* Jaune clair */
}

body {
  background: linear-gradient(135deg, #4E342E, #3E2723); /* Dégradé brun */
  color: var(--text-color);
  font-family: 'Comfortaa', sans-serif;
  line-height: 1.6;
}

.app {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
}

.gradient-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255, 87, 34, 0.6), rgba(62, 39, 35, 0.9));
  z-index: -1;
}

.title {
  font-family: 'Righteous', cursive;
  font-size: 3rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  text-align: center;
  color: var(--highlight-color);
}
</style>
