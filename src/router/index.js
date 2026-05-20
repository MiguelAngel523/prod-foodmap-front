import { createRouter, createWebHistory } from 'vue-router'
import HomeComponent from "@/views/home/homeComponent.vue";
import DishesComponent from '@/views/dishes/dishesComponent.vue'
import LoginComponent from '@/core/login/LoginComponent.vue'
import DishDetail from '@/views/dishes/dishDetail.vue'
import RegisterComponent from '@/core/register/RegisterComponent.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: HomeComponent,
    },
    {
      path: '/dishes',
      component: DishesComponent,
    },
    {
      path: '/login',
      component: LoginComponent,
    },
    {
      path: '/register',
      component: RegisterComponent
    },
    {
      path: '/dish-detail/:id',
      props: true,
      name: 'plato-detalle',
      component: DishDetail
    },
  ],
})

export default router
