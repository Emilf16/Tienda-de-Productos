<style>
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
    .avatar {
        position: relative;
        overflow: hidden;
        cursor: pointer;
        margin: 10px auto;
        transition: opacity 0.5s ease-in-out;
    }

    .avatar:hover {
        opacity: 0.8;
    }

    .avatar:hover img {
        filter: brightness(0.3); /* Cambia el brillo de la imagen al hacer hover */
    }


    .edit-icon {
        position: absolute;
        color: white;
        border-radius: 50%;
        padding: 5px;
        cursor: pointer;
        transition: opacity 0.2s ease-in-out;
    }

    .edit-icon:hover {
        opacity: 0.8;
    }

    .titleUsername {
        margin-top: 20px;
    }

    .userProfile {
        margin-bottom: 20px;
    }

    .userForm {
        padding: 5%;
    }

    .formPerfil {
        margin: 0px 10px;
    }

    .isInvalid {
        margin-bottom: 20px;
    }
</style>

<template>
    <v-container class="mainContainer">

        <h1>Mi perfil</h1>

        <v-row class="rowContainer">
            <v-col cols="8" sm="12" lg="8" class="colsContainer">
                <div class="containerCols">
                    <h2 class="text-center titleUsername">{{ user.NombreUsuario }}</h2>
                    <p class="text-center userProfile">{{ user.Perfil }}</p>
                    <div style="width: 100%;" class="text-center">
                        <v-avatar class="avatar elevation-3" :size="150" @mouseenter="showEditIcon = true" @mouseleave="showEditIcon = false" @click="uploadImage">
                            <img :src="imageUrl" alt="avatar" width="150">
                            <v-icon v-if="showEditIcon" class="edit-icon">mdi-pencil</v-icon>
                            <v-tooltip
                                activator="parent"
                                location="top"
                            >Cambiar la foto de perfil</v-tooltip>
                        </v-avatar>
                        <input type="file" ref="fileInput" style="display: none" @change="handleImageUpload">
                    </div>
                    <v-form ref="userForm" v-model="valid" class="userForm">
                        <div class="w-100 d-flex flex-row bd-highlight">
                            <v-text-field autocomplete="off" label="Nombres" name="Nombres" v-model="user.Nombres" :rules="nameRules"
                            required class="formPerfil"
                            v-bind:class="{ 'form-control': true, 'is-invalid': !validName(name) }"
                            variant="outlined"></v-text-field>

                            <v-text-field autocomplete="off" label="Apellidos" name="Apellidos" v-model="user.Apellidos" :rules="nameRules"
                            required class="formPerfil"
                            v-bind:class="{ 'form-control': true, 'is-invalid': !validName(name) }"
                            variant="outlined"></v-text-field>
                        </div>
                        <v-text-field autocomplete="off" label="Correo electrónico" name="email" type="email" variant="outlined"
                                v-model="user.CorreoElectronico" :rules="emailRules" required class="formPerfil"
                                v-bind:class="{ 'form-control': true, 'is-invalid': !validEmail(email) }"></v-text-field>

                        <v-text-field autocomplete="off" label="Nueva contraseña" name="password" variant="outlined"
                            v-model="password" :rules="passwordRules" required class="formPerfil"
                            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                            v-bind:class="{ 'form-control': true, 'is-invalid': !validPassword(password) }"
                            :type="showPassword ? 'text' : 'password'"
                            @click:append="showPassword = !showPassword">
                        </v-text-field>

                        <v-text-field autocomplete="off" label="Confirmar nueva contraseña" name="confirmPassword" variant="outlined"
                            :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'" class="formPerfil"
                            v-model="confirmPassword" :rules="confirmPasswordRules" required
                            v-bind:class="{ 'form-control': true, 'is-invalid': !validConfirmPassword(confirmPassword) }"
                            :type="showConfirmPassword ? 'text' : 'password'"
                            @click:append="showConfirmPassword = !showConfirmPassword">
                        </v-text-field>
                        <div class="w-100 d-flex flex-row bd-highlight">
                            <v-text-field autocomplete="off" label="Teléfono" variant="outlined" style="width: 50%;"
                                v-model="user.Telefono" class="formPerfil"
                                :counter="14"
                                v-bind:class="{ 'form-control': true, 'is-invalid': !validEmail(email) }">
                            </v-text-field>
                            <v-btn
                                :loading="loading"
                                class="form-control"
                                color="warning"
                                variant="flat"
                                height="55"
                                @click="load"
                            >
                                Guardar cambios
                                <v-tooltip
                                activator="parent"
                                location="top"
                                >Guardar los cambios a tu perfil</v-tooltip>
                            </v-btn>
                        </div>

                    </v-form>
                </div>
            </v-col>
            <v-col cols="4" sm="12" lg="4" class="colsContainer">
                <div class="containerCols">
                    <h4>Mis direcciones</h4>
                </div>
                <div class="containerCols">
                    <h4>Mis métodos de pago</h4>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>


<script>
import { useToast } from "vue-toastification";
import axios from 'axios'

    export default {
        setup() {
            const toast = useToast();
            return { toast }
        },

        data() {
            
            return {
                imageUrl: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
                showEditIcon: false,
                valid: false,
                user: {},
                userVerification: {},
                email: "",
                password: "",
                showPassword: false,
                showConfirmPassword: false,
                name: "",
                Nombres: "",
                Apellidos: "",
                confirmPassword: "",
                telefono: "",
                loading: false,
                emailRules: [
                    (v) => !!v || "El correo electrónico es requerido",
                    (v) => /.+@.+\..+/.test(v) || "El correo electrónico debe ser válido",
                ],
                passwordRules: [
                    (v) => !!v || "La contraseña es requerida",
                    (v) => v && v.length >= 8 || "La contraseña debe contener al menos 8 caracteres",
                ],
                nameRules: [
                    (v) => !!v || "El nombre es requerido",
                    (v) => v && v.length >= 3 || "El nombre debe contener al menos 3 caracteres",
                ],
                confirmPasswordRules: [
                    (v) => !!v || "Confirmar contraseña es requerido",
                    (v) => v === this.password || "Las contraseñas no coinciden",
                ],
                drawer: false,
                login: false,
                rail: true,
                reveal: false,
                isLoggedIn: false,
            }
        },
        mounted() {
            const token = localStorage.getItem('token');
            console.log(token);
            axios.get('https://tiendabackend.azurewebsites.net/api/Account', {
                headers: {
                    'Authorization': `${token}`
                }
            })
            .then(data => {
                this.user = data.data.usuario;
                this.userVerification = data.data.usuario;
                console.log(data.data);
            })
            .catch(error => {
                this.toast.error("Error 500. " + error, {
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
            });
        },
        methods: {
            uploadImage() {
            this.$refs.fileInput.click(); // abrir el input file al hacer clic en el avatar
            },
            handleImageUpload(event) {
                try {
                    const file = event.target.files[0];
                    if (!file.type.includes('image/')) {
                        this.toast.error("Por favor, seleccione una imagen", {
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
                    const reader = new FileReader();
                    reader.onload = () => {
                        this.imageUrl = reader.result; // actualizar la imagen del avatar con la imagen cargada
                    };
                    reader.readAsDataURL(file);
                }
                catch {
                    this.toast.error("Por favor, seleccione una imagen", {
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

            validate() {
                this.emailBlured = true;
                this.passwordBlured = true;
                if (this.validName(this.name) && this.validPassword(this.password) && this.validEmail(this.email) && this.validConfirmPassword(this.confirmPassword)) {
                    this.valid = true;
                }
            },
            validEmail(email) {
                var re = /(.+)@(.+){2,}\.(.+){2,}/;
                if (re.test(email.toLowerCase())) {

                    return true;
                }
            },
            validConfirmPassword(confirmPassword) {
                if (confirmPassword.length > 7 && confirmPassword == this.password) {
                    return true;
                }
            },
            validPassword(password) {
                if (password.length > 7) {
                    return true;
                }
            },
            validName(name) {
                if (name.length >= 3) {
                    return true;
                }
            },
        },

    }
</script>