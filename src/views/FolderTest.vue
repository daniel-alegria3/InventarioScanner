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
                    <ion-input v-model="codbarra" fill="outline" label-placement="floating" label="Código de barras" type="text"></ion-input>
                    <ion-input v-model="formato" fill="outline" label-placement="floating" label="Formato" type="text"></ion-input>
                    <ion-input v-model="tipo" fill="outline" label-placement="floating" label="Tipo" type="text"></ion-input>
                </ion-card-content>
            </ion-card>

            <ion-fab vertical="bottom" horizontal="end" slot="fixed">
              <ion-fab-button @click="openModal">
                <ion-icon :icon="addOutline" />
              </ion-fab-button>
            </ion-fab>

            <ScannerModal :isOpen="modalAbierto" :barcode="data"/>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">

import { IonPage,
        IonContent,
        IonHeader,
        IonToolbar,
        IonCard,
        IonCardHeader,
        IonCardTitle,
        IonCardContent,
        IonInput,
        IonTitle
} from '@ionic/vue';
// import { test } from '../services/test';

// const {codbarra, formato, tipo} = test();
import {ref, watch} from 'vue';
import ScannerModal from '@/components/ScannerModal.vue';

const codbarra = ref("hola");
const formato = ref("que");
const tipo = ref("tal");
const modalAbierto = ref(false);
const data = ref(null);


const openModal = () => {
  console.log("openmodal called");
  modalAbierto.value = true;
};

watch(data, (newdata) => {
  codbarra.value = newdata.value.valor;
  formato.value = newdata.value.formato;
  tipo.value = newdata.value.tipo_valor;
});

</script>

<style scoped>

ion-input {
    margin: 10px;
}

ion-button {
    margin: 10px;
}
</style>
