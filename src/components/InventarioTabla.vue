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
                        <ion-col size="5">Producto</ion-col>
                        <ion-col size="3">Stock</ion-col>
                        <ion-col size="3">Precio/U</ion-col>
                        <ion-col size="1"></ion-col>
                    </ion-row>

                    <!-- Filas dinámicas -->
                    <ion-row v-for="(producto, index) in Productos" :key="index">
                        <ion-col size="5">{{ producto.nombre }}</ion-col>
                        <ion-col size="3">{{ producto.stock }}</ion-col>
                        <ion-col size="3">S/ {{ producto.precio }}</ion-col>
                        <ion-col size="1" class="iconos">
                            <div class="botonDelete" @click="deleteThis(producto.id, producto.nombre)">
                                <ion-icon :icon="closeCircleOutline"></ion-icon>
                            </div>
                            <div class="botonModificar" @click="ModifyThis(producto.id)">
                                <ion-icon :icon="createOutline"></ion-icon>
                            </div>
                        </ion-col>
                    </ion-row>
                </ion-grid>
            </ion-card-content>
        </ion-card>
    </ion-content>
    <ion-modal :is-open="isOpen" @didDismiss="closeModal">
        <ion-header>
            <ion-toolbar>
                <ion-title>Editar Producto</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <ion-card>
                <ion-input v-model="productoEditado.nombre" fill="outline" label-placement="floating"
                    label="Nombre del producto" type="text"></ion-input>
                <ion-input type="number" v-model="productoEditado.stock" fill="outline" label-placement="floating"
                label="Stock del producto" ></ion-input>
                <ion-input type="number" v-model="productoEditado.precio" fill="outline" label-placement="floating"
                label="Precio del producto" ></ion-input>
                <ion-button expand="full" @click="guardarCambios">Guardar</ion-button>
            </ion-card>
        </ion-content>
    </ion-modal>

</template>

<script setup lang="ts">
import {
    IonCard,
    IonContent,
    IonHeader,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCardTitle,
    IonIcon,
    IonInput,
    IonButton,
    IonModal,
    IonToolbar,
    IonTitle,
    alertController
} from '@ionic/vue';
import {
    closeCircleOutline
    , createOutline
} from 'ionicons/icons';

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

const isOpen = ref(false);
const productoEditado = ref({ id: 0, nombre: '', stock: 0, precio: 0 });

const ModifyThis = (id: number) => {
    const producto = Productos.value.find(p => p.id === id);
    if (producto) {
        productoEditado.value = { ...producto }; // Copia los datos
        isOpen.value = true;
    }
};

const closeModal = () => {
    isOpen.value = false;
};

const guardarCambios = async () => {
    try {
        // Actualizar el producto en la base de datos
        // actualizarProducto(productoEditado.value);
        // Actualizar el producto en la lista del frontend
        const index = Productos.value.findIndex(p => p.id === productoEditado.value.id);
        if (index !== -1) Productos.value[index] = { ...productoEditado.value };

        isOpen.value = false;
    } catch (error) {
        console.error('Error al actualizar:', error);
    }
};

</script>


<style scoped>
.Productos {
    margin: 20px 7% 0px 7%;
    min-height: 500px;
}

.botonDelete,
.botonModificar {
    cursor: pointer;
    margin: 0px 10px;
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

ion-input {
    margin: 20px 0;
}
.iconos {
    display: flex;
}
</style>
