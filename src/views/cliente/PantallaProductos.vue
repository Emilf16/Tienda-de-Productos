<template>
    <v-container fluid>

        <v-row>
            <v-col v-for="category in categories" v-bind:key="category.idCategory" v-bind:category="category" cols="12"
                lg="3" md="4" sm="6" xs="12">

                <v-card class="mx-auto my-2" max-width="auto" elevation="6">
                    <v-img height="200px" contain v-bind:src="category.strCategoryThumb"
                        v-bind:alt="category.strCategory"></v-img>
                    <v-card-item>
                        <v-card-title>{{ category.strCategory }}</v-card-title>

                        <v-card-subtitle>
                            <span class="me-1">US$29.99</span>

                            <v-icon color="error" icon="mdi-fire-circle" size="small"></v-icon>
                        </v-card-subtitle>
                    </v-card-item>

                    <v-card-text>
                        <v-row align="center" class="mx-0">
                            <v-rating :model-value="4.5" color="amber" density="compact" half-increments readonly
                                size="small"></v-rating>

                            <div class="text-grey ms-4">
                                4.5 (413)
                            </div>
                        </v-row>

                        <div class=" mt-5" color="#000000"
                            style="overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; white-space: normal;">
                            {{ category.strCategoryDescription }}
                        </div>
                    </v-card-text>
                    <v-divider class="mx-4 mb-1"></v-divider>
                    <v-card-title>En Stock</v-card-title>

                    <v-card-actions class=" d-flex" style="justify-content: space-between;">
                        <v-btn color="blue" variant="flat" text class="flex-grow-1 ml-2">
                            <span style="color: white; font-weight: bold;">
                                ver
                            </span>
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn color="#FFC107" variant="flat" class="flex-grow-4 mr-2"
                            @click="agregarNuevoProducto(category)">
                            <span style="color: white; font-weight: bold;">
                                + Agregar al carrito
                            </span>
                        </v-btn>
                    </v-card-actions>
                </v-card>


            </v-col>
        </v-row>

    </v-container>
</template>

<script>
import axios from 'axios'

export default {

    components: {
    },
    data() {
        return {
            checkoutModal: false,
            productosCarrito: [],
            categories: [],
            meals: [],
            search: null,
            current: 1,
            pageSize: 5, rating: 3, loading: false,
            selection: 1,

        }
    },
    mounted() {
        axios.get('https://www.themealdb.com/api/json/v1/1/categories.php')
            .then((res) => {
                //idCategory
                //strCategory
                //strCategoryDescription
                //strCategoryThumb
                this.categories = res.data.categories;
            }).catch((err) => {
                console.log(err);
            })
    },
    methods: {
        agregarNuevoProducto(producto) {
            this.$store.commit('agregarNuevoProducto', producto)
            console.log(this.$store.state.productosCarrito)

        },


        searchData() {
            //verificar si el campo de busquea tiene texto
            if (this.search) {
                axios.get('https://www.themealdb.com/api/json/v1/1/search.php?s=' + this.search)
                    .then((res) => {
                        //idMeal
                        //strArea
                        //strCategory
                        //strSource
                        this.meals = res.data.meals;


                    }).catch((err) => {
                        console.log(err);

                    })
            } else {

                return;

            }
        }, showPaymentModal() {
            this.checkoutModal = true;
        },
        reserve() {
            this.loading = true

            setTimeout(() => (this.loading = false), 2000)
        },

    },
    computed: {

    }
}
</script>
