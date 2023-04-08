
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import PrimeVue from 'primevue/config';
import Image from 'primevue/image';
import { createApp } from 'vue'
import { createStore } from 'vuex'
import { jsPDF } from "jspdf";
import ConfirmPopup from 'primevue/confirmpopup';
import ConfirmationService from 'primevue/confirmationservice';

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
  .mount('#app')
