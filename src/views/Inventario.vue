<template>
  <PageTemplate title="Inventario">
    <template v-slot:header>
      <ion-header :translucent="true">
        <ion-toolbar>
          <ion-searchbar v-model="search_text" placeholder="Buscar producto" />
          <ion-buttons slot="end">
            <ion-button @click="buscarPorBarcode">
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
      >
    </ion-header>

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
import { ref, watch, computed, onMounted, onUnmounted } from 'vue';

import { useBarcodeScanner } from '@/composables/useBarcodeScanner';
import { useDatabase, Product } from '@/composables/useDatabase';

import PageTemplate from '@/views/PageTemplate.vue';
import TablaInventario from '@/components/TablaInventario.vue';
import ModalFormularioProducto from '@/components/ModalFormularioProducto.vue';

//------------------------------------------------------------------------------

const db = useDatabase();
const { openBarcodeScanner } = useBarcodeScanner();
const barcode = ref<string>(null);

const productos = ref<Product[]>([]);
const selected_products = ref<number[]>([]);
const is_sel_mode_open = ref<boolean>(false);

const search_text = ref<string>('');

const filteredProductos = computed(() => {
  if (search_text.value.trim() === '') {
    return productos.value;
  }
  const search_lower = search_text.value.toLowerCase();
  return productos.value.filter((p) => p.name.toLowerCase().includes(search_lower));
});

onMounted(async () => {
  await recargarProductos();
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

watch(barcode, async (new_barcode) => {
  if (new_barcode !== null) {
    const prods = await db.getProductsByBarcode(new_barcode);

    if (prods) {
      if (prods.length === 1) {
        await updateProduct(prods[0]);
      } else {
        // TODO: handle two or more products with the same barcode (ERROR)
        console.error('Bad!');
      }
    }
  }
});

//------------------------------------------------------------------------------
const buscarPorBarcode = async () => {
  barcode.value = await openBarcodeScanner();
};

const recargarProductos = async () => {
  productos.value = await db.getProducts();
};

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
    await db.addProduct(data);
    await recargarProductos();
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
    await db.updateProduct(data.id, data);
    await recargarProductos();
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
        handler: async () => {
          await db.removeProducts(ids);
          await recargarProductos();

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
