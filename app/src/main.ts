import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import { router } from './router'
import './styles/index.css'

export const createApp = ViteSSG(App, {
    routes: router.options.routes,
    base: '/',
})
