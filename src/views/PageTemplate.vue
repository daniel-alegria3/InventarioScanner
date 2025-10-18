<template>
  <ion-page>
    <!-- Header -->
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>{{ title }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="fullscreen">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ title }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <!-- Contenido principal -->
      <slot> </slot>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonToolbar,
  IonHeader,
  IonTitle,
  IonButtons,
  IonMenuButton,
  IonContent,
} from '@ionic/vue';

const props = withDefaults(
  defineProps<{
    title?: string;
    fullscreen?: bolean;
  }>(),
  {
    title: 'Untitled Page',
    fullscreen: true,
  }
);
</script>

<style scoped></style>
