<template>
  <v-container fluid id="reporte">
    <v-row>
      <v-col cols="12" lg="8" md="6" sm="12" xs="12">
        <v-card-title>
          <div class="d-flex">
            <h1 class="ml-5 mb-15 mt-5" style="left: 600px; top: -25px">
              Artículos del Carrito
            </h1>
          </div>
          <div class="ml-4" style="position: relative">
            <div class="d-flex justify-space-between align-center">
              <span
                style="
                  position: absolute;
                  left: 0;
                  top: -25px;
                  bottom: 5;
                  margin-left: 2%;
                  margin-bottom: 10px;
                  width: 20%;
                "
                >Producto</span
              >
              <span
                style="
                  position: absolute;
                  left: 0;
                  top: -25px;
                  bottom: 5;
                  margin-bottom: 10px;
                  width: 55%;
                  text-align: right;
                  padding-right: -30%;
                "
                >Precio</span
              >
              <span
                style="
                  position: absolute;
                  left: 0;
                  top: -25px;
                  bottom: 5;
                  margin-bottom: 10px;
                  width: 72%;
                  text-align: right;
                  padding-right: -30%;
                "
                >Cantidad</span
              >
              <span
                style="
                  position: absolute;
                  left: 0;
                  top: -25px;
                  bottom: 5;
                  margin-bottom: 10px;
                  width: 85%;
                  text-align: right;
                  padding-right: -30%;
                "
                >Total</span
              >
            </div>
            <hr
              class="mt-5"
              style="
                position: relative;
                bottom: -9px;
                left: 0;
                right: 0;
                border-top: 1px solid grey;
              "
            />
          </div>
        </v-card-title>

        <v-col
          v-for="(producto, index) in listaProductosCarrito.Productos"
          v-bind:key="index"
          v-bind:producto="producto"
          class="ml-5"
        >
          <v-card color="#ffffff" theme="light" elevation="0" class="ml-0">
            <div class="d-flex flex-no-wrap">
              <v-avatar
                class="mb-5"
                size="120"
                rounded="0"
                cols="9"
                lg="6"
                md="6"
                sm="6"
                xs="6"
              >
                <v-img
                  v-bind:src="producto.FotoUrl"
                  v-bind:alt="producto.Nombre"
                ></v-img>
              </v-avatar>
              <div>
                <v-col>
                  <v-card-title class="text-h6 mt-2">
                    {{ producto.Nombre }}
                  </v-card-title>
                  <v-card-text>
                    <v-row class="mx-0 my-4">
                      <div
                        style="
                          position: absolute;
                          left: 0;
                          top: 47px;
                          bottom: 3;
                          margin-bottom: 7px;
                          width: 53%;
                          text-align: right;
                          padding-right: -30%;
                        "
                      >
                        <span style="font-size: large" class="text-black"
                          >$ {{ producto.Precio }}</span
                        >
                      </div>
                      <div
                        style="
                          position: absolute;
                          left: 0;
                          top: 47px;
                          bottom: 3;
                          margin-bottom: 1px;
                          width: 66%;
                          text-align: right;
                          padding-right: -30%;
                        "
                      >
                        <span
                          style="font-size: large"
                          class="text-black mt-1"
                          >{{ producto.CantidadEnCarrito }}</span
                        >
                      </div>

                      <div
                        style="
                          position: absolute;
                          left: 0;
                          top: 32px;
                          bottom: 5;
                          margin-bottom: 10px;
                          width: 100%;
                          text-align: right;
                          padding-right: -30%;
                        "
                      >
                        <v-btn
                          @click="borrarProductoCarrito(producto)"
                          icon
                          elevation="0"
                          hover-size="0"
                        >
                          <v-icon left color="#252525">mdi-delete</v-icon>
                        </v-btn>
                      </div>
                      <div
                        style="
                          position: absolute;
                          left: 0;
                          top: 32px;
                          bottom: 5;
                          margin-bottom: 10px;
                          width: 95%;
                          text-align: right;
                          padding-right: -30%;
                        "
                      >
                        <v-btn
                          icon
                          elevation="0"
                          hover-size="0"
                          @click="agregarOtroProductoCarrito(producto)"
                        >
                          <span style="color: #252525; font-weight: bold">
                            +
                          </span>
                        </v-btn>
                      </div>
                    </v-row>
                  </v-card-text>
                </v-col>
              </div>
            </div>
          </v-card>
          <hr class="mt-2" style="border-top: 1px solid grey; width: 98%" />
        </v-col>
      </v-col>

      <v-col cols="12" lg="4" md="6">
        <v-btn
          color="#F7BB44"
          @click="clearCart"
          style="margin-top: 10%; margin-left: 61%; margin-bottom: 9%"
        >
          <span style="font-weight: bold; color: white">Limpiar Carrito</span>
        </v-btn>
        <v-sheet
          color="#F0FCFF"
          elevation="0"
          class="pa-6"
          style="margin-left: 6%; margin-right: 4%"
        >
          <v-card-title class="align-center">
            <h2 class="align-center mt-20px mb-5">Resumen</h2>

            <hr class="border-top-1 border-grey mb-9" />
            <ul>
              <div
                class="text-center"
                style="display: flex; justify-content: space-between"
              >
                <span>Total Productos:</span>
                <span style="text-align: right">100.00</span>
              </div>
              <br />
              <div
                class="text-center"
                style="display: flex; justify-content: space-between"
              >
                <span>Envío:</span>
                <span style="text-align: right">Gratis</span>
              </div>
            </ul>
            <hr class="border-top-1 border-grey mt-7 mb-7" />
            <div
              class="text-center"
              style="
                display: flex;
                justify-content: space-between;
                font-weight: bold;
              "
            >
              <span>Total:</span>
              <span style="text-align: right">100.00</span>
            </div>
          </v-card-title>
          <v-card-text> </v-card-text>
          <v-btn
            color="primary"
            @click="showPaymentModal()"
            class="ml-4 d-flex justify-center"
            >Pagar</v-btn
          >
        </v-sheet>
      </v-col>
    </v-row>

    <!-- pagar productos /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////-->
    <v-dialog v-model="checkoutModal" max-width="550">
      <v-card color="#ffffff" theme="light" elevation="0">
        <v-card-text>
          <div class="container d-flex flex-column align-center justify-center">
            <div
              class="card"
              style="
                font-family: 'Poppins', sans-serif;
                height: 260px;
                width: 350px;
              "
            >
              <div class="top">
                <h3 class="mb-7 mt-5" style="margin-left: 100px">
                  Agregar Tarjeta
                </h3>
                <hr />
              </div>
              <div class="card-details mt-6">
                <span style="margin-right: 17%">Número</span>
                <input
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  data-slots="0"
                  data-accept="\d"
                  size="19"
                  style="padding-left: 5px; margin-left: 3%"
                  maxlength="16"
                />
                <i class="fa fa-credit-card"></i>
              </div>

              <div class="exp-cvv">
                <div class="card-details mt-4">
                  <span style="margin-right: 17%">Fecha</span>
                  <input
                    type="text"
                    placeholder="MM/YYYY"
                    data-slots="my"
                    size="5"
                    maxlength="3"
                    style="padding-left: 5px; margin-left: 8%"
                  />

                  <i class="fa fa-calendar"></i>
                </div>
                <div class="card-details mt-4">
                  <span style="margin-right: 17%">CVV</span>
                  <input
                    type="text"
                    placeholder="000"
                    data-slots="my"
                    data-accept="\d"
                    size="7"
                    style="padding-left: 5px; margin-left: 13%"
                    maxlength="3"
                  />
                  <i class="fa fa-info-circle"></i>
                </div>
              </div>
              <div class="card-details mt-4 mb-5">
                <span style="margin-right: 17%; margin-top: 10px">Nombre</span>
                <input
                  type="text"
                  placeholder="Nombre en tarjeta"
                  style="padding-left: 5px; margin-left: 4%"
                />
              </div>
            </div>
          </div>
        </v-card-text>
        <v-card-actions style="margin-top: -10px">
          <v-spacer></v-spacer>
          <v-btn
            class="mb-5"
            color="#BE1D1D"
            variant="flat"
            style="margin-left: 20px"
            @click="closeCheckout"
          >
            <span style="color: white; font-weight: bold"> Cancelar </span>
          </v-btn>
          <v-btn
            class="mb-5"
            color="#008F39"
            variant="flat"
            style="margin-left: 160px"
            @click="checkout"
          >
            <span style="color: white; font-weight: bold"> Confirmar </span>
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import api from "../../utilities/api";
// import VueCreditCardValidation from 'vue-credit-card-validation';
export default {
  // props: ['productosCarrito'],

  data() {
    return {
      verProducto: false,
      listaProductosCarrito: [],
      cardHolderName: "",
      cardNumber: "",
      expirationDate: "",
      cvv: "",
      selectedItems: [],
      valid: {
        cardHolderName: true,
        cardNumber: true,
        expirationDate: true,
        cvv: true,
      },
      nameRules: [
        (v) => !!v || "El nombre en la tarjeta es requerido",
        (v) => /^[a-zA-Z\s]*$/.test(v) || "Solo se permiten letras y espacios",
      ],
      numberRules: [
        (v) => !!v || "El número de tarjeta es requerido",
        (v) =>
          /^\d{16}$/.test(v) || "El número de tarjeta debe ser de 16 dígitos",
      ],
      dateRules: [
        (v) => !!v || "La fecha de expiración es requerida",
        (v) =>
          /^(0[1-9]|1[0-2])\/\d{2}$/.test(v) ||
          "La fecha de expiración debe tener el formato MM/YY",
      ],
      cvvRules: [
        (v) => !!v || "El CVV es requerido",
        (v) => /^\d{3}$/.test(v) || "El CVV debe ser de 3 dígitos",
      ],
      checkoutModal: false,

      incrementCount(index) {
        this.listaProductosCarrito[index].count++;
      },
      margins: {
        top: 80,
        bottom: 60,
        left: 40,
        width: 522,
      },
      state() {
        return {
          productosCarrito: [],
        };
      },
    };
  },
  methods: {
    agregarNuevoProducto(producto) {
      this.incrementCount(producto.index);
      this.listaProductosCarrito.push(producto);
    },

    cerrarProductoModal() {
      this.verProducto = false;
    },

    verProductoModal() {
      this.verProducto = true;
    },
    calcularCantidad(producto) {
      this.verProductoModal();
      console.log(producto);
    },
    removeItem(index) {
      this.listaProductosCarrito.splice(index, 1);
    },
    clearCart() {
      this.selectedItems = [];
      this.productosCarrito = [];
    },

    processPayment() {
      // Lógica para procesar el pago
    },
    showPaymentModal() {
      this.checkoutModal = true;
    },
    closeCheckout() {
      this.checkoutModal = false;
    },
    checkout() {
      this.$refs.form.validate().then((valid) => {
        if (valid) {
          // Procesar el pago...
          this.$refs.form.resetValidation();
          this.closeCheckout();
          this.productosCarrito = [];
          alert("Pago procesado correctamente");
        }
      });
    },

    ///API METHODS///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async cargarCarrito() {
      try {
        const response = await api.get(
          `https://tiendabackend.azurewebsites.net/api/Carritos/GetActualCarrito`
        );

        console.log(response.data);
        this.listaProductosCarrito = response.data;

        // this.toast.success(response.data.Message, this.toastProperties);
      } catch (error) {
        this.toast.error(
          "Error 500. Error al agregar al carrito." + error,
          this.toastProperties
        );
      }
    },
    async agregarOtroProductoCarrito(producto) {
      try {
        const response = await api.post(
          `https://tiendabackend.azurewebsites.net/api/Carritos/InsertarProducto?idProducto=${
            producto.idProducto
          }&cantidad=${1}&precioPorProducto=${producto.Precio}`
        );
        this.cargarCarrito();

        // this.toast.success(response.data.Message, this.toastProperties);
      } catch (error) {
        this.toast.error(
          "Error 500. Error al agregar al carrito." + error,
          this.toastProperties
        );
      }
    },
    async borrarProductoCarrito(producto) {
      try {
        const response = await api.post(
          `https://tiendabackend.azurewebsites.net/api/Carritos/RemoverProductos?idProducto=${
            producto.idProducto
          }&cantidad=${1}`
        );
        this.cargarCarrito();

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
    this.cargarCarrito();
  },
};
</script>
