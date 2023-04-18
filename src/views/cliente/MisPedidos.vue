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
    .content{
        padding: 1%;
    }
    .pageTitle {
        font-size: 150% !important;
    }
</style>

<template>
    <v-container fluid class="mainContainer">
        <v-breadcrumbs :items="breadCrumb">
            <template v-slot:prepend>
            <v-icon size="small" icon="mdi-home"></v-icon>
            </template>
        </v-breadcrumbs>
        
        <v-row class="rowContainer">
            <v-col cols="12" sm="12" lg="12" class="colsContainer">
                <div class="containerCols">
                    <div class="content">
                        <h1 class="pageTitle">Mis pedidos</h1>
                        <template>
                            <v-table :columns="columns" :table-data="tableData" />
                        </template>
                    </div>  
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>


<script>
    import { useToast } from "vue-toastification";
    import api from "../../utilities/api"

    export default {
        setup() {
            const toast = useToast();
            return { toast }
        },


        data() {
            return {
                toastProperties: this.$store.state.defaultToastProperties,
                breadCrumb: [
                    {
                        title: 'Home',
                        disabled: false,
                        href: '/',
                    },
                    {
                        title: 'Mis pedidos',
                        disabled: true,
                        href: 'Mis',
                    },
                ],
                pageLoaded: false,
                token: localStorage.getItem('token'),
                user: {},
                pedidos: [],
                loading: false,
                
                columns: [
                { field: "name", key: "a", title: "Name", align: "center" },
                { field: "date", key: "b", title: "Date", align: "left" },
                { field: "hobby", key: "c", title: "Hobby", align: "right" },
                { field: "address", key: "d", title: "Address", align: "left" }
                ],
                tableData: [
                {
                    name: "John",
                    date:"1900-05-20",
                    hobby: "coding and coding repeat",
                    address: "No.1 Century Avenue, Shanghai",
                },
                {
                    name: "Dickerson",
                    date:"1910-06-20",
                    hobby: "coding and coding repeat",
                    address: "No.1 Century Avenue, Beijing",
                },
                {
                    name: "Larsen",
                    date:"2000-07-20",
                    hobby: "coding and coding repeat",
                    address: "No.1 Century Avenue, Chongqing",
                },
                {
                    name: "Geneva",
                    date:"2010-08-20",
                    hobby: "coding and coding repeat",
                    address: "No.1 Century Avenue, Xiamen",
                },
                {
                    name: "Jami",
                    date:"2020-09-20",
                    hobby: "coding and coding repeat",
                    address: "No.1 Century Avenue, Shenzhen",
                },
                ],
            }
        },
        mounted() {
            if (!this.pageLoaded) {
                api.get('Account')
                    .then(data => {
                        this.user = data.data.usuario;
                        this.cargarPedidos();
                        this.pageLoaded = true;
                    })
                    .catch(error => {
                        this.toast.error("Error 500. " + error, this.toastProperties);
                    });
            }
        },
        methods: {
            async cargarPedidos() {
                try {
                    this.loading = true;

                    const response = await api.get("Pedidos/GetPedidosUsuarios?idUsuario=" + this.user.idUsuario);
                    
                    console.log(response);
                    this.pedidos = response.data;
                    this.loading = false;
                    
                    console.log(this.pedidos);
                    // this.toast.success(response.data.Message, this.toastProperties);
                } 
                catch (error) {
                    this.toast.error("Error 500. Error al cargar los pedidos.", this.toastProperties);
                }
            },
        },
    }
</script>