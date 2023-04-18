<template>
    <v-container fluid class="fill-height form-container">
        <v-col align="center" justify="center">
            <v-col cols="12" md="8" sm="12" lg="6" class="login-form">
                <v-card>
                    <v-tabs v-model="tab">
                        <v-tab>Inicio de sesión</v-tab>
                        <v-tab>Registro</v-tab>
                    </v-tabs>
                    <v-card-text>
                        <v-form v-if="tab === 0" ref="loginForm" v-model="valid">
                            <v-text-field autocomplete="off" label="Nombre de usuario" name="name" v-model="name" :rules="nameRules"
                                required
                                v-bind:class="{ 'form-control': true, 'is-invalid': !validName(name) }"
                                variant="outlined"></v-text-field>


                            <v-text-field autocomplete="off" label="Contraseña" name="password"
                                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                v-model="password" :rules="passwordRules" required
                                v-bind:class="{ 'form-control': true, 'is-invalid': !validPassword(password) }"
                                :type="showPassword ? 'text' : 'password'"
                                @click:append="showPassword = !showPassword"
                                variant="outlined">
                            </v-text-field>
                            <div class="w-100 d-flex flex-row-reverse bd-highlight">
                                <a class="forgot-password-link">¿Has olvidado la contraseña?</a>
                            </div>
                        </v-form>

                        <v-form v-else ref="registerForm" v-model="valid">

                            <v-text-field autocomplete="off" label="Nombre" name="name" v-model="name" :rules="nameRules" variant="outlined"
                                required></v-text-field>

                            <v-text-field autocomplete="off" label="Correo electrónico" name="email" type="email" variant="outlined"
                                v-model="email" :rules="emailRules" required
                                v-bind:class="{ 'form-control': true, 'is-invalid': !validEmail(email) }"></v-text-field>

                            <v-text-field autocomplete="off" label="Contraseña" name="password" variant="outlined"
                                v-model="password" :rules="passwordRules" required
                                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                v-bind:class="{ 'form-control': true, 'is-invalid': !validPassword(password) }"
                                :type="showPassword ? 'text' : 'password'"
                                @click:append="showPassword = !showPassword">
                            </v-text-field>

                            <v-text-field autocomplete="off" label="Confirmar contraseña" name="confirmPassword" variant="outlined"
                                :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                v-model="confirmPassword" :rules="confirmPasswordRules" required
                                v-bind:class="{ 'form-control': true, 'is-invalid': !validConfirmPassword(confirmPassword) }"
                                :type="showConfirmPassword ? 'text' : 'password'"
                                @click:append="showConfirmPassword = !showConfirmPassword">
                            </v-text-field>
                        </v-form>
                    </v-card-text>
                    <v-card-actions class="mx-auto">
                        <v-btn color="warning" @click="submitForm" variant="flat" :loading="loading" class="mx-auto">
                            {{ tab === 0 ? 'Iniciar sesión' : 'Registrar' }}
                        </v-btn>
                    </v-card-actions>

                </v-card>
            </v-col>
        </v-col>
    </v-container>
</template>

<style>
    .form-container {
        background: linear-gradient(to bottom, #090c29, #2b2d42) !important; 
        height: 100% !important;
    }
    .forgot-password-link {
        text-align: right;
    }
    .forgot-password-link:hover {
        text-align: right;
        cursor: pointer;
        color: --warning;
    }
</style>


<script>
import { useToast } from "vue-toastification";

import axios from 'axios'
export default {
    setup() {
        const toast = useToast();
        return { toast }
    },

    computed: {
        estaLogueado() {
            return this.$store.state.estaLogueado
        }
    },
    data() {
        return {
            tab: 0,
            valid: false,
            email: "",
            password: "",
            showPassword: false,
            showConfirmPassword: false,
            name: "",
            confirmPassword: "",
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
            categories: [],
            isLoggedIn: false,
        };
    },
    methods: {
        async registrar() {

            const url = 'https://tiendabackend.azurewebsites.net/api/Usuarios/Registrar';
            const data = {
                NombreUsuario: this.name,
                CorreoElectronico: this.email,
                Password: this.password,
                idPerfil: 2,
                idEstado: 1,
                Nombres: this.name,
            };
            try {
                this.loading = true;
                const response = await axios.post(url, data);
                // Obtener el token de la respuesta y guardarlo en el almacenamiento local 
                if (response.data.Success) {
                    this.loading = false;
                    localStorage.setItem('token', response.data.Token);
                    this.$store.commit('mostrarTienda', response.data.Token);
                    this.estaLogueado;

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
                }
                else {
                    this.loading = false;
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
                this.toast.error("Error 500. Error al realizar la operación.", {
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
        async ingresar() {

            const url = 'https://tiendabackend.azurewebsites.net/api/Account';
            const data = {
                userName: this.name,
                password: this.password
            };
            try {
                this.loading = true;
                const response = await axios.post(url, data);
                // Obtener el token de la respuesta y guardarlo en el almacenamiento local 
                if (response.data.Success) {
                    localStorage.setItem('token', response.data.Token);
                    this.$store.commit('mostrarTienda', response.data.Token);
                    this.estaLogueado;
                    
                    this.loading = false;
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
                }
                else {
                    this.loading = false;
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
                this.toast.error("Error 500. Error al realizar la operación.", {
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
        submitForm() {
            if (this.tab === 0) {

                this.validate();
                if (this.valid) {
                    this.ingresar();
                }

            } else {

                this.validate();
                if (this.valid) {
                    this.registrar();
                }
            }

        },
    },
};
</script> 
 