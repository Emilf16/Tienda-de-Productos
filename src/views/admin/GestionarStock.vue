<template>
  <v-container fluid class="mainContainer">
    <v-col>
      <v-breadcrumbs :items="breadCrumb">
        <template v-slot:prepend>
          <v-icon size="small" icon="mdi-home"></v-icon>
        </template>
      </v-breadcrumbs>

      <v-row class="rowContainer">
        <v-col cols="12" sm="12" lg="12" class="colsContainer">
          <div class="containerCols">
            <div class="content">
              <v-row>
                <h1 class="pageTitle">Inventario</h1>
                <v-spacer></v-spacer>
                <v-btn @click="agregarProducto()" elevation="0"
                  ><v-icon>mdi-cart-plus</v-icon></v-btn
                >
              </v-row>

              <div>
                <DataTable
                  ref="dt"
                  v-model:expandedRows="expandedRows"
                  v-model:filters="filters"
                  :value="listaProductos"
                  resizableColumns
                  columnResizeMode="fit"
                  removableSort
                  tableStyle="min-width: 50rem"
                  paginator
                  :rows="10"
                  dataKey="id"
                  :loading="loading"
                >
                  <template #header>
                    <div class="flex justify-content-between">
                      <v-spacer></v-spacer>
                      <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText
                          v-model="filters['global'].value"
                          placeholder="Buscar..."
                        />
                      </span>
                    </div>
                  </template>

                  <!-- NOMBRE ////////////////////////////////////////////////////////////////////////////////////////////////////// -->
                  <Column field="Nombre" header="Nombre" sortable></Column>

                  <!-- FOTO ////////////////////////////////////////////////////////////////////////////////////////////////////// -->
                  <Column field="Foto" header="Imagen">
                    <template #body="{ data }">
                      <Image
                        preview
                        :src="data.FotoUrl"
                        class="shadow-2 border-round"
                        width="64"
                        height="64"
                        objectFit="contain"
                      />
                    </template>
                  </Column>

                  <!-- PRECIO ////////////////////////////////////////////////////////////////////////////////////////////////////// -->
                  <Column field="Precio" header="Precio" sortable>
                    <template #body="{ data }">
                      {{ formatCurrency(data.Precio) }}
                    </template>
                  </Column>

                  <!-- FECHA COMPRA ////////////////////////////////////////////////////////////////////////////////////////////////////// -->
                  <Column
                    field="FechaIngreso"
                    header="Fecha de compra"
                    sortable
                  >
                    <template #body="{ data }">
                      {{ formatDate(data.FechaIngreso) }}
                    </template>
                  </Column>

                  <!-- CATEGORIAS ////////////////////////////////////////////////////////////////////////////////////////////////////// -->
                  <Column header="Categorias">
                    <template #body="{ data }">
                      <div>
                        <Chip
                          class="mx-1"
                          v-for="categoria in data.Categorias"
                          :key="categoria"
                          :label="categoria.Nombre"
                        />
                      </div>
                    </template>
                  </Column>

                  <!-- RATING ////////////////////////////////////////////////////////////////////////////////////////////////////// -->
                  <Column header="Rating" sortable style="min-width: 12rem">
                    <template #body="{ data }">
                      <Rating
                        :modelValue="data.Valoracion"
                        :readonly="true"
                        :cancel="false"
                      />
                    </template>
                  </Column>

                  <!-- ESTADO ////////////////////////////////////////////////////////////////////////////////////////////////////// -->
                  <Column header="STOCK" sortable style="min-width: 12rem">
                    <template #body="{ data }">
                      <Tag
                        :value="getStockLabel(data.CantidadStock)"
                        :severity="getStock(data.CantidadStock)"
                      />
                    </template>
                  </Column>
                  <!-- DISPONIBILIDAD ////////////////////////////////////////////////////////////////////////////////////////////////////// -->
                  <Column header="ESTATUS" sortable style="min-width: 12rem">
                    <template #body="{ data }">
                      <Tag
                        :value="getEstatusLabel(data.EstaActivo)"
                        :severity="getEstatus(data.EstaActivo)"
                      />
                    </template>
                  </Column>

                  <!-- OPCIONES ////////////////////////////////////////////////////////////////////////////////////////////////////// -->
                  <Column
                    header="Opciones"
                    styleClass="col-icon"
                    :expander="true"
                    style="width: 5rem"
                  >
                    <template #body="{ data, index }">
                      <Button
                        icon="pi pi-pencil"
                        text
                        rounded
                        aria-label="Bookmark"
                        @click="editarProducto(data, index)"
                      />
                      <Button
                        :icon="getIcono(data.EstaActivo)"
                        text
                        rounded
                        :severity="getIconoEstatus(data.EstaActivo)"
                        @click="deshabilitarProducto(data, index)"
                      />
                    </template>
                  </Column>
                </DataTable>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-col>

    <!-- DIALOGO PARA EDITAR PRODUCTOS ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// -->
    <Dialog
      v-model:visible="productoDialog"
      :style="{ width: '500px' }"
      :modal="true"
      class="p-fluid"
      :header="formTitle"
    >
      <div class="field">
        <label for="Nombre">Nombre</label>
        <InputText
          id="Nombre"
          v-model.trim="editedProduct.Nombre"
          required="true"
          autofocus
          :class="{ 'p-invalid': submitted && !editedProduct.Nombre }"
        />
        <small class="p-error" v-if="submitted && !editedProduct.Nombre"
          >El Nombre es requerido.</small
        >
      </div>
      <div class="field">
        <label for="description">Descripción</label>
        <Textarea
          id="description"
          v-model="editedProduct.Descripcion"
          required="true"
          rows="3"
          cols="20"
        />
      </div>
      <template v-if="editedProduct.FotoUrl">
        <div class="card flex justify-content-center">
          <Image
            :src="`${editedProduct.FotoUrl}`"
            :alt="`${editedProduct.FotoUrl}`"
            width="250"
            preview
          />
        </div>
      </template>
      <template v-else>
        <div class="card flex justify-content-center">
          <Image
            src="https://ecomworld.shop/uploads/default-product.png"
            width="250"
            preview
          />
        </div>
      </template>
      <div class="field">
        <label for="FotoUrl">Link de la Foto</label>
        <InputText
          id="Nombre"
          v-model.trim="editedProduct.FotoUrl"
          required="true"
          autofocus
          :class="{ 'p-invalid': submitted && !editedProduct.FotoUrl }"
        />
      </div>

      <div class="formgrid grid">
        <div class="field col">
          <label for="quantity">Disponibilidad</label>
          <v-col>
            <InputSwitch v-model="editedProduct.EstaActivo" />
          </v-col>
        </div>
        <div class="field col">
          <label for="quantity">Categorias</label>
          <MultiSelect
            v-model="editedProduct.Categorias"
            :options="listaCategorias"
            filter
            optionLabel="Nombre"
            placeholder="Categorias"
            :maxSelectedLabels="3"
            class="w-full md:w-20rem"
            display="chip"
          />
        </div>
      </div>
      <div class="formgrid grid">
        <div class="field col">
          <label for="price">Precio</label>
          <InputNumber
            id="price"
            v-model="editedProduct.Precio"
            mode="currency"
            currency="USD"
            locale="en-US"
          />
        </div>
        <div class="field col">
          <label for="quantity">Cantidad</label>
          <InputNumber
            id="quantity"
            v-model="editedProduct.CantidadStock"
            integeronly
          />
        </div>
      </div>
      <template #footer>
        <div style="height: 30px">
          <Button
            label="Cancelar"
            icon="pi pi-times"
            text
            style="color: white; background-color: red"
            @click="closeEditar()"
          />
          <Button
            label="Guardar"
            icon="pi pi-check"
            text
            style="color: white; background-color: green"
            @click="guardarProductos(editedProduct)"
          />
        </div>
      </template>
    </Dialog>

    <!-- DIALOGO PARA DESHABILITAR PRODUCTOS ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// -->
    <Dialog
      v-model:visible="deshabilitarDialog"
      modal
      header="Deshabilitar Productos"
      :style="{ width: '500px' }"
    >
      <div class="field">
        <span class="text-h5" style="text-align: center"
          >¿Está seguro que desea eliminar este producto?</span
        >
      </div>
      <template #footer>
        <div style="height: 40px">
          <Button
            type="button"
            label="Cancelar"
            icon="pi pi-times"
            text
            color="#BE1D1D"
            style="color: white; background-color: red"
            @click="closeDeshabilitar()"
          />
          <Button
            type="button"
            label="Confirmar"
            icon="pi pi-check"
            text
            style="color: white; background-color: green"
            @click="confirmDeshabilitar()"
          />
        </div>
      </template>
    </Dialog>
  </v-container>
</template>

<script>
import SelectButton from "primevue/selectbutton";
import ToggleButton from "primevue/togglebutton";
import Chip from "primevue/chip";
import { useToast } from "vue-toastification";
import api from "../../utilities/api";
import DataTable from "primevue/datatable";
// import Image from "primevue/image";
import Textarea from "primevue/textarea";
import InputText from "primevue/inputtext";
import Column from "primevue/column";
import { FilterMatchMode } from "primevue/api";
import Tag from "primevue/tag";
import Rating from "primevue/rating";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import InputNumber from "primevue/inputnumber";
import "primeicons/primeicons.css";
import Image from "primevue/image";
import MultiSelect from "primevue/multiselect";
import InputSwitch from "primevue/inputswitch";
export default {
  setup() {
    const toast = useToast();
    return { toast };
  },
  components: {
    InputNumber,
    DataTable,
    ToggleButton,
    MultiSelect,
    Column,
    InputText,
    Tag,
    Chip,
    Rating,
    Textarea,
    Button,
    Dialog,
    Image,
    InputSwitch,
    SelectButton,
  },
  data() {
    return {
      listaProductos: [],
      listaCategorias: [],
      customers: null,
      editedIndex: -1,
      formTitle: "",
      productoDialog: false,
      dialogDelete: false,
      deshabilitarDialog: false,
      editedProduct: {},
      categoriasSeleccionadas: [],
      defaultProduct: {},
      filters: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        status: { value: null, matchMode: FilterMatchMode.EQUALS },
      },
      loading: true,
      toastProperties: this.$store.state.defaultToastProperties,
      toastProperties: this.$store.state.defaultToastProperties,
      breadCrumb: [
        {
          title: "Home",
          disabled: false,
          href: "/",
        },
        {
          title: "Gestionar Productos",
          disabled: true,
          href: "/gestionarProductos",
        },
      ],
      pageLoaded: false,
      token: localStorage.getItem("token"),
      user: {},
      expandedRows: [],
      detailsVisible: false,
    };
  },
  mounted() {
    if (!this.pageLoaded) {
      api
        .get("Account")
        .then((data) => {
          this.user = data.data.usuario;
          this.getProductos();
          this.getCategorias();
          this.pageLoaded = true;
        })
        .catch((error) => {
          this.toast.error("Error 500. " + error, this.toastProperties);
        });
    }
  },
  methods: {
    async print() {
      console.log(this.categoriasSeleccionadas);
    },
    async getCategorias() {
      try {
        const response = await api.get(
          "https://tiendabackend.azurewebsites.net/api/Productos/GetCategorias"
        );
        this.listaCategorias = response.data;
        console.log(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    },
    async getProductos() {
      try {
        const response = await api.get(
          "https://tiendabackend.azurewebsites.net/api/Productos/GetAllProducts"
        );
        this.listaProductos = response.data;
        this.loading = false;
      } catch (error) {
        console.error("Error:", error);
      }
    },
    async crearProductos() {
      try {
        const data = this.defaultProduct;
        const response = await api.post(
          "https://tiendabackend.azurewebsites.net/api/Productos",
          data
        );
        this.toast.success(response.data.Message, this.toastProperties);
      } catch (error) {
        this.toast.error(
          "Error 500. Error al agregar al carrito." + error,
          this.toastProperties
        );
      }
    },
    //DESABILITAR PRODUCTOS///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////v///////////////////////////////////////////////////////////////////////////////////////////////////////
    deshabilitarProducto(producto, index) {
      this.editedProduct = Object.assign({}, producto);
      this.deshabilitarDialog = true;
      // this.actualizarProducto(producto);
    },
    confirmDeshabilitar() {
      this.editedProduct.EstaActivo = !this.editedProduct.EstaActivo;
      console.log(this.editedProduct);
      console.log("this.editedProduct");
      this.actualizarProducto(this.editedProduct);
      this.deshabilitarDialog = false;
      this.getProductos();
    },
    closeDeshabilitar() {
      this.deshabilitarDialog = false;
    },
    //EDITAR PRODDUCTOS//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    editarProducto(producto, index) {
      this.formTitle = "Editar producto";
      this.editedIndex = index;
      this.editedProduct = Object.assign({}, producto);
      // this.dialog = true;
      this.productoDialog = true;
    },
    async actualizarProducto(producto) {
      try {
        console.log(producto);
        const data = producto;
        const response = await api.put(
          "https://tiendabackend.azurewebsites.net/api/Productos?idProducto=" +
            this.editedProduct.idProducto,
          data
        );
        this.getProductos();
        this.toast.success(response.data.Message, this.toastProperties);
      } catch (error) {
        this.toast.error(
          "Error 500. Error al agregar al carrito." + error,
          this.toastProperties
        );
      }
    },
    closeEditar() {
      this.productoDialog = false;
    },
    //AGREGAR PRODDUCTOS//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    agregarProducto() {
      this.formTitle = "Agregar producto";
      this.editedProduct = Object.assign({}, this.defaultProduct);
      this.productoDialog = true;
    },
    async crearProducto(producto) {
      try {
        const data = producto;
        const response = await api.post(
          "https://tiendabackend.azurewebsites.net/api/Productos",
          data
        );
        this.getProductos();
        this.toast.success(response.data.Message, this.toastProperties);
      } catch (error) {
        this.toast.error(
          "Error 500. Error al agregar al carrito." + error,
          this.toastProperties
        );
      }
    },
    guardarProductos(producto) {
      console.log(producto);
      // Verificar que el objeto de usuario tenga los datos necesarios
      if (
        !producto.Nombre ||
        !producto.Descripcion ||
        !producto.CantidadStock ||
        !producto.Precio ||
        !producto.FotoUrl
      ) {
        this.toast.error("Faltan datos del producto.", {
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
        });
        return;
      }
      if (this.formTitle === "Agregar producto") {
        producto.Categorias.forEach((categoria) => {
          categoria.PoseeCategoria = true;
        });
        this.crearProducto(producto);
        console.log("Nuevo usuario agregado:", producto);
      } else {
        const index = this.listaProductos.findIndex(
          (u) => u.idProducto === producto.idProducto
        );
        if (index > -1) {
          console.log(producto);
          Object.assign(this.listaProductos[index], producto);
          producto.Categorias.forEach((categoria) => {
            categoria.PoseeCategoria = true;
          });
          this.actualizarProducto(producto);
          console.log("Usuario actualizado:", producto);
        }
      }
      this.productoDialog = false;
    },
    //FUNCIONES ADICIONALES //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    getStock(cantidad) {
      if (cantidad >= 50) {
        return "success";
      } else if (cantidad <= 20 && cantidad > 0) {
        return "warning";
      } else if (cantidad == 0) {
        return "danger";
      } else {
        return "success";
      }
    },
    getStockLabel(cantidad) {
      if (cantidad > 20) {
        return "En Stock";
      } else if (cantidad <= 20 && cantidad > 0) {
        return "Pocas Unidades";
      } else if (cantidad == 0) {
        return "Sin Stock";
      } else {
        return "En Stock";
      }
    },
    getEstatus(EstaActivo) {
      if (EstaActivo == true) {
        return "success";
      } else {
        return "danger";
      }
    },
    getEstatusLabel(EstaActivo) {
      if (EstaActivo == true) {
        return "Disponible";
      } else {
        return "No Disponible";
      }
    },
    getIcono(EstaActivo) {
      if (EstaActivo == false) {
        return "pi pi-eye";
      } else {
        return "pi pi-eye-slash";
      }
    },
    getIconoEstatus(EstaActivo) {
      if (EstaActivo == true) {
        return "danger";
      } else {
        return "success";
      }
    },
    formatDate(value) {
      value = new Date(value);
      return value.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    },
    formatCurrency(value) {
      return value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    },
    exportCSV() {
      this.$refs.dt.exportCSV();
    },
    expandRow(row) {
      this.expandedRows.push(row);
    },
    collapseRow(row) {
      const index = this.expandedRows.findIndex((r) => r === row);
      if (index !== -1) {
        this.expandedRows.splice(index, 1);
      }
    },
  },
  computed: {},
  watch: {
    validarToken() {
      const token = localStorage.getItem("token");
      this.$store.commit("mostrarTienda", token);
      console.log(this.$store.state.estaLogueado);
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },
};
</script>
<style>
@import "primeicons/primeicons.css";
body {
  background-color: #f3f3f3;
}
.mainContainer {
  background-color: #f3f3f3;
  height: 100%;
}
.rowContainer {
  margin: 10px 0px;
}
.containerCols {
  background-color: white;
  margin: 5px;
  padding: 10px;
  border-radius: 20px;
}
.content {
  padding: 1%;
}
.pageTitle {
  font-size: 150% !important;
  margin: 10px 5px 15px 5px;
}
.pi {
  font-family: PrimeIcons !important;
}
</style>
