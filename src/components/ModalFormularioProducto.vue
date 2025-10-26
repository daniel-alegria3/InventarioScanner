<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>{{ modal_vars.title }}</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content :scrollY="false" :fullscreen="true">
    <ion-card>
      <ion-card-content>
        <ion-grid>
          <ion-row>
            <ion-col>
              <ion-input
                v-model="form_data.name"
                label="Nombre"
                type="text"
                label-placement="floating"
                fill="outline"
              ></ion-input>
            </ion-col>
          </ion-row>

          <ion-row class="ion-align-items-center">
            <ion-col class="ion-flex">
              <ion-input
                v-model="form_data.price"
                label="Precio"
                type="number"
                label-placement="floating"
                fill="outline"
              ></ion-input>
            </ion-col>
            <ion-col class="ion-no-flex" size="auto">
              <ion-button
                @click="escanearBarcode"
                :color="form_data.barcode ? 'success' : 'medium'"
                fill="outline"
              >
                {{ form_data.barcode || 'Cod. Barra' }}
                <ion-icon
                  slot="end"
                  aria-hidden="true"
                  :ios="barcodeOutline"
                  :md="barcodeSharp"
                />
              </ion-button>
            </ion-col>
          </ion-row>

          <ion-row>
            <ion-col>
              <ion-button
                @click="cerrarModal(null)"
                expand="block"
                :color="ableDismiss ? 'medium' : 'danger'"
                >Cancelar</ion-button
              >
            </ion-col>
            <ion-col>
              <ion-button @click="handleSubmit" type="submit" expand="block">{{
                modal_vars.confirm
              }}</ion-button>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-card-content>
    </ion-card>
  </ion-content>
</template>

<script setup lang="ts">
import {
  IonHeader,
  IonTitle,
  IonToolbar,
  IonContent,
  IonButton,
  IonInput,
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  alertController,
  modalController,
  onIonViewDidEnter,
  useBackButton,
} from '@ionic/vue';
import { barcodeSharp, barcodeOutline } from 'ionicons/icons';
import { ref, computed, watch, onMounted } from 'vue';

import { Product } from '@/services/DatabaseService';
import { useBarcodeScanner } from '@/composables/useBarcodeScanner';
const { openBarcodeScanner } = useBarcodeScanner();

const props = withDefaults(
  defineProps<{
    type: 'add' | 'update';
    product?: Product | null;
  }>(),
  {
    product: null,
  }
);

//------------------------------------------------------------------------------

const barcode = ref<string | null>(null);

const ableDismiss = ref<boolean>(true);
const form_data = ref<Product>({} as Product);

const isFormIncomplete = computed(() => {
  return (
    form_data.value.name === '' ||
    form_data.value.price == null || // use == to check for null and undefined
    form_data.value.price < 0
  );
});

const form_has_changed = computed(() => {
  return;
});
const modal_vars = computed(() => {
  let title, confirm;
  if (props.type === 'add') {
    title = 'Nuevo Producto';
    confirm = 'Agregar';
  } else if (props.type === 'update') {
    title = 'Modificar Producto';
    confirm = 'Actualizar';
  } else {
    // TODO: Throw error, idk
    console.assert(0, `El prop '${props.type}' no es valido`);
  }
  return { title: title, confirm: confirm };
});

watch(barcode, async (new_barcode) => {
  if (new_barcode) {
    if (false) {
      // TODO: check if barcode is already on database
      const alert = await alertController.create({
        header: 'Advertencia',
        message: 'Codigo de Barras ya esta relacionado con otro producto',
        buttons: ['OK'],
      });
      await alert.present();
    }

    form_data.value.barcode = new_barcode;
  }
});

onMounted(async () => {
  if (props.product) {
    form_data.value = props.product;
  }
  /*
  const modal = await modalController.getTop();
  if (modal) {
    modal.canDismiss = async (data, role) => {
      return role !== 'gesture';
    };
  }
  */
});

//------------------------------------------------------------------------------

const escanearBarcode = async () => {
  barcode.value = await openBarcodeScanner();
};

const handleSubmit = async () => {
  if (isFormIncomplete.value) {
    const alert = await alertController.create({
      header: 'Error',
      message: 'Nombre y/o Precio invalidos',
      buttons: ['OK'],
    });
    await alert.present();
    return;
  }

  cerrarModal({ ...form_data.value });
};

const cerrarModal = async (producto: Product | null) => {
  const modal = await modalController.getTop();
  if (modal) {
    modal.canDismiss = true;
    modal.dismiss(producto, producto ? 'confirm' : 'cancel');
  }
};

//-------------------------------- { Niceties } --------------------------------

watch(
  form_data,
  async (new_val) => {
    const { name, price, barcode } = new_val;
    const modal = await modalController.getTop();
    if (modal) {
      const has_changed = name !== '' || price !== null || barcode !== null;
      modal.canDismiss = !has_changed;
      ableDismiss.value = !has_changed;
    }
  },
  { deep: true }
);

/*
onIonViewDidEnter(() => {
  useBackButton(14, async (processNextHandler) => {
    const modal = await modalController.getTop();
    const a = await alertController.create({
      header: 'nice debug',
      message: 'Descartar cambios?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });
    await a.present();
    if (modal && !modal.canDismiss) {
      const alert = await alertController.create({
        header: 'Advertencia',
        message: 'Descartar cambios?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'OK',
            role: 'confirm',
            handler: () => {
              modal.canDismiss = true;
              modal.dismiss(null, 'cancel');
            },
          },
        ],
      });
      await alert.present();
    } else {
      processNextHandler();
    }
  });
});
*/
</script>

<style scoped></style>
