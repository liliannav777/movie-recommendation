// main.js
import { createApp } from 'vue';
import App from './App.vue'; // Le composant principal
import router from './router'; // Importation du routeur

const app = createApp(App);
app.use(router); // Utilisation du routeur dans l'application
app.mount('#app'); // Montage de l'application dans l'élément HTML avec id 'app'
