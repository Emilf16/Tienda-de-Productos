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
                            <DataTable ref="dt"  v-model:filters="filters" :value="perfiles" resizableColumns columnResizeMode="fit" removableSort tableStyle="min-width: 50rem" paginator :rows="10" dataKey="id" :loading="loading">
                                <template #empty> No se han encontrado perfiles. </template>
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
                                <Column field="Descripcion" header="Descripcion" sortable style="width: 70%"/>
                                <Column field="CantPermisos" header="Cant. Permisos" sortable class="text-center">
                                    <template #body="{ data }" >
                                        <Badge  :value="data.CantPermisos" severity="warning" />
                                    </template>
                                </Column>
                                <Column field="PorDefecto" header="Por Defecto" sortable class="text-center">
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
                                        
                                    </template>
                                </Column>
                                <Dialog v-model:visible="perfilDetailsVisible" header="Editar perfil" :style="{ width: '60vw' }" maximizable modal>
                                    <div class="dialogContent">
                                        <v-form ref="form">
                                            <div class="flex flex-column gap-2 p-2">
                                                <label for="nombre">Nombre del perfil:</label>
                                                <InputText id="nombre" v-model="actualDetails.Nombre" aria-describedby="username-help" />
                                            </div>
                                            <div class="flex flex-column gap-2 p-2">
                                                <label for="descripcion">Descripción del perfil:</label>
                                                <Textarea id="nombre" v-model="actualDetails.Descripcion" autoResize rows="5" />
                                            </div>
                                            <div class="d-flex justify-content-between">
                                                <div class="d-flex flex-column gap-2 p-2">
                                                    <label for="PorDefecto">Perfil por defecto:</label>
                                                    <InputSwitch id="PorDefecto" v-model="actualDetails.PorDefecto" />
                                                </div>
                                                <div class="flex flex-column gap-2 p-2">
                                                    <label for="EstaActivo">Activo:</label>
                                                    <InputSwitch id="EstaActivo" v-model="actualDetails.EstaActivo" />
                                                </div>
                                            </div>
                                            
                                        </v-form>
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
                                        <PickList   
                                            :source="vistasDisponibles"
                                            :target="vistasAsignadas"
                                            :show-source-filter="true"
                                            :show-target-filter="true"
                                            :source-filter-placeholder="'Filtrar disponibles'"
                                            :target-filter-placeholder="'Filtrar asignados'"
                                            :source-header="'Disponibles'"
                                            :target-header="'Asignados'"
                                            :item-value="'idVista'"
                                            :item-label="'Nombre'"
                                            @target-select="eliminarDisponiblesSeleccionados"
                                            @source-select="eliminarAsignadosSeleccionados"
                                            listStyle="height:342px">
                                            <template #sourceheader> Disponibles </template>
                                            <template #targetheader> Asignados </template>
                                            <!-- <template #item="slotProps">
                                                <div class="flex flex-wrap p-2 align-items-center gap-3">
                                                    <div class="flex-1 flex flex-column gap-2">
                                                        <span class="font-bold">{{ slotProps }}</span>
                                                        <div class="flex align-items-center gap-2">
                                                            <i class="pi pi-tag text-sm"></i>
                                                            <span>{{ slotProps }}</span>
                                                        </div>
                                                    </div>
                                                    <span class="font-bold text-900">$ {{ slotProps.item.price }}</span>
                                                </div>
                                            </template> -->
                                        </PickList>
                                    </div>
                                    
                                    
                                    <template #footer>
                                        <Button label="Guardar" icon="pi pi-save" @click="detailsVisible = false" />
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
    import Badge from 'primevue/badge';
    import Button from 'primevue/button'
    import Dialog from 'primevue/dialog'
    import PickList from 'primevue/picklist'
    import InputSwitch from 'primevue/inputswitch'
    import Textarea from 'primevue/textarea'
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
            PickList,
            InputSwitch,
            Textarea
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
                actualDetails: {},
                perfilDetailsVisible: false,
                vistas: [],
                perfiles: [],
                vistasDisponibles: [],
                vistasAsignadas: [],
                vistasSeleccionadas: [],
                sourceCars: ['Audi', 'BMW', 'Fiat', 'Ford', 'Honda', 'Jaguar', 'Mercedes', 'Renault', 'VW'],
                targetCars: [],
                productos: [
                {
                    id: '1000',
                    code: 'f230fh0g3',
                    name: 'Bamboo Watch',
                    description: 'Product Description',
                    image: 'bamboo-watch.jpg',
                    price: 65,
                    category: 'Accessories',
                    quantity: 24,
                    inventoryStatus: 'INSTOCK',
                    rating: 5
                },
                {
                    id: '1001',
                    code: 'nvklal433',
                    name: 'Black Watch',
                    description: 'Product Description',
                    image: 'black-watch.jpg',
                    price: 72,
                    category: 'Accessories',
                    quantity: 61,
                    inventoryStatus: 'INSTOCK',
                    rating: 4
                },
                {
                    id: '1002',
                    code: 'zz21cz3c1',
                    name: 'Blue Band',
                    description: 'Product Description',
                    image: 'blue-band.jpg',
                    price: 79,
                    category: 'Fitness',
                    quantity: 2,
                    inventoryStatus: 'LOWSTOCK',
                    rating: 3
                },
                {
                    id: '1003',
                    code: '244wgerg2',
                    name: 'Blue T-Shirt',
                    description: 'Product Description',
                    image: 'blue-t-shirt.jpg',
                    price: 29,
                    category: 'Clothing',
                    quantity: 25,
                    inventoryStatus: 'INSTOCK',
                    rating: 5
                },
                {
                    id: '1004',
                    code: 'h456wer53',
                    name: 'Bracelet',
                    description: 'Product Description',
                    image: 'bracelet.jpg',
                    price: 15,
                    category: 'Accessories',
                    quantity: 73,
                    inventoryStatus: 'INSTOCK',
                    rating: 4
                },
                {
                    id: '1005',
                    code: 'av2231fwg',
                    name: 'Brown Purse',
                    description: 'Product Description',
                    image: 'brown-purse.jpg',
                    price: 120,
                    category: 'Accessories',
                    quantity: 0,
                    inventoryStatus: 'OUTOFSTOCK',
                    rating: 4
                }]
            }
        },
        mounted() {
            this.loading = true;
            if (!this.pageLoaded) {
                api.get('Account')
                    .then(data => {
                        this.user = data.data.usuario;
                        this.cargarPerfiles();
                        this.cargarVistas();
                        this.pageLoaded = true;
                        this.loading = false;
                    })
                    .catch(error => {
                        this.toast.error("Error 500. " + error, this.toastProperties);
                    });
            }
        },
        methods: {
            async cargarPerfiles() {
                try {
                    const response = await api.get("Perfiles");
                    
                    this.perfiles = response.data;
                } 
                catch (error) {
                    this.toast.error("Error 500. Error al cargar los perfiles.", this.toastProperties);
                }
            },
            async cargarVistas() {
                try {
                    const response = await api.get("Perfiles/GetVistas");
                    
                    this.vistas = response.data;
                    console.log(this.vistas);
                } 
                catch (error) {
                    this.toast.error("Error 500. Error al cargar las vistas.", this.toastProperties);
                }
            },
            exportCSV() {
                this.$refs.dt.exportCSV();
            },
            showDetails(idPerfil) {
                const model = this.perfiles.find(item => item.idPerfil === idPerfil);
                this.actualDetails = model;
                console.log(model);

                if (model.Vistas != null) {
                    console.log(model.Vistas);
                    this.vistasDisponibles = model.Vistas.filter(vista => !vista.Permiso);
                    this.vistasAsignadas = model.Vistas.filter(vista => vista.Permiso);
                    this.vistasSeleccionadas = this.vistasAsignadas;
                    console.log(this.vistasDisponibles, this.vistasAsignadas);
                }
                else{
                    this.vistasDisponibles = this.vistas;
                    this.vistasAsignadas = [];
                }

                this.actualDetails = model;
                this.perfilDetailsVisible = true;
            },
            eliminarDisponiblesSeleccionados() {
                this.vistasDisponibles = this.vistasDisponibles.filter(
                    vista => !this.vistasSeleccionadas.includes(vista)
                );
            },
            eliminarAsignadosSeleccionados() {
            // eliminar las vistas seleccionadas de la lista de asignados
                this.vistasAsignadas = this.vistasAsignadas.filter(
                    vista => !this.vistasSeleccionadas.includes(vista)
                );
            }
        }
    }
</script>