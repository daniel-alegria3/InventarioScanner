<template>
    <ion-page>
      <ion-header :translucent="true">
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-back-button :text="getBackButtonText()" default-href="/folder/Venta"></ion-back-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <ion-content :scrollY="false" :fullscreen="true">
        <ion-grid class="ion-justify-content-center">
          <ion-card>
            <ion-card-content>
              <ion-row>
                <ion-col>
                  <h1>Agregar Producto</h1>
                </ion-col>
              </ion-row>

              <form @submit.prevent="handleSubmit">
                <ion-row>
                  <ion-col>
                    <ion-input v-model="form_data.name" fill="outline" label-placement="floating"
                      label="Nombre del producto" type="text" required></ion-input>
                  </ion-col>
                </ion-row>

                <ion-row>
                  <ion-col>
                    <ion-input v-model="form_data.price" fill="outline" label-placement="floating" label="Precio"
                      type="number" required></ion-input>
                  </ion-col>
                  <ion-col>
                    <ion-input v-model="form_data.quantity" fill="outline" label-placement="floating" label="Cantidad"
                      type="number" required></ion-input>
                  </ion-col>
                </ion-row>

                <ion-row>
                  <ion-col>
                    <ion-select v-model="form_data.categories" fill="outline" label="Categorías" :multiple="true"
                      placeholder="Seleccionar">
                      <ion-select-option v-for="(c, i) in CATEGORIES" :key="i" :value="c">
                        {{ c }}
                      </ion-select-option>
                    </ion-select>
                  </ion-col>
                </ion-row>

                <ion-row>
                  <ion-col>
                    <ion-button expand="block" type="submit">Agregar</ion-button>
                  </ion-col>
                  <ion-col>
                    <ion-button expand="block" color="medium" @click="resetForm">Limpiar formulario</ion-button>
                  </ion-col>
                </ion-row>
              </form>
            </ion-card-content>
          </ion-card>
        </ion-grid>
      </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import {
  IonSelect,
  IonSelectOption,
  IonGrid,
  IonRow,
  IonCol,
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonButtons,
  IonButton,
  IonBackButton,
  IonInput,
  alertController,
} from '@ionic/vue';
import { ref, computed, toRaw } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';

const CATEGORIES = ["Electronics", "Clothing", "Food", "Books"];

interface FormData {
  name: string;
  price: string;
  quantity: string;
  categories: string[];
}

const default_form: FormData = {
  name: "",
  price: "",
  quantity: "",
  categories: [],
};

const form_data = ref<FormData>({ ...default_form });

const hasFormChanged = computed(() => {
  return (Object.keys(form_data.value) as (keyof FormData)[]).some((field) => {
    return form_data.value[field] !== default_form[field];
  });
});

const isFormIncomplete = computed(() => {
  return form_data.value.name === "" || form_data.value.price === "" || form_data.value.quantity === "";
});

const handleSubmit = async () => {
  if (isFormIncomplete.value) {
    const alert = await alertController.create({
      header: 'Error',
      message: 'Nombre, Precio y Cantidad son obligatorios',
      buttons: ['OK'],
    });
    await alert.present();
    return;
  }

  const schema = `CREATE TABLE IF NOT EXISTS inventory (
    id INTEGER PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    quantity REAL NOT NULL,
    categories TEXT
  )`;

  console.log("Datos enviados:", toRaw(form_data.value));
};

const resetForm = () => {
  form_data.value = { ...default_form };
};

const getBackButtonText = () => {
  const win = window as any;
  const mode = win?.Ionic?.mode;
  return mode === 'ios' ? 'Inventario' : '';
};

onBeforeRouteLeave(async (to, from) => {
  if (!hasFormChanged.value) {
    return true;
  }

  const alert = await alertController.create({
    header: "Descartar cambios?",
    message: "Su progreso se perderá",
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
      },
      {
        text: 'OK',
        role: 'confirm',
      },
    ]
  });

  await alert.present();
  const result = await alert.onDidDismiss();
  return result.role !== "cancel";
});
</script>

<style scoped>
h1 {
  text-align: center;
  font-size: 22px;
  margin-bottom: 15px;
}
</style>
