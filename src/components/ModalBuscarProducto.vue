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
import { ref, computed, onMounted } from 'vue';
import { useDatabase } from '@/composables/useDatabase';

import { Product } from '@/services/DatabaseService';
import TablaInventario from '@/components/TablaInventario.vue';

//------------------------------------------------------------------------------

const db = useDatabase();
const productos = ref<Product[]>([
  { id: 0, name: 'Pepsi', price: 2.0, barcode: null },
  { id: 1, name: 'Sprite', price: 2.5, barcode: null },
]);
const selected_products = ref<number[]>([]);

const search_text = ref('');
const filteredProductos = computed(() => {
  if (search_text.value.trim() === '') {
    return productos.value;
  }
  const search_lower = search_text.value.toLowerCase();
  return productos.value.filter(() => p.name.toLowerCase().includes(search_lower));
});

onMounted(async () => {
  productos.value = await db.getProducts();
});

const closeModal = async (prods: Product[] | null) => {
  modalController.dismiss(prods, prods.length > 0 ? 'confirm' : 'cancel');
};
</script>

<style scoped></style>
