<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Buscar Productos</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-input
          v-model="search_text"
          fill="outline"
          placeholder="Buscar..."
          type="text"
        >
        </ion-input>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <!-- Tabla de Inventario -->
      <TablaInventario
        :products="filteredProductos"
        v-model:selectedProducts="selected_products"
        :isSelModeOpen="true"
      />
    </ion-content>

    <ion-footer :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="primary" class="">
          <ion-button color="primary" @click="closeModal(selected_products)">
            Aceptar
            <ion-icon color="primary" slot="end" :icon="checkmark"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonModal,
  IonContent,
  IonButtons,
  IonButton,
  IonHeader,
  IonFooter,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  alertController,
  modalController,
} from '@ionic/vue';
import { checkmark } from 'ionicons/icons';
import { ref, computed } from 'vue';
import { useSearch } from '@/composables/useSearch';

// const { search_text, search_results } = useSearch();

import TablaInventario from '@/components/TablaInventario.vue';

interface Producto {
  id: number;
  name: string;
  price: number;
  barcode: string | null;
}

//------------------------------------------------------------------------------

// TODO: fetch productos with a db call
const products = ref<Producto[]>([
  { id: 0, name: 'Pepsi', price: 2.0, barcode: null },
  { id: 1, name: 'Sprite', price: 2.5, barcode: null },
  { id: 2, name: 'Fanta', price: 2.0, barcode: null },
  { id: 3, name: 'Galletas', price: 1.5, barcode: null },
  { id: 4, name: 'Chocolates', price: 1.0, barcode: null },
  { id: 5, name: 'Cerveza', price: 3.0, barcode: null },
  { id: 6, name: 'Vodka', price: 5.0, barcode: null },
  { id: 7, name: 'Ron', price: 4.0, barcode: null },
  { id: 8, name: 'Whisky', price: 6.0, barcode: null },
  { id: 9, name: 'Tequila', price: 3.5, barcode: null },
  { id: 10, name: 'Vino', price: 2.5, barcode: null },
  { id: 11, name: 'Coca-Cola', price: 2.0, barcode: null },
  { id: 12, name: 'Pepsi', price: 2.0, barcode: null },
  { id: 13, name: 'Sprite', price: 2.5, barcode: null },
  { id: 14, name: 'Fanta', price: 2.0, barcode: null },
  { id: 15, name: 'Galletas', price: 1.5, barcode: null },
  { id: 16, name: 'Chocolates', price: 1.0, barcode: null },
  { id: 17, name: 'Cerveza', price: 3.0, barcode: null },
  { id: 18, name: 'Vodka', price: 5.0, barcode: null },
  { id: 19, name: 'Ron', price: 4.0, barcode: null },
  { id: 21, name: 'Whisky', price: 6.0, barcode: null },
  { id: 22, name: 'Tequila', price: 3.5, barcode: null },
  { id: 23, name: 'Vino', price: 2.5, barcode: null },
  { id: 24, name: 'Coca-Cola', price: 2.0, barcode: null },
  { id: 25, name: 'Pepsi', price: 2.0, barcode: null },
  { id: 26, name: 'Sprite', price: 2.5, barcode: null },
  { id: 27, name: 'Fanta', price: 2.0, barcode: null },
  { id: 28, name: 'Galletas', price: 1.5, barcode: null },
]);
const selected_products = ref<number[]>([]);

const search_text = ref('');
const filteredProductos = computed(() => {
  if (!search_text.value.trim()) {
    return products.value;
  }

  const search_lower = search_text.value.toLowerCase();
  const filtered = products.value.filter(
    (producto) =>
      producto.name.toLowerCase().includes(search_lower) ||
      (producto.barcode && producto.barcode.includes(search_text.value))
  );
  return [...filtered];
});

const closeModal = async (productos: Producto[] | null) => {
  modalController.dismiss(productos, productos.length > 0 ? 'confirm' : 'cancel');
};
</script>

<style scoped></style>

