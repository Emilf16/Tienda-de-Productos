<template>
  <v-app id="inspire">
    <v-app-bar style="background-color: #090c29; color: white">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <router-link to="/" style="text-decoration: none; color: inherit"
        ><v-toolbar-title>Secure Store</v-toolbar-title></router-link
      >
      <v-spacer> </v-spacer>
      <v-btn :ripple="false" variant="text" class="text-none" stacked>
        <router-link
          to="/carritoCompras"
          style="text-decoration: none; color: inherit"
        >
          <v-badge :content="badge">
            <v-icon size="large" icon="mdi-cart-outline"></v-icon>
          </v-badge>
        </router-link>
        <v-tooltip activator="parent" location="bottom">Mi carrito</v-tooltip>
      </v-btn>
      <v-menu :close-on-content-click="false">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" :ripple="false" variant="text" stacked>
            <v-avatar
              size="x-small"
              image="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
              class="mx-1"
            ></v-avatar>
            <v-tooltip activator="parent" location="bottom"
              >Mi cuenta</v-tooltip
            >
          </v-btn>
        </template>
        <v-list border class="mx-auto" max-width="256">
          <v-list-item
            link
            :to="{ name: 'MiPerfil' }"
            prepend-icon="mdi-account-outline"
            title="Mi perfil"
          >
          </v-list-item>

          <v-list-item
            link
            :to="{ name: 'MisPedidos' }"
            prepend-icon="mdi-package-variant-closed"
            title="Mis pedidos"
          ></v-list-item>

          <v-divider></v-divider>

          <v-list-item class="text-center">
            <v-btn
              style="width: 100%; margin: 10px 0px 5px 0px"
              color="warning"
              variant="outlined"
              @click="logOut"
            >
              <v-icon style="margin: 0px 5px">mdi-logout</v-icon>
              Cerrar sesión
            </v-btn>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" temporary>
      <v-divider></v-divider>

      <v-divider></v-divider>
      <v-list density="compact" nav>
        <router-link to="/" style="text-decoration: none; color: inherit"
          ><v-list-item
            prepend-icon="mdi-view-dashboard"
            title="Productos"
            value="productos"
          ></v-list-item
        ></router-link>

        <router-link
          v-for="(vista, index) in vistas"
          :key="index"
          :to="vista.URL"
          style="text-decoration: none; color: inherit"
          ><v-list-item
            :prepend-icon="vista.Icon"
            :title="vista.Vista"
            :value="vista.DescVista"
          ></v-list-item
        ></router-link>
      </v-list>
    </v-navigation-drawer>

    <v-main style="background-color: #f3f3f3">
      <router-view />
    </v-main>
    <!---->
    <v-footer color="#090C29" class="white--text">
      <v-container>
        <v-row style="color: white">
          <v-col cols="12" md="4">
            <h3 class="mb-4">Sobre nosotros</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ut
              tellus eget neque tincidunt semper. Pellentesque habitant morbi
              tristique senectus et netus et malesuada fames ac turpis egestas.
              Fusce eget sapien tincidunt, maximus eros ac, cursus ante.
            </p>
          </v-col>
          <v-col cols="12" md="4">
            <h3 class="mb-4">Contáctanos</h3>
            <p>Teléfono: 123-456-7890</p>
            <p>Email: info@mi-tienda.com</p>
            <p>Dirección: 123 Main St, Ciudad, Estado ZIP</p>
          </v-col>
          <v-col cols="12" md="4">
            <h3 class="mb-4">Síguenos en redes sociales</h3>
            <v-row>
              <v-col cols="4" md="3" v-for="icon in socialIcons" :key="icon">
                <v-btn
                  color="#fff"
                  depressed
                  class="rounded-lg"
                  :href="'https://' + icon.link"
                  target="_blank"
                >
                  <v-icon size="28">{{ icon.icon }}</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </v-app>
</template>

<style>
.profileBtn {
  margin: 0 35px 0 10px !important;
}
</style>

<script>
import axios from "axios";
import { useToast } from "vue-toastification";

import api from "../utilities/api";

export default {
  setup() {
    const toast = useToast();
    return { toast };
  },
  data() {
    return {
      drawer: false,
      listaProductosCarrito: [],
      badge: 0,
      rail: true,
      user: {},
      reveal: false,
      vistas: [],
      toastProperties: this.$store.state.defaultToastProperties,
      socialIcons: [
        { icon: "mdi-facebook", link: "www.facebook.com/mitienda" },
        { icon: "mdi-twitter", link: "www.twitter.com/mitienda" },
        { icon: "mdi-instagram", link: "www.instagram.com/mitienda" },
        { icon: "mdi-pinterest", link: "www.pinterest.com/mitienda" },
      ],
    };
  },
  methods: {
    async logOut() {
      try {
        // Hacer la solicitud PUT con el token de autorización en los encabezados
        const token = localStorage.getItem("token");
        const response = await axios.put(
          "https://tiendabackend.azurewebsites.net/api/Account",
          {},
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        // Borrar el token de autorización del almacenamiento local

        this.$store.commit("mostrarTienda", null);
        localStorage.removeItem("token");
        console.log(response);
      } catch (error) {
        console.error("Error:", error);
      }
    },
    async getUsuario() {
      try {
        const url = "https://tiendabackend.azurewebsites.net/api/Account";
        const token = localStorage.getItem("token");

        const response = await axios.get(url, {
          headers: {
            Authorization: `${token}`,
          },
        });
        this.user = response.data;
        this.vistas = response.data.vistas;

        console.log("Success:", response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    },
    async cargarCarrito() {
      try {
        const response = await api.get(
          `https://tiendabackend.azurewebsites.net/api/Carritos/GetActualCarrito`
        );

        console.log(response.data);
        this.listaProductosCarrito = response.data;
        this.badge = this.listaProductosCarrito.Productos.length;

        console.log(this.listaProductosCarrito.Productos.length);

        // this.toast.success(response.data.Message, this.toastProperties);
      } catch (error) {
        this.toast.error(
          "Error 500. Error al agregar al carrito." + error,
          this.toastProperties
        );
      }
    },
  },
  mounted() {
    this.getUsuario();
    this.cargarCarrito();
  },
};
</script>
