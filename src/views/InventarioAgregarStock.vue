<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button :text="getBackButtonText()" default-href="/folder/Inventario"></ion-back-button>
        </ion-buttons>
        <ion-title>Agregar Stock</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="contenedor">
        <div class="buscador">
          <ion-grid>
            <ion-card class="Mostrar">
              <ion-card-content>
                <ion-input v-model="search_text" fill="outline" label-placement="floating" label="Nombre del producto"
                  type="text">
                </ion-input>
                <!-- Contenedor de categorías con scroll horizontal -->
                <div class="categorias-scroll">
                  <button class="categoria-btn" v-for="(categoria, index) in Categorias" :key="index"
                    :class="['categoria-btn', { 'active': categoriaSeleccionada.includes(categoria) }]"
                    @click="toggleCategoria(categoria, $event)">
                    {{ categoria }}
                  </button>
                </div>
                <ion-row class="headerProductos">
                  <ion-col size="4">Producto</ion-col>
                  <ion-col size="4">Stock</ion-col>
                  <ion-col size="4">Precio</ion-col>
                </ion-row>
                <ion-row v-for="(product, index) in Productos" :key="index">
                  <ion-col size="4"><button @click="selectThis(product.nombre)">{{
                    product.nombre }}</button></ion-col>
                  <ion-col size="4">{{ product.stock }}</ion-col>
                  <ion-col size="4">{{ product.precio }}</ion-col>
                </ion-row>
              </ion-card-content>
            </ion-card>
          </ion-grid>
        </div>
        <div class="agregarExistencias">
          <ion-grid class="ion-justify-content-center">
            <ion-card>
              <ion-card-header>
                <ion-card-title>Agregar Existencias</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <form @submit.prevent="handleSubmit">
                  <ion-row>
                    <ion-col>
                      <ion-input v-model="form_data.name" fill="outline" label-placement="floating"
                        label="Nombre del producto" type="text" required></ion-input>
                    </ion-col>
                  </ion-row>
                  <ion-row>
                    <ion-col>
                      <ion-input v-model="form_data.quantity" fill="outline" label-placement="floating" label="Cantidad"
                        type="number" required></ion-input>
                    </ion-col>
                    <ion-col>
                      <ion-select v-model="form_data.unidadMedida" fill="outline" :multiple="true" label="Unidad de medida" class="unidadMedida" default="Unidades">
                        <ion-select-option v-for="(unidad, index) in UnidadesMedida" :key="index">
                          {{ unidad }}
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
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonBackButton,
  IonButtons,
  IonHeader,
  IonPage,
  IonToolbar,
  IonContent,
  alertController,
  IonCol,
  IonGrid,
  IonRow,
  IonInput,
  IonButton,
  IonCardContent,
  IonCard,
} from '@ionic/vue';
import { ref, computed, toRaw } from 'vue';

import { useSearch } from "@/composables/useSearch";

const { search_text, search_results } = useSearch();

interface Producto {
  id: number;
  nombre: string;
  stock: number;
  precio: number;
}

const categoriaSeleccionada = ref<string[]>([]); // Ahora es un array vacío

const toggleCategoria = (categoria: string, event: Event) => {
  const index = categoriaSeleccionada.value.indexOf(categoria);

  if (index !== -1) {
    // Si ya está seleccionada, la eliminamos
    categoriaSeleccionada.value.splice(index, 1);
  } else {
    // Si no está seleccionada, la agregamos
    categoriaSeleccionada.value.push(categoria);

    // Desplazamos la vista hacia el botón seleccionado
    const target = event.currentTarget as HTMLElement;
    target.scrollIntoView({ behavior: "smooth", inline: "center" });
  }
  console.log(categoriaSeleccionada.value);
};

const selectThis = (nombre: string) => {
  form_data.value.name = nombre;

};

const Productos = ref<Producto[]>([
  { id: 1, nombre: 'Pepsi', stock: 5, precio: 2.0 },
  { id: 2, nombre: 'Sprite', stock: 8, precio: 2.5 },
  { id: 3, nombre: 'Fanta', stock: 3, precio: 2.0 },
]);
const Categorias = ref<string[]>(['Gaseosas', 'Dulces', 'Galletas', 'Snacks', 'Cervezas', 'Licores']);
const UnidadesMedida = ref<string[]>(['Unidades', 'Kilogramos', 'Litros', 'Metros']);

interface FormData {
  name: string;
  quantity: string;
  unidadMedida: string;
}

const getBackButtonText = () => {
  const win = window as any;
  const mode = win?.Ionic?.mode;
  return mode === 'ios' ? 'Inventario' : '';
};

const default_form: FormData = {
  name: "",
  quantity: "",
  unidadMedida: "Unidades",
};

const form_data = ref<FormData>({ ...default_form });

const isFormIncomplete = computed(() => {
  return form_data.value.name === "" || form_data.value.quantity === "";
});

const resetForm = () => {
  form_data.value = { ...default_form };
};

const handleSubmit = async () => {
  if (isFormIncomplete.value) {
    const alert = await alertController.create({
      header: 'Error',
      message: 'Nombre y Cantidad son obligatorios',
      buttons: ['OK'],
    });
    await alert.present();
    return;
  }

  //Usar funcion que agrega a la base de datos de un formulario
  //agregarStockProducto(form_data.value);
  console.log("Stock Agregado: ", toRaw(form_data.value));
};
</script>

<style scoped>
ion-row.headerProductos {
  font-weight: bold;
  background-color: var(--ion-color-light);
  text-align: center;
  border-bottom: 1px solid var(--ion-color-medium);
}

ion-row {
  text-align: center;
  padding: 10px 0;
}

ion-row:nth-child(even) {
  background-color: var(--ion-color-light-shade);
}

button {
  background-color: transparent;
  border: none;
  color: var(--ion-color-primary);
  cursor: pointer;
}

.categoria-btn {
  flex: 0 0 auto;
  margin: 10px;
  color: white;
  min-width: 80px;
  max-width: none;
  background-color: rgb(29, 28, 28);
  padding: 9px;
  text-overflow: clip;
  border-radius: 10px;
  overflow: visible;
  border: 0.5px solid transparent;
  /* Se inicia sin borde */
  transition: border-color 0.1s ease-in-out, background-color 0.7s ease-in-out;
  /* Agregamos una transición suave */
}

.categoria-btn.active {
  border-color: white;
  background-color: var(--ion-color-primary);
  color: white;
}

ion-input {
  background-color: rgb(29, 28, 28);
  --padding-start: 15px;
}

.categorias-scroll {
  display: flex;
  overflow-x: auto;
  /* Permite el desplazamiento horizontal */
  white-space: nowrap;
  /* Evita que los botones se rompan en varias líneas */
  padding: 10px;
  gap: 10px;
  /* Espaciado entre botones */
  scrollbar-width: thin;
  /* Reduce el tamaño de la barra de desplazamiento en Firefox */
  -webkit-overflow-scrolling: touch;
  /* Mejora el desplazamiento en dispositivos táctiles */
}

/* Personaliza la barra de desplazamiento en Webkit (Chrome, Edge, Safari) */
.categorias-scroll::-webkit-scrollbar {
  height: 6px;
}

.categorias-scroll::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}

.categorias-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.contenedor {
  display: flex;
  gap: 20px;
}

.Mostrar {
  min-height: 90vh;
  max-height: 200%;
  scroll-behavior: smooth;
  overflow-y: auto;
}

.buscador {
  width: 50%;
}

.agregarExistencias {
  height: 85vh;
  display: flex;
  align-items: center;
  width: 50%;
}

/* Cambia la dirección a columna en pantallas pequeñas */
@media (max-width: 768px) {
  .contenedor {
    flex-direction: column;
    /* Acomoda los elementos en columna */
    align-items: center;
    /* Centra los elementos */
  }

  .buscador,
  .agregarExistencias {
    height: auto;
    width: 100%;
    /* Ocupan todo el ancho en móvil */
  }
}
</style>