<script setup lang="ts">
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonFab, IonFabButton, IonIcon } from '@ionic/vue';
import VentasTabla from '@/components/VentasTabla.vue';
import { search, searchOutline, searchSharp } from 'ionicons/icons';
import ModalBuscarProducto from '@/components/ModalBuscarProducto.vue';
import { onMounted, ref } from 'vue';

const ventaContent = ref<HTMLElement | null>(null);
const presentingElement = ref<HTMLElement | null>(null);

onMounted(() => {
    presentingElement.value = ventaContent.value;
});


const modalAbierto = ref(false);
const openModal = () => {
    modalAbierto.value = true;
}
const cerrarModal = () => {
    modalAbierto.value = false;
}
const productoSeleccionado = ref<{ nombre: string; cantidad: number; precio: number; total: number }[]>([]);

const agregarProducto = (producto: { nombre: string; cantidad: number; precio: number; total: number }) => {
    productoSeleccionado.value = [producto]; // Reemplaza directamente con un nuevo array
};


</script>

<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-menu-button color="primary"></ion-menu-button>
                </ion-buttons>
                <ion-title>Venta</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true" :innert="openModal">
            <ion-header collapse="condense">
                <ion-toolbar>
                    <ion-title size="large">Ventas</ion-title>
                </ion-toolbar>
            </ion-header>
            <VentasTabla :productoSeleccionado="productoSeleccionado" />
            <ion-fab vertical="bottom" horizontal="end" slot="fixed">
                <ion-fab-button @click="openModal">
                    <ion-icon :icon="search" :ios="searchOutline" :md="searchSharp" />
                </ion-fab-button>
            </ion-fab>

            <ModalBuscarProducto :isOpen="modalAbierto" @cerrar="cerrarModal" @agregar-producto="agregarProducto" 
            :presentingElement="presentingElement"/>
        </ion-content>
    </ion-page>
</template>