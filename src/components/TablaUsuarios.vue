<template>
    <ion-content>
        <ion-card class="Productos">
            <ion-card-header>
                <ion-card-title>Tabla de Productos</ion-card-title>
            </ion-card-header>
            <ion-card-content>
                <ion-grid>
                    <!-- Encabezados de la tabla -->
                    <ion-row class="header">
                        <ion-col size="3">Producto</ion-col>
                        <ion-col size="3">Cantidad</ion-col>
                        <ion-col size="3">Precio/U</ion-col>
                        <ion-col size="3">Total/Parcial</ion-col>
                    </ion-row>

                    <!-- Filas dinámicas -->
                    <ion-row v-for="(usuario, index) in usuarios" :key="index">
                        <ion-col size="3">{{ usuario.producto }}</ion-col>
                        <ion-col size="3">{{ usuario.cantidad }}</ion-col>
                        <ion-col size="3">S/ {{ usuario.precio }}</ion-col>
                        <ion-col size="3">S/ {{ usuario.cantidad * usuario.precio }}</ion-col>
                    </ion-row>
                </ion-grid>
            </ion-card-content>
        </ion-card>
        <ion-card class="Total">
            <ion-card-content>
                <h1 class="TotalPrecio">
                    <span>Total: </span>
                    <span>S/ {{ Total }}</span>
                </h1>
            </ion-card-content>
        </ion-card>
        <div class="botonCancelar boton">
            <ion-button @:click="cancelar">
                <ion-icon name="cash-outline" slot="start" :ios="cash" :md="cashSharp"></ion-icon>
                Cancelado
            </ion-button>
        </div>
    </ion-content>
</template>

<script setup lang="ts">
import {
    IonCard,
    IonContent,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCardHeader,
    IonCardTitle,
    IonButton,
    IonIcon
} from '@ionic/vue';
import {
    cashSharp,
    cash
} from 'ionicons/icons';
import { ref, watch } from 'vue';
const usuarios = ref([
    { producto: 'Gaseosa ORO', cantidad: 1, precio: 1.5, total: 0 },
    { producto: 'Galleta', cantidad: 2, precio: 0.80, total: 0 },
    { producto: 'Pastel', cantidad: 3, precio: 1.0, total: 0 },
    { producto: 'Chocolate', cantidad: 4, precio: 0.50, total: 0 },
    { producto: 'Caramelo', cantidad: 5, precio: 0.20, total: 0 },
]);
const Total = ref(0);

const calcularTotal = () => {
    Total.value = usuarios.value.reduce((suma, usuario) => {
        return suma + usuario.cantidad * usuario.precio;
    }, 0)
}
watch(usuarios, calcularTotal, { deep: true });
calcularTotal();
const cancelar = () => {
    usuarios.value = [];
    Total.value = 0;
}
const agregarProducto = () => {
    usuarios.value.push({ producto: 'Producto', cantidad: 1, precio: 1, total: 0 });
}
</script>


<style scoped>
.Productos {
    margin: 20px 7% 0px 7%;
    min-height: 500px;
}

ion-row.header {
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

.Total {
    margin: 20px 7% 0px 7%;
}

.TotalPrecio {
    display: flex;
    justify-content: space-between; /* Espacio entre el texto y el total */
    padding: 0px 10% 0px 0px;
    font-size: 1.5em;
    font-weight: bold;

}

ion-button {
    margin: 20px 7% 0px 0px;
    float: right;
}

ion-icon {
    font-size: 1.5em;
    padding: 5px;
}
</style>
