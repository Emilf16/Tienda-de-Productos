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
    <ConfirmDialog></ConfirmDialog>
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
                        <h1 class="pageTitle">Gestionar Pedidos</h1>
                        <div>
                            <DataTable ref="dt" v-model:expandedRows="expandedRows"  v-model:filters="filters" :value="pedidos" 
                            resizableColumns columnResizeMode="fit" removableSort tableStyle="min-width: 50rem" 
                            paginator :rows="10" dataKey="id" :loading="loading"
                            editMode="cell" @cell-edit-init="onCellEditInit" @cell-edit-complete="onCellEditComplete" tableClass="editable-cells-table">
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
                                <Column field="NombreUsuario" header="Usuario" sortable ></Column>
                                <Column field="Estado" header="Estado" sortable style="width: 10%">
                                    <template #editor>
                                        <Dropdown v-model="selectedEstatus" :options="statuses" optionLabel="idEstado" class="w-full">
                                            <template #value="slotProps">
                                                <Tag :value="slotProps.value.Nombre" :icon="getIcon(slotProps.value.Nombre)" :severity="getSeverity(slotProps.value.Nombre)" />
                                            </template>
                                            <template #option="slotProps">
                                                <Tag :value="slotProps.option.Nombre" :icon="getIcon(slotProps.option.Nombre)" :severity="getSeverity(slotProps.option.Nombre)" />
                                            </template>
<!-- 
                                            <template #option="{ option }">
                                                <Tag :value="option.Nombre" :icon="getIcon(option.Nombre)" :severity="getSeverity(option.Nombre)" />
                                            </template> -->
                                        </Dropdown>
                                    </template>
                                    <template #body="{ data }">
                                        <Tag :value="data.Estado" :icon="getIcon(data.Estado)" :severity="getSeverity(data.Estado)" style="cursor: pointer">
                                            <span class="p-tag-value">{{ data.Estado }}</span>
                                            <v-tooltip
                                                activator="parent"
                                                location="top"
                                                >Cambiar estado</v-tooltip>
                                        </Tag>
                                    </template>
                                </Column>
                                <Column field="MontoPagado" header="Monto total" sortable>
                                    <template #body="{ data }">
                                        {{formatCurrency(data.MontoPagado)}}
                                    </template>
                                </Column>
                                <Column header="Cant. de Productos" sortable>
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
                                    </template>
                                </Column>
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
                                        <Column field="Valoracion" header="Valoración" sortable>
                                            <template #body="slotProps" >
                                                <Rating :modelValue="slotProps.data.Valoracion" readonly :cancel="false" />
                                            </template>
                                        </Column>
                                    </DataTable>
                                    <template #footer>
                                        <Button label="Ok" icon="pi pi-check" @click="detailsVisible = false" />
                                    </template>
                                </Dialog>
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
    import Dropdown from 'primevue/dropdown';
    import 'primeicons/primeicons.css';
    import { useConfirm } from "primevue/useconfirm";
    import ConfirmDialog from 'primevue/confirmdialog';

    export default {
        setup() {
            const toast = useToast();
            const confirm = useConfirm();
            return { confirm, toast  }
        },
        
        name: 'MyDataTable',
        components: {
            DataTable,
            Column,
            InputText,
            Tag,
            Rating,
            Button,
            Dialog,
            Dropdown,
            ConfirmDialog
        },

        data() {
            return {
                filters: {
                    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
                    status: { value: null, matchMode: FilterMatchMode.EQUALS },
                },
                statuses: [],
                loading: true,
                toastProperties: this.$store.state.defaultToastProperties,
                breadCrumb: [
                    {
                        title: 'Home',
                        disabled: false,
                        href: '/',
                    },
                    {
                        title: 'Administración',
                        disabled: true,
                        href: '/',
                    },
                    {
                        title: 'Pedidos',
                        disabled: true,
                        href: '/gestionarPedidos',
                    },
                ],
                pageLoaded: false,
                token: localStorage.getItem('token'),
                pedidos: [],
                expandedRows: [],
                actualDetails: {
                    idPedido: 0,
                    Carrito: {
                        Productos: []
                    }
                },
                selectedEstatus: "Procesando",
                detailsVisible: false,
            }
        },
        mounted() {
            if (!this.pageLoaded) {
                this.cargarPedidos();
                this.cargarEstatus();
                this.pageLoaded = true;
            }
        },
        methods: {
            async cargarPedidos() {
                try {
                    this.loading = true;

                    const response = await api.get("Pedidos");
                    
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
            async cargarEstatus() {
                try {
                    this.loading = true;

                    const response = await api.put("Pedidos/GetEstadosProductos");
                    
                    console.log(response.data);
                    this.statuses = response.data;
                    this.loading = false;
                    
                    // this.toast.success(response.data.Message, this.toastProperties);
                } 
                catch (error) {
                    this.toast.error("Error 500. Error al cargar los estatus de los pedidos.", this.toastProperties);
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
                    case 'Cancelado':
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
            getIcon(status) {
                switch (status) {
                    case 'Cancelado':
                        return 'pi pi-times';
                    case 'Entregado':
                        return 'pi pi-check';
                    case 'Enviado':
                        return 'pi pi-envelope';
                    case 'En espera':
                        return 'pi pi-clock';
                    case 'Procesando':
                        return 'pi pi-spinner pi-spin';
                    default:
                        return '';
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
            onEditInit(event) {
                event.cellElement.querySelector('.p-dropdown').click();
            },
            onCellEditInit(event) {
                this.selectedEstatus = this.statuses.find(item => item.idEstado === event.data.idEstado);
                console.log(event);
            },
            onCellEditComplete(event) {
                this.confirmChangeStatus(event);
                
            },
            confirmChangeStatus(event) {
                this.confirm.require({
                    message: '¿Estás seguro de que quieres cambiar el Estado del pedido?',
                    header: 'Confirmación',
                    icon: 'pi pi-exclamation-triangle',
                    accept: () => {
                        this.pedidos[event.index].idEstado = this.selectedEstatus.idEstado;
                        this.pedidos[event.index].Estado = this.selectedEstatus.Nombre;

                        const model = this.pedidos[event.index];

                        api.put('Pedidos/CambiarEstado?idPedido=' + model.idPedido + '&idEstado=' + model.idEstado)
                        .then(response => {
                            console.log(response);
                            if (response.data.Success) {
                                this.sinGuardar = false;
                                this.toast.success(response.data.Message, this.$store.state.defaultToastOptions);
                                this.cargarPerfiles();
                            }
                            else {
                                console.log(response.data);
                                this.toast.warning(response.data.Message, this.$store.state.defaultToastOptions);
                            }
                        })
                    },
                    reject: () => {
                        // reject
                    }
                });
            },
        }
    }
</script>