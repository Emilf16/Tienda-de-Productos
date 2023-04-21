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
                  width: 40%;
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
                  width: 55%;
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
                  width: 65%;
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
                          width: 40%;
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
                          width: 50%;
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
                          top: 47px;
                          bottom: 3;
                          margin-bottom: 1px;
                          width: 60%;
                          text-align: right;
                          padding-right: -30%;
                        "
                      >
                        <span
                          style="font-size: large"
                          class="text-black mt-1"
                          >{{ preciototal(producto) }}</span
                        >
                      </div>

                      <div
                        style="
                          position: absolute;
                          left: 0;
                          top: 32px;
                          bottom: 5;
                          margin-bottom: 30px;
                          width: 80%;
                          text-align: right;
                        "
                      >
                        <v-col>
                          <v-btn
                            icon
                            elevation="0"
                            hover-size="0"
                            @click="agregarOtroProductoCarrito(producto)"
                          >
                            Agregar
                            <span style="color: #252525; font-weight: bold">
                              +
                            </span>
                          </v-btn>
                          <div style="width: 30px"></div>
                          <v-btn
                            @click="borrarProductoCarrito(producto)"
                            icon
                            elevation="0"
                            hover-size="0"
                          >
                            Eliminar
                            <v-icon left color="#252525">mdi-delete</v-icon>
                          </v-btn>
                        </v-col>
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
          @click="limpiarCarrito"
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
                <span style="text-align: right">{{
                  formatNumber(montoTotal)
                }}</span>
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
                font-weight: bold;,
              "
            >
              <span>Total:</span>
              <span style="text-align: right">{{
                formatNumber(montoTotal)
              }}</span>
            </div>
          </v-card-title>
          <v-card-text> </v-card-text>
          <v-btn
            color="primary"
            @click="mostrarPagoDialog()"
            class="ml-4 d-flex justify-center"
            >Pagar</v-btn
          >
        </v-sheet>
      </v-col>
    </v-row>

    <!-- pagar productos /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////-->
    <Dialog
      v-model:visible="pagoDialog"
      modal
      header="Pagar Carrito"
      :style="{ width: 'auto' }"
    >
      <v-col>
        <v-col>
          <label for="tarjeta">Tarjeta</label>
        </v-col>
        <v-col>
          <Dropdown
            v-model="tarjetaSeleccionada"
            :options="metodosDePago"
            optionLabel="Tipo"
            placeholder="Tarjeta"
            class="w-full md:w-20rem"
          />
        </v-col>
        <v-col>
          <label for="direccion">Dirección</label>
        </v-col>
        <v-col>
          <Dropdown
            v-model="direccionSeleccionada"
            :options="direcciones"
            optionLabel="Direccion"
            placeholder="Dirección"
            class="w-full md:w-20rem"
          />
        </v-col>
      </v-col>

      <template #footer>
        <Button
          label="Cancelar"
          icon="pi pi-times"
          @click="cerrarPagoDialog()"
          text
          style="color: white; background-color: red"
        />
        <Button
          label="Confirmar"
          icon="pi pi-check"
          style="color: white; background-color: green"
          @click="pagarProductosCarrito()"
          autofocus
        />
      </template>
    </Dialog>
    <!-- agregar tarjeta productos /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////-->

    <v-dialog v-model="showMetodoDialog" max-width="700">
      <v-card>
        <v-toolbar dense color="rgb(9, 12, 41)">
          <v-toolbar-title class="text-white">{{
            metodoDialogTitle
          }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeMetodoDialog">
            <v-icon class="text-white">mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    label="Número de tarjeta"
                    v-model="newMetodo.Numero"
                    :rules="[rules.required, rules.cardNumber]"
                    variant="outlined"
                    v-cardformat:formatCardNumber
                  >
                    <template v-slot:prepend>
                      <v-icon>mdi-credit-card-outline</v-icon>
                    </template>
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    label="Nombre en la tarjeta"
                    v-model="cardholderName"
                    :rules="[rules.required, rules.name]"
                    variant="outlined"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-menu
                    ref="expDateMenu"
                    v-model="expDateMenu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    lazy
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="newMetodo.FechaExpiracion"
                        label="Fecha de vencimiento"
                        prepend-icon="mdi-calendar"
                        :rules="[rules.required, rules.expDate]"
                        v-bind="attrs"
                        v-on="on"
                        variant="outlined"
                        v-cardformat:formatCardExpiry
                      />
                    </template>
                  </v-menu>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    label="Código de seguridad (CVV)"
                    v-model="newMetodo.CVV"
                    :rules="[rules.required, rules.CVV]"
                    variant="outlined"
                    v-cardformat:formatCardCVC
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-btn @click="closeMetodoDialog()" variant="plain"
                  >Cancelar</v-btn
                >
                <v-spacer></v-spacer>
                <v-btn
                  prepend-icon="mdi-content-save-outline"
                  color="warning"
                  @click="saveMetodo()"
                  variant="flat"
                  :loading="loading"
                >
                  <template v-slot:prepend>
                    <v-icon></v-icon>
                  </template>

                  Guardar
                </v-btn>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { useToast } from "vue-toastification";
import api from "../../utilities/api";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import Dropdown from "primevue/dropdown";
// import axios from "axios";
export default {
  setup() {
    const toast = useToast();
    return { toast };
  },
  // props: ['productosCarrito'],
  components: {
    Button,
    Dialog,
    Image,
    Dropdown,
  },
  data() {
    return {
      tarjetaSeleccionada: {},
      direccionSeleccionada: {},
      token: localStorage.getItem("token"),
      user: {},
      toastProperties: this.$store.state.defaultToastProperties,
      userVerification: {},
      listaProductosCarrito: [],
      pagoDialog: false,
      showMetodoDialog: false,
      metodosDePago: [],
      direcciones: [],
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
      montoTotal: 0,
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
    };
  },
  methods: {
    limpiarCarrito() {
      this.listaProductosCarrito = [];
    },
    preciototal(producto) {
      return producto.CantidadEnCarrito * producto.Precio;
    },

    mostrarPagoDialog() {
      this.pagoDialog = true;
    },
    cerrarPagoDialog() {
      this.pagoDialog = false;
    },

    /////TARJETA METODO PAGO/////////////////////////////////////////////////////////////////////////////////////////
    closeMetodoDialog() {
      this.showMetodoDialog = false;
    },
    openMetodoDialog() {
      this.resetMetodoForm();
      this.showMetodoDialog = true;
    },

    ///API METHODS///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async pagarProductosCarrito() {
      try {
        const response = await api.post(
          `https://tiendabackend.azurewebsites.net/api/Pedidos/Pagar?idUsuario=${this.listaProductosCarrito.idUsuario}&idMetodoPago=${this.tarjetaSeleccionada.idMetodo}&idDireccion=${this.direccionSeleccionada.idDireccion}`
        );

        this.direcciones = response.data;
        console.log(response.data);
        this.toast.success(response.data.Message, this.toastProperties);
      } catch (error) {
        this.toast.error(
          "Error 500. Error al cargar los pedidos.",
          this.toastProperties
        );
      }
      console.log(this.tarjetaSeleccionada.idMetodo);
      console.log(this.direccionSeleccionada);
      this.cargarCarrito();
      this.pagoDialog = false;
    },

    async cargarDirecciones() {
      try {
        const response = await api.get(
          `https://tiendabackend.azurewebsites.net/api/Direcciones/GetDireccionesUsuario?idUsuario=" +
          ${this.listaProductosCarrito.idUsuario}`
        );

        this.direcciones = response.data;
        console.log(response.data);
        // this.toast.success(response.data.Message, this.toastProperties);
      } catch (error) {
        this.toast.error(
          "Error 500. Error al agregar al carrito." + error,
          this.toastProperties
        );
      }
    },

    async cargarTarjetas() {
      try {
        const response = await api.get(
          `https://tiendabackend.azurewebsites.net/api/MetodosPagos/GetMetodosUsuario?idUsuario=" +
            ${this.listaProductosCarrito.idUsuario}`
        );

        console.log(response.data);
        this.metodosDePago = response.data;

        // this.toast.success(response.data.Message, this.toastProperties);
      } catch (error) {
        this.toast.error(
          "Error 500. Error al agregar al carrito." + error,
          this.toastProperties
        );
      }
    },
    formatNumber(num) {
      return parseFloat(num).toFixed(2);
    },

    async cargarCarrito() {
      try {
        const response = await api.get(
          `https://tiendabackend.azurewebsites.net/api/Carritos/GetActualCarrito`
        );

        console.log(response.data);
        this.listaProductosCarrito = response.data;
        for (let i = 0; i < this.listaProductosCarrito.Productos.length; i++) {
          this.montoTotal +=
            this.listaProductosCarrito.Productos[i].Precio *
            this.listaProductosCarrito.Productos[i].CantidadEnCarrito;
        }
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
    this.cargarDirecciones();
    this.cargarTarjetas();
  },
};
</script>
