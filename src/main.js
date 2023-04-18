
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import PrimeVue from 'primevue/config';
import { createApp } from 'vue'
import { createStore } from 'vuex'
import { jsPDF } from "jspdf";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import { FilterMatchMode } from 'primevue/api';
import "vue-easytable/libs/theme-default/index.css"; // import style
import VueEasytable from "vue-easytable"; // import library





loadFonts()

const store = createStore({
  state() {
    return {
      productosCarrito: [],
      estaLogueado: false,
      userName: "",
      defaultToastProperties: {
        timeout: 3000,
        closeOnClick: true,
        pauseOnFocusLoss: false,
        pauseOnHover: false,
        draggable: true,
        draggablePercent: 0.6,
        showCloseButtonOnHover: true,
        hideProgressBar: true,
        closeButton: "button",
        icon: true,
        rtl: false
      },
    }
  },
  mutations: {

    agregarNuevoProducto(state, producto) {
      state.productosCarrito.push(producto)
    },
    mostrarTienda(state, token) {
      if (token == null) {
        state.estaLogueado = false;
      }
      else {
        state.estaLogueado = true;
      }
    }
  }
})

createApp(App)
  .use(router)
  .use(jsPDF)
  .use(vuetify)
  .use(store)
  .use(FilterMatchMode)
  .use(PrimeVue)
  .use(VueEasytable)
  .use(Toast, {
    transition: "Vue-Toastification__fade",
    maxToasts: 20,
    newestOnTop: true
  })
  .mount('#app')
