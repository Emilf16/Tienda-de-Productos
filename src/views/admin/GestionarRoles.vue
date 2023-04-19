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
                        <h1 class="pageTitle">Perfiles y Roles</h1>
                        <div>
                            <DataTable ref="dt" v-model:expandedRows="expandedRows"  v-model:filters="filters" :value="perfiles" showGridlines resizableColumns columnResizeMode="fit" removableSort tableStyle="min-width: 50rem" paginator :rows="10" dataKey="id" :loading="loading">
                                <template #header>
                                    <div class="flex justify-content-between">
                                        <Button icon="pi pi-external-link" label="Exportar" severity="warning" @click="exportCSV($event)" >
                                            <span class="pi pi-external-link p-button-icon p-button-icon-left"></span>
                                            <span class="p-button-label">Exportar</span>
                                            <v-tooltip
                                                activator="parent"
                                                location="top"
                                                >Exportar en Excel</v-tooltip>
                                        </Button>
                                        <span class="p-input-icon-left">
                                            <i class="pi pi-search" />
                                            <InputText v-model="filters['global'].value" placeholder="Buscar..." />
                                        </span>
                                    </div>
                                </template>
                                <Column field="idPerfil" header="# de Perfil" sortable ></Column>
                                <Column field="Nombre" header="Nombre" sortable />
                                <Column field="Descripcion" header="Descripcion" sortable />
                                <Column field="CantPermisos" header="Cant. Permisos" sortable style="width: 6rem">
                                    <template #body="{ data }" >
                                        <Badge  :value="data.CantPermisos" severity="warning" />
                                    </template>
                                </Column>
                                <Column field="PorDefecto" header="Por Defecto" sortable >
                                    <template #body="{ data }">
                                        <i className="pi pi-check" v-if="data.PorDefecto" />
                                    </template>
                                </Column>
                                <Column styleClass="col-icon" :expander="true" style="width: 5rem">
                                    <template #body="{ data }">
                                        <Button icon="pi pi-user-edit" rounded text style="color:black; font-weight:bold" @click="showDetails(data.idPerfil)" class="text-center">
                                            <span class="pi pi-user-edit p-button-icon"></span>
                                            <v-tooltip
                                            activator="parent"
                                            location="top"
                                            >Editar perfil</v-tooltip>
                                        </Button>
                                        <Dialog v-model:visible="detailsVisible" header="Editar perfil" :style="{ width: '75vw' }" maximizable modal :contentStyle="{ height: '300px' }">
                                            <template #body>
                                                <PickList v-model="products" listStyle="height:342px" dataKey="id">
                                                    <template #sourceheader> Available </template>
                                                    <template #targetheader> Selected </template>
                                                    <template #item="slotProps">
                                                        <div class="flex flex-wrap p-2 align-items-center gap-3">
                                                            <img class="w-4rem shadow-2 flex-shrink-0 border-round" :src="'https://primefaces.org/cdn/primevue/images/product/' + slotProps.item.image" :alt="slotProps.item.name" />
                                                            <div class="flex-1 flex flex-column gap-2">
                                                                <span class="font-bold">{{ slotProps.item.name }}</span>
                                                                <div class="flex align-items-center gap-2">
                                                                    <i class="pi pi-tag text-sm"></i>
                                                                    <span>{{ slotProps.item.category }}</span>
                                                                </div>
                                                            </div>
                                                            <span class="font-bold text-900">$ {{ slotProps.item.price }}</span>
                                                        </div>
                                                    </template>
                                                </PickList>
                                            </template>
                                            <template #footer>
                                                <Button label="Guardar" icon="pi pi-check" @click="detailsVisible = false" />
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
    import Badge from 'primevue/badge';
    import Button from 'primevue/button'
    import Dialog from 'primevue/dialog'
    import PickList from 'primevue/picklist'
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
            Badge,
            Button,
            Dialog,
            PickList
        },

        data() {
            return {
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
                        title: 'Administración',
                        disabled: true,
                        href: '/',
                    },
                    {
                        title: 'Perfiles y Roles',
                        disabled: true,
                        href: '/gestionarRoles',
                    },
                ],
                pageLoaded: false,
                token: localStorage.getItem('token'),
                actualDetails: {
                    idPedido: 0,
                    Carrito: {
                        Productos: []
                    }
                },
                detailsVisible: false,
                vistas: [],
            }
        },
        mounted() {
            if (!this.pageLoaded) {
                api.get('Account')
                    .then(data => {
                        this.user = data.data.usuario;
                        this.cargarPerfiles();
                        this.pageLoaded = true;
                    })
                    .catch(error => {
                        this.toast.error("Error 500. " + error, this.toastProperties);
                    });
            }
        },
        methods: {
            async cargarPerfiles() {
                try {
                    this.loading = true;

                    const response = await api.get("Perfiles");
                    
                    this.perfiles = response.data;
                    this.loading = false;
                    console.log(this.perfiles);
                } 
                catch (error) {
                    this.toast.error("Error 500. Error al cargar los perfiles.", this.toastProperties);
                }
            },
            exportCSV() {
                this.$refs.dt.exportCSV();
            },
            showDetails(idPerfil){
                const model = this.perfiles.find(item => item.idPerfil === idPerfil);
                this.actualDetails = model;
                this.detailsVisible = true;
            },
        }
    }
</script>