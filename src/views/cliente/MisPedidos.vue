<style>
    @import 'primeicons/primeicons.css';
    
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
        margin: 10px 5px 15px 5px;
    }

    .pi { font-family: PrimeIcons !important;  }
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
                        <div>
                            <DataTable ref="dt" v-model:expandedRows="expandedRows"  v-model:filters="filters" :value="pedidos" resizableColumns columnResizeMode="fit" removableSort tableStyle="min-width: 50rem" paginator :rows="10" dataKey="id" :loading="loading">
                                <template #header>
                                    <div class="flex justify-content-between">
                                        <Button icon="pi pi-external-link" label="Exportar" severity="warning" @click="exportCSV($event)" />
                                        <span class="p-input-icon-left">
                                            <i class="pi pi-search" />
                                            <InputText v-model="filters['global'].value" placeholder="Buscar..." />
                                        </span>
                                    </div>
                                </template>
                                <Column field="idPedido" header="# de Pedido" sortable ></Column>
                                <Column field="Estado" header="Estado" sortable >
                                    <template #body="{ data }">
                                        <Tag :value="data.Estado" :severity="getSeverity(data.Estado)" />
                                    </template>
                                </Column>
                                <Column field="MontoPagado" header="Monto total" sortable>
                                    <template #body="{ data }">
                                        {{formatCurrency(data.MontoPagado)}}
                                    </template>
                                </Column>
                                <Column header="Cantidad de Productos" sortable>
                                    <template #body="{ data }">
                                        {{(data.Carrito.Productos).length}}
                                    </template>
                                </Column>
                                <Column field="Metodo" header="Metodo de Pago" sortable>
                                    <template #body="{ data }">
                                        <div class="flex justify-content-start">
                                            <v-icon size="small" icon="mdi-credit-card-outline" style="margin: 0px 5px"></v-icon>
                                            <span>{{data.Metodo}}</span>
                                        </div>
                                    </template>
                                </Column>
                                <Column field="FechaIngreso" header="Fecha de compra" sortable>
                                    <template #body="{ data }">
                                        {{formatDate(data.FechaIngreso)}}
                                    </template>
                                </Column>
                                <Column field="FechaUltimoEstado" header="Ultimo estado" sortable>
                                    <template #body="{ data }">
                                        {{formatDate(data.FechaUltimoEstado)}}
                                    </template>
                                </Column>
                                <Column styleClass="col-icon" :expander="true" style="width: 5rem">
                                    <template #body="{ data }">
                                        <Button icon="pi pi-eye" text rounded aria-label="Bookmark" @click="showDetails(data.idPedido)"/>
                                        <Dialog v-model:visible="detailsVisible" header="Detalles del pedido" :style="{ width: '75vw' }" maximizable modal :contentStyle="{ height: '300px' }">
                                            <DataTable :value="actualDetails.Carrito.Productos">
                                                <Column field="idProducto" header="ID del Producto" sortable></Column>
                                                <Column field="Nombre" header="Nombre del Producto" sortable></Column>
                                                <Column field="Descripcion" header="Descripción del Producto" sortable></Column>
                                                <Column field="CantidadEnCarrito" header="Cantidad" sortable></Column>
                                                <Column field="Precio" header="Precio" sortable>
                                                    <template #body="{ data }">
                                                        {{formatCurrency(data.Precio)}}
                                                    </template>
                                                </Column>
                                                <Column header="Valoración" sortable>
                                                    <template #body="slotProps" >
                                                        <Rating :modelValue="slotProps.data.Valoracion" readonly :cancel="false" />
                                                    </template>
                                                </Column>
                                            </DataTable>
                                            <template #footer>
                                                <Button label="Ok" icon="pi pi-check" @click="detailsVisible = false" />
                                            </template>
                                        </Dialog>
                                    </template>
                                </Column>
                            </DataTable>
                        </div>
                    </div>  
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>


<script>
    import { useToast } from "vue-toastification";
    import api from "../../utilities/api"
    import DataTable from 'primevue/datatable';
    import InputText from 'primevue/inputtext';
    import Column from 'primevue/column';
    import { FilterMatchMode } from 'primevue/api';
    import Tag from 'primevue/tag';
    import Rating from 'primevue/rating'
    import Button from 'primevue/button'
    import Dialog from 'primevue/dialog'
    import 'primeicons/primeicons.css';

    export default {
        setup() {
            const toast = useToast();
            return { toast }
        },
        
        name: 'MyDataTable',
        components: {
            DataTable,
            Column,
            InputText,
            Tag,
            Rating,
            Button,
            Dialog
        },

        data() {
            return {
                customers: null,
                filters: {
                    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
                    status: { value: null, matchMode: FilterMatchMode.EQUALS },
                },
                statuses: ['En progreso', 'Enviado', 'Entregado', 'Retenido'],
                loading: true,
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
                        href: '/Pedidos',
                    },
                ],
                pageLoaded: false,
                token: localStorage.getItem('token'),
                user: {},
                pedidos: [],
                expandedRows: [],
                actualDetails: {
                    idPedido: 0,
                    Carrito: {
                        Productos: []
                    }
                },
                detailsVisible: false,
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
                    
                    console.log(response.data);
                    this.pedidos = response.data;
                    this.loading = false;
                    
                    console.log(this.pedidos);
                    // this.toast.success(response.data.Message, this.toastProperties);
                } 
                catch (error) {
                    this.toast.error("Error 500. Error al cargar los pedidos.", this.toastProperties);
                }
            },
            formatDate(value) {
                value = new Date(value);
                return value.toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });
            },
            formatCurrency(value) {
                return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
            },
            getSeverity(status) {
                switch (status) {
                    case 'Retenido':
                        return 'danger';

                    case 'Entregado':
                        return 'success';

                    case 'Enviado':
                        return 'info';

                    case 'En espera':
                        return 'warning';

                    case 'Procesando':
                        return null;
                }
            },
            exportCSV() {
                this.$refs.dt.exportCSV();
            },
            expandRow(row) {
                this.expandedRows.push(row);
            },
            collapseRow(row) {
                const index = this.expandedRows.findIndex(r => r === row);
                if (index !== -1) {
                this.expandedRows.splice(index, 1);
                }
            },
            showDetails(idPedido){
                const model = this.pedidos.find(item => item.idPedido === idPedido);
                this.actualDetails.Carrito = model.Carrito;
                this.detailsVisible = true;
            },
        }
    }
</script>