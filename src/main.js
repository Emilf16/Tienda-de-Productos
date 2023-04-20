import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import PrimeVue from "primevue/config";
import { createApp } from "vue";
import { createStore } from "vuex";
import { jsPDF } from "jspdf";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import { FilterMatchMode } from "primevue/api";
import VueCreditCardValidation from "vue-credit-card-validation";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
// import InputNumber from 'primevue/inputnumber';

import "primeflex/primeflex.min.css";
import "primeicons/primeicons.css";
import "primevue/resources/primevue.min.css";
import "primevue/resources/themes/saga-blue/theme.css";
import "primevue/resources/themes/fluent-light/theme.css";

loadFonts();

const store = createStore({
  state() {
    return {
      estaLogueado: false,
      userName: "",
      defaultToastOptions: {
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
        rtl: false,
      },
    };
  },
  mutations: {
    mostrarTienda(state, token) {
      if (token == null) {
        state.estaLogueado = false;
      } else {
        state.estaLogueado = true;
      }
    },
  },
});

createApp(App)
  .use(router)
  .use(jsPDF)
  .use(vuetify)
  .use(store)
  .use(FilterMatchMode)
  .use(PrimeVue, { ripple: true })
  .use(VueCreditCardValidation)
  .use(Toast, {
    transition: "Vue-Toastification__fade",
    maxToasts: 20,
    newestOnTop: true,
  })
  .component("font-awesome-icon", FontAwesomeIcon)
  .mount("#app");
