<template>
  <v-carousel
    cycle
    height="400"
    hide-delimiter-background
    show-arrows="hover"
    hide-delimiters
  >
    <v-carousel-item v-for="(category, index) in categoriesSlider" :key="index">
      <v-sheet
        height="100%"
        :style="
          'background-image: linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.4)), url(' +
          category.image +
          ');' +
          'background-position: center center; background-repeat: no-repeat; background-size: cover;'
        "
        class="d-flex flex-column justify-center align-center"
      >
        <h2
          class="text-h2 mb-2 text-white"
          style="
            font-family: 'Poppins', sans-serif !important;
            font-weight: bold;
          "
        >
          {{ category.title }}
        </h2>
        <p
          class="text-h5 mb-5 text-white"
          style="font-family: 'Poppins', sans-serif !important"
        >
          {{ category.description }}
        </p>
        <v-btn
          class="mx-auto my-2"
          color="warning"
          @click="viewCategory(category)"
        >
          Ver más
        </v-btn>
      </v-sheet>
    </v-carousel-item>
  </v-carousel>

  <v-container fluid>
    <v-row class="mx-4 my-4">
      <v-col cols="12" class="py-2">
        <v-card-title
          style="
            font-family: 'Poppins', sans-serif !important;
            font-weight: bold;
          "
          >Categorias</v-card-title
        >

        <v-btn-toggle
          v-model="text"
          rounded="0"
          color="deep-purple-accent-3"
          group
        >
          <v-btn
            style="
              font-family: 'Poppins', sans-serif !important;
              font-weight: bold;
            "
            v-for="categoria in listaCategorias"
            v-bind:key="categoria.idCategoria"
            v-bind:categoria="categoria"
            v-model="categoria.idCategoria"
            rounded="0"
            color="warning"
            group
            @click="filtrarProductos(categoria.idCategoria)"
            >{{ categoria.Nombre }}
          </v-btn>
        </v-btn-toggle>
      </v-col>

      <v-col
        v-for="producto in listaProductoFiltros"
        v-bind:key="producto.idProducto"
        v-bind:producto="producto"
        cols="12"
        lg="3"
        md="4"
        sm="6"
        xs="12"
      >
        <v-card class="mx-auto my-2" max-width="auto" elevation="6">
          <div class="my-4"></div>
          <v-img
            v-if="producto.FotoUrl != null"
            :src="producto.FotoUrl"
            :alt="producto.FotoUrl"
            height="200px"
            contain
          ></v-img>
          <v-img
            v-else
            src="https://ecomworld.shop/uploads/default-product.png"
            :alt="producto.Nombre"
            height="300px"
            contain
          ></v-img>
          <v-card-title
            style="
              font-family: 'Poppins', sans-serif !important;
              font-weight: bold;
            "
            >{{ producto.Nombre }}</v-card-title
          >
          <v-card-title
            style="
              font-family: 'Poppins', sans-serif !important;
              font-weight: bold;
            "
            >RD$ {{ producto.Precio }}</v-card-title
          >
          <v-card-text>
            <v-row align="center" class="mx-0">
              <v-rating
                :model-value="producto.Valoracion"
                color="warning"
                density="compact"
                half-increments
                readonly
                size="small"
              ></v-rating>
              <div
                class="text-grey ms-4"
                style="
                  font-family: 'Poppins', sans-serif !important;
                  font-weight: bold;
                "
              >
                {{ producto.Valoracion }}/5
              </div>
            </v-row>
          </v-card-text>
          <v-textarea
            style="
              font-family: 'Poppins', sans-serif !important;
              font-weight: light;
            "
            v-model="producto.Descripcion"
            variant="filled"
            auto-grow
            label="Descripción"
            rows="4"
            row-height="30"
            shaped
          ></v-textarea>
          <v-card-text
            style="
              font-family: 'Poppins', sans-serif !important;
              font-weight: bold;
            "
            v-if="producto.CantidadStock < 21"
            class="text-red-accent-4 text-h6"
          >
            Solo queda(n) {{ producto.CantidadStock }} en Stock
          </v-card-text>

          <v-card-text
            v-else
            class="text-h6"
            style="
              font-family: 'Poppins', sans-serif !important;
              font-weight: bold;
            "
          >
            En Stock
          </v-card-text>
          <!-- HACER QUE SI QUEDAN MENOS DE 5 PRODUCTOS SALGA MENSAJE ROJO AVISANDO -->

          <v-card-actions class="d-flex" style="justify-content: space-between">
            <v-btn color="#090C29" variant="flat" text class="flex-grow-1 ml-2">
              <span style="color: white; font-weight: bold">Ver</span>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="warning"
              variant="flat"
              class="flex-grow-4 mr-2"
              @click="agregarAlCarrito(producto)"
            >
              <span style="color: white; font-weight: bold"
                >+ Agregar al carrito</span
              >
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import api from "../../utilities/api";

export default {
  data() {
    return {
      checkoutModal: false,
      productosCarrito: [],
      categories: [],

      listaCategorias: [],
      listaProductos: [],
      listaProductoFiltros: [],
      meals: [],
      text: "center",
      icon: "justify",
      toggle_none: null,
      toggle_one: 0,
      toggle_exclusive: 2,
      toggle_multiple: [0, 1, 2],
      search: null,
      current: 1,
      pageSize: 5,
      rating: 3,
      loading: false,
      selection: 1,
      colors: [
        "indigo",
        "warning",
        "pink darken-2",
        "red lighten-1",
        "deep-purple accent-4",
      ],
      slides: ["First", "Second", "Third", "Fourth", "Fifth"],

      categoriesSlider: [
        {
          title: "Ropa",
          description: "Vestido de verano para mujer de color rojo.",
          image:
            "https://cdn.stocksnap.io/img-thumbs/960w/clothes-store_Q2WKRAM2O4.jpg",
        },
        {
          title: "Tecnología",
          description: "Vestido de versdfde color rojo.",
          image:
            "https://cdn.stocksnap.io/img-thumbs/960w/computer-keyboard_IHIHTFK8YH.jpg",
        },
        {
          title: "Hogar",
          description: "Vsdfo.",
          image:
            "https://cdn.stocksnap.io/img-thumbs/960w/bed-bedroom_UJCTKDCTXC.jpg",
        },
        {
          title: "Libros",
          description: "Vestido de sdf rojo.",
          image:
            "https://cdn.stocksnap.io/img-thumbs/960w/developer-books_KAUFJW1PEQ.jpg",
        },
      ],
    };
  },
  mounted() {
    this.getCategorias();
    this.getProductos();
    this.filtrarProductos();
  },
  methods: {
    filtrarProductos(IdCategoria) {
      console.log(IdCategoria);
      if (IdCategoria == null) {
        this.listaProductoFiltros = this.listaProductos;
      }

      this.listaProductoFiltros = this.listaProductos.filter((producto) =>
        producto.Categorias.some(
          (categoria) => categoria.idCategoria === IdCategoria
        )
      );
    },
    async getCategorias() {
      try {
        const url =
          "https://tiendabackend.azurewebsites.net/api/Productos/GetCategorias";
        const token = localStorage.getItem("token");

        const response = await axios.get(url, {
          headers: {
            Authorization: `${token}`,
          },
        });

        this.listaCategorias = response.data;
        console.log(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    },
    async getProductos() {
      try {
        const url = "https://tiendabackend.azurewebsites.net/api/Productos";
        const token = localStorage.getItem("token");

        const response = await axios.get(url, {
          headers: {
            Authorization: `${token}`,
          },
        });

        this.listaProductos = response.data;
        this.listaProductoFiltros = response.data;
      } catch (error) {
        console.error("Error:", error);
      }
    },

    async agregarAlCarrito(produto) {
      console.log(produto);
      try {
        const response = await api.post(
          `https://tiendabackend.azurewebsites.net/api/Carritos/InsertarProducto?idProducto=${produto.idProducto}&cantidad=1&precioPorProducto=0`
        );

        console.log(response);

        // this.toast.success(response.data.Message, this.toastProperties);
      } catch (error) {
        this.toast.error(
          "Error 500. Error al agregar al carrito." + error,
          this.toastProperties
        );
      }
    },

    agregarNuevoProducto(producto) {
      this.$store.commit("agregarNuevoProducto", producto);
      console.log(this.$store.state.productosCarrito);
    },

    showPaymentModal() {
      this.checkoutModal = true;
    },
    reserve() {
      this.loading = true;

      setTimeout(() => (this.loading = false), 2000);
    },
  },
  computed: {},
};
</script>
