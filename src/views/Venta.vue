<template>
  <PageTemplate title="Venta">
    <ion-card>
      <ion-card-content>
        <ion-grid class="ion-align-items-center">
          <!-- Encabezados de la tabla -->
          <ion-row class="header ion-align-items-center">
            <ion-col size="1"></ion-col>
            <ion-col size="3">Producto</ion-col>
            <ion-col size="2" class="ion-text-right">Pre.</ion-col>
            <ion-col size="4" class="ion-text-center">Cant.</ion-col>
            <ion-col size="2" class="ion-text-center"></ion-col>
          </ion-row>

          <!-- Filas dinámicas -->
          <ion-row
            v-for="(item, index) in ventaItems"
            :key="index"
            class="ion-align-items-center"
          >
            <ion-col size="1" class="ion-text-center">
              <ion-button
                size="small"
                color="danger"
                @click="deleteVentaItem(item)"
                fill="clear"
              >
                <ion-icon slot="icon-only" :icon="close"></ion-icon>
              </ion-button>
            </ion-col>
            <ion-col size="3">{{ item.product.name }}</ion-col>
            <ion-col size="2" class="ion-text-right">{{
              Number(item.product.price).toFixed(2)
            }}</ion-col>
            <ion-col size="4" class="ion-text-center">
              <!-- TODO: couldn't make the item.quantity be vertically centered without using a 'sub-grid' -->
              <ion-grid class="ion-no-padding">
                <ion-row class="ion-align-items-center ion-justify-content-center">
                  <ion-col size="auto">
                    <ion-button
                      @click="incVentaItem(item, -1)"
                      size="small"
                      color="primary"
                      fill="clear"
                    >
                      <ion-icon slot="icon-only" :icon="caretBackOutline"></ion-icon>
                    </ion-button>
                  </ion-col>
                  <ion-col size="auto">
                    <!-- TODO: number input here to directly edit the amount? -->
                    <ion-text
                      ><strong>{{ item.quantity }}</strong></ion-text
                    >
                  </ion-col>
                  <ion-col size="auto">
                    <ion-button
                      @click="incVentaItem(item, +1)"
                      size="small"
                      color="primary"
                      fill="clear"
                    >
                      <ion-icon slot="icon-only" :icon="caretForwardOutline"></ion-icon>
                    </ion-button>
                  </ion-col>
                </ion-row>
              </ion-grid>
            </ion-col>
            <ion-col size="2" class="ion-text-center">{{
              Number(item.quantity * item.product.price).toFixed(2)
            }}</ion-col>
          </ion-row>
        </ion-grid>
      </ion-card-content>
    </ion-card>

    <ion-card class="total">
      <ion-card-content>
        <h1 class="total-precio">
          <span>Total: </span>
          <span>S/ {{ precio_total.toFixed(2) }}</span>
        </h1>
        <div class="ion-text-right">
          <ion-button @click="cancelarVenta">
            <ion-icon slot="start" :icon="cash"></ion-icon>
            Cancelar
          </ion-button>
        </div>
      </ion-card-content>
    </ion-card>

    <ion-fab vertical="bottom" horizontal="end" slot="fixed">
      <ion-fab-button @click="openBuscadorProducto">
        <ion-icon :icon="search" />
      </ion-fab-button>
    </ion-fab>
  </PageTemplate>
</template>

<script setup lang="ts">
import {
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonFab,
  IonFabButton,
  IonIcon,
  IonText,
  modalController,
} from '@ionic/vue';
import {
  search,
  cash,
  close,
  caretBackOutline,
  caretForwardOutline,
} from 'ionicons/icons';
import { ref, watch } from 'vue';

import PageTemplate from '@/views/PageTemplate.vue';
import ModalBuscarProducto from '@/components/ModalBuscarProducto.vue';

interface Product {
  id: number;
  name: string;
  price: number;
  barcode: string | null;
}
interface VentaItem {
  product: Product;
  quantity: number;
}

//------------------------------------------------------------------------------

const ventaItems = ref<Product[]>([]);
const precio_total = ref<number>(0);

const openBuscadorProducto = async () => {
  const modal = await modalController.create({
    component: ModalBuscarProducto,
  });

  modal.present();

  const { data, role } = await modal.onWillDismiss();

  if (data) {
    console.log('Selected products: ', data);

    for (const product of data) {
      const index = ventaItems.value.findIndex((vi) => vi.product.id === product.id);
      if (index > -1) {
        ventaItems.value[index].quantity++;
      } else {
        ventaItems.value.push({
          product: product,
          quantity: 1,
        });
      }
    }
    calcularTotal();
  }
};

const calcularTotal = () => {
  // WARN: maybe implement a watch() to not manually call this
  //       but for now looks performant
  precio_total.value = ventaItems.value.reduce((suma, vi) => {
    return suma + vi.quantity * vi.product.price;
  }, 0);
};

const incVentaItem = (venta: VentaItem, amount: number) => {
  const index = ventaItems.value.findIndex((vi) => vi.product.id === venta.product.id);
  // NOTE: we don't check if index is -1 because we call this on an item in the table
  const new_quantity = ventaItems.value[index].quantity + amount;
  if (amount < 0 && new_quantity < 1) {
    return;
  }
  ventaItems.value[index].quantity += amount;
  calcularTotal();
};

const deleteVentaItem = async (item: VentaItem) => {
  const index = ventaItems.value.findIndex((vi) => vi.product.id === item.product.id);
  ventaItems.value.splice(index, 1);
};

const cancelarVenta = () => {
  ventaItems.value = [];
  precio_total.value = 0;
};
</script>

<style scoped>
ion-row.header {
  font-weight: bold;
  background-color: var(--ion-color-light);
  border-bottom: 1px solid var(--ion-color-medium);
}

ion-row {
  text-align: left;
}

ion-row:nth-child(even) {
  background-color: var(--ion-color-light-shade);
}

.total {
  margin: 20px 7% 0px 7%;
}

.total-precio {
  display: flex;
  justify-content: space-between;
  /* Espacio entre el texto y el precio_total */
  padding: 0px 4% 0px 0px;
  font-size: 1.5em;
  font-weight: bold;
}
</style>
