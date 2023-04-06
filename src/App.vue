<template>
  <v-app>
    <v-main>
      <!-- <v-layout fluid v-if="isLoggedIn"> -->
      <PantallaTienda>
      </PantallaTienda>
      <!-- </v-layout> -->

      <!-- <v-container fluid class="fill-height" v-else>
        <v-row align="center" justify="center">
          <v-col cols="12" md="8" class="login-form">
            <v-card>
              <v-tabs v-model="tab">
                <v-tab>Inicio de sesión</v-tab>
                <v-tab>Registro</v-tab>
              </v-tabs>
              <v-card-text>
                <v-form v-if="tab === 0" ref="loginForm" v-model="valid">

                  <v-text-field autocomplete="off" label="Correo electrónico" name="email" type="email" v-model="email"
                    :rules="emailRules" required
                    v-bind:class="{ 'form-control': true, 'is-invalid': !validEmail(email) }"></v-text-field>


                  <v-text-field autocomplete="off" label="Contraseña" name="password" type="password" v-model="password"
                    :rules="passwordRules" required
                    v-bind:class="{ 'form-control': true, 'is-invalid': !validPassword(password) }"></v-text-field>


                </v-form>

                <v-form v-else ref="registerForm" v-model="valid">

                  <v-text-field autocomplete="off" label="Nombre" name="name" v-model="name" :rules="nameRules"
                    required></v-text-field>

                  <v-text-field autocomplete="off" label="Correo electrónico" name="email" type="email" v-model="email"
                    :rules="emailRules" required
                    v-bind:class="{ 'form-control': true, 'is-invalid': !validEmail(email) }"></v-text-field>

                  <v-text-field autocomplete="off" label="Contraseña" name="password" type="password" v-model="password"
                    :rules="passwordRules" required
                    v-bind:class="{ 'form-control': true, 'is-invalid': !validPassword(password) }"></v-text-field>

                  <v-text-field autocomplete="off" label="Confirmar contraseña" name="confirmPassword" type="password"
                    v-model="confirmPassword" :rules="confirmPasswordRules" required
                    v-bind:class="{ 'form-control': true, 'is-invalid': !validConfirmPassword(confirmPassword) }"></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn color="blue" @click="submitForm" variant="flat">
                  {{ tab === 0 ? 'Iniciar sesión' : 'Registrar' }}
                </v-btn>
              </v-card-actions>

            </v-card>
          </v-col>
        </v-row>
      </v-container> -->
    </v-main>
  </v-app>
</template>

<script>

import PantallaTienda from './views/PantallaTienda.vue'
export default {
  components: {

    PantallaTienda
  },
  data() {
    return {
      tab: 0,
      valid: false,
      email: "",
      password: "",
      name: "",
      confirmPassword: "",
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

    validate() {
      this.emailBlured = true;
      this.passwordBlured = true;
      if (this.validEmail(this.email) && this.validPassword(this.password) && this.validConfirmPassword(this.confirmPassword) && this.validName(this.name)) {

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
      if (name.length > 3) {
        return true;
      }
    },

    submitForm() {

      if (this.tab === 0) {

        this.validate();
        if (this.valid) {
          this.isLoggedIn = true;
        }

      } else {

        this.validate();
        if (this.valid) {
          this.isLoggedIn = true;
        }
        // Handle login submit

      }

    },
  },
};
</script> 
 