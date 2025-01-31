<script setup lang="ts">
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonFab, IonFabButton, IonIcon } from '@ionic/vue';
import TablaVentas from '@/components/TablaVentas.vue';
import { search, searchOutline, searchSharp } from 'ionicons/icons';
</script>

<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-menu-button color="primary"></ion-menu-button>
                </ion-buttons>
                <ion-title>Venta</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <ion-header collapse="condense">
                <ion-toolbar>
                    <ion-title size="large">Inventario</ion-title>
                </ion-toolbar>
            </ion-header>
            <TablaVentas />
            <ion-fab vertical="bottom" horizontal="end" slot="fixed">
                <ion-fab-button router-direction="forward" router-link="/folder/Venta/buscarProducto">
                    <ion-icon :icon="search" :ios="searchOutline" :md="searchSharp" />
                </ion-fab-button>
            </ion-fab>
        </ion-content>
    </ion-page>
</template>
