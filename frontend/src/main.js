import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/tailwind.css';

// Axios
import axios from 'axios';
axios.defaults.baseURL = process.env.VUE_APP_API_URL || 'http://localhost:3000';
export default axios;

createApp(App).use(router).mount('#app');
