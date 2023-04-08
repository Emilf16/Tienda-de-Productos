<template>
    <v-container fluid>
        <v-table fixed-header height="300px">
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
                    <td>{{ usuario.Nombres }}</td>
                    <td>{{ usuario.Apellidos }}</td>
                    <td>{{ usuario.CorreoElectronico }}</td>
                    <td>{{ usuario.Perfil }}</td>
                    <td>
                        <v-row>
                            <v-btn @click="getUser">hola</v-btn>
                            <div style="width: 5px;">
                            </div>
                            <v-btn></v-btn>
                        </v-row>

                    </td>
                </tr>
            </tbody>
        </v-table>


    </v-container>
</template>
  
<script>
import axios from 'axios'
export default {
    data: () => ({
        dialog: false,
        headers: [
            { text: 'ID', value: 'id' },
            { text: 'Usuario', value: 'usuario' },
            { text: 'Nombre', value: 'nombre' },
            { text: 'Apellido', value: 'apellido' },
            { text: 'Correo electrónico', value: 'email' },
            { text: 'Perfil', value: 'perfil' },
            { text: 'Acciones', value: 'acciones' },
        ],
        listaUsuarios: [
            {
                idUsuario: 1,
                NombreUsuario: "Emil@2314",
                CorreoElectronico: "Emil@mail.com",
                Password: "1234512345",
                PasswordHash: "QEA=sdsdsdsdsdsds",
                idPerfil: 2,
                Perfil: "Cliente",
                idEstado: 7,
                Estado: "Activo",
                FechaRegistro: "2023-04-07T17:29:45.8845929-07:00",
                UltimoIngreso: "2023-04-07T17:29:45.8845929-07:00",
                Nombres: "Emil Francisco",
                Apellidos: "Solano Gil",
                Telefono: "8095555555"
            },
            {
                idUsuario: 2,
                NombreUsuario: "Divanny@1223",
                CorreoElectronico: "Divanny@mail.com",
                Password: "1234512345",
                PasswordHash: "QEA=sdsdsdsdsdsds",
                idPerfil: 1,
                Perfil: "Admin",
                idEstado: 7,
                Estado: "Activo",
                FechaRegistro: "2023-04-07T17:29:45.8845929-07:00",
                UltimoIngreso: "2023-04-07T17:29:45.8845929-07:00",
                Nombres: "Divanny",
                Apellidos: "Perez Mendez",
                Telefono: "8094444444"
            }
        ]

    }),



    methods: {
        async getUser() {
            this.error = null;
            try {
                const respuesta = await axios.get('https://tiendabackend.azurewebsites.net/api/Account/GetUserData');
                console.log(respuesta);
                if (respuesta.length > 0) {
                    this.$store.commit('LogOut', true)
                    this.estaLogueado
                    console.log(respuesta)
                }
            } catch (error) {
                console.log(error);
                if (error.response.status === 401) {
                    console.log('Error desconocido:', error.message);
                } else {
                    console.log('Error desconocido:', error);
                }
            }
        },


        editItem(item) {
            this.editedIndex = this.desserts.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },

        deleteItem(item) {
            const index = this.desserts.indexOf(item)
            confirm('Are you sure you want to delete this item?') && this.desserts.splice(index, 1)
        },

        close() {
            this.dialog = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },

        save() {
            if (this.editedIndex > -1) {
                Object.assign(this.desserts[this.editedIndex], this.editedItem)
            } else {
                this.desserts.push(this.editedItem)
            }
            this.close()
        },
    },
}
</script>
 