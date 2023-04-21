import { createRouter, createWebHashHistory } from "vue-router";
import PantallaProductos from "../views/cliente/PantallaProductos.vue";
import CarritoCompras from "../views/cliente/CarritoCompras.vue";
import PagarProducto from "../components/PagarProducto.vue";
import GestionarStock from "../views/admin/GestionarStock.vue";
import GestionarUsuarios from "../views/admin/GestionarUsuarios.vue";
import GestionarRoles from "../views/admin/GestionarRoles.vue";

import GestionarPedidos from "../views/admin/GestionarPedidos.vue";

import GestionarCategorias from "../views/admin/GestionarCategorias.vue";

import MiPerfil from "../views/cliente/MiPerfil.vue";
import MisPedidos from "../views/cliente/MisPedidos.vue";
import PantallaLogin from "../views/PantallaLogin.vue";

const routes = [
  {
    path: "/pantallaLogin",
    name: "Login",
    component: PantallaLogin,
  },
  {
    path: "/",
    name: "Home",
    component: PantallaProductos,
  },
  {
    path: "/carritoCompras",
    name: "Carrito",
    component: CarritoCompras,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/pagarProducto",
    name: "Pagar",
    component: PagarProducto,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/gestionarProductos",
    name: "GestionarStock",
    component: GestionarStock,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/gestionarCategorias",
    name: "GestionarCategorias",
    component: GestionarCategorias,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/gestionarUsuarios",
    name: "GestionarUsuarios",
    component: GestionarUsuarios,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/gestionarPedidos",
    name: "GestionarPedidos",
    component: GestionarPedidos,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/gestionarPerfiles",
    name: "GestionarPerfiles",

    component: GestionarRoles,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/MiPerfil",
    name: "MiPerfil",
    component: MiPerfil,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/Pedidos",
    name: "MisPedidos",
    component: MisPedidos,
    meta: {
      requiresAuth: true,
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem("token");

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isLoggedIn) {
      // MI BRO METE UNA LOGICA AQUI PA MANDARLO PAL LOGIN
      // next('/pantallaLogin');
      next();
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
