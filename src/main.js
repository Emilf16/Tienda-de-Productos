
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import PrimeVue from 'primevue/config';
import Image from 'primevue/image';
import { createApp } from 'vue'
import { createStore } from 'vuex'
import { jsPDF } from "jspdf";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

loadFonts()

const store = createStore({
  state() {
    return {
      productosCarrito: [],
      estaLogueado: false
    }
  },
  mutations: {

    agregarNuevoProducto(state, producto) {
      state.productosCarrito.push(producto)
    },
    LogOut(state, bool) {
      state.estaLogueado = bool;
    }
  }
})

createApp(App)
  .use(router)
  .use(jsPDF)
  .use(vuetify)
  .use(store)
  .use(Image, "Image")
  .use(PrimeVue)
  .use(Toast, {
    transition: "Vue-Toastification__fade",
    maxToasts: 20,
    newestOnTop: true
  })
  .mount('#app')
