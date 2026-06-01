import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import Venta from "@/views/Venta.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "",
    redirect: "/venta",
  },
  {
    path: "/venta",
    component: Venta,
  },
  {
    path: "/inventario",
    component: () => import("@/views/Inventario.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
