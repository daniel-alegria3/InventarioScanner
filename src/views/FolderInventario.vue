<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>Inventario</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Inventario</ion-title>
        </ion-toolbar>
      </ion-header>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/vue';

/// Debugging
import { onIonViewDidEnter } from '@ionic/vue';
import { inject } from 'vue';

import {Producto, DatabaseService} from '@/services/DatabaseService';

let dbs: DatabaseService = new DatabaseService(inject('$sqlite'));
let data: Producto[];

onIonViewDidEnter(async () => {
  await dbs.init();
  data = await dbs.obtener_productos_por_texto("nombre1");
  data = await dbs.obtener_producto_por_cod_barra("12374");
  await dbs.añadir_producto({
    nombre: "noooo",
    precio: 666,
    unidad_medida: "woa",
    categorias: null,
    foto:  null,
    cod_barra: null,
  } as Producto);
  data = await dbs.obtener_productos();
  console.log(data);
});
/// end Debugging

</script>

<style scoped>
#container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  color: #8c8c8c;
  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>
