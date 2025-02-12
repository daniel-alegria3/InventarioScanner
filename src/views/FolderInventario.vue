<template>
  <ion-page>
      <!-- Header -->
      <ion-header :translucent="true">
          <ion-toolbar>
              <ion-buttons slot="start">
                  <ion-menu-button color="primary"></ion-menu-button>
              </ion-buttons>
              <ion-title>Inventario</ion-title>
          </ion-toolbar>
      </ion-header>

      <!-- Contenido principal -->
      <ion-content :fullscreen="true">
          <ion-header collapse="condense">
              <ion-toolbar>
                  <ion-title size="large">Inventario</ion-title>
              </ion-toolbar>
          </ion-header>

          <ion-input v-model="search_text" fill="outline" label-placement="floating"
                    label="Nombre del producto" type="text">
                </ion-input>
                 <!-- Contenedor de categorías con scroll horizontal -->
                 <div class="categorias-scroll">
                    <button class="categoria-btn" v-for="(categoria, index) in Categorias" :key="index"
                        :class="['categoria-btn', { 'active': categoriaSeleccionada === categoria }]"
                        @click="toggleCategoria(categoria, $event)">
                        {{ categoria }}
                    </button>
                </div>

          <!-- Tabla de Inventario -->
          <InventarioTabla />

          <!-- Botón flotante para agregar productos -->
          <ion-fab vertical="bottom" horizontal="end" slot="fixed">
              <ion-fab-button @click="openModal">
                  <ion-icon :icon="addOutline" />
              </ion-fab-button>
          </ion-fab>

          <!-- Modal para agregar producto -->
          <ModalAgregarProducto :isOpen="modalAbierto" @cerrar="cerrarModal" />
      </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar , IonFab, IonFabButton, IonIcon, IonInput} from '@ionic/vue';
import InventarioTabla from '@/components/InventarioTabla.vue';
import ModalAgregarProducto from '@/components/ModalAgregarNuevoProducto.vue';
import { addOutline } from 'ionicons/icons';
import { ref } from 'vue';
import { useSearch } from "@/composables/useSearch";

const { search_text, search_results } = useSearch();

const modalAbierto = ref(false);

const Categorias = ref(['Electrodomésticos', 'Electrónicos', 'Herramientas', 'Muebles', 'Ropa', 'Zapatos', 'Otros']);
const openModal = () => {
    modalAbierto.value = true;
};

const cerrarModal = () => {
    modalAbierto.value = false;
};

const categoriaSeleccionada = ref(['']); // Categoría seleccionada

const toggleCategoria = (categoria: string, event: Event) => {
    if (categoriaSeleccionada.value.includes(categoria)) {
        categoriaSeleccionada.value = ''; // Desactiva si ya está seleccionada
    } else {
        categoriaSeleccionada.value = categoria; // Activa si no está seleccionada
    }
};

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
    border: 0.5px solid transparent; /* Se inicia sin borde */
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
    margin: 20px 7% 0px 7%;
    width: 86%;
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

    margin: 20px 7% 0px 7%;
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

</style>

