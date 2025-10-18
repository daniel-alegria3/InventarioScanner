<template>
  <PageTemplate title="Venta">
    <VentasTabla :productoSeleccionado="productoSeleccionado" />
    <ion-fab vertical="bottom" horizontal="end" slot="fixed">
      <ion-fab-button @click="openModal">
        <ion-icon :icon="search" :ios="searchOutline" :md="searchSharp" />
      </ion-fab-button>
    </ion-fab>

    <ModalBuscarProducto
      :isOpen="modalAbierto"
      @cerrar="cerrarModal"
      @agregar-producto="agregarProducto"
      :presentingElement="presentingElement"
    />
  </PageTemplate>
</template>

<script setup lang="ts">
import { IonFab, IonFabButton, IonIcon } from '@ionic/vue';
import { search, searchOutline, searchSharp } from 'ionicons/icons';
import { onMounted, ref } from 'vue';

import PageTemplate from '@/views/PageTemplate.vue';
import VentasTabla from '@/components/VentasTabla.vue';
import ModalBuscarProducto from '@/components/ModalBuscarProducto.vue';

const ventaContent = ref<HTMLElement | null>(null);
const presentingElement = ref<HTMLElement | null>(null);

onMounted(() => {
  presentingElement.value = ventaContent.value;
});

const modalAbierto = ref(false);
const openModal = () => {
  modalAbierto.value = true;
};
const cerrarModal = () => {
  modalAbierto.value = false;
};
const productoSeleccionado = ref<
  { nombre: string; cantidad: number; precio: number; total: number }[]
>([]);

const agregarProducto = (producto: {
  nombre: string;
  cantidad: number;
  precio: number;
  total: number;
}) => {
  productoSeleccionado.value = [producto]; // Reemplaza directamente con un nuevo array
};
</script>

