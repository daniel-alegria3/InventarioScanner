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

          <ion-row>
            <ion-col size="8">
              <ion-input
                v-model="form_data.price"
                label="Precio"
                type="number"
                label-placement="floating"
                expand="block"
                fill="outline"
              ></ion-input>
            </ion-col>
            <ion-col size="4">
              <ion-button @click="escanearBarcode" fill="outline" expand="block">
                {{ "Scan" }}
                <ion-icon slot="end" aria-hidden="true" :ios="barcodeOutline" :md="barcodeSharp" />
              </ion-button>
            </ion-col>
          </ion-row>

          <ion-row>
            <ion-col class="ion-no-flex" size="auto">
              <ion-chip
                v-for="(bc, index) in form_data.barcodes"
                :key="index"
                :color="bc == barcode ? 'success' : 'medium'"
                :outline="true"
              >
                <ion-label>{{ bc }}</ion-label>
                <ion-icon :icon="closeCircle" @click="removerBarcode(bc)"></ion-icon>
              </ion-chip>
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
  IonChip,
  IonLabel,
  IonIcon,
  alertController,
  modalController,
  onIonViewDidEnter,
  useBackButton,
} from "@ionic/vue";
import { barcodeSharp, barcodeOutline, closeCircle } from "ionicons/icons";
import { ref, computed, watch, onMounted, toRaw } from "vue";

import { useDatabase, Product } from "@/composables/useDatabase";
import { useBarcodeScanner } from "@/composables/useBarcodeScanner";
const { openBarcodeScanner } = useBarcodeScanner();

const props = withDefaults(
  defineProps<{
    type: "add" | "update";
    product?: Product | null;
    found_with_barcode?: string | null;
  }>(),
  {
    product: null,
    found_with_barcode: null,
  },
);

//------------------------------------------------------------------------------

const db = useDatabase();
const barcode = ref<string | null>(null);

const ableDismiss = ref<boolean>(true);
const form_data = ref<Product>({
  id: null,
  name: "",
  price: 0,
  barcodes: [],
} as Product);

const isFormIncomplete = computed(() => {
  return (
    form_data.value.name === "" ||
    form_data.value.price == null || // use == to check for null and undefined
    form_data.value.price < 0
  );
});

const form_has_changed = computed(() => {
  return;
});
const modal_vars = computed(() => {
  let title, confirm;
  if (props.type === "add") {
    title = "Nuevo Producto";
    confirm = "Agregar";
  } else if (props.type === "update") {
    title = "Modificar Producto";
    confirm = "Actualizar";
  } else {
    // TODO: Throw error, idk
    console.assert(false, `El prop '${props.type}' no es valido`);
  }
  return { title: title, confirm: confirm };
});

onMounted(async () => {
  if (props.product) form_data.value = { ...form_data.value, ...props.product };
  if (props.found_with_barcode) barcode.value = props.found_with_barcode;
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
  await agregarBarcode(barcode.value);
};
const agregarBarcode = async (barcode: string | null) => {
  if (!barcode) {
    return;
  }

  let msg = null;
  if (form_data.value.barcodes.includes(barcode)) {
    msg = "Codigo de Barras ya esta incluido en este producto";
  } else if (await db.getProductByBarcode(barcode)) {
    msg = "Codigo de Barras ya esta relacionado con otro producto";
  }

  if (msg) {
    const alert = await alertController.create({
      header: "Advertencia",
      message: msg,
      buttons: ["OK"],
    });
    await alert.present();
    return;
  }

  form_data.value.barcodes.push(barcode);
};
const removerBarcode = async (barcode: string | null) => {
  if (!barcode) {
    return;
  }
  form_data.value.barcodes = form_data.value.barcodes.filter((b) => b !== barcode);
};

const handleSubmit = async () => {
  if (isFormIncomplete.value) {
    const alert = await alertController.create({
      header: "Error",
      message: "Nombre y/o Precio invalidos",
      buttons: ["OK"],
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
    modal.dismiss(producto, producto ? "confirm" : "cancel");
  }
};

//-------------------------------- { Niceties } --------------------------------

watch(
  form_data,
  async (new_val) => {
    const { name, price, barcodes } = new_val;
    const modal = await modalController.getTop();
    if (modal) {
      const has_changed = name !== "" || price !== null || barcodes.length > 0;
      modal.canDismiss = !has_changed;
      ableDismiss.value = !has_changed;
    }
  },
  { deep: true },
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
