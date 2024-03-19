import { createApp } from 'vue'
import App from './views/Home.vue'

import { createMemoryHistory, createRouter } from 'vue-router'
import Quiz from '@/views/Quiz.vue'

const routes = [

    { path: '/quiz', component: Quiz },
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

const app = createApp(App)
app.use(router)
app.mount('#app')
