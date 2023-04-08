<template>
    <v-app id="inspire">
        <v-app-bar>
            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
            <router-link to="/pantallaProductos"
                style="text-decoration: none; color: inherit;"><v-toolbar-title>Tienda</v-toolbar-title></router-link>
            <v-spacer> </v-spacer>
            <v-btn>

                <router-link to="/carritoCompras" style="text-decoration: none; color: inherit;">
                    <v-badge :content="0" floating>
                        Carrito <v-icon size="large" icon="mdi-cart-outline"></v-icon></v-badge>
                </router-link>


            </v-btn>
            <v-btn @click="logOut">LogOut</v-btn>
            <span class="ml-5"></span>

        </v-app-bar>
        <v-navigation-drawer v-model="drawer" temporary>
            <v-divider></v-divider>

            <v-divider></v-divider>
            <v-list density="compact" nav>
                <!-- buscar productos -->
                <router-link to="/" style="text-decoration: none; color: inherit;"><v-list-item
                        prepend-icon="mdi-view-dashboard" title="Productos" value="productos"></v-list-item></router-link>
                <!-- ver carrito -->
                <router-link to="/carritoCompras" style="text-decoration: none; color: inherit;"><v-list-item
                        prepend-icon="mdi-cart-outline" title="Carrito" value="carrito"></v-list-item></router-link>
                <!-- gestionar productos -->
                <router-link to="/gestionarStock" style="text-decoration: none; color: inherit;"><v-list-item
                        prepend-icon="mdi-cart-arrow-down" title="Gestionar Stock"
                        value="carrito"></v-list-item></router-link>

                <!-- gestionar Usuario -->
                <router-link to="/gestionarUsuarios" style="text-decoration: none; color: inherit;"><v-list-item
                        prepend-icon="mdi-account-edit" title="Gestionar Usuarios"
                        value="carrito"></v-list-item></router-link>
                <!-- gestionar Roles -->
                <router-link to="/gestionarRoles" style="text-decoration: none; color: inherit;"><v-list-item
                        prepend-icon="mdi-account-key" title="Gestionar Roles" value="carrito"></v-list-item></router-link>

            </v-list>
        </v-navigation-drawer>

        <v-main>
            <router-view />
            <v-footer class="bg-indigo-lighten-1 text-center d-flex flex-column">
                <div>
                    <v-btn v-for="icon in icons" :key="icon" class="mx-4" :icon="icon" variant="text"></v-btn>
                </div>

                <div class="pt-0">
                    Bienvenidos a nuestra tienda de productos, donde encontrarás una amplia selección de artículos de alta
                    calidad para satisfacer todas tus necesidades. Desde tecnología innovadora hasta productos de belleza y
                    bienestar, tenemos todo lo que necesitas para mejorar tu estilo de vida y disfrutar de una experiencia
                    de compra inolvidable. Nuestro compromiso es ofrecerte los mejores productos al mejor precio, y nuestro
                    equipo de expertos está siempre dispuesto a ayudarte a encontrar exactamente lo que estás buscando.
                    Gracias por visitarnos y esperamos verte pronto en nuestra tienda.
                </div>

                <v-divider></v-divider>

                <div>
                    {{ new Date().getFullYear() }} — <strong>Vuetify</strong>
                </div>
            </v-footer>
        </v-main>
        <!---->
    </v-app>
</template>

<script>
import axios from 'axios'

export default {
    data() {
        return {

            drawer: false,
            rail: true,
            reveal: false,
            categories: [],
        };
    },
    methods: {
        async logOut() {
            this.error = null;
            await axios.put('https://tiendabackend.azurewebsites.net/api/Account',
                {})
                .then(respuesta => {
                    console.log(respuesta);

                    this.$store.commit('LogOut', false)
                    // this.$router.push({ path: '/' })
                })
        },



    },
};
</script>