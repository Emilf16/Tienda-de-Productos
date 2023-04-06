import { createRouter, createWebHashHistory } from 'vue-router'
import PantallaProductos from '../components/PantallaProductos.vue'
import CarritoCompras from '../components/CarritoCompras.vue'
import PagarProducto from '../components/PagarProducto.vue'
import GestionarStock from '../components/GestionarStock.vue'

const routes = [


  {
    path: '/pantallaProductos',
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

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})


export default router
