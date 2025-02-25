<template>
  <ion-modal :is-open="isOpen" @didDismiss="closeModal">
    <ion-header>
      <ion-toolbar>
        <ion-title>Scanning</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="closeModal">
            <ion-icon name="close"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <video ref='video' autoplay class="video"></video>
      <div ref='square' class="square"></div>
      <div class="zoom-ratio-wrapper">
        <ion-range
          :min="minZoomRatio"
          :max="maxZoomRatio"
          :disabled="minZoomRatio === undefined || maxZoomRatio === undefined"
          @ionChange="setZoomRatio"
        ></ion-range>
      </div>
      <ion-fab v-if="isTorchAvailable" slot="fixed" horizontal="end" vertical="bottom">
        <ion-fab-button @click="toggleTorch">
          <ion-icon name="flashlight"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonFab,
  IonFabButton,
  modalController,
} from '@ionic/vue';
import { BarcodeScanner, BarcodeFormat, LensFacing } from '@capacitor-mlkit/barcode-scanning';
import { Torch } from '@capawesome/capacitor-torch';
import { Capacitor } from '@capacitor/core';

export interface CodigoBarra {
    valor: string;
    formato: BarcodeFormat;
    tipo_valor: BarcodeValueType;
}

const props = defineProps<{
}>();
const props = withDefaults(defineProps<{
  lensFacing?: LensFacing;
  formats?: BarcodeFormat[];
  barcode?: CodigoBarra;
}>(), {
  lensFacing: LensFacing.Back;
  formats: [
    BarcodeFormat.Aztec,
    BarcodeFormat.Codabar,
    BarcodeFormat.Code39,
    BarcodeFormat.Code93,
    BarcodeFormat.Code128,
    BarcodeFormat.DataMatrix,
    BarcodeFormat.Ean8,
    BarcodeFormat.Ean13,
    BarcodeFormat.Itf,
    BarcodeFormat.Pdf417,
    BarcodeFormat.QrCode,
    BarcodeFormat.UpcA,
    BarcodeFormat.UpcE,
  ];
});

const emit = defineEmits(['update:barcode']); // Enables 'v-model' for barcode

const squareElement = ref<HTMLDivElement | undefined>(undefined);
const videoElement = ref<HTMLVideoElement | undefined>(undefined);
const isTorchAvailable = ref(false);
const minZoomRatio = ref<number | undefined>(undefined);
const maxZoomRatio = ref<number | undefined>(undefined);

onMounted(async () => {
  const torchResult = await Torch.isAvailable();
  isTorchAvailable.value = torchResult.available;
  setTimeout(startScan, 500);
});

onBeforeUnmount(stopScan);

const startScan = async () => {
  // Hide everything behind the modal (see `src/theme/variables.scss`)
  // document.querySelector('body')?.classList.add('barcode-scanning-active');
  document.body.classList.add('barcode-scanning-active');

  const options: StartScanOptions = {
    formats: props.formats;
    lensFacing: props.lensFacing,
    videoElement: Capacitor.getPlatform() === 'web' ? videoElement.value ?? undefined : undefined,
  };

  await nextTick(); // Ensure elements are rendered before measuring

  const squareBoundingRect = squareElement.value?.getBoundingClientRect();
  const scaledRect = squareBoundingRect
    ? {
        left: squareBoundingRect.left * window.devicePixelRatio,
        right: squareBoundingRect.right * window.devicePixelRatio,
        top: squareBoundingRect.top * window.devicePixelRatio,
        bottom: squareBoundingRect.bottom * window.devicePixelRatio,
        width: squareBoundingRect.width * window.devicePixelRatio,
        height: squareBoundingRect.height * window.devicePixelRatio,
      }
    : undefined;

  const detectionCornerPoints = scaledRect
    ? [
        [scaledRect.left, scaledRect.top],
        [scaledRect.left + scaledRect.width, scaledRect.top],
        [scaledRect.left + scaledRect.width, scaledRect.top + scaledRect.height],
        [scaledRect.left, scaledRect.top + scaledRect.height],
      ]
    : undefined;

  const listener = await BarcodeScanner.addListener('barcodesScanned', async (event) => {
    const firstBarcode: Barcode | undefined = event.barcodes[0];
    if (!firstBarcode) {
      return;
    }

    const cornerPoints = firstBarcode.cornerPoints;
    if (detectionCornerPoints && cornerPoints && Capacitor.getPlatform() !== 'web') {
      if (
        detectionCornerPoints[0][0] > cornerPoints[0][0] ||
        detectionCornerPoints[0][1] > cornerPoints[0][1] ||
        detectionCornerPoints[1][0] < cornerPoints[1][0] ||
        detectionCornerPoints[1][1] > cornerPoints[1][1] ||
        detectionCornerPoints[2][0] < cornerPoints[2][0] ||
        detectionCornerPoints[2][1] < cornerPoints[2][1] ||
        detectionCornerPoints[3][0] > cornerPoints[3][0] ||
        detectionCornerPoints[3][1] < cornerPoints[3][1]
      ) {
        return;
      }
    }

    listener.remove();
    updateBarcode({
      valor:  firstBarcode.displayValue,
      formato: firstBarcode.format,
      tipo_valor: firstBarcode.valueType,
    } as CodigoBarra);
    closeModal();
  });

  await BarcodeScanner.startScan(options);

  if (Capacitor.getPlatform() !== 'web') {
    minZoomRatio.value = (await BarcodeScanner.getMinZoomRatio()).zoomRatio;
    maxZoomRatio.value = (await BarcodeScanner.getMaxZoomRatio()).zoomRatio;
  }
};
const stopScan = async () => {
  // Show everything behind the modal again
  document.querySelector('body')?.classList.remove('barcode-scanning-active');
  await BarcodeScanner.stopScan();
};


const toggleTorch = async () => {
  await Torch.toggle();
};
const setZoomRatio = (event) => {
  if (!event.detail.value) return;
  BarcodeScanner.setZoomRatio({ zoomRatio: parseInt(event.detail.value, 10) });
};


const openModal = () => {
  isOpen.value = true;
};
const closeModal = () => {
  isOpen.value = false;
};

const updateBarcode = (new: CodigoBarra) => {
  emit('update:barcode', new);
};

</script>

<style scoped>
ion-content {
  --background: transparent;
}
.square {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 16px;
  width: 200px;
  height: 200px;
  border: 6px solid white;
  box-shadow: 0 0 0 4000px rgba(0, 0, 0, 0.3);
}
.video {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.zoom-ratio-wrapper {
  position: absolute;
  left: 50%;
  bottom: 16px;
  transform: translateX(-50%);
  width: 50%;
}
</style>

