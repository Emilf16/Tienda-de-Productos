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

    .pi { 
        font-family: PrimeIcons !important;  
    }

    .picklistName {
        font-size: 14px;
    }

    .picklistURL {
        color: #a7a7a7;
        font-size: small;
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
                        <h1 class="pageTitle">Perfiles y Roles</h1>
                        <InlineMessage v-if="sinGuardar" severity="warn">Hay elementos sin guardar.</InlineMessage>
                        <div>
                            <DataTable ref="dt"  v-model:filters="filters" :value="perfiles" resizableColumns columnResizeMode="fit" removableSort tableStyle="min-width: 50rem" paginator :rows="10" dataKey="id" :loading="loading">
                                <template #empty> No se han encontrado perfiles. </template>
                                <template #header>
                                    <div class="flex justify-content-between">
                                        <div>
                                            <Button icon="pi pi-external-link" style="margin: 0px 5px" label="Exportar" severity="warning" @click="exportCSV($event)" >
                                                <span class="pi pi-external-link p-button-icon p-button-icon-left"></span>
                                                <span class="p-button-label">Exportar</span>
                                                <v-tooltip
                                                    activator="parent"
                                                    location="top"
                                                    >Exportar en Excel</v-tooltip>
                                            </Button>
                                            <Button icon="pi pi-external-link" style="margin: 0px 5px" label="Exportar" severity="primary" @click="newProfile()" >
                                                <span class="pi pi-plus p-button-icon"></span>
                                                <span class="p-button-label">&nbsp;</span>
                                                <v-tooltip
                                                    activator="parent"
                                                    location="top"
                                                    >Nuevo perfil</v-tooltip>
                                            </Button>
                                        </div>
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
                                            <div class="d-flex justify-content-between" style="margin: 0px 10px;">
                                                <div class="flex flex-column gap-2 p-2" style="width: 70%">
                                                    <label class="font-bold" for="nombre">Nombre del perfil:</label>
                                                    <InputText id="nombre" v-model="actualDetails.Nombre" aria-describedby="username-help" />
                                                </div>
                                                <div class="d-flex flex-column gap-2 p-2">
                                                    <label class="font-bold" for="PorDefecto">Por defecto:</label>
                                                    <InputSwitch id="PorDefecto" v-model="actualDetails.PorDefecto" />
                                                </div>
                                            </div>
                                            
                                            <div class="flex flex-column gap-2 p-2" style="margin: 0px 10px;">
                                                <label class="font-bold" for="descripcion">Descripción del perfil:</label>
                                                <Textarea id="nombre" v-model="actualDetails.Descripcion" autoResize rows="5" />
                                            </div>
                                            
                                            <div class="flex flex-column gap-2 p-2" style="margin: 0px 10px;">
                                                <label class="font-bold" for="Permisos">Permisos:</label>

                                                <PickList id ="Permisos" v-model="vistasDisponibles" dataKey="idVista">
                                                    <template #sourceheader> Disponibles </template>
                                                    <template #targetheader> Seleccionados </template>
                                                    <template #item="slotProps">
                                                        <div class="flex flex-wrap align-items-center">
                                                            <div class="flex-1 flex flex-column">
                                                                <span class="picklistName">{{ slotProps.item.Vista }}</span>
                                                                <div class="flex align-items-center">
                                                                    <span class="picklistURL">{{ slotProps.item.URL }}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </template>
                                                </PickList>
                                            </div>
                                        </v-form>
                                    </div>
                                    
                                    
                                    <template #footer>
                                        <Button label="Guardar" icon="pi pi-save" @click="saveEditingProfile(actualDetails, vistasDisponibles[1])" />
                                    </template>
                                </Dialog>

                                <Dialog v-model:visible="perfilNewVisible" header="Nuevo perfil" :style="{ width: '60vw' }" maximizable modal>
                                    <div class="dialogContent">
                                        <v-form ref="form">
                                            <div class="d-flex justify-content-between" style="margin: 0px 10px;">
                                                <div class="flex flex-column gap-2 p-2" style="width: 70%">
                                                    <label class="font-bold" for="nombre">Nombre del perfil:</label>
                                                    <InputText id="nombre" v-model="actualNew.Nombre" aria-describedby="username-help" />
                                                </div>
                                                <div class="d-flex flex-column gap-2 p-2">
                                                    <label class="font-bold" for="PorDefecto">Por defecto:</label>
                                                    <InputSwitch id="PorDefecto" v-model="actualNew.PorDefecto" />
                                                </div>
                                            </div>
                                            
                                            <div class="flex flex-column gap-2 p-2" style="margin: 0px 10px;">
                                                <label class="font-bold" for="descripcion">Descripción del perfil:</label>
                                                <Textarea id="nombre" v-model="actualNew.Descripcion" autoResize rows="5" />
                                            </div>
                                            
                                            <div class="flex flex-column gap-2 p-2" style="margin: 0px 10px;">
                                                <label class="font-bold" for="Permisos">Permisos:</label>

                                                <PickList id ="Permisos" v-model="vistasDisponibles" dataKey="idVista">
                                                    <template #sourceheader> Disponibles </template>
                                                    <template #targetheader> Seleccionados </template>
                                                    <template #item="slotProps">
                                                        <div class="flex flex-wrap align-items-center">
                                                            <div class="flex-1 flex flex-column">
                                                                <span class="picklistName">{{ slotProps.item.Vista }}</span>
                                                                <div class="flex align-items-center">
                                                                    <span class="picklistURL">{{ slotProps.item.URL }}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </template>
                                                </PickList>
                                            </div>
                                        </v-form>
                                    </div>
                                    
                                    <template #footer>
                                        <Button label="Guardar" icon="pi pi-save" @click="saveNewProfile(actualNew, vistasDisponibles[1])" />
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
    import InlineMessage from 'primevue/inlinemessage'
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
            Textarea,
            InlineMessage
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
                perfilDetailsVisible: false,
                perfilNewVisible: false,
                vistasDisponibles: [],
                vistas: [],
                perfiles: [],
                actualDetails: {},
                actualNew: {},
                vistasAsignadas: [],
                vistasSeleccionadas: [],    
                sinGuardar: false,
            }
        },
        watch: {
            actualDetails: {
                handler(newVal) {
                    // Comprueba si los objetos dentro del array perfiles son diferentes a los objetos dentro de actualDetails
                    const perfilesDiferentes = this.perfiles.filter(perfil => {
                    for (let key in newVal) {
                        if (Object.prototype.hasOwnProperty.call(newVal, key)) {
                        for (let subKey in newVal[key]) {
                            if (Object.prototype.hasOwnProperty.call(newVal[key], subKey)) {
                            if (JSON.stringify(perfil) === JSON.stringify(newVal[key][subKey])) {
                                return false;
                            }
                            }
                        }
                        }
                    }
                    return true;
                    });
                    if (perfilesDiferentes.length === this.perfiles.length) {
                    this.sinGuardar = true;
                    } else {
                    this.sinGuardar = false;
                    }
                },
                deep: true
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
                    
                    this.vistas = Object.assign(response.data);
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

                if (model.Vistas != null) {
                    this.vistasDisponibles[0] = model.Vistas.filter(x => x.Permiso == false);
                    this.vistasDisponibles[1] = model.Vistas.filter(x => x.Permiso == true);
                }

                Object.assign(this.actualDetails, model);
                this.perfilDetailsVisible = true;
            },
            newProfile() {
                this.vistasDisponibles[0] = this.vistas;
                this.vistasDisponibles[1] = [];

                this.perfilNewVisible = true;
            },
            saveEditingProfile(model, vistas) {
                this.loading = true;
                
                if (vistas.length == 0) {
                    model.Vistas = null;
                }
                else {
                    for (let i = 0; i < vistas.length; i++) {
                        vistas[i].Permiso = true;
                    }

                    model.Vistas = vistas;
                }
                
                console.log(model);

                try {
                    api.put('Perfiles?idPerfil=' + model.idPerfil, model)
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
                }

                catch (error) {
                    this.loading = false;
                    console.log(error);
                    this.toast.error("Error 500. Error al realizar la operación.", this.$store.state.defaultToastOptions);
                }     

                this.loading = false;
                this.perfilDetailsVisible = false;
            },
            saveNewProfile(model, vistas) {
                this.loading = true;

                for (let i = 0; i < vistas.length; i++) {
                    vistas[i].Permiso = true;
                }

                model.Vistas = vistas;
                console.log(model);

                try {
                    api.post('Perfiles', model)
                        .then(response => {
                            console.log(response);
                            if (response.data.Success) {
                                this.toast.success(response.data.Message, this.$store.state.defaultToastOptions);
                            }
                            else {
                                console.log(response.data);
                                this.toast.warning(response.data.Message, this.$store.state.defaultToastOptions);
                            }
                        })
                }

                catch (error) {
                    this.loading = false;
                    console.log(error);
                    this.toast.error("Error 500. Error al realizar la operación.", this.$store.state.defaultToastOptions);
                }     

                this.loading = false;
                this.perfilNewVisible = false;
                this.cargarPerfiles();
            },
        }
    }
</script>