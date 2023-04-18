<template>
  <link rel="stylesheet" 
        href="https://use.fontawesome.com/releases/v5.2.0/css/all.css" 
        integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ" 
        crossorigin="anonymous">
  <v-app>
    <v-main>
      <v-layout fluid v-if="mostrarTienda">
        <PantallaTienda>
        </PantallaTienda>
      </v-layout>

      <v-layout fluid v-else class="h-100">
        <PantallaLogin>
        </PantallaLogin>
      </v-layout>


    </v-main>
  </v-app>
</template>

<style>
  @import 'primeicons/primeicons.css';
  * {
    font-family: 'Poppins', sans-serif !important;
  }
  i.pi { font-family: PrimeIcons !important;  }
</style>

<script>
import PantallaTienda from './views/PantallaTienda.vue'
import PantallaLogin from './views/PantallaLogin.vue'
import 'primeicons/primeicons.css';

export default {
  components: {
    PantallaLogin,
    PantallaTienda
  },
  computed: {
    mostrarTienda() {
      const token = localStorage.getItem('token');
      this.$store.commit('mostrarTienda', token);
      return this.$store.state.estaLogueado
    },
    estaLogueado() {
      return this.$store.state.estaLogueado
    },
    // async getUser() {
    //   this.error = null;
    //   await axios.get('https://tiendabackend.azurewebsites.net/api/Account/GetUserData',
    //   )
    //     .then(respuesta => {
    //       console.log(respuesta);
    //       if (respuesta.length > 0) {
    //         this.$store.commit('LogOut', true)
    //         this.estaLogueado
    //         console.log(respuesta)
    //       }
    //     })
    // },

  },
  data() {
    return {
      tab: 0,
      valid: false,
      email: "",
      password: "",
      name: "",
      confirmPassword: "",
      emailRules: [
        (v) => !!v || "El correo electrónico es requerido",
        (v) => /.+@.+\..+/.test(v) || "El correo electrónico debe ser válido",
      ],
      passwordRules: [
        (v) => !!v || "La contraseña es requerida",
        (v) => v && v.length >= 8 || "La contraseña debe contener al menos 8 caracteres",
      ],
      nameRules: [
        (v) => !!v || "El nombre es requerido",
        (v) => v && v.length >= 3 || "El nombre debe contener al menos 3 caracteres",
      ],
      confirmPasswordRules: [
        (v) => !!v || "Confirmar contraseña es requerido",
        (v) => v === this.password || "Las contraseñas no coinciden",
      ],
      drawer: false,
      login: false,
      rail: true,
      reveal: false,
      categories: [],
      isLoggedIn: false,
    };
  },
  methods: {

  },
};
</script> 
 