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
} from '@ionic/vue';
// import { test } from '../services/test';

// const {codbarra, formato, tipo} = test();

</script>

<style scoped>

ion-input {
    margin: 10px;
}

ion-button {
    margin: 10px;
}
</style>