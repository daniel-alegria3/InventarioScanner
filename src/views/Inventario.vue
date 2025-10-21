<template>
  <PageTemplate title="Inventario">
    <template v-slot:header>
      <ion-header :translucent="true">
        <ion-toolbar>
          <ion-searchbar v-model="search_text" placeholder="Buscar producto" />
          <ion-buttons slot="end">
            <ion-button @click="openBarcodeScanner">
              <ion-icon aria-hidden="true" slot="icon-only" :icon="barcodeOutline" />
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
    </template>

    <!-- TODO: temporal solution -->
    <ion-header class="ion-text-right">
      <ion-button v-if="!is_sel_mode_open" @click="is_sel_mode_open = true"
        >Seleccionar</ion-button
      >
      <ion-button v-if="is_sel_mode_open" @click="is_sel_mode_open = false"
        >Cerrar Seleccion</ion-button
      ></ion-header
    >

    <!-- Tabla de Inventario -->
    <TablaInventario
      :products="filteredProductos"
      @normModeRowClick="updateProduct"
      v-model:selectedProducts="selected_products"
      v-model:isSelModeOpen="is_sel_mode_open"
    />

    <!-- Botón flotante para agregar productos -->
    <ion-fab vertical="bottom" horizontal="end" slot="fixed">
      <ion-fab-button v-if="!is_sel_mode_open" @click="agregarProducto">
        <ion-icon :icon="addOutline" />
      </ion-fab-button>
    </ion-fab>

    <template v-slot:footer>
      <ion-footer v-if="is_sel_mode_open" :translucent="true">
        <ion-toolbar>
          <ion-buttons slot="primary" class="footer-buttons">
            <ion-button
              @click="deleteProducts"
              :disabled="selected_products.length === 0"
              size="small"
            >
              <ion-icon color="danger" slot="icon-only" :icon="trash"></ion-icon>
            </ion-button>
            <ion-label>
              <p>Eliminar ({{ selected_products.length }})</p>
            </ion-label>
          </ion-buttons>
        </ion-toolbar>
      </ion-footer>
    </template>
  </PageTemplate>
</template>

<script setup lang="ts">
import {
  IonHeader,
  IonFooter,
  IonToolbar,
  IonSearchbar,
  IonButtons,
  IonButton,
  IonLabel,
  IonFab,
  IonFabButton,
  IonIcon,
  modalController,
  alertController,
  useBackButton,
  onIonViewDidEnter,
} from '@ionic/vue';
import { addOutline, barcodeOutline, trash } from 'ionicons/icons';
import { ref, watch, computed, onMouted, onUnmounted } from 'vue';

import { useSearch } from '@/composables/useSearch';
import { useBarcodeScanner } from '@/composables/useBarcodeScanner';

import PageTemplate from '@/views/PageTemplate.vue';
import TablaInventario from '@/components/TablaInventario.vue';
import ModalFormularioProducto from '@/components/ModalFormularioProducto.vue';

//------------------------------------------------------------------------------

// const { search_text, search_results } = useSearch();
const { barcode, openBarcodeScanner } = useBarcodeScanner();

interface Producto {
  id: number | null;
  name: string;
  price: number;
  barcode: string | null;
}

const productos = ref<Producto[]>([
  { id: 1, name: 'Gaseosa ORO 2 litros waos uwu', price: 1.5, barcode: '123451' },
  { id: 2, name: 'Galleta', price: 0.8, barcode: null },
  { id: 3, name: 'Pastel', price: 1.0, barcode: null },
  { id: 4, name: 'Chocolate', price: 0.5, barcode: null },
  { id: 5, name: 'Caramelo', price: 0.2, barcode: null },
  { id: 6, name: 'Caramelo', price: 0.2, barcode: null },
  { id: 7, name: 'Caramelo', price: 0.2, barcode: null },
  { id: 8, name: 'Caramelo', price: 0.2, barcode: null },
  { id: 9, name: 'Caramelo', price: 0.2, barcode: null },
  { id: 10, name: 'Caramelo', price: 0.2, barcode: null },
  { id: 11, name: 'Caramelo', price: 0.2, barcode: null },
  { id: 12, name: 'Caramelo', price: 0.2, barcode: null },
  { id: 13, name: 'Caramelo', price: 0.2, barcode: null },
  { id: 15, name: 'Caramelo', price: 0.2, barcode: null },
  { id: 16, name: 'Caramelo', price: 0.2, barcode: null },
  { id: 17, name: 'Caramelo', price: 0.2, barcode: null },
  { id: 18, name: 'Caramelo', price: 0.2, barcode: null },
  { id: 19, name: 'Caramelo', price: 0.2, barcode: null },
  { id: 20, name: 'Caramelo', price: 0.2, barcode: null },
  { id: 21, name: 'Gaseosa ORO 2 litros waos uwu', price: 1.5, barcode: '123451' },
  { id: 22, name: 'Galleta', price: 0.8, barcode: null },
  { id: 23, name: 'Pastel', price: 1.0, barcode: null },
  { id: 24, name: 'Chocolate', price: 0.5, barcode: null },
  { id: 25, name: 'Caramelo', price: 0.2, barcode: null },
  { id: 31, name: 'Gaseosa ORO 2 litros waos uwu', price: 1.5, barcode: '123451' },
  { id: 32, name: 'Galleta', price: 0.8, barcode: null },
  { id: 33, name: 'Pastel', price: 1.0, barcode: null },
  { id: 34, name: 'Chocolate', price: 0.5, barcode: null },
  { id: 35, name: 'Caramelo', price: 0.2, barcode: null },
  { id: 40, name: 'Termino', price: 0.2, barcode: null },
]);

//------------------------------------------------------------------------------

const selected_products = ref<number[]>([]);
const is_sel_mode_open = ref<boolean>(false);

const search_text = ref<string>('');
const filteredProductos = computed(() => {
  if (!search_text.value.trim()) {
    return productos.value;
  }

  const search_lower = search_text.value.toLowerCase();
  const filtered = productos.value.filter(
    (producto) =>
      producto.name.toLowerCase().includes(search_lower) ||
      (producto.barcode && producto.barcode.includes(search_text.value))
  );
  return [...filtered];
});

watch(
  () => selected_products.value.length,
  (new_selection) => {
    if (new_selection) {
      console.log('Added to selection: ', selected_products.value);
    }
  }
);

watch(
  () => is_sel_mode_open.value,
  (new_bool) => {
    if (new_bool !== null) {
      console.log('Open/Close selection mode: ', new_bool);
    }

    // NOTE: dont delete this watch
    if (new_bool === false) {
      selected_products.value = [];
    }
  }
);

watch(barcode, (new_barcode) => {
  if (new_barcode) {
    search_text.value = new_barcode;
  }
});

//------------------------------------------------------------------------------

const agregarProducto = async () => {
  const modal = await modalController.create({
    component: ModalFormularioProducto,
    componentProps: {
      type: 'add',
    },
  });

  modal.present();

  const { data, role } = await modal.onWillDismiss();

  if (data) {
    console.log('Product added: ', data);
    // TODO: call your API to add in database
    // await db_agregarProducto(data);

    productos.value.push({ ...data, id: productos.value.length + 2 });
  }
};

const updateProduct = async (producto) => {
  const modal = await modalController.create({
    component: ModalFormularioProducto,
    componentProps: {
      type: 'update',
      product: { ...producto },
    },
  });

  modal.present();

  const { data, role } = await modal.onWillDismiss();

  if (data) {
    // TODO: call your API to update in database
    // await db_actualizarProducto(data);
    const index = productos.value.findIndex((prod) => prod.id === data.id);
    if (index !== -1) {
      // Update the product in the list
      console.log('ONE: ', productos.value[index]);
      console.log('TWO: ', data);
      productos.value[index] = {
        ...productos.value[index],
        ...data,
      };
    }
  }
};

const deleteProducts = async () => {
  const ids = selected_products.value.map((p) => p.id);
  const alert = await alertController.create({
    header: 'Eliminar Producto',
    message: '¿Estás seguro de eliminar (' + ids.length + ') productos ?',
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
      },
      {
        text: 'Eliminar',
        handler: () => {
          const idsToRemove = new Set(); // Convert 'ids' array to a Set for O(1) lookups
          for (const id of ids) {
            // TODO: llamar a una funcion que eliminara el producto de la base de datos
            // db_eliminarProducto(id);

            idsToRemove.add(id);
          }
          const filtered = productos.value.filter(
            (producto) => !idsToRemove.has(producto.id)
          );

          productos.value.length = 0;
          productos.value.push(...filtered);

          is_sel_mode_open.value = false;
        },
      },
    ],
  });

  await alert.present();
};

//-------------------------------- { Niceties } --------------------------------

function tryCatch() {
  let did_catch = false;
  if (search_text.value.trim() !== '') {
    search_text.value = '';
    did_catch = true;
  } else if (is_sel_mode_open.value) {
    is_sel_mode_open.value = false;
    did_catch = true;
  }
  return did_catch;
}

const onBackButton = (processNextHandler) => {
  if (!tryCatch()) {
    processNextHandler();
  }
};

onIonViewDidEnter(() => {
  useBackButton(15, onBackButton);
});
</script>

<style scoped>
.footer-buttons {
  flex-direction: column;
  align-items: center;
  padding: 7px;
}
</style>
