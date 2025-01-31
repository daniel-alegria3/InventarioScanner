import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    redirect: '/folder/Venta'
  },
  {
    path: '/folder/Venta',
    component: () => import ('../views/FolderVentas.vue')
  },
  {
    path: '/folder/Inventario',
    component: () => import ('../views/FolderInventario.vue')
  },
  {
    path: '/folder/Venta/buscarProducto',
    component: () => import ('../components/BuscarProducto.vue')
  }

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
