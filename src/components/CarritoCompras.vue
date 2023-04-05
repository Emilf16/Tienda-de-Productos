<template>
    <v-container fluid id="reporte">
        <v-row>
            <v-col cols="12" lg="8" md="6" sm="12" xs="12">
                <v-card-title>
                    <h2 class="headline">Productos seleccionados</h2>
                </v-card-title>
                <v-col v-for="(producto, index) in productosCarrito" v-bind:key="index" v-bind:producto="producto"
                    class="pa-0 mb-3">
                    <v-card color="#ffffff" theme="light" elevation="4">
                        <div class="d-flex flex-no-wrap  ">
                            <v-avatar class="ma-4" size="180" rounded="0" cols="12" lg="12" md="12" sm="12" xs="12">

                                <v-img v-bind:src="producto.strCategoryThumb" v-bind:alt="producto.strCategory"></v-img>
                            </v-avatar>
                            <div>
                                <v-col>
                                    <v-card-title class="text-h5">
                                        {{ producto.strCategory }}
                                    </v-card-title>


                                    <v-card-text>

                                        <v-row align="center" class="mx-0 my-6">
                                            <v-rating :model-value="producto.valoracion" color="amber" density="compact"
                                                half-increments readonly size="small"></v-rating>

                                            <div class="text-grey ms-4">
                                                {{ producto.valoracion }} (413)
                                            </div>
                                        </v-row>
                                        <span style="  font-weight: bold; font-size: large;" class="text-black mt-1">
                                            RD${{ producto.precio }}
                                        </span>
                                    </v-card-text>
                                    <v-card-text>Cantidad: {{ 3 }}</v-card-text>
                                    <v-card-actions>
                                        <v-btn color="#BE1D1D" variant="flat" text @click="removeItem(index)">
                                            <span style="color: white; font-weight: bold;">Eliminar</span> </v-btn>

                                        <v-btn color="blue" variant="flat" style="color: white; font-weight: bold;" text
                                            @click="calcularCantidad(producto)"> Ver </v-btn>
                                        <v-btn color="#FFC107" variant="flat" text @click="agregarNuevoProducto(producto)">
                                            <span style="color: white; font-weight: bold;">Agregar</span></v-btn>

                                    </v-card-actions>
                                </v-col>
                            </div>
                        </div>
                    </v-card>
                </v-col>

            </v-col>
            <v-col cols="12" lg="4" md="6">
                <v-card-title>
                    <h2 class="headline">Resumen de compra</h2>
                </v-card-title>
                <v-card elevation="4">
                    <v-card-text>
                        <v-list dense>
                            <v-list-item v-for="producto in productosCarrito" :key="producto.idCategory">
                                <v-list-item-content>
                                    <v-list-item-title>{{ producto.strCategory }}</v-list-item-title>
                                    <v-list-item-subtitle>{{ producto.idCategory }}</v-list-item-subtitle>
                                    <v-list-item-subtitle>{{ producto.precio }}</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                        <span>Total: 100.00</span>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="primary" @click="showPaymentModal">Pagar</v-btn>
                    </v-card-actions>
                </v-card>
                <v-btn class="mt-9" @click="clearCart">Vaciar carrito</v-btn>
            </v-col>
        </v-row>

        <!-- ver producto -->
        <v-dialog v-model="verProducto">
            <v-card>
                <v-card-title>Procesar pago</v-card-title>
                <v-card-text>
                    <v-form ref="form" v-model="valid">
                        <v-text-field label="Nombre en la tarjeta" v-model="cardHolderName" :rules="nameRules"
                            required></v-text-field>
                        <v-text-field label="Número de tarjeta" v-model="cardNumber" :rules="numberRules"
                            required></v-text-field>
                        <v-text-field label="Fecha de expiración (MM/YY)" v-model="expirationDate" :rules="dateRules"
                            required></v-text-field>
                        <v-text-field label="CVV" v-model="cvv" :rules="cvvRules" required></v-text-field>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="primary" @click="checkout">
                        Procesar pago
                    </v-btn>
                    <v-btn @click="cerrarProductoModal">Cancelar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- pagar productos -->
        <v-dialog v-model="checkoutModal">
            <v-card>
                <v-card-title>Procesar pago</v-card-title>
                <v-card-text>
                    <v-form ref="form" v-model="valid">
                        <v-text-field label="Nombre en la tarjeta" v-model="cardHolderName" :rules="nameRules"
                            required></v-text-field>
                        <v-text-field label="Número de tarjeta" v-model="cardNumber" :rules="numberRules"
                            required></v-text-field>
                        <v-text-field label="Fecha de expiración (MM/YY)" v-model="expirationDate" :rules="dateRules"
                            required></v-text-field>
                        <v-text-field label="CVV" v-model="cvv" :rules="cvvRules" required></v-text-field>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="primary" @click="checkout">
                        Procesar pago
                    </v-btn>
                    <v-btn @click="closeCheckout">Cancelar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>
  
<script>
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas';
export default {
    // props: ['productosCarrito'],

    data() {
        return {
            verProducto: false,
            // productosCarrito: [{
            //     "precio": 23.95,
            //     "valoracion": 4.3,
            //     "idCategory": "1",
            //     "strCategory": "Beef",
            //     "strCategoryThumb": "https://www.themealdb.com/images/category/beef.png",
            //     "strCategoryDescription": "Beef is the culinary name for meat from cattle, particularly skeletal muscle. Humans have been eating beef since prehistoric times.[1] Beef is a source of high-quality protein and essential nutrients.[2]"
            // }, {
            //     "precio": 50.00,
            //     "valoracion": 2.5,
            //     "idCategory": "3",
            //     "strCategory": "Dessert",
            //     "strCategoryThumb": "https://www.themealdb.com/images/category/dessert.png",
            //     "strCategoryDescription": "Dessert is a course that concludes a meal. The course usually consists of sweet foods, such as confections dishes or fruit, and possibly a beverage such as dessert wine or liqueur, however in the United States it may include coffee, cheeses, nuts, or other savory items regarded as a separate course elsewhere. In some parts of the world, such as much of central and western Africa, and most parts of China, there is no tradition of a dessert course to conclude a meal.\r\n\r\nThe term dessert can apply to many confections, such as biscuits, cakes, cookies, custards, gelatins, ice creams, pastries, pies, puddings, and sweet soups, and tarts. Fruit is also commonly found in dessert courses because of its naturally occurring sweetness. Some cultures sweeten foods that are more commonly savory to create desserts."
            // }, {
            //     "precio": 128.95,
            //     "valoracion": 5.0,
            //     "idCategory": "4",
            //     "strCategory": "Lamb",
            //     "strCategoryThumb": "https://www.themealdb.com/images/category/lamb.png",
            //     "strCategoryDescription": "Lamb, hogget, and mutton are the meat of domestic sheep (species Ovis aries) at different ages.\r\n\r\nA sheep in its first year is called a lamb, and its meat is also called lamb. The meat of a juvenile sheep older than one year is hogget; outside the USA this is also a term for the living animal. The meat of an adult sheep is mutton, a term only used for the meat, not the living animals. The term mutton is almost always used to refer to goat meat in the Indian subcontinent.\r\n\r\n"
            // }, {
            //     "precio": 45.95,
            //     "valoracion": 3.0,
            //     "idCategory": "5",
            //     "strCategory": "Miscellaneous",
            //     "strCategoryThumb": "https://www.themealdb.com/images/category/miscellaneous.png",
            //     "strCategoryDescription": "General foods that don't fit into another category"
            // }, {
            //     "precio": 23.95,
            //     "valoracion": 4.3,
            //     "idCategory": "1",
            //     "strCategory": "Beef",
            //     "strCategoryThumb": "https://www.themealdb.com/images/category/beef.png",
            //     "strCategoryDescription": "Beef is the culinary name for meat from cattle, particularly skeletal muscle. Humans have been eating beef since prehistoric times.[1] Beef is a source of high-quality protein and essential nutrients.[2]"
            // }, {
            //     "precio": 23.95,
            //     "valoracion": 4.3,
            //     "idCategory": "1",
            //     "strCategory": "Beef",
            //     "strCategoryThumb": "https://www.themealdb.com/images/category/beef.png",
            //     "strCategoryDescription": "Beef is the culinary name for meat from cattle, particularly skeletal muscle. Humans have been eating beef since prehistoric times.[1] Beef is a source of high-quality protein and essential nutrients.[2]"
            // },],
            cardHolderName: '',
            cardNumber: '',
            expirationDate: '',
            cvv: '',
            selectedItems: [
            ],
            valid: {
                cardHolderName: true,
                cardNumber: true,
                expirationDate: true,
                cvv: true
            }, nameRules: [
                v => !!v || 'El nombre en la tarjeta es requerido',
                v => /^[a-zA-Z\s]*$/.test(v) || 'Solo se permiten letras y espacios'
            ],
            numberRules: [
                v => !!v || 'El número de tarjeta es requerido',
                v => /^\d{16}$/.test(v) || 'El número de tarjeta debe ser de 16 dígitos'
            ],
            dateRules: [
                v => !!v || 'La fecha de expiración es requerida',
                v => /^(0[1-9]|1[0-2])\/\d{2}$/.test(v) || 'La fecha de expiración debe tener el formato MM/YY'
            ],
            cvvRules: [
                v => !!v || 'El CVV es requerido',
                v => /^\d{3}$/.test(v) || 'El CVV debe ser de 3 dígitos'
            ],
            checkoutModal: false,
            items: [
                {
                    name: 'Producto 1',
                    price: '$100.00',
                    image: 'https://via.placeholder.com/150x150',
                },
                {
                    name: 'Producto 2',
                    price: '$50.00',
                    image: 'https://via.placeholder.com/150x150',
                },
                {
                    name: 'Producto 3',
                    price: '$75.00',
                    image: 'https://via.placeholder.com/150x150',
                },
            ],
            margins: {
                top: 80,
                bottom: 60,
                left: 40,
                width: 522
            },
        };
    }, computed: {
        productosCarrito() {
            return this.$store.state.productosCarrito
        },
        // calcularPrecioTotal() {
        //     var precioTotal = this.productosCarrito.reduce((total, productosCarrito) => total + productosCarrito.idCategory, 0);
        //     return precioTotal.toFixed(2);
        // }

    },
    methods: {

        imprimirRecibo() {
            const section = document.querySelector('#reporte');
            html2canvas(section).then(canvas => {
                const imgData = canvas.toDataURL('assets/Logo_Tienda.png');
                const pdf = new jsPDF();
                pdf.addImage(imgData, 'PNG', 10, 10);
                pdf.save('reporte.pdf');
            });

        },
        agregarNuevoProducto(producto) {
            this.$store.commit('agregarNuevoProducto', producto)
            console.log(this.$store.state.productosCarrito)

        },
        cerrarProductoModal() {
            this.verProducto = false;

        },
        verProductoModal() {
            this.verProducto = true;

        },
        calcularCantidad(producto) {
            this.verProductoModal();
            console.log(producto);
        },
        removeItem(index) {
            this.productosCarrito.splice(index, 1);

        },
        clearCart() {
            this.items = [];
            this.selectedItems = [];
            this.productosCarrito = [];
        },
        processPayment() {
            // Lógica para procesar el pago
        },
        showPaymentModal() {
            this.checkoutModal = true;
        },
        closeCheckout() {
            this.checkoutModal = false;

        },
        checkout() {
            this.imprimirRecibo();
            this.$refs.form.validate().then(valid => {
                if (valid) {
                    // Procesar el pago...
                    this.$refs.form.resetValidation()
                    this.items = [];
                    this.closeCheckout()
                    this.productosCarrito = []
                    alert("Pago procesado correctamente");
                }
            })
        },
    },
};
</script>