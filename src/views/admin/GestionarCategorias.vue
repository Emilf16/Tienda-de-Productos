<template>
    <v-container fluid>
        <v-col>
            <v-row>
                <v-spacer></v-spacer>
                <v-btn @click="addCategoria(nuevaCategoria)"><v-icon>mdi-account-plus</v-icon></v-btn>
            </v-row>
            <div class="mb-5"></div>
            <v-row>
                <v-card style="width: 100%;">
                    <v-table style="border-spacing: 0px;">
  <thead>
    <tr style="border-bottom: none;">
  <th class="text-left" style="border-bottom: none; color: black; font: bold;" v-for="header in headers">
    {{ header.text }}
  </th>
</tr>

  </thead>
  <tbody>
    <tr v-for="(categoria, index) in listaCategorias" v-bind:key="index" v-bind:categoria="categoria">
      <td style="padding-left: 15px; ">{{ categoria.idCategoria }}</td>
      <td style="padding-left: 1%; ">{{ categoria.Nombre }}</td>
      <td style="padding-left: 15px; ">{{ categoria.Descripcion }}</td>
      <td ><v-icon style="padding-left: 100%;" @click="editCategoria(categoria)" color="#0083B8">mdi-pencil</v-icon></td>
      <td ><v-icon style="margin-left: 7%; ;" @click="deleteCategoria(categoria)" color="#B50000">mdi-delete</v-icon></td>
    </tr>
  </tbody>
</v-table>
                </v-card>
            </v-row>
        </v-col>
        <v-dialog v-model="dialog" max-width="900px">
            <v-card>
                <v-card-title style="margin-top: 20px; margin-left: 24px;">
                    <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field v-model="editedCategoria.Nombre"
                                    label="Nombre"></v-text-field>
                            </v-col>

                            <v-col cols="12" sm="6" md="4">
                                <v-text-field v-model="editedCategoria.Descripcion"
                                    label="Descripción"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="#BE1D1D" variant="flat" @click="closeDialog">
                        <span style="color:white">
                            Cancelar
                        </span>
                    </v-btn>
                    <v-btn color="#008F39" variant="flat" @click="guardarCategoria(editedCategoria)">
                        <span style="color:white">
                            Guardar
                        </span>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="600px">
      <v-card>
        <v-card-title class="text-h5" style="text-align:center">¿Está seguro que desea eliminar esta categoría?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#BE1D1D" variant="flat" @click="closeDelete">
            <span style="color:white">
              Cancelar
            </span>
          </v-btn>
          <v-btn color="#008F39" variant="flat" @click="deletedCategoria(editedCategoria.idCategoria)">
            <span style="color:white">
              Confirmar
            </span>
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>

      </v-card>
    </v-dialog>
    </v-container>
</template>
  
<script>
import { useToast } from "vue-toastification";
import axios from 'axios'
import api from "@/utilities/api";

export default {
    data: () => ({
        dialog: false,
        dialogDelete: false,
        listaCategorias: [],
        categoriaSeleccionada: {
            idCategoria: '',
            Nombre: " ",
            Descripcion: " ",
        },
        headers: [
            { text: 'Id', value: 'id' },
            { text: 'Nombre', value: 'nombre' },
            { text: 'Descripción', value: 'descripcion' },
        ],
        editedCategoria: {
            idCategoria: null,
            Nombre: " ",
            Descripcion: " ",
        },
        nuevaCategoria: {
            idCategoria: "",
            Nombre: " ",
            Descripcion: " ",
            FechaRegistro: ""            
        }
    }),
    setup() {
        const toast = useToast();
        return { toast }
    },
    methods: {

        async getCategorias() {
            try {
                const url = 'https://tiendabackend.azurewebsites.net/api/Categorias';
                const token = localStorage.getItem('token');

                const response = await axios.get(url, {
                    headers: 
                    {
                        Authorization: `${token}`
                    }
                });

                this.listaCategorias = response.data;
            } catch (error) {
                console.error('Error:', error);
            }
        },
        async actualizarCategoria(idCategoria, categoriaActualizada) {
            try {
                const url = `https://tiendabackend.azurewebsites.net/api/Categorias?idCategoria=${idCategoria}`;
                const token = localStorage.getItem('token');

                const response = await axios.put(url, categoriaActualizada, {
                    headers: {
                        Authorization: `${token}`
                    }
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
                        rtl: false
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
                        rtl: false
                    });
                }

            } catch (error) {
                console.error('Error:', error);
                this.toast.warning('Error al crear la categoría', {
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
                    rtl: false
                });
            }
        },
        async registrar(categoriaNueva) {

            const url = 'https://tiendabackend.azurewebsites.net/api/Categorias';
            const data = categoriaNueva;
            try {
                const token = localStorage.getItem('token');
                const response = await axios.post(url, data, {
                    headers: {
                        Authorization: `${token}`
                    }
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
                        rtl: false
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
                        rtl: false
                    });
                }

            } catch (error) {
                console.error('Error:', error);
                this.toast.warning('Error al crear la categoría', {
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
                    rtl: false
                });
            }
        },
        guardarCategoria(categoria) {
            // Verificar que el objeto de categoria tenga los datos necesarios
            if (!categoria.Nombre || !categoria.Descripcion) {
                this.toast.error("Faltan datos de la Categoría.", {
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
                    rtl: false
                });
                return;
            }

            if (this.formTitle === 'Agregar Categoría') {

                this.registrar(categoria);
                this.getCategorias()
                console.log(categoria);
                console.log("Nueva categoría agregada:", categoria);

            } else {

                const index = this.listaCategorias.findIndex(
                    (u) => u.idCategoria === categoria.idCategoria
                )
                if (index > -1) 
                {
                    Object.assign(this.listaCategorias[index], categoria);
                    this.actualizarCategoria(categoria.idCategoria, categoria);
                    this.getCategorias()
                    console.log("Categoría actualizada:", categoria);
                }
            }
            this.dialog = false;
            this.getCategorias()
        },
        editCategoria(categoria) 
        {
            this.dialog = true
            this.formTitle = 'Editar Categoría'
            this.editedIndex = this.listaCategorias.indexOf(categoria)
            this.editedCategoria = Object.assign({}, categoria)
        },
        deleteCategoria(categoria) 
        {
            this.categoriaSeleccionada = this.listaCategorias.indexOf(categoria)
            this.editedCategoria = Object.assign({}, categoria)
            this.dialogDelete = true
            this.formTitle = 'Eliminar Categoría'
        },
        async deletedCategoria(idCategoria) {
            console.log(idCategoria);
            console.log(`https://tiendabackend.azurewebsites.net/api/Categorias?idCategoria=${idCategoria}`)
            try {
                const url = `https://tiendabackend.azurewebsites.net/api/Categorias?idCategoria=${idCategoria}`;
                
                const token = localStorage.getItem('token');
                
                const response = await api.delete(url);
                
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
                        rtl: false
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
                        rtl: false
                    });
                }

            } catch (error) {
                console.error('Error:', error);
                this.toast.warning('Error al eliminar la categoría', {
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
                    rtl: false
                });
            }
        },
        addCategoria(nuevaCategoria) 
        {
            this.formTitle = 'Agregar Categoría'
            this.editedCategoria = Object.assign({}, nuevaCategoria)
            this.dialog = true
        },
        closeDialog() 
        {
            this.dialog = false
        },
        closeDelete() 
        {
            this.dialogDelete = false
        },
    },
    mounted() {
        this.getCategorias();
    }
}
</script>
 