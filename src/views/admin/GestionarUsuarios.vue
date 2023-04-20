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
                <h1 class="pageTitle mb-5">Usuarios</h1>
                <v-spacer></v-spacer>
                <Button
                  style="height: fit-content"
                  elevation="0"
                  rounded
                  class="mr-3"
                  @click="addUsuario(nuevoUsuario)"
                >
                  Agregar Usuario<v-icon class="ml-3" size="30"
                    >mdi-account-plus</v-icon
                  ></Button
                >
              </v-row>

              <div>
                <DataTable
                  ref="dt"
                  v-model:expandedRows="expandedRows"
                  v-model:filters="filters"
                  :value="listaUsuarios"
                  resizableColumns
                  columnResizeMode="fit"
                  removableSort
                  tableStyle="min-width: 50rem"
                  paginator
                  :rows="10"
                  dataKey="idUsuario"
                  :loading="loading"
                >
                  <template #header>
                    <div class="flex justify-content-between">
                      <Button
                        rounded
                        icon="pi pi-external-link"
                        label="Exportar"
                        severity="warning"
                        @click="exportCSV($event)"
                      />
                      <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText
                          style="border-radius: 25px"
                          v-model="filters['global'].value"
                          placeholder="Buscar..."
                        />
                      </span>
                    </div>
                  </template>

                  <!-- NOMBRE ////////////////////////////////////////////////////////////////////////////////////////////////////// -->
                  <Column field="idUsuario" header="ID" sortable></Column>

                  <!-- FOTO ////////////////////////////////////////////////////////////////////////////////////////////////////// -->
                  <Column field="NombreUsuario" header="Nombre" sortable>
                  </Column>

                  <!-- PRECIO ////////////////////////////////////////////////////////////////////////////////////////////////////// -->
                  <Column
                    field="CorreoElectronico"
                    header="Correo electrónico"
                    sortable
                  >
                  </Column>

                  <Column field="Perfil" header="Perfil" sortable> </Column>

                  <!-- FECHA COMPRA ////////////////////////////////////////////////////////////////////////////////////////////////////// -->
                  <Column
                    field="UltimoIngreso"
                    header="Ultimo Ingreso"
                    sortable
                  >
                    <template #body="{ data }">
                      {{ formatDate(data) }}
                    </template>
                  </Column>

                  <!-- CATEGORIAS ////////////////////////////////////////////////////////////////////////////////////////////////////// -->
                  <Column header="Estado" field="Estado" sortable>
                    <template #body="{ data }">
                      <div>
                        <Tag
                          :severity="getEstadoColor(data.Estado)"
                          rounded
                          :value="data.Estado"
                        >
                          {{ data.Estado }}
                        </Tag>
                      </div>
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
                        @click="editUsuario(data)"
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

    <Dialog v-model:visible="dialog" modal :header="formTitle" width="100px">
      <v-container>
        <v-row>
          <v-col cols="12" sm="6">
            <div class="flex flex-column gap-2">
              <label for="Contraseña">Nombre</label>
              <InputText
                id="Nombre"
                v-model="editedUsuario.Nombres"
                aria-describedby="Nombres-help"
              />
            </div>
            <!-- /////////////////////////////////////////////////////////////////// -->
          </v-col>

          <v-col cols="12" sm="6">
            <div class="flex flex-column gap-2">
              <label for="Contraseña">Apellidos</label>
              <InputText
                id="Apellidos"
                v-model="editedUsuario.Apellidos"
                aria-describedby="Apellidos-help"
              />
            </div>
            <!-- /////////////////////////////////////////////////////////////////// -->
          </v-col>
          <v-col cols="12" sm="6">
            <div class="flex flex-column gap-2">
              <label for="Usuario">Usuario</label>
              <InputText
                id="Usuario"
                v-model="editedUsuario.NombreUsuario"
                aria-describedby="Nombre-help"
              />
            </div>

            <!-- /////////////////////////////////////////////////////////////////// -->
          </v-col>

          <v-col cols="12" sm="6">
            <div class="flex flex-column gap-2">
              <label for="Nombre">Correo Electrónico</label>
              <InputText
                id="Nombre"
                v-model="editedUsuario.CorreoElectronico"
                aria-describedby="Nombre-help"
              />
            </div>
            <!-- /////////////////////////////////////////////////////////////////// -->
          </v-col>

          <v-col cols="12" sm="6" v-if="formTitle == 'Agregar usuario'">
            <div class="flex flex-column gap-2">
              <label for="Contraseña">Contraseña</label>
              <InputText
                id="Contraseña"
                v-model="editedUsuario.Password"
                aria-describedby="Contraseña-help"
              />
            </div>
            <!-- /////////////////////////////////////////////////////////////////// -->
          </v-col>

          <v-col v-if="formTitle == 'Agregar usuario'">
            <v-row>
              <v-col cols="12" sm="6">
                <div class="flex flex-column gap-2">
                  <label for="Contraseña">Perfiles</label>
                  <Dropdown
                    v-model="perfilSeleccionado"
                    :options="perfilesListado"
                    optionLabel="Nombre"
                    placeholder="Perfiles"
                    class="w-full md:w-20rem"
                  />
                </div>
                <!-- /////////////////////////////////////////////////////////////////// -->
              </v-col>
              <v-col cols="12" sm="6">
                <div class="flex flex-column gap-2">
                  <label for="Contraseña">Estados</label>
                  <Dropdown
                    v-model="estadoSeleccionado"
                    :options="estados"
                    optionLabel="Nombre"
                    placeholder="Estados"
                    class="w-full md:w-20rem"
                  />
                </div>
                <!-- ////////////////////////////////////////////////////////// v-if="formTitle == 'Agregar usuario'"///////// -->
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12" sm="6" v-if="formTitle != 'Agregar usuario'">
            <div class="flex flex-column gap-2">
              <label for="Contraseña">Perfiles</label>
              <Dropdown
                v-model="perfilSeleccionado"
                :options="perfilesListado"
                optionLabel="Nombre"
                placeholder="Perfiles"
                class="w-full md:w-20rem"
              />
            </div>
            <!-- /////////////////////////////////////////////////////////////////// -->
          </v-col>
          <v-col cols="12" sm="6" v-if="formTitle != 'Agregar usuario'">
            <div class="flex flex-column gap-2">
              <label for="Contraseña">Estados</label>
              <Dropdown
                v-model="estadoSeleccionado"
                :options="estados"
                optionLabel="Nombre"
                placeholder="Estados"
                class="w-full md:w-20rem"
              />
            </div>
            <!-- ////////////////////////////////////////////////////////// v-if="formTitle == 'Agregar usuario'"///////// -->
          </v-col>
        </v-row>
      </v-container>
      <template #footer>
        <Button rounded severity="danger" variant="flat" @click="closeDialog">
          <span style="color: white"> Cancelar </span>
        </Button>
        <Button
          rounded
          severity="success"
          variant="flat"
          @click="guardarUsuario(editedUsuario)"
        >
          <span style="color: white"> Guardar </span>
        </Button></template
      >
    </Dialog>
  </v-container>
</template>

<script>
import Row from "primevue/row";
import { useToast } from "vue-toastification";
import axios from "axios";
import Chip from "primevue/chip";
import DataTable from "primevue/datatable";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import Column from "primevue/column";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import { FilterMatchMode } from "primevue/api";
import InputNumber from "primevue/inputnumber";
import "primeicons/primeicons.css";
import InputSwitch from "primevue/inputswitch";
import Tag from "primevue/tag";
export default {
  components: {
    InputNumber,
    DataTable,
    Column,
    Column,
    InputText,
    Chip,
    Dropdown,
    Button,
    Dialog,
    Row,
    InputSwitch,
    Tag,
  },
  data: () => ({
    breadCrumb: [
      {
        title: "Home",
        disabled: false,
        href: "/",
      },
      {
        title: "Gestionar Usuarios",
        disabled: true,
        href: "/gestionarUsuarios",
      },
    ],
    filters: {
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      status: { value: null, matchMode: FilterMatchMode.EQUALS },
    },
    dialog: false,
    listaUsuarios: [],
    horasIngreso: [],
    perfilesListado: [],
    estados: [],
    perfilSeleccionado: {
      idPerfil: "",
      Nombre: " ",
      Descripcion: " ",
      CantPermisos: "",
      PorDefecto: false,
      Vistas: null,
      Usuarios: null,
    },
    estadoSeleccionado: {
      idEstado: "",
      Nombre: " ",
      Descripcion: " ",
    },
    headers: [
      { text: "ID", value: "id" },
      { text: "Usuario", value: "usuario" },
      { text: "Correo electrónico", value: "email" },
      { text: "Perfil", value: "perfil" },
      { text: "Ultimo Ingreso", value: "ultimoIngreso" },
      { text: "Estado", value: "estado" },
      { text: "Acciones", value: "acciones" },
    ],
    editedUsuario: {
      idUsuario: null,
      NombreUsuario: " ",
      CorreoElectronico: " ",
      idPerfil: "",
      Perfil: " ",
      idEstado: "",
      Estado: " ",
      Nombres: " ",
      Apellidos: " ",
      Telefono: " ",
    },
    nuevoUsuario: {
      idUsuario: "",
      CorreoElectronico: " ",
      Password: " ",

      NombreUsuario: " ",
      PasswordHash: " ",
      idPerfil: "",
      Perfil: " ",
      idEstado: "",
      Estado: "",
      FechaRegistro: "",
      UltimoIngreso: "",
      Nombres: " ",
      Apellidos: "",
      Telefono: "",
    },
  }),
  setup() {
    const toast = useToast();
    return { toast };
  },
  methods: {
    async getUsuarios() {
      try {
        const url = "https://tiendabackend.azurewebsites.net/api/Usuarios";
        const token = localStorage.getItem("token");

        const response = await axios.get(url, {
          headers: {
            Authorization: `${token}`,
          },
        });

        this.listaUsuarios = response.data;
      } catch (error) {
        console.error("Error:", error);
      }
    },
    async getEstadosUsuarios() {
      try {
        const url =
          "https://tiendabackend.azurewebsites.net/api/Usuarios/GetEstadosUsuarios";
        const token = localStorage.getItem("token");

        const response = await axios.get(url, {
          headers: {
            Authorization: `${token}`,
          },
        });

        this.estados = response.data;
        // console.log(response.data)
      } catch (error) {
        console.error("Error:", error);
      }
    },
    async getPerfiles() {
      try {
        const url = "https://tiendabackend.azurewebsites.net/api/Perfiles";
        const token = localStorage.getItem("token");

        const response = await axios.get(url, {
          headers: {
            Authorization: `${token}`,
          },
        });

        this.perfilesListado = response.data;
        // console.log(response.data)
      } catch (error) {
        console.error("Error:", error);
      }
    },
    async actualizarUsuario(idUsuario, usuarioActualizado) {
      try {
        const url = `https://tiendabackend.azurewebsites.net/api/Usuarios?idUsuario=${idUsuario}`;
        const token = localStorage.getItem("token");

        const response = await axios.put(url, usuarioActualizado, {
          headers: {
            Authorization: `${token}`,
          },
        });
        if (response.data.Success) {
          this.toast.success(response.data.Message, {
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
        } else {
          this.toast.warning(response.data.Message, {
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
        }
      } catch (error) {
        console.error("Error:", error);
        this.toast.warning("Error al crear el usuario", {
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
      }
    },
    async registrar(usuarioNuevo) {
      const url = "https://tiendabackend.azurewebsites.net/api/Usuarios";
      const data = usuarioNuevo;
      try {
        const token = localStorage.getItem("token");

        const response = await axios.post(url, data, {
          headers: {
            Authorization: `${token}`,
          },
        });
        // Obtener el token de la respuesta y guardarlo en el almacenamiento local
        if (response.data.Success) {
          this.toast.success(response.data.Message, {
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
        } else {
          this.toast.warning(response.data.Message, {
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
        }
      } catch (error) {
        console.error("Error:", error);
        this.toast.warning("Error al crear el usuario", {
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
      }
    },
    guardarUsuario(usuario) {
      this.editedUsuario.idEstado = this.estadoSeleccionado.idEstado;
      this.editedUsuario.Estado = this.estadoSeleccionado.Nombre;

      this.editedUsuario.idPerfil = this.perfilSeleccionado.idPerfil;
      this.editedUsuario.Perfil = this.perfilSeleccionado.Nombre;
      // Verificar que el objeto de usuario tenga los datos necesarios
      if (
        !usuario.NombreUsuario ||
        !usuario.CorreoElectronico ||
        !usuario.idPerfil
      ) {
        this.toast.error("Faltan datos del usuario.", {
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

      if (this.formTitle === "Agregar usuario") {
        this.registrar(usuario);

        this.getUsuarios();

        console.log("Nuevo usuario agregado:", usuario);
      } else {
        const index = this.listaUsuarios.findIndex(
          (u) => u.idUsuario === usuario.idUsuario
        );
        if (index > -1) {
          Object.assign(this.listaUsuarios[index], usuario);
          this.actualizarUsuario(usuario.idUsuario, usuario);
          this.getUsuarios();

          console.log("Usuario actualizado:", usuario);
        }
      }
      this.dialog = false;

      this.getUsuarios();
    },
    editUsuario(usuario) {
      this.dialog = true;
      this.formTitle = "Editar usuario";
      this.editedIndex = this.listaUsuarios.indexOf(usuario);
      this.estadoSeleccionado.Nombre = usuario.Estado;
      this.estadoSeleccionado.idEstado = usuario.idEstado;
      this.perfilSeleccionado.idPerfil = usuario.idPerfil;
      this.perfilSeleccionado.Nombre = usuario.Perfil;
      this.editedUsuario = Object.assign({}, usuario);
    },
    addUsuario(nuevoUsuario) {
      this.formTitle = "Agregar usuario";
      this.editedUsuario = Object.assign({}, nuevoUsuario);
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
    },
    cambioEstado() {
      // this.editedUsuario.idEstado = this.estadoSeleccionado.idEstado;
      // this.editedUsuario.Estado = this.estadoSeleccionado.Nombre;
      // this.nuevoUsuario.idEstado = this.estadoSeleccionado.idEstado;
      // this.nuevoUsuario.Estado = this.estadoSeleccionado.Nombre;
    },
    cambioPerfil() {
      // this.editedUsuario.idPerfil = this.perfilSeleccionado.idPerfil;
      // this.editedUsuario.Perfil = this.perfilSeleccionado.Nombre;
      // this.nuevoUsuario.idPerfil = this.perfilSeleccionado.idPerfil;
      // this.nuevoUsuario.Perfil = this.perfilSeleccionado.Nombre;
    },
    print() {
      this.editedUsuario.idEstado = this.estadoSeleccionado.idEstado;
      this.editedUsuario.Estado = this.estadoSeleccionado.Nombre;

      this.editedUsuario.idPerfil = this.perfilSeleccionado.idPerfil;
      this.editedUsuario.Perfil = this.perfilSeleccionado.Nombre;
    },
    getEstadoColor(estado) {
      switch (estado) {
        case "Activo":
          return "success";
        case "Inactivo":
          return "info";
        case "Suspendido":
          return "warning";
        case "Baneado":
          return "danger";
        default:
          return "";
      }
    },
    exportCSV() {
      this.$refs.dt.exportCSV();
    },
  },
  computed: {
    formatDate() {
      return (usuario) => {
        const date = new Date(usuario.UltimoIngreso);
        const options = {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false, // formato de hora en 24h
        };
        return date.toLocaleString("es-ES", options);
      };
    },
  },
  mounted() {
    this.getEstadosUsuarios();
    this.getUsuarios();
    this.getPerfiles();
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
