import { createRouter, createWebHashHistory } from 'vue-router'
import PantallaProductos from '../views/cliente/PantallaProductos.vue'
import CarritoCompras from '../views/cliente/CarritoCompras.vue'
import PagarProducto from '../components/PagarProducto.vue'
import GestionarStock from '../views/admin/GestionarStock.vue'
import GestionarUsuarios from '../views/admin/GestionarUsuarios.vue'
import GestionarRoles from '../views/admin/GestionarRoles.vue'
import GestionarCategorias from '../views/admin/GestionarCategorias.vue'
import PantallaLogin from '../views/PantallaLogin.vue'

const routes = [

  {
    path: '/pantallaLogin',
    component: PantallaLogin
  },
  {
    path: '/',
    component: PantallaProductos
  },
  {
    path: '/carritoCompras',
    component: CarritoCompras
  },
  {
    path: '/pagarProducto',
    component: PagarProducto
  },
  {
    path: '/gestionarStock',
    component: GestionarStock
  }
  , {
    path: '/gestionarUsuarios',
    component: GestionarUsuarios
  }, {
    path: '/gestionarCategorias',
    component: GestionarCategorias
  }
  , {
    path: '/gestionarRoles',
    component: GestionarRoles
  }

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})


export default router
