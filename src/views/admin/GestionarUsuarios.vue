<template>
    <v-container fluid>
        <v-col>
            <v-row>
                <v-spacer></v-spacer>
                <v-btn @click="addUsuario(nuevoUsuario)"><v-icon>mdi-account-plus</v-icon></v-btn>
                <v-btn @click="getUsuarios" class="ml-5"><v-icon>mdi-restart</v-icon></v-btn>
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
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field v-model="editedUsuario.Nombres" label="Nombres"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field v-model="editedUsuario.Perfil" label="Perfil"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field v-model="editedUsuario.Estado" label="Estado"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field v-model="editedUsuario.idPerfil" label="id Perfil"></v-text-field>
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
import axios from 'axios'
export default {
    computed: {
        formattedDate() {
            return (usuario) => {
                const dateObject = new Date(usuario.UltimoIngreso);
                return `${dateObject.getDate()}/${dateObject.getMonth() + 1}/${dateObject.getFullYear()} ${dateObject.getHours()}:${dateObject.getMinutes()}:${dateObject.getSeconds()}`;
            };
        },
        async getUsers() {
            try {
                const url = 'https://tiendabackend.azurewebsites.net/api/Usuarios';
                const token = localStorage.getItem('token');

                const response = await axios.get(url, {
                    headers: {
                        Authorization: `${token}`
                    }
                });

                this.listaUsuarios = response.data;
                for (const usuario of this.listaUsuarios) {
                    const dateObject = new Date(usuario.UltimoIngreso);
                    const formattedDate = `${dateObject.getDate()}/${dateObject.getMonth() + 1}/${dateObject.getFullYear()} ${dateObject.getHours()}:${dateObject.getMinutes()}:${dateObject.getSeconds()}`;
                    this.horasIngreso.push(formattedDate);
                }
                console.log('Success:', response.data);

            } catch (error) {
                console.error('Error:', error);
            }
        },
    },
    data: () => ({
        dialog: false,
        headers: [
            { text: 'ID', value: 'id' },
            { text: 'Usuario', value: 'usuario' },
            { text: 'Correo electrónico', value: 'email' },
            { text: 'Perfil', value: 'perfil' },
            { text: 'Ultimo Ingreso', value: 'ultimoIngreso' },
            { text: 'Estado', value: 'estado' },
            { text: 'Acciones', value: 'acciones' },
        ],
        listaUsuarios: [],
        horasIngreso: [],
        editedUsuario: {
            idUsuario: null,
            NombreUsuario: " ",
            CorreoElectronico: " ",
            Password: null,
            PasswordHash: null,
            idPerfil: null,
            Perfil: " ",
            idEstado: null,
            Estado: " ",
            FechaRegistro: " ",
            UltimoIngreso: " ",
            Nombres: " ",
            Apellidos: null,
            Telefono: null
        },
        nuevoUsuario: {
            idUsuario: "",
            CorreoElectronico: " ",
            Password: "hola",
            PasswordHash: "hola",
            idPerfil: 1,
            Perfil: " ",
            idEstado: 1,
            Estado: " ",
            FechaRegistro: "hola",
            UltimoIngreso: "hola",
            Nombres: "hola",
            Apellidos: "hola",
            Telefono: "hola"
        }
    }),
    methods: {
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
                console.log('Success:', response.data);
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

                console.log(response);
            } catch (error) {
                console.error('Error:', error);
            }
        },



        editUsuario(usuario) {
            this.dialog = true
            this.formTitle = 'Editar usuario'
            this.editedIndex = this.listaUsuarios.indexOf(usuario)
            this.editedUsuario = Object.assign({}, usuario)
        },
        addUsuario(nuevoUsuario) {
            this.formTitle = 'Agregar usuario'
            this.editedUsuario = Object.assign({}, nuevoUsuario)
            this.dialog = true
        },

        guardarUsuario(usuario) {
            // Verificar que el objeto de usuario tenga los datos necesarios
            if (!usuario.NombreUsuario || !usuario.CorreoElectronico || !usuario.idPerfil) {
                console.error("Faltan datos de usuario para guardar");
                return;
            }

            if (this.formTitle === 'Agregar producto') {
                this.listaUsuarios.push(usuario);
                console.log("Nuevo usuario agregado:", usuario);
            } else {
                const index = this.listaUsuarios.findIndex(
                    (u) => u.idUsuario === usuario.idUsuario
                )
                if (index > -1) {
                    Object.assign(this.listaUsuarios[index], usuario);
                    this.actualizarUsuario(usuario.idUsuario, usuario)
                    console.log("Usuario actualizado:", usuario);
                }
            }
            this.dialog = false;
        },

        closeDialog() {
            this.dialog = false
        },
    },
}
</script>
 