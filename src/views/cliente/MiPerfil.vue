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
        padding: 0px !important;
    }

    .isInvalid {
        margin-bottom: 20px;
    }

    .edit-address {
        color: blue;
        text-decoration: underline;
        cursor: pointer;
        margin-top: -10px;
    }

    .profileMiniTitles {
        width: 100%;
        margin: 10px auto 0px 20px;
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
                            v-bind:class="{ 'form-control': true }"
                            variant="outlined"></v-text-field>

                            <v-text-field autocomplete="off" label="Apellidos" name="Apellidos" v-model="user.Apellidos" :rules="nameRules"
                            required class="formPerfil"
                            v-bind:class="{ 'form-control': true }"
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
                                :counter="20"
                                v-bind:class="{ 'form-control': true, 'is-invalid': !validEmail(email) }">
                            </v-text-field>
                            <v-btn
                                :loading="loading"
                                class="form-control"
                                color="warning"
                                variant="flat"
                                height="55"
                                @click="submitForm"
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
                    <div class="d-flex">
                        <h4 class="profileMiniTitles">Mis direcciones</h4>
                        <v-btn variant="plain" :ripple="false" v-on:click="openDireccionDialog()">
                            Nuevo
                            <v-tooltip
                                    activator="parent"
                                    location="top"
                                    >Agregar nueva dirección
                                </v-tooltip>
                        </v-btn>
                    </div>
                    <v-list lines="two">
                        <v-list-item
                            v-for="(direccion, index) in direcciones" :key="index"
                            :title="direccion.Direccion"
                            :subtitle="direccion.Ciudad + ', ' + direccion.CodigoPostal"
                        >
                            <template v-slot:prepend >
                                <v-avatar>
                                    <v-icon v-if="direccion.EsPrincipal" color="warning">
                                        mdi-star
                                    </v-icon>
                                    <v-icon v-if="!direccion.EsPrincipal">
                                        mdi-map-marker-outline
                                    </v-icon>
                                </v-avatar>
                            </template>

                            <template v-slot:append>
                                <v-btn
                                    icon
                                    v-bind="props"
                                    elevation="0"
                                    v-on:click="editDireccion(index)"
                                >
                                    <v-icon color="grey-lighten-1">
                                        mdi-square-edit-outline
                                    </v-icon>
                                    <v-tooltip
                                    activator="parent"
                                    location="top"
                                    >Editar dirección</v-tooltip>
                                </v-btn>
                            
                            </template>
                        </v-list-item>
                    </v-list>
                </div>
                <div class="containerCols">
                    <div class="d-flex">
                        <h4 class="profileMiniTitles">Mis métodos de pago</h4>
                        <v-btn variant="plain" :ripple="false" v-on:click="openMetodoDialog()">
                            Nuevo
                            <v-tooltip
                                    activator="parent"
                                    location="top"
                                    >Agregar nuevo método de pago
                                </v-tooltip>
                        </v-btn>
                    </div>
                    <v-list lines="two">
                        <v-list-item
                        v-for="(metodo, index) in metodosDePago"
                        :key="index"
                        :title="metodo.Tipo + ': ' + metodo.Numero.slice(-4)"
                        :subtitle="formattedExpirationDate(metodo.FechaExpiracion)"
                        >
                        <template v-slot:prepend>
                            <v-avatar>
                            <v-icon v-if="metodo.Tipo === 'Visa'" color="primary">mdi-cards-variant</v-icon>
                            <v-icon v-else-if="metodo.Tipo === 'Mastercard'" color="red">mdi-cards-variant</v-icon>
                            <v-icon v-else-if="metodo.Tipo === 'Paypal'" color="blue">mdi-paypal</v-icon>
                            <v-icon v-else>mdi-credit-card-outline</v-icon>
                            </v-avatar>
                        </template>

                        <template v-slot:append>
                                <v-btn
                                icon
                                v-bind="props"
                                elevation="0"
                                v-on:click="editMetodo(index)"
                                >
                                    <v-icon color="grey-lighten-1">
                                        mdi-square-edit-outline
                                    </v-icon>
                                    <v-tooltip
                                    activator="parent"
                                    location="top"
                                    >Editar método de pago</v-tooltip>
                                </v-btn>
                            
                            </template>
                        </v-list-item>
                    </v-list>
                </div>
            </v-col>
        </v-row>
    </v-container>
    <template>
        <div>
            <v-dialog v-model="showDireccionDialog" max-width="500">
                <template v-slot:activator="{ on }">
                    <v-btn color="rgb(9, 12, 41)" dark v-on="on" @click="closeDireccionDialog()" class="mr-4"></v-btn>
                </template>
                <v-card>
                    <v-toolbar dense color="rgb(9, 12, 41)">
                        <v-toolbar-title class="text-white">{{ direccionDialogTitle }}</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-btn icon @click="closeDireccionDialog">
                        <v-icon class="text-white">mdi-close</v-icon>
                        </v-btn>
                    </v-toolbar>
                    <v-card-text>
                        <v-form ref="form">
                            <v-text-field label="Dirección" variant="outlined" v-model="newDireccion.Direccion" required></v-text-field>
                            <v-text-field label="Ciudad" variant="outlined" v-model="newDireccion.Ciudad" required></v-text-field>
                            <v-text-field label="Código Postal" variant="outlined" :counter="5" v-model="newDireccion.CodigoPostal" required></v-text-field>
                            <v-checkbox label="Por defecto" variant="outlined" v-model="newDireccion.EsPrincipal"></v-checkbox>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn @click="closeDireccionDialog()" variant="plain">Cancelar</v-btn>
                        <v-spacer></v-spacer>
                        <v-btn color="error" text @click="deleteDireccion" v-if="!isAddDireccionDialog" variant="outlined" prepend-icon="mdi-delete-outline">
                            <template v-slot:prepend>
                                <v-icon></v-icon>
                            </template>

                            Eliminar
                        </v-btn>
                        <v-btn prepend-icon="mdi-content-save-outline" color="warning" @click="saveDireccion()" variant="flat" :loading="loading">
                            <template v-slot:prepend>
                                <v-icon></v-icon>
                            </template>

                            Guardar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>
    </template>
    <template>
        <div>
            <v-dialog v-model="showMetodoDialog" max-width="700">
                <template v-slot:activator="{ on }">
                    <v-btn color="rgb(9, 12, 41)" dark v-on="on" @click="closeMetodoDialog()" class="mr-4"></v-btn>
                </template>
                <v-card>
                    <v-toolbar dense color="rgb(9, 12, 41)">
                        <v-toolbar-title class="text-white">{{ metodoDialogTitle }}</v-toolbar-title>
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
                                        label="Card Number"
                                        v-model="cardNumber"
                                        :rules="[rules.required, rules.cardNumber]"
                                        variant="outlined"
                                        v-cardformat:formatCardNumber
                                    >
                                        <template v-slot:prepend>
                                            <i :class="cardBrandClass"></i>
                                            <i class="fa fa-credit-card"></i>
                                            <v-icon icon="fas fa-credit-card" /> 
                                            <font-awesome-icon :icon="['fas', 'credit-card']" />
                                        </template>
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6">
                                <v-text-field
                                    label="Cardholder Name"
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
                                        v-model="expDate"
                                        label="Expiration Date"
                                        append-icon="mdi-calendar"
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
                                    label="CVV"
                                    v-model="CVV"
                                    :rules="[rules.required, rules.CVV]"
                                    variant="outlined"
                                    v-cardformat:formatCardCVC
                                />
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-btn @click="closeMetodoDialog()" variant="plain">Cancelar</v-btn>
                                <v-spacer></v-spacer>
                                <v-btn color="error" text @click="deleteMetodo" v-if="!isAddMetodoDialog" variant="outlined" prepend-icon="mdi-delete-outline">
                                    <template v-slot:prepend>
                                        <v-icon></v-icon>
                                    </template>

                                    Eliminar
                                </v-btn>
                                <v-btn prepend-icon="mdi-content-save-outline" color="warning" @click="saveMetodo()" variant="flat" :loading="loading">
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
        </div>
    </template>
</template>



<script>
import { useToast } from "vue-toastification";
import axios from 'axios'

export default {
    setup() {
        const toast = useToast();
        return { toast }
    },

    computed: {
        cardBrandClass(){
          return this.getBrandClass(this.cardBrand);
        }
    },

    data() {
        return {
            imageUrl: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
            showEditIcon: false,
            showDireccionDialog: false,
            isAddDireccionDialog: true,
            direccionDialogTitle: "Agregar dirección",
            showMetodoDialog: false,
            isAddMetodoDialog: true,
            metodoDialogTitle: "Agregar método de pago",
            valid: false,
            cardBrand: null,
            user: {},
            newDireccion: {
                idDireccion: 0,
                Direccion: "",
                Ciudad: "",
                CodigoPostal: "",
                Pais: "",
                EsPrincipal: false,
            },
            newMetodo: {
                idMetodo: 0,
                idUsuario: 0,
                Tipo: "",
                Numero: "",
                FechaExpiracion: "",
                Pais: "",
                EsPrincipal: false,
            },
            direcciones: [],
            metodosDePago: [],
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
            loaded: false,
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
            cambiosRealizados: false,
            token: localStorage.getItem('token'),
            cardNumber: "",
            cardholderName: "",
            expDate: null,
            CVV: "",
            expDateMenu: false,
            rules: {
                required: (value) => !!value || "Requerido.",
                cardNumber: (value) =>
                /^\d{4} \d{4} \d{4} \d{4}$/.test(value) ||
                "Número de tarjeta inválido.",
                name: (value) =>
                /^[A-Za-z]+([A-Za-z]+)*$/.test(value) || "Nombre inválido.",
                expDate: (value) =>
                !!value || "La fecha de expiración es requerida.",
                CVV: (value) =>
                /^\d{3}$/.test(value) || "Código CVV inválida."
            }
        }
    },
    watch: {
        user: {
            handler: function(nuevoValor, antiguoValor) {
                console.log(JSON.stringify(nuevoValor) !== JSON.stringify(antiguoValor));
                if (JSON.stringify(nuevoValor) !== JSON.stringify(antiguoValor)) {
                    this.cambiosRealizados = true;
                } else {
                    this.cambiosRealizados = false;
                }
            },
            deep: true
        }
    },
    mounted() {
        if (!this.loaded) {
            axios.get('https://tiendabackend.azurewebsites.net/api/Account', {
                headers: {
                    'Authorization': `${this.token}`
                }
            })
            .then(data => {
                this.user = data.data.usuario;
                this.userVerification = data.data.usuario;

                this.loadUserDirecciones();
                this.loadUserMetodos();

                this.loaded = true;
            })
            .catch(error => {
                this.toast.error("Error 500. " + error, this.$store.state.defaultToastOptions);
            });
        }
    },

    methods: {
        getBrandClass: function (brand) {
          let icon = '';

          brand = brand || 'unknown';

          let cardBrandToClass = {
            'visa': 'fab fa-cc-visa',
            'mastercard': 'fab fa-cc-mastercard',
            'amex': 'fab fa-cc-amex',
            'discover': 'fab fa-cc-discover',
            'diners': 'fab fa-cc-diners-club',
            'jcb': 'fab fa-cc-jcb',
            'unknown': 'fa fa-credit-card',
          };

          if (cardBrandToClass[brand]) {
            icon = cardBrandToClass[brand];
          }

          return icon;
        },
        submit() {
            if (this.valid) {
                // send credit card data to server or process payment
                this.$refs.form.reset();
                this.cardNumber = "";
                this.cardholderName = "";
                this.expDate = null;
                this.CVV = "";
                this.expDateMenu = false;
            }
        },
        loadUserDirecciones() {
            axios.get('https://tiendabackend.azurewebsites.net/api/Direcciones/GetDireccionesUsuario?idUsuario=' + this.user.idUsuario, {
                headers: {
                    'Authorization': `${this.token}`
                }
                })
                .then(data => {
                    this.direcciones = data.data;
                    this.loaded = true;
                })
                .catch(error => {
                    this.toast.error("Error 500. " + error, this.$store.state.defaultToastOptions);
            });
        },
        loadUserMetodos() {
            axios.get('https://tiendabackend.azurewebsites.net/api/MetodosPagos/GetMetodosUsuario?idUsuario=' + this.user.idUsuario, {
                headers: {
                    'Authorization': `${this.token}`
                }
                })
                .then(data => {
                    this.metodosDePago = data.data;
                    this.loaded = true;
                })
                .catch(error => {
                    this.toast.error("Error 500. " + error, this.$store.state.defaultToastOptions);
            });
        },
        
        formattedExpirationDate(dateString) {
            const date = new Date(dateString);
            const month = date.getMonth() + 1;
            const year = date.getFullYear().toString().slice(-2);
            return `Fecha de Exp.: ${month.toString().padStart(2, '0')}/${year}`;
        },

        uploadImage() {
            this.$refs.fileInput.click(); // abrir el input file al hacer clic en el avatar
        },
        handleImageUpload(event) {
            try {
                const file = event.target.files[0];
                if (!file.type.includes('image/')) {
                    this.toast.error("Por favor, seleccione una imagen", this.$store.state.defaultToastOptions);
                }
                const reader = new FileReader();
                reader.onload = () => {
                    this.imageUrl = reader.result; // actualizar la imagen del avatar con la imagen cargada
                };
                reader.readAsDataURL(file);
            }
            catch {
                this.toast.error("Por favor, seleccione una imagen", this.$store.state.defaultToastOptions);
            }
        },

        validate() {
            this.emailBlured = true;
            this.passwordBlured = true;
            if (this.validPassword(this.password) && this.validEmail(this.user.CorreoElectronico) && this.validConfirmPassword(this.confirmPassword)) {
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
            if ((confirmPassword == null || confirmPassword == "") && (this.password == null || this.password == "")){
                return true;
            }

            if (confirmPassword.length > 7 && confirmPassword == this.password) {
                return true;
            }
        },
        validPassword(password) {
            if ((this.confirmPassword == null || this.confirmPassword == "") && (this.password == null || this.password == "")){
                return true;
            }
            if (password.length > 7) {
                return true;
            }
        },
        submitForm() {
            this.validate();

            if (this.valid) {
                if (this.cambiosRealizados) {
                    this.toast.warning("No hay nuevos cambios.", this.$store.state.defaultToastOptions);
                }
                else {
                    axios.put('https://tiendabackend.azurewebsites.net/api/Usuarios?idUsuario=' + this.user.idUsuario, this.user, {
                        headers: {
                            'Authorization': `${this.token}`
                        }
                    })
                    .then(data => {
                        console.log(data);
                        if (data.data.Success) {
                            this.loading = false;
                            this.toast.success(data.data.Message, this.$store.state.defaultToastOptions);
                        }
                        else {
                            this.loading = false;
                            this.toast.warning(data.data.Message, this.$store.state.defaultToastOptions);
                        }
                    })
                    .catch(error => {
                        this.loading = false;
                        console.log(error);
                        this.toast.error("Error 500. " + error, this.$store.state.defaultToastOptions);
                    }); 
                }
            }
        },
        closeDireccionDialog() {
            this.showDireccionDialog = false;
        },
        openDireccionDialog() {
            this.resetDireccionForm();
            this.showDireccionDialog = true;
        },
        closeMetodoDialog() {
            this.showMetodoDialog = false;
        },
        openMetodoDialog() {
            this.resetMetodoForm();
            this.showMetodoDialog = true;
        },
        resetDireccionForm() {
            this.direccionDialogTitle = "Agregar dirección";
            this.isAddDireccionDialog = true;
            this.newDireccion.idDireccion = 0;
            this.newDireccion.Direccion = "";
            this.newDireccion.Ciudad = "";
            this.newDireccion.CodigoPostal = "";
            this.newDireccion.Pais = "República Dominicana";
            this.newDireccion.EsPrincipal = false;
        },
        resetMetodoForm() {
            this.direccionDialogTitle = "Agregar dirección";
            this.isAddDireccionDialog = true;
            this.newDireccion.idDireccion = 0;
            this.newDireccion.Direccion = "";
            this.newDireccion.Ciudad = "";
            this.newDireccion.CodigoPostal = "";
            this.newDireccion.Pais = "República Dominicana";
            this.newDireccion.EsPrincipal = false;
        },
        eliminarDireccion(){
            
        },
        async saveDireccion(){
            const url = 'https://tiendabackend.azurewebsites.net/api/Direcciones';
            this.newDireccion.idUsuario = this.user.idUsuario;

            const model = Object.assign({}, this.newDireccion);

            try {
                if (this.newDireccion.idDireccion == 0){
                    this.loading = true;

                    const response = await axios.post(url, this.newDireccion, {
                        headers: {
                            Authorization: `${this.token}`
                        }
                    });
                    if (response.data.Success) {
                        this.loading = false;
                        this.loadUserDirecciones();
                        this.showDireccionDialog = false;

                        this.toast.success(response.data.Message, this.$store.state.defaultToastOptions);
                    }
                    else {
                        this.loading = false;
                        this.toast.warning(response.data.Message, this.$store.state.defaultToastOptions);
                    }
                }
                else {
                    this.loading = true;
                    console.log(model);
                    const token = localStorage.getItem('token');

                    const response = await axios.put(url + '?idDireccion=' + this.newDireccion.idDireccion, model, {
                        headers: {
                            Authorization: `${token}`
                        }
                    });
                    if (response.data.Success) {
                        this.loading = false;
                        this.loadUserDirecciones();
                        this.showDireccionDialog = false;

                        this.toast.success(response.data.Message, this.$store.state.defaultToastOptions);
                    }
                    else {
                        this.loading = false;
                        this.toast.warning(response.data.Message, this.$store.state.defaultToastOptions);
                    }
                }
            } 
            catch (error) {
                this.loading = false;
                console.log("si ta funcionando");
                this.toast.error("Error 500. Error al realizar la operación.", this.$store.state.defaultToastOptions);
            }                
        },
        editDireccion(index) {
            this.resetForm();
            this.isAddDireccionDialog = false;
            this.newDireccion.idDireccion = this.direcciones[index].idDireccion;
            this.newDireccion.Direccion = this.direcciones[index].Direccion;
            this.newDireccion.Ciudad = this.direcciones[index].Ciudad;
            this.newDireccion.CodigoPostal = this.direcciones[index].CodigoPostal;
            this.newDireccion.EsPrincipal = this.direcciones[index].EsPrincipal;
            this.newDireccion.Pais = this.direcciones[index].Pais;
            this.direccionDialogTitle = "Editar dirección";
            this.showDireccionDialog = true;
        },
        deleteDireccion() {

        },
    },
}
</script>