<template>
    <ion-modal :is-open="props.isOpen" @didDismiss="cerrarModal" :inert="!props.isOpen">
        <ion-page>
            <ion-header>
                <ion-toolbar>
                    <ion-title>Agregar Nuevo Producto</ion-title>
                </ion-toolbar>
            </ion-header>
            <ion-content :scrollY="false" :fullscreen="true">
                <ion-grid class="ion-justify-content-center">
                    <ion-card>
                        <ion-card-content>
                            <form @submit.prevent="handleSubmit">
                                <ion-row>
                                    <ion-col>
                                        <ion-input v-model="form_data.name" fill="outline" label-placement="floating"
                                            label="Nombre del producto" type="text"></ion-input>
                                    </ion-col>
                                </ion-row>

                                <ion-row>
                                    <ion-col>
                                        <ion-input v-model="form_data.price" fill="outline" label-placement="floating"
                                            label="Precio (S/)" type="number"></ion-input>
                                    </ion-col>
                                    <ion-col>
                                        <ion-select v-model="form_data.categories" fill="outline" label="Categorías"
                                            :multiple="true" >
                                            <ion-select-option v-for="(c, i) in CATEGORIES" :key="i" :value="c">
                                                {{ c }}
                                            </ion-select-option>
                                        </ion-select>
                                    </ion-col>
                                </ion-row>
                                <ion-row>
                                    <ion-col>
                                        <ion-input v-model="form_data.quantity" fill="outline"
                                            label-placement="floating" label="Cantidad" type="number"></ion-input>
                                    </ion-col>
                                    <ion-col>
                                        <ion-select v-model="form_data.unidad_medida" fill="outline" label="Unidad de medida"
                                            :multiple="true" >
                                            <ion-select-option v-for="(u, i) in unidadMedidas" :key="i" :value="u">
                                                {{ u }}
                                            </ion-select-option>
                                        </ion-select>
                                    </ion-col>
                                </ion-row>

                                <ion-row>
                                    <ion-col>
                                        <ion-button expand="block" type="submit">Agregar</ion-button>
                                    </ion-col>
                                    <ion-col>
                                        <ion-button expand="block" color="medium" @click="resetForm">Limpiar
                                            formulario</ion-button>
                                    </ion-col>
                                </ion-row>
                            </form>
                        </ion-card-content>
                    </ion-card>
                    <ion-button @click="cerrarModal" class="botonCerrar">Cerrar</ion-button>

                </ion-grid>
            </ion-content>
        </ion-page>
    </ion-modal>
</template>

<script setup lang="ts">
import {
    IonModal,
    IonContent,
    IonButton,
    IonPage,
    IonInput,
    IonCard,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonSelect,
    IonSelectOption,
    IonToolbar,
    IonTitle,
    IonHeader,
    alertController
} from '@ionic/vue';
import { ref, computed, toRaw } from 'vue';
// import { Producto } from '@/services/DatabaseService';
const emit = defineEmits(['cerrar']); // Definiendo los eventos 'cerrar' y 'agregar-producto'
const CATEGORIES = ref<string[]>(['Gaseosas', 'Dulces', 'Galletas', 'Snacks', 'Cervezas', 'Licores']);
const unidadMedidas = ref<string[]>(['Paquete12', 'Paquete10', 'Kilos', 'Gramos']);
const props = defineProps<{ isOpen: boolean }>(); // Definiendo la prop 'isOpen'
const cerrarModal = () => {
    emit('cerrar'); // Emite el evento cuando se cierra el modal
};

interface FormData {
    name: string;
    price: string;
    quantity: string;
    categories: string[];
    unidad_medida: string;
}

// const Formulario = ref<Producto>({
//     id: 0,
//     nombre: '',
//     precio: 0,
//     unidad_medida: '',
//     categorias: [],
//     stock: 0,
//     foto: "",
//     cod_barra: ""
// });

const default_form: FormData = {
    name: "",
    price: "",
    quantity: "",
    categories: [],
    unidad_medida: "",
};

const form_data = ref<FormData>({ ...default_form });

const isFormIncomplete = computed(() => {
    return form_data.value.name === "" || form_data.value.price === "" || form_data.value.quantity === "";
});


const handleSubmit = async () => {
    if (isFormIncomplete.value) {
        const alert = await alertController.create({
            header: 'Error',
            message: 'Nombre, Precio y Cantidad son obligatorios',
            buttons: ['OK'],
        });
        await alert.present();
        return;
    }

    //Usar funcion que agrega a la base de datos de un formulario
    //agregarProducto(form_data.value);
    console.log("Datos enviados:", toRaw(form_data.value));
};

const resetForm = () => {
    form_data.value = { ...default_form };
};
</script>

<style scoped>
ion-row.headerProductos {
    font-weight: bold;
    background-color: var(--ion-color-light);
    text-align: center;
    border-bottom: 1px solid var(--ion-color-medium);
}

ion-row {
    text-align: center;
    padding: 10px 0;
}

ion-row:nth-child(even) {
    background-color: var(--ion-color-light-shade);
}

button {
    background-color: transparent;
    border: none;
    color: var(--ion-color-primary);
    cursor: pointer;
}
.botonCerrar {
    margin-top: 10px;
    border-radius: 8px;
    position: absolute;
    bottom: 15px;
    right: 15px;
}
.categoria-btn {
    flex: 0 0 auto;
    margin: 10px;
    color: white;
    min-width: 80px;
    max-width: none;
    background-color: rgb(29, 28, 28);
    padding: 9px;
    text-overflow: clip;
    border-radius: 10px;
    overflow: visible;
    border: 0.5px solid transparent;
    /* Se inicia sin borde */
    transition: border-color 0.1s ease-in-out, background-color 0.7s ease-in-out;
    /* Agregamos una transición suave */
}

.categoria-btn.active {
    border-color: white;
    background-color: var(--ion-color-primary);
    color: white;
}

.botonCerrar {
    margin-top: 10px;
    border-radius: 8px;
    position: absolute;
    bottom: 15px;
    right: 15px;
}

ion-input {
    background-color: rgb(29, 28, 28);
    --padding-start: 15px;
}

.categorias-scroll {
    display: flex;
    overflow-x: auto;
    /* Permite el desplazamiento horizontal */
    white-space: nowrap;
    /* Evita que los botones se rompan en varias líneas */
    padding: 10px;
    gap: 10px;
    /* Espaciado entre botones */
    scrollbar-width: thin;
    /* Reduce el tamaño de la barra de desplazamiento en Firefox */
    -webkit-overflow-scrolling: touch;
    /* Mejora el desplazamiento en dispositivos táctiles */
}

/* Personaliza la barra de desplazamiento en Webkit (Chrome, Edge, Safari) */
.categorias-scroll::-webkit-scrollbar {
    height: 6px;
}

.categorias-scroll::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 4px;
}

.categorias-scroll::-webkit-scrollbar-track {
    background: transparent;
}
</style>