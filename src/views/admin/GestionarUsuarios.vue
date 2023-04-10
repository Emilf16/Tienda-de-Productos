<template>
    <v-container fluid>
        <v-col>
            <v-row>
                <v-spacer></v-spacer>
                <v-btn @click="addUsuario(nuevoUsuario)"><v-icon>mdi-account-plus</v-icon></v-btn>
            </v-row>
            <div class="mb-5"></div>

            <v-row>
                <v-card style="width: 100%;">
                    <v-table fixed-header height="auto">
                        <thead>
                            <tr>
                                <th class="text-left" v-for="header in headers">
                                    {{ header.text }}
                                </th>

                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(usuario, index)  in listaUsuarios" v-bind:key="index" v-bind:usuario="usuario">
                                <td>{{ usuario.idUsuario }}</td>
                                <td>{{ usuario.NombreUsuario }}</td>
                                <td>{{ usuario.CorreoElectronico }}</td>
                                <td>{{ usuario.Perfil }}</td>
                                <td>{{ formattedDate(usuario) }}</td>
                                <td>{{ usuario.Estado }}</td>
                                <td> <v-icon @click="editUsuario(usuario)">mdi-pencil</v-icon></td>
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
                                <v-text-field v-model="editedUsuario.NombreUsuario" label="Nombre"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field v-model="editedUsuario.CorreoElectronico"
                                    label="Correo Electronico"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4" v-if="formTitle == 'Agregar usuario'">
                                <v-text-field v-model="editedUsuario.Password" label="Contraseña"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field v-model="editedUsuario.Nombres" label="Nombres"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-combobox v-model="perfilSeleccionado" @change=" " :items="perfilesListado"
                                    item-value="idPerfil" item-title="Nombre" label="Perfiles" outlined></v-combobox>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-combobox v-model="estadoSeleccionado" @change="cambioEstado()" :items="estados"
                                    item-value="idEstado" item-title="Nombre" label="Estados" outlined></v-combobox>
                            </v-col>


                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="#BE1D1D" variant="flat" @click="klk">
                        <span style="color:white">
                            jij
                        </span>
                    </v-btn>
                    <v-btn color="#BE1D1D" variant="flat" @click="closeDialog">
                        <span style="color:white">
                            Cancelar
                        </span>
                    </v-btn>
                    <v-btn color="#008F39" variant="flat" @click="guardarUsuario(editedUsuario)">
                        <span style="color:white">
                            Guardar
                        </span>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>



    </v-container>
</template>
  
<script>
import { useToast } from "vue-toastification";
import axios from 'axios'
export default {
    data: () => ({
        dialog: false,
        listaUsuarios: [],
        horasIngreso: [],
        perfilesListado: [],
        estados: [],
        perfilSeleccionado: {
            idPerfil: 0,
            Nombre: " ",
            Descripcion: " ",
            CantPermisos: 0,
            PorDefecto: false,
            Vistas: null,
            Usuarios: null
        },
        estadoSeleccionado: {
            idEstado: 0,
            Nombre: " ",
            Descripcion: " "
        },
        headers: [
            { text: 'ID', value: 'id' },
            { text: 'Usuario', value: 'usuario' },
            { text: 'Correo electrónico', value: 'email' },
            { text: 'Perfil', value: 'perfil' },
            { text: 'Ultimo Ingreso', value: 'ultimoIngreso' },
            { text: 'Estado', value: 'estado' },
            { text: 'Acciones', value: 'acciones' },
        ],
        editedUsuario: {
            idUsuario: null,
            NombreUsuario: " ",
            CorreoElectronico: " ",
            idPerfil: null,
            Perfil: " ",
            idEstado: null,
            Estado: " ",
            Nombres: " ",
            Apellidos: " ",
            Telefono: " "
        },
        nuevoUsuario: {
            idUsuario: "",
            CorreoElectronico: " ",
            Password: " ",
            PasswordHash: " ",
            idPerfil: 1,
            Perfil: " ",
            idEstado: 2,
            Estado: '',
            FechaRegistro: "hola",
            UltimoIngreso: "hola",
            Nombres: " ",
            Apellidos: "hola",
            Telefono: "hola"
        }
    }),
    setup() {
        const toast = useToast();
        return { toast }
    },
    methods: {
        klk() {
            console.log(this.editedUsuario)
        },
        async getUsuarios() {
            try {
                const url = 'https://tiendabackend.azurewebsites.net/api/Usuarios';
                const token = localStorage.getItem('token');

                const response = await axios.get(url, {
                    headers: {
                        Authorization: `${token}`
                    }
                });

                this.listaUsuarios = response.data;
            } catch (error) {
                console.error('Error:', error);
            }
        },
        async getEstadosUsuarios() {
            try {
                const url = 'https://tiendabackend.azurewebsites.net/api/Usuarios/GetEstadosUsuarios';
                const token = localStorage.getItem('token');

                const response = await axios.get(url, {
                    headers: {
                        Authorization: `${token}`
                    }
                });

                this.estados = response.data;
                console.log(response.data)

            } catch (error) {
                console.error('Error:', error);
            }
        },
        async getPerfiles() {
            try {
                const url = 'https://tiendabackend.azurewebsites.net/api/Perfiles';
                const token = localStorage.getItem('token');

                const response = await axios.get(url, {
                    headers: {
                        Authorization: `${token}`
                    }
                });

                this.perfilesListado = response.data;
                console.log(response.data)

            } catch (error) {
                console.error('Error:', error);
            }
        },
        async actualizarUsuario(idUsuario, usuarioActualizado) {
            try {
                const url = `https://tiendabackend.azurewebsites.net/api/Usuarios?idUsuario=${idUsuario}`;
                const token = localStorage.getItem('token');

                const response = await axios.put(url, usuarioActualizado, {
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
                this.toast.warning('Error al crear el usuario', {
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
        async registrar(usuarioNuevo) {

            const url = 'https://tiendabackend.azurewebsites.net/api/Usuarios';
            const data = usuarioNuevo;
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
                this.toast.warning('Error al crear el usuario', {
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
        guardarUsuario(usuario) {
            // Verificar que el objeto de usuario tenga los datos necesarios
            if (!usuario.NombreUsuario || !usuario.CorreoElectronico || !usuario.idPerfil) {
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
                    rtl: false
                });
                return;
            }

            if (this.formTitle === 'Agregar usuario') {
                console.log(usuario);
                this.registrar(usuario);

                this.getUsuarios()
                console.log("Nuevo usuario agregado:", usuario);
            } else {
                const index = this.listaUsuarios.findIndex(
                    (u) => u.idUsuario === usuario.idUsuario
                )
                if (index > -1) {
                    Object.assign(this.listaUsuarios[index], usuario);
                    this.actualizarUsuario(usuario.idUsuario, usuario);
                    this.getUsuarios()


                    console.log("Usuario actualizado:", usuario);
                }
            }
            this.dialog = false;
        },
        editUsuario(usuario) {
            this.dialog = true
            this.formTitle = 'Editar usuario'
            this.editedIndex = this.listaUsuarios.indexOf(usuario)
            this.estadoSeleccionado.idEstado = usuario.idEstado;
            this.estadoSeleccionado.Nombre = usuario.Estado;

            this.perfilSeleccionado.idPerfil = usuario.idPerfil;
            this.perfilSeleccionado.Nombre = usuario.Perfil;
            this.editedUsuario = Object.assign({}, usuario)
        },
        addUsuario(nuevoUsuario) {
            this.formTitle = 'Agregar usuario'
            this.estadoSeleccionado.idEstado = nuevoUsuario.idEstado;
            this.estadoSeleccionado.Nombre = nuevoUsuario.Estado;
            this.editedUsuario = Object.assign({}, nuevoUsuario)
            this.dialog = true
        },
        closeDialog() {

            this.dialog = false
        },
        cambioEstado() {
            this.editedUsuario.idEstado = this.estadoSeleccionado.idEstado;

            this.editedUsuario.Perfil = this.estadoSeleccionado.Nombre;

            console.log(this.estadoSeleccionado.idEstado);  // Imprime solo el idEstado
        }
    },
    computed: {
        formattedDate() {
            return (usuario) => {
                const dateObject = new Date(usuario.UltimoIngreso);
                return `${dateObject.getDate()}/${dateObject.getMonth() + 1}/${dateObject.getFullYear()} ${dateObject.getHours()}:${dateObject.getMinutes()}:${dateObject.getSeconds()}`;
            };
        },
    },
    mounted() {
        this.getEstadosUsuarios();
        this.getUsuarios();
        this.getPerfiles();
    }
}
</script>
 