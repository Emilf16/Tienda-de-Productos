<template>
    <v-container fluid id="reporte">
        <v-row>
            <v-col cols="12" lg="8" md="6" sm="12" xs="12">
                <v-card-title> 
                    <div class="d-flex">
  <h1 class="ml-5 mb-15 mt-5" style="left: 600px; top: -25px;">Artículos del Carrito</h1>
</div>
<div class="ml-4" style="position: relative;">
    <div class="d-flex justify-space-between align-center">
  <span style="position: absolute; left: 0; top: -25px; bottom: 5; margin-left: 2%; margin-bottom: 10px; width: 20%;">Producto</span>
  <span style="position: absolute; left: 0; top: -25px; bottom: 5; margin-bottom: 10px; width: 55%; text-align: right; padding-right: -30%;">Precio</span>
  <span style="position: absolute; left: 0; top: -25px; bottom: 5; margin-bottom: 10px; width: 72%; text-align: right; padding-right: -30%;">Cantidad</span>
  <span style="position: absolute; left: 0; top: -25px; bottom: 5; margin-bottom: 10px; width: 85%; text-align: right; padding-right: -30%;">Total</span>
</div>
  <hr class="mt-5" style="position: relative; bottom: -9px; left: 0; right: 0; border-top: 1px solid grey;">
</div>




</v-card-title>
 

                <v-col v-for="(producto, index) in productosCarrito" v-bind:key="index" v-bind:producto="producto"
                    class="ml-5">
                    <v-card color="#ffffff" theme="light" elevation="0" class="ml-0">
                        <div class="d-flex flex-no-wrap">
                            <v-avatar class="mb-5" size="120" rounded="0" cols="9" lg="6" md="6" sm="6" xs="6">
                                <v-img v-bind:src="producto.strCategoryThumb" v-bind:alt="producto.strCategory"></v-img>
                            </v-avatar>
                            <div>
                                <v-col>
                                    <v-card-title class="text-h6 mt-2">
  {{ producto.strCategory }}
</v-card-title>
<v-card-text>
  <v-row class="mx-0 my-4">
    <div style="position: absolute; left: 0; top: 47px; bottom: 3; margin-bottom: 7px; width: 53%; text-align: right; padding-right: -30%;">
      <span style="font-size: large;" class="text-black">$ {{ producto.precio }}</span>
    </div>
    <div style="position: absolute; left: 0; top: 47px; bottom: 3; margin-bottom: 1px; width: 66%; text-align: right; padding-right: -30%;">
      <span style="font-size: large;" class="text-black mt-1">{{ producto.count }}</span>
    </div>
 
    <div style="position: absolute; left: 0; top: 32px; bottom: 5; margin-bottom: 10px; width: 100%; text-align: right; padding-right: -30%;">
        <v-btn @click="removeItem(index)" icon elevation="0" hover-size="0">
  <v-icon left color="#252525">mdi-delete</v-icon>
</v-btn>
</div>
<div style="position: absolute; left: 0; top: 32px; bottom: 5; margin-bottom: 10px; width: 95%; text-align: right; padding-right: -30%;">
        <v-btn icon elevation="0" hover-size="0"
                            @click="agregarNuevoProducto(producto)">
                            <span style="color: #252525; font-weight: bold;">
                                +
                            </span>
                        </v-btn>
</div>
  </v-row>
</v-card-text>
 
                                </v-col>
                               
                            </div>
                            
                        </div>
                    </v-card>
                    <hr class="mt-2" style="border-top: 1px solid grey; width: 98%;">
                </v-col>

            </v-col>
            <v-col cols="12" lg="4" md="6"> 
                <v-btn color="#F7BB44" @click="clearCart" style="margin-top: 10%; margin-left: 61%; margin-bottom: 9%;">
                    <span style="font-weight: bold; color: white;">Vacear Carro</span>
                </v-btn>
                    <v-sheet color="#F0FCFF" elevation="0" class="pa-6 " style="margin-left: 6%; margin-right: 4%;">
                   <v-card-title class="align-center">
                    
                    <h2 class="align-center mt-20px mb-5">Resumen</h2>
 
                        <hr class="border-top-1 border-grey mb-9">
                        <ul>
                            <div class="text-center" style="display: flex; justify-content: space-between;">
                                <span>Total Productos:</span>
                                <span style="text-align: right;">100.00</span>
                            </div>
                            <br>
                            <div class="text-center" style="display: flex; justify-content: space-between;">
                                <span>Envío:</span>
                                <span style="text-align: right;">Gratis</span>
                            </div>
                        </ul>
                        <hr class="border-top-1 border-grey mt-7 mb-7">
                        <div class="text-center" style="display: flex; justify-content: space-between; font-weight: bold;">
                            <span>Total:</span>
                            <span style="text-align: right;">100.00</span>
                        </div>
                    </v-card-title>
                    <v-card-text>

                    </v-card-text>
                    <v-btn color="primary" @click="showPaymentModal()" class="ml-4 d-flex justify-center">Pagar</v-btn>
                </v-sheet>

            </v-col>
        </v-row> 
        
 
        <!-- pagar productos -->
        <v-dialog v-model="checkoutModal" max-width="550">
  <v-card color="#ffffff" theme="light" elevation="0">
    <v-card-text>
      <div class="container d-flex flex-column align-center justify-center">
        <div class="card" style="font-family:'Poppins', sans-serif; height: 260px; width: 350px;">
          <div class="top">
            <h3 class="mb-7 mt-5" style="margin-left: 100px;">Agregar Tarjeta</h3>
            <hr>
          </div>
          <div class="card-details mt-6">
  <span style="margin-right: 17%;">Número</span>
  <input type="text" placeholder="0000 0000 0000 0000" data-slots="0" data-accept="\d" size="19" style="padding-left: 5px; margin-left: 3%;" maxlength="16">
  <i class="fa fa-credit-card"></i>
</div>

          <div class="exp-cvv">
            <div class="card-details mt-4">
              <span style="margin-right: 17%;;">Fecha</span>
              <input type="text" placeholder="MM/YYYY" data-slots="my" size="5" maxlength="3" style="padding-left: 5px; margin-left: 8%;">
              
              <i class="fa fa-calendar"></i>
            </div>
            <div class="card-details mt-4">
  <span style="margin-right: 17%;">CVV</span>
  <input type="text" placeholder="000" data-slots="my" data-accept="\d" size="7" style="padding-left: 5px; margin-left: 13%;" maxlength="3">
  <i class="fa fa-info-circle"></i>
</div>

          </div>
          <div class="card-details mt-4 mb-5">
            <span style="margin-right: 17%; margin-top: 10px;">Nombre</span>
            <input type="text" placeholder="Nombre en tarjeta" style="padding-left: 5px; margin-left: 4%;">            
          </div>
        </div>
      </div>
    </v-card-text>
    <v-card-actions style="margin-top: -10px;">
          <v-spacer></v-spacer>
          <v-btn class="mb-5" color="#BE1D1D" variant="flat" style="margin-left: 20px;" @click="closeCheckout">
            <span style="color:white; font-weight: bold;">
              Cancelar
            </span>
          </v-btn>
          <v-btn class="mb-5" color="#008F39" variant="flat" style="margin-left: 160px;" @click="checkout">
            <span style="color:white; font-weight: bold;">
              Confirmar
            </span>
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
  </v-card>
</v-dialog>
    </v-container>
</template>

<script>
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas';
import VueCreditCardValidation from 'vue-credit-card-validation';
export default {
    // props: ['productosCarrito'],

    data() {
        return {
            verProducto: false,
            productosCarrito: [
                {
                    idCategory: "1",
                    strCategory: "Beef",
                    precio: 30.95,
                    stock: 20,
                    count: 1,
                    strCategoryThumb: "https://www.themealdb.com/images/category/beef.png",
                    strCategoryDescription: "Beef is the culinary name for meat from cattle, particularly skeletal muscle. Humans have been eating beef since prehistoric times.[1] Beef is a source of high-quality protein and essential nutrients.[2]"
                },
                {
                    idCategory: "2",
                    strCategory: "Chicken",
                    precio: 24.80,
                    stock: 12,
                    count: 1,
                    strCategoryThumb: "https://www.themealdb.com/images/category/chicken.png",
                    strCategoryDescription: "Chicken is a type of domesticated fowl, a subspecies of the red junglefowl. It is one of the most common and widespread domestic animals, with a total population of more than 19 billion as of 2011.[1] Humans commonly keep chickens as a source of food (consuming both their meat and eggs) and, more rarely, as pets."
                },
                {
                    idCategory: "3",
                    strCategory: "Dessert",
                    precio: 90.00,
                    stock: 50,
                    count: 1,
                    strCategoryThumb: "https://www.themealdb.com/images/category/dessert.png",
                    strCategoryDescription: "Dessert is a course that concludes a meal. The course usually consists of sweet foods, such as confections dishes or fruit, and possibly a beverage such as dessert wine or liqueur, however in the United States it may include coffee, cheeses, nuts, or other savory items regarded as a separate course elsewhere. In some parts of the world, such as much of central and western Africa, and most parts of China, there is no tradition of a dessert course to conclude a meal.\r\n\r\nThe term dessert can apply to many confections, such as biscuits, cakes, cookies, custards, gelatins, ice creams, pastries, pies, puddings, and sweet soups, and tarts. Fruit is also commonly found in dessert courses because of its naturally occurring sweetness. Some cultures sweeten foods that are more commonly savory to create desserts."
                },
                {
                    idCategory: "4",
                    strCategory: "Lamb",
                    precio: 99.99,
                    stock: 15,
                    count: 1,
                    strCategoryThumb: "https://www.themealdb.com/images/category/lamb.png",
                    strCategoryDescription: "Lamb, hogget, and mutton are the meat of domestic sheep (species Ovis aries) at different ages.\r\n\r\nA sheep in its first year is called a lamb, and its meat is also called lamb. The meat of a juvenile sheep older than one year is hogget; outside the USA this is also a term for the living animal. The meat of an adult sheep is mutton, a term only used for the meat, not the living animals. The term mutton is almost always used to refer to goat meat in the Indian subcontinent.\r\n\r\n"
                },
                {
                    idCategory: "5",
                    strCategory: "Miscellaneous",
                    precio: 99.99,
                    stock: 15,
                    count: 1,
                    strCategoryThumb: "https://www.themealdb.com/images/category/miscellaneous.png",
                    strCategoryDescription: "General foods that don't fit into another category"
                },
                {
                    idCategory: "6",
                    strCategory: "Pasta",
                    precio: 99.99,
                    stock: 15,
                    count: 1,
                    strCategoryThumb: "https://www.themealdb.com/images/category/pasta.png",
                    strCategoryDescription: "Pasta is a staple food of traditional Italian cuisine, with the first reference dating to 1154 in Sicily.\r\n\r\nAlso commonly used to refer to the variety of pasta dishes, pasta is typically a noodle made from an unleavened dough of a durum wheat flour mixed with water or eggs and formed into sheets or various shapes, then cooked by boiling or baking. As an alternative for those wanting a different taste, or who need to avoid products containing gluten, some pastas can be made using rice flour in place of wheat.[3][4] Pastas may be divided into two broad categories, dried (pasta secca) and fresh (pasta fresca)."
                },
                {
                    idCategory: "7",
                    strCategory: "Pork",
                    precio: 99.99,
                    stock: 15,
                    count: 1,
                    strCategoryThumb: "https://www.themealdb.com/images/category/pork.png",
                    strCategoryDescription: "Pork is the culinary name for meat from a domestic pig (Sus scrofa domesticus). It is the most commonly consumed meat worldwide,[1] with evidence of pig husbandry dating back to 5000 BC. Pork is eaten both freshly cooked and preserved. Curing extends the shelf life of the pork products. Ham, smoked pork, gammon, bacon and sausage are examples of preserved pork. Charcuterie is the branch of cooking devoted to prepared meat products, many from pork.\r\n\r\nPork is the most popular meat in Eastern and Southeastern Asia, and is also very common in the Western world, especially in Central Europe. It is highly prized in Asian cuisines for its fat content and pleasant texture. Consumption of pork is forbidden by Jewish and Muslim dietary law, a taboo that is deeply rooted in tradition, with several suggested possible causes. The sale of pork is limited in Israel and illegal in certain Muslim countries."
                },
                {
                    idCategory: "8",
                    strCategory: "Seafood",
                    precio: 99.99,
                    stock: 15,
                    count: 1,
                    strCategoryThumb: "https://www.themealdb.com/images/category/seafood.png",
                    strCategoryDescription: "Seafood is any form of sea life regarded as food by humans. Seafood prominently includes fish and shellfish. Shellfish include various species of molluscs, crustaceans, and echinoderms. Historically, sea mammals such as whales and dolphins have been consumed as food, though that happens to a lesser extent in modern times. Edible sea plants, such as some seaweeds and microalgae, are widely eaten as seafood around the world, especially in Asia (see the category of sea vegetables). In North America, although not generally in the United Kingdom, the term \"seafood\" is extended to fresh water organisms eaten by humans, so all edible aquatic life may be referred to as seafood. For the sake of completeness, this article includes all edible aquatic life."
                },
                {
                    idCategory: "9",
                    strCategory: "Side",
                    precio: 150.00,
                    stock: 5,
                    count: 1,
                    strCategoryThumb: "https://www.themealdb.com/images/category/side.png",
                    strCategoryDescription: "A side dish, sometimes referred to as a side order, side item, or simply a side, is a food item that accompanies the entrée or main course at a meal. Side dishes such as salad, potatoes and bread are commonly used with main courses throughout many countries of the western world. New side orders introduced within the past decade[citation needed], such as rice and couscous, have grown to be quite popular throughout Europe, especially at formal occasions (with couscous appearing more commonly at dinner parties with Middle Eastern dishes)."
                },
                {
                    idCategory: "10",
                    strCategory: "Starter",
                    precio: 79.99,
                    stock: 10,
                    count: 1,
                    strCategoryThumb: "https://www.themealdb.com/images/category/starter.png",
                    strCategoryDescription: "An entrée in modern French table service and that of much of the English-speaking world (apart from the United States and parts of Canada) is a dish served before the main course of a meal; it may be the first dish served, or it may follow a soup or other small dish or dishes. In the United States and parts of Canada, an entrée is the main dish or the only dish of a meal.\r\n\r\nHistorically, the entrée was one of the stages of the “Classical Order” of formal French table service of the 18th and 19th centuries. It formed a part of the “first service” of the meal, which consisted of potage, hors d’œuvre, and entrée (including the bouilli and relevé). The “second service” consisted of roast (rôti), salad, and entremets (the entremets sometimes being separated into a “third service” of their own). The final service consisted only of dessert.[3]:3–11 :13–25"
                },
                {
                    idCategory: "11",
                    strCategory: "Vegan",
                    precio: 19.99,
                    stock: 55,
                    count: 1,
                    strCategoryThumb: "https://www.themealdb.com/images/category/vegan.png",
                    strCategoryDescription: "Veganism is both the practice of abstaining from the use of animal products, particularly in diet, and an associated philosophy that rejects the commodity status of animals.[b] A follower of either the diet or the philosophy is known as a vegan (pronounced /ˈviːɡən/ VEE-gən). Distinctions are sometimes made between several categories of veganism. Dietary vegans (or strict vegetarians) refrain from consuming animal products, not only meat but also eggs, dairy products and other animal-derived substances.[c] The term ethical vegan is often applied to those who not only follow a vegan diet but extend the philosophy into other areas of their lives, and oppose the use of animals for any purpose.[d] Another term is environmental veganism, which refers to the avoidance of animal products on the premise that the harvesting or industrial farming of animals is environmentally damaging and unsustainable."
                },
                {
                    idCategory: "12",
                    strCategory: "Vegetarian",
                    precio: 29.99,
                    stock: 35,
                    count: 1,
                    strCategoryThumb: "https://www.themealdb.com/images/category/vegetarian.png",
                    strCategoryDescription: "Vegetarianism is the practice of abstaining from the consumption of meat (red meat, poultry, seafood, and the flesh of any other animal), and may also include abstention from by-products of animal slaughter.\r\n\r\nVegetarianism may be adopted for various reasons. Many people object to eating meat out of respect for sentient life. Such ethical motivations have been codified under various religious beliefs, as well as animal rights advocacy. Other motivations for vegetarianism are health-related, political, environmental, cultural, aesthetic, economic, or personal preference. There are variations of the diet as well: an ovo-lacto vegetarian diet includes both eggs and dairy products, an ovo-vegetarian diet includes eggs but not dairy products, and a lacto-vegetarian diet includes dairy products but not eggs. A vegan diet excludes all animal products, including eggs and dairy. Some vegans also avoid other animal products such as beeswax, leather or silk clothing, and goose-fat shoe polish."
                },
                {
                    idCategory: "13",
                    strCategory: "Breakfast",
                    precio: 59.99,
                    stock: 45,
                    count: 1,
                    strCategoryThumb: "https://www.themealdb.com/images/category/breakfast.png",
                    strCategoryDescription: "Breakfast is the first meal of a day. The word in English refers to breaking the fasting period of the previous night. There is a strong likelihood for one or more \"typical\", or \"traditional\", breakfast menus to exist in most places, but their composition varies widely from place to place, and has varied over time, so that globally a very wide range of preparations and ingredients are now associated with breakfast."
                },
                {
                    idCategory: "14",
                    strCategory: "Goat",
                    precio: 89.99,
                    stock: 34,
                    count: 1,
                    strCategoryThumb: "https://www.themealdb.com/images/category/goat.png",
                    strCategoryDescription: "The domestic goat or simply goat (Capra aegagrus hircus) is a subspecies of C. aegagrus domesticated from the wild goat of Southwest Asia and Eastern Europe. The goat is a member of the animal family Bovidae and the subfamily Caprinae, meaning it is closely related to the sheep. There are over 300 distinct breeds of goat. Goats are one of the oldest domesticated species of animal, and have been used for milk, meat, fur and skins across much of the world. Milk from goats is often turned into goat cheese."
                }],
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
            incrementCount(index) {
                this.productosCarrito[index].count++;
            },
            margins: {
                top: 80,
                bottom: 60,
                left: 40,
                width: 522
            },
            state() {
                return {
                    productosCarrito: []
                }

            } 
            const Example ={ 
    
}
        }
    }; 
    }, computed: {

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
            this.incrementCount(producto.index)
            this.productosCarrito.push(producto)
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