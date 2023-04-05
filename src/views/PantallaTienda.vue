<template>
    <v-app id="inspire">
        <v-app-bar>
            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
            <router-link to="/pantallaProductos"
                style="text-decoration: none; color: inherit;"><v-toolbar-title>Tienda</v-toolbar-title></router-link>
            <v-spacer></v-spacer>
            <v-btn>

                <router-link to="/carritoCompras" style="text-decoration: none; color: inherit;">
                    <v-icon size="large" icon="mdi-cart-outline" @click="drawer = !drawer"></v-icon>
                    Carrito</router-link>
            </v-btn>

        </v-app-bar>
        <v-navigation-drawer v-model="drawer" temporary>
            <v-divider></v-divider>

            <v-divider></v-divider>
            <v-list density="compact" nav>
                <router-link to="/pantallaProductos" style="text-decoration: none; color: inherit;"><v-list-item
                        prepend-icon="mdi-view-dashboard" title="Productos" value="productos"></v-list-item></router-link>
                <router-link to="/carritoCompras" style="text-decoration: none; color: inherit;"><v-list-item
                        prepend-icon="mdi-cart-outline" title="Carrito" value="carrito"></v-list-item></router-link>
            </v-list>
        </v-navigation-drawer>

        <v-main>
            <router-view />
            <v-footer class="bg-indigo-lighten-1 text-center d-flex flex-column">
                <div>
                    <v-btn v-for="icon in icons" :key="icon" class="mx-4" :icon="icon" variant="text"></v-btn>
                </div>

                <div class="pt-0">
                    Phasellus feugiat arcu sapien, et iaculis ipsum elementum sit amet. Mauris cursus commodo interdum.
                    Praesent
                    ut risus eget metus luctus accumsan id ultrices nunc. Sed at orci sed massa consectetur dignissim a sit
                    amet
                    dui. Duis commodo vitae velit et faucibus. Morbi vehicula lacinia malesuada. Nulla placerat augue vel
                    ipsum
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
// import LoginForm from "./components/LoginRegistroUsuario.vue";

export default {
    components: {
        // LoginForm,
    },
    data() {
        return {

            drawer: false,
            rail: true,
            reveal: false,
            categories: [],
        };
    },
    methods: {

    },
};
</script>