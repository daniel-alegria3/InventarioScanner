<template>
    <ion-modal :is-open="props.isOpen" @didDismiss="cerrarModal" :inert="!props.isOpen">
        <ion-page>
            <ion-header>
                <ion-toolbar>
                    <ion-title>Buscar Producto</ion-title>
                </ion-toolbar>
            </ion-header>

            <ion-content class="ion-padding">
                <ion-input v-model="search_text" fill="outline" label-placement="floating"
                    label="Nombre del producto" type="text">
                </ion-input>
                <ion-button @click="cerrarModal" class="botonCerrar">Cerrar</ion-button>
                 <!-- Contenedor de categorías con scroll horizontal -->
                 <div class="categorias-scroll">
                    <button class="categoria-btn" v-for="(categoria, index) in Categorias" :key="index"
                        :class="['categoria-btn', { 'active': categoriaSeleccionada === categoria }]"
                        @click="toggleCategoria(categoria, $event)">
                        {{ categoria }}
                    </button>
                </div>
                <ion-grid>
                    <ion-card class="Mostrar">
                        <ion-card-content>
                            <ion-row class="headerProductos">
                                <ion-col size="4">Producto</ion-col>
                                <ion-col size="4">Stock</ion-col>
                                <ion-col size="4">Precio</ion-col>
                            </ion-row>
                            <ion-row v-for="(product, index) in Productos" :key="index">
                                <ion-col size="4"><button @click="addThis(product.nombre, product.precio)">{{
                                    product.nombre }}</button></ion-col>
                                <ion-col size="4">{{ product.stock }}</ion-col>
                                <ion-col size="4">{{ product.precio }}</ion-col>
                            </ion-row>
                        </ion-card-content>
                    </ion-card>
                </ion-grid>
            </ion-content>
        </ion-page>
    </ion-modal>
</template>

<script setup lang="ts">
import { IonModal, IonContent, IonButton, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonCard, IonCardContent, IonGrid, IonRow, IonCol } from '@ionic/vue';
import { ref } from 'vue';
import { useSearch } from "@/composables/useSearch";
const { search_text, search_results } = useSearch();


const props = defineProps<{ isOpen: boolean }>(); // Definiendo la prop 'isOpen'
const emit = defineEmits(['cerrar','agregar-producto']); // Definiendo los eventos 'cerrar' y 'agregar-producto'

const cerrarModal = () => {
    emit('cerrar'); // Emite el evento cuando se cierra el modal
    categoriaSeleccionada.value = []; // Desactiva la categoría seleccionada
};

interface Producto {
    nombre: string;
    stock: number;
    precio: number;
}

const categoriaSeleccionada = ref<string[]>([]); // Ahora es un array vacío

const toggleCategoria = (categoria: string, event: Event) => {
    const index = categoriaSeleccionada.value.indexOf(categoria);

    if (index !== -1) {
        // Si ya está seleccionada, la eliminamos
        categoriaSeleccionada.value.splice(index, 1);
    } else {
        // Si no está seleccionada, la agregamos
        categoriaSeleccionada.value.push(categoria);

        // Desplazamos la vista hacia el botón seleccionado
        const target = event.currentTarget as HTMLElement;
        target.scrollIntoView({ behavior: "smooth", inline: "center" });
    }
    console.log(categoriaSeleccionada.value);
};


const Productos = ref<Producto[]>([
    { nombre: 'Pepsi', stock: 5, precio: 2.0 },
    { nombre: 'Sprite', stock: 8, precio: 2.5 },
    { nombre: 'Fanta', stock: 3, precio: 2.0 },
]);
const Categorias = ref<string[]>(['Gaseosas', 'Dulces', 'Galletas', 'Snacks', 'Cervezas', 'Licores']);

const addThis = (nombre: string, precio: number): void => {
    const cantidad = 1;
    const totalParcial = 0;
    emit('agregar-producto',{nombre, cantidad, precio, totalParcial}); // Emite el evento 'agregar-producto' con los datos del producto
}

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
    border: 0.5px solid transparent; /* Se inicia sin borde */
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