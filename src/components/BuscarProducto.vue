<template>
    <ion-page>
      <ion-header :translucent="true">
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-back-button :text="getBackButtonText()" default-href="/folder/Venta"></ion-back-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
  
      <ion-content :scrollY="false" :fullscreen="true"> <!-- ion-padding -->
        <ion-grid class="ion-justify-content-center">
          <ion-card>
            <ion-card-content>
              <!--<ion-col size="12" size-md="8" size-lg="6" size-xl="4">
            EN VEZ DE USAR ESTO, CREA TUS PROPIAR REGLAS "MEDIA" EN CSS -->
              <ion-row>
                <ion-col>
                  <h1> Interes Simple </h1>
                </ion-col>
              </ion-row>
  
              <form @submit.prevent="handleSubmit">
                <ion-row>
                  <ion-col>
                    <ion-input v-model="form_data.name" fill="outline" label-placement="floating" label="Nombre"
                      type="text">
                    </ion-input>
                  </ion-col>
                </ion-row>
  
                <ion-row>
                  <ion-col>
                    <ion-input v-model="form_data.price" error-text="Numero Invalido" fill="outline"
                      label-placement="floating" label="Precio" type="number">
                    </ion-input>
                  </ion-col>
  
                  <!-- <ion-col size="auto"> -->
                  <ion-col size="auto" class="ion-align-self-center">
                    <ion-buttons>
                      <ion-button shape="round" fill="solid"> <!-- @click="" -->
                        barcode
                        <ion-icon aria-hidden="true" slot="end" :ios="barcodeOutline" :md="barcodeSharp" /> </ion-button>
                    </ion-buttons>
                  </ion-col>
                </ion-row>
  
                <ion-row>
                  <ion-col>
                    <ion-input v-model="form_data.quantity" fill="outline" label-placement="floating" label="Cantidad"
                      type="number">
                    </ion-input>
                  </ion-col>
  
                  <ion-col size="auto">
                    <ion-select v-model="form_data.measure" fill="outline" label="" interface="popover" placeholder="medida"
                      @ion-change="handleMeasuresChange">
                      <ion-select-option v-for="(m, i) in MEASURES" :key="i">
                        {{ m }}
                      </ion-select-option>
                    </ion-select>
                  </ion-col>
                </ion-row>
  
                <ion-row>
                  <ion-col>
                    <ion-select fill="outline" label="Categorias" :multiple="true" placeholder="Ninguna"
                      @ion-change="handleCategoriesChange">
                      <template  v-for="(c, i) in CATEGORIES" :key="i">
                        <ion-select-option :value="c">
                          {{ c }}
                        </ion-select-option>
                      </template>
                    </ion-select>
                  </ion-col>
                </ion-row>
  
                <ion-row>
                  <ion-col>
                    <ion-button expand="block" type="submit">{{ button_label }}</ion-button>
                  </ion-col>
                </ion-row>
              </form>
            </ion-card-content>
          </ion-card>
        </ion-grid>
  
  
        <!-- <div id="container"> -->
        <!--   <strong class="capitalize">Settings</strong> -->
        <!--   <p>Explore <a target="_blank" rel="noopener noreferrer" href="https://ionicframework.com/docs/components">UI Components</a></p> -->
        <!-- </div> -->
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
    IonIcon,
  } from '@ionic/vue';
  import {
    barcodeOutline,
    barcodeSharp,
  } from 'ionicons/icons';
  import { useRoute, onBeforeRouteLeave, } from 'vue-router';
  import { ref, computed, toRaw, } from 'vue';
  
  const route = useRoute();
  const MEASURES = ["kg", "g", "lb", "oz"]; // Add your measures here
  const CATEGORIES = ["Electronics", "Clothing", "Food", "Books"]; // Add your categories here
  const default_form = {
    name: "",
    price: "",
    barcode: "",
    quantity: "",
    measure: "",
    categories: "",
  };
  
  const form_data = ref({ ...default_form });
  
  const title_label = ref("");
  const button_label = ref("");
  
  const id = route.query.id;
  const id_exists = false;
  
  
  if (id_exists) {
    console.log("CHANGE from sqlite")
    title_label.value = "Editando Entrada"
    button_label.value = "Actualizar"
  } else {
    console.log("CREATE from sqlite")
    title_label.value = "Creando Entrada"
    button_label.value = "Crear"
  }
  
  const hasFormChanged = computed(() => {
    return Object.keys(form_data.value).some((field) => {
      type key = keyof typeof default_form;
      return form_data.value[field as key] !== default_form[field as key];
    });
  })
  
  const isFormIncomplete = computed(() => {
    if (form_data.value.name === "" || form_data.value.price === "") {
      return true;
    }
    return false;
  })
  
  const handleSubmit = async () => {
    if (isFormIncomplete.value) {
      const alert = await alertController.create({
        header: 'Error',
        message: 'Nombre y Precio obligatorios',
        buttons: ['ok'],
      });
      await alert.present();
      return;
    }
  
    const schema = `CREATE TABLE IF NOT EXITS inventory (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      quantity REAL,
      measure TEXT,
      CATEGORIES TEXT,
      )`;
  
    console.log(toRaw(form_data.value));
  }
  
  const handleMeasuresChange = (ev: any) => {
    form_data.value.measure = ev.detail.value;
  }
  
  const handleCategoriesChange = (ev: any) => {
    form_data.value.categories = JSON.stringify(ev.detail.value);
  }
  
  const getBackButtonText = () => {
    const win = window as any;
    const mode = win && win.Ionic && win.Ionic.mode;
    return mode === 'ios' ? 'Inventario' : '';
  };
  
  
  onBeforeRouteLeave(async (to, from) => {
    // const answer = window.confirm( 'Do you really want to leave? you have unsaved changes!')
    // if (answer === false ) return false
    if (!hasFormChanged.value) {
      return true;
    }
  
    const alert = await alertController.create({
      header: "Descartar cambios?",
      message: "Su progreso se perdera",
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'OK',
          role: 'confirm',
        },
      ]
    })
    await alert.present();
    const result = await alert.onDidDismiss();
    if (result.role === "cancel")
      return false;
  })
  
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
  