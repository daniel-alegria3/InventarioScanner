<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>FolderTest</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-card>
        <ion-card-header>
          <ion-card-title>Fromulario</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-input
            v-model="codbarra"
            fill="outline"
            label-placement="floating"
            label="Código de barras"
            type="text"
          ></ion-input>
          <ion-input
            v-model="formato"
            fill="outline"
            label-placement="floating"
            label="Formato"
            type="text"
          ></ion-input>
          <ion-input
            v-model="tipo"
            fill="outline"
            label-placement="floating"
            label="Tipo"
            type="text"
          ></ion-input>
        </ion-card-content>
      </ion-card>

      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="openModal">
          <ion-icon :icon="addOutline" />
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonInput,
  IonTitle,
  IonIcon,
  IonFab,
  IonFabButton,
  modalController,
} from '@ionic/vue';
import { addOutline } from 'ionicons/icons';
// import { test } from '../services/test';

// const {codbarra, formato, tipo} = test();
import { ref, watch } from 'vue';
import ScannerModal from '@/components/ScannerModal.vue';

const codbarra = ref('hola');
const formato = ref('que');
const tipo = ref('tal');
const modalAbierto = ref(false);

const openModal = async () => {
  const modal = await modalController.create({
    component: ScannerModal,
    cssClass: 'barcode-scanning-modal',
  });

  // modal.canDismiss = false;
  modal.present();

  const { data, role } = await modal.onWillDismiss();

  if (data) {
    codbarra.value = data.valor;
    formato.value = data.formato;
    tipo.value = data.tipo_valor;
  }
};

</script>

<style scoped>
ion-input {
  margin: 10px;
}

ion-button {
  margin: 10px;
}
</style>
