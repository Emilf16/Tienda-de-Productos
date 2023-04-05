<template>
    <v-form @submit.prevent="processPayment">
        <v-text-field v-model="cardHolderName" label="Nombre del titular de la tarjeta"></v-text-field>
        <v-text-field v-model="cardNumber" label="Número de tarjeta"></v-text-field>
        <v-text-field v-model="expirationDate" label="Fecha de vencimiento (MM/YY)"></v-text-field>
        <v-text-field v-model="cvv" label="CVV"></v-text-field>
        <v-btn color="primary" type="submit">Pagar</v-btn>
    </v-form>
</template>
  
<script>
export default {
    data() {
        return {
            cardHolderName: '',
            cardNumber: '',
            expirationDate: '',
            cvv: ''
        }
    },
    methods: {
        processPayment() {
            // Lógica para procesar el pago
        }
    }
}
</script>