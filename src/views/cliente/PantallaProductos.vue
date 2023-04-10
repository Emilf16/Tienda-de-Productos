<template>
    <v-carousel
        cycle
        height="400"
        hide-delimiter-background
        show-arrows="hover"
        hide-delimiters
    >
        <v-carousel-item v-for="(category, index) in categoriesSlider" :key="index" >
            <v-sheet height="100%" 
                :style="'background-image: linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.4)), url(' + category.image + ');' + 'background-position: center center; background-repeat: no-repeat; background-size: cover;'"
                class="d-flex flex-column justify-center align-center"
            >
                <h2 class="text-h2 mb-2 text-white" style="font-family: 'Poppins', sans-serif !important; font-weight: bold;">{{ category.title }}</h2>
                <p class="text-h5 mb-5 text-white" style="font-family: 'Poppins', sans-serif !important">{{ category.description }}</p>
                <v-btn class="mx-auto my-2" color="warning" @click="viewCategory(category)">
                    Ver más
                </v-btn>
            </v-sheet>
        </v-carousel-item>
    </v-carousel>

    <v-container fluid>
        <v-row class="mx-4 my-4">
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
                        <v-btn color="#090C29" variant="flat" text class="flex-grow-1 ml-2">
                            <span style="color: white; font-weight: bold;">
                                ver
                            </span>
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn color="warning" variant="flat" class="flex-grow-4 mr-2"
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
            colors: [
            'indigo',
            'warning',
            'pink darken-2',
            'red lighten-1',
            'deep-purple accent-4',
            ],
            slides: [
            'First',
            'Second',
            'Third',
            'Fourth',
            'Fifth',
            ],

            categoriesSlider: [
                {
                    title: "Ropa",
                    description: "Vestido de verano para mujer de color rojo.",
                    image: "https://cdn.stocksnap.io/img-thumbs/960w/clothes-store_Q2WKRAM2O4.jpg",
                },
                {
                    title: "Tecnología",
                    description: "Vestido de versdfde color rojo.",
                    image: "https://cdn.stocksnap.io/img-thumbs/960w/computer-keyboard_IHIHTFK8YH.jpg",
                },
                {
                    title: "Hogar",
                    description: "Vsdfo.",
                    image: "https://cdn.stocksnap.io/img-thumbs/960w/bed-bedroom_UJCTKDCTXC.jpg",
                },
                {
                    title: "Libros",
                    description: "Vestido de sdf rojo.",
                    image: "https://cdn.stocksnap.io/img-thumbs/960w/developer-books_KAUFJW1PEQ.jpg",
                },
            ],
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
