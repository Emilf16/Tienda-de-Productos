 
 


<template>
  <v-app>
    <v-main>
      <v-layout fluid v-if="isLoggedIn">
        <PantallaTienda>
        </PantallaTienda>
      </v-layout>


      <v-container fluid class="fill-height" v-else>
        <v-row align="center" justify="center">
          <v-col cols="12" md="8" class="login-form">
            <v-card>
              <v-tabs v-model="tab">
                <v-tab>Inicio de sesión</v-tab>
                <v-tab>Registro</v-tab>
              </v-tabs>
              <v-card-text>
                <v-form v-if="tab === 0" ref="loginForm" v-model="valid">

                  <v-text-field label="Correo electrónico" name="email" type="email" v-model="email" :rules="emailRules"
                    required></v-text-field>
                  <v-text-field label="Contraseña" name="password" type="password" v-model="password"
                    :rules="passwordRules" required></v-text-field>
                </v-form>
                <v-form v-else ref="registerForm" v-model="valid">
                  <v-text-field label="Nombre" name="name" v-model="name" :rules="nameRules" required></v-text-field>
                  <v-text-field label="Correo electrónico" name="email" type="email" v-model="email" :rules="emailRules"
                    required></v-text-field>
                  <v-text-field label="Contraseña" name="password" type="password" v-model="password"
                    :rules="passwordRules" required></v-text-field>
                  <v-text-field label="Confirmar contraseña" name="confirmPassword" type="password"
                    v-model="confirmPassword" :rules="confirmPasswordRules" required></v-text-field>
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
      </v-container>
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
    onLoginSuccess() {
      this.isLoggedIn = true;
    },
    submitForm() {
      if (this.$refs.loginForm.validate()) {
        // this.$refs.loginForm.validate().then((valid) => {
        //   if (valid) {
        //     this.onLoginSuccess();
        //     // Handle login submit
        //   }
        // }
        // );

        console.log('hola')
        this.onLoginSuccess();
      } else {
        this.$refs.registerForm.validate().then((valid) => {
          if (valid) {
            console.log("no")
            // this.onLoginSuccess();
          }
        });
      }
    },
  },
};
</script> 
 