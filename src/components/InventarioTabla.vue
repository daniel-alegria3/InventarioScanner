<template>
    <ion-content>
        <ion-card class="Productos">
            <div class="ion-card-header">
                <ion-card-title>Tabla de Productos</ion-card-title>
                <a class="btnAgregarStock" href="/folder/Inventario/AgregarExistencias">Agregar Existencias</a>
            </div>
            <ion-card-content>
                <ion-grid>
                    <!-- Encabezados de la tabla -->
                    <ion-row class="header">
                        <ion-col size="3">Producto</ion-col>
                        <ion-col size="3">Stock</ion-col>
                        <ion-col size="3">Precio/U</ion-col>
                    </ion-row>

                    <!-- Filas dinámicas -->
                    <ion-row v-for="(producto, index) in Productos" :key="index">
                        <ion-col size="3">{{ producto.nombre }}</ion-col>
                        <ion-col size="3">{{ producto.stock }}</ion-col>
                        <ion-col size="3">S/ {{ producto.precio }}</ion-col>
                        <ion-col size="3">
                            <div class="botonDelete" @click="deleteThis(producto.id, producto.nombre)">
                                <ion-icon :icon="closeCircleOutline"></ion-icon>
                            </div>
                        </ion-col>
                    </ion-row>
                </ion-grid>
            </ion-card-content>
        </ion-card>
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
    IonCardTitle,
    IonIcon,
    alertController
} from '@ionic/vue';
import { closeCircleOutline } from 'ionicons/icons';

import { ref } from 'vue';

interface Producto {
    id: number;
    nombre: string;
    stock: number;
    precio: number;
}

const Productos = ref<Producto[]>([
    { id: 1, nombre: 'Gaseosa ORO', stock: 1, precio: 1.5 },
    { id: 2, nombre: 'Galleta', stock: 2, precio: 0.80 },
    { id: 3, nombre: 'Pastel', stock: 3, precio: 1.0 },
    { id: 4, nombre: 'Chocolate', stock: 4, precio: 0.50 },
    { id: 5, nombre: 'Caramelo', stock: 5, precio: 0.20 },
]);

const deleteThis = async (id: number, nombre: string): Promise<void> => {
    const alert = await alertController.create({
        header: 'Eliminar Producto',
        message: '¿Estás seguro de eliminar ' + nombre + ' ?',
        buttons: [
            {
                text: 'Cancelar',
                role: 'cancel',
            },
            {
                text: 'Eliminar',
                handler: () => {
                    //llamar a una funcion que eliminara el producto de la base de datos
                    //eliminarProducto(id);

                    //Solo se eliminara de la lista de productos
                    const index = Productos.value.findIndex((producto) => producto.id === id);
                    Productos.value.splice(index, 1);
                },
            },
        ],
    });

    (await alert).present();

};
</script>


<style scoped>
.Productos {
    margin: 20px 7% 0px 7%;
    min-height: 500px;
}

.botonDelete {
    cursor: pointer;
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

ion-button {
    margin: 0px 0px 0px 0px;
}

ion-icon {
    color: azure;
    background-color: transparent;
    font-size: 1.5em;
    padding: 0px;
}
.btnAgregarStock {
    background-color: var(--ion-color-primary);
    color: white;
    padding: 10px;
    border-radius: 5px;
    text-decoration: none;
}

.ion-card-header {
    padding: 25px;
    display: flex;
    justify-content: space-between;
}
</style>
