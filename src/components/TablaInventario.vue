<template>
  <ion-card>
    <ion-card-content>
      <!-- NOTE: margin set so that the fab button wont overlap -->
      <ion-grid style="margin-bottom: 56px">
        <!-- Encabezados de la tabla -->
        <ion-row class="header ion-align-items-center">
          <ion-col
            :size="1"
            v-if="is_sel_mode_open"
            class="ion-display-inline-flex ion-justify-content-end ion-order-last"
          >
            <ion-checkbox
              :checked="areAllSelected"
              color="warning"
              @ionChange="toggleSelectAll"
            ></ion-checkbox>
          </ion-col>
          <ion-col :size="is_sel_mode_open ? 8 : 9" class="ion-justify-content-start"
            >Producto</ion-col
          >
          <ion-col :size="3" class="ion-justify-content-end ion-text-right"
            >Precio</ion-col
          >
        </ion-row>

        <!-- Filas dinámicas -->
        <ion-row
          class="ion-align-items-center"
          v-for="(prod, index) in props.products"
          :key="index"
          @click="handleRowClick(prod, index)"
          :class="{ selected: isProductSelected(prod.id) }"
        >
          <ion-col
            :size="1"
            v-if="is_sel_mode_open"
            class="ion-display-inline-flex ion-justify-content-end ion-order-last"
          >
            <ion-checkbox
              :checked="isProductSelected(prod.id)"
              @click.stop
              @ionChange="toggleProductSelection(prod.id)"
            ></ion-checkbox>
          </ion-col>
          <ion-col :size="is_sel_mode_open ? 8 : 9" class="ion-justify-content-start">{{
            prod.name
          }}</ion-col>
          <ion-col :size="3" class="ion-justify-content-end ion-text-right">{{
            Number(prod.price).toFixed(2)
          }}</ion-col>
        </ion-row>
      </ion-grid>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import {
  IonCard,
  IonCardContent,
  IonCheckbox,
  IonGrid,
  IonRow,
  IonCol,
  alertController,
  modalController,
} from '@ionic/vue';
import { ref, watch, computed } from 'vue';

import ModalFormularioProducto from '@/components/ModalFormularioProducto.vue';

//------------------------------------------------------------------------------

const props = withDefaults(
  defineProps<{
    products: any[];
  }>(),
  {
    products: [],
  }
);

const selected_products = defineModel('selectedProducts', {
  default: [],
  required: false,
});
const is_sel_mode_open = defineModel('isSelModeOpen', {
  default: false,
  required: false,
});

const emit = defineEmits<{
  normModeRowClick: [product: Object];
}>();

//------------------------------------------------------------------------------

const areAllSelected = computed(() => {
  return (
    props.products.length > 0 &&
    selected_products.value.length === props.products.length
  );
});

const isProductSelected = (id: number) => {
  return selected_products.value.includes(id);
};

const toggleSelectAll = () => {
  if (areAllSelected.value) {
    selected_products.value = [];
  } else {
    selected_products.value = props.products.map((p) => p.id);
  }
};

const enterSelectionMode = (producto: Producto | null) => {
  if (!is_sel_mode_open.value) {
    is_sel_mode_open.value = true;
  }
  if (producto && !isProductSelected(producto.id)) {
    selected_products.value.push(producto.id);
  }
};

const exitSelectionMode = () => {
  is_sel_mode_open.value = false;
  selected_products.value = [];
};

const toggleProductSelection = (id: number) => {
  const index = selected_products.value.indexOf(id);
  if (index > -1) {
    selected_products.value.splice(index, 1);
  } else {
    selected_products.value.push(id);
  }
};

const handleRowClick = async (producto, index) => {
  if (is_sel_mode_open.value) {
    toggleProductSelection(producto.id);
  } else {
    emit('normModeRowClick', producto);
  }
};
</script>

<style scoped>
ion-row.header {
  font-weight: bold;
  background-color: var(--ion-color-light);
  border-top: 1px solid var(--ion-color-medium);
  border-bottom: 1px solid var(--ion-color-medium);
}
ion-row {
  padding: 0px 0;
}
ion-row:nth-child(odd) {
  background-color: var(--ion-color-light-shade);
}

ion-row.selected {
  background-color: rgba(var(--ion-color-tertiary-rgb), 0.14);
}
</style>
