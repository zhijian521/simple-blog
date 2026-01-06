import { createApp } from 'vue';

import App from '@/App.vue';
import { bootstrapApp } from '@/app/bootstrap';

import '@/style.css';

const app = createApp(App);
bootstrapApp(app);
app.mount('#app');
