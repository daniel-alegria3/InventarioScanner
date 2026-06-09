<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>Scanning</ion-title>
      <ion-buttons slot="end">
        <ion-button @click="closeModal(null)">
          <ion-icon :icon="close"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content>
    <video v-if="isWeb" ref="videoElement" autoplay class="video"></video>
    <div ref="scanLineContainer" class="scan-line-container">
      <div ref="scanLineElement" class="scan-line"></div>
    </div>
    <div class="zoom-ratio-wrapper">
      <ion-range
        :min="minZoomRatio"
        :max="maxZoomRatio"
        :disabled="minZoomRatio === undefined || maxZoomRatio === undefined"
        @ionChange="setZoomRatio"
      ></ion-range>
    </div>
    <ion-fab v-if="isTorchAvailable" horizontal="end" vertical="bottom">
      <ion-fab-button @click="toggleTorch">
        <ion-icon :icon="flashlight"></ion-icon>
      </ion-fab-button>
    </ion-fab>
  </ion-content>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
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
  IonRange,
  modalController,
} from "@ionic/vue";
import { close, flashlight } from "ionicons/icons";
import {
  Barcode,
  BarcodeScanner,
  BarcodeFormat,
  BarcodeValueType,
  LensFacing,
  StartScanOptions,
} from "@capacitor-mlkit/barcode-scanning";
import { Capacitor } from "@capacitor/core";

export interface CodBarra {
  value: string;
  format: BarcodeFormat[];
  type: BarcodeValueType;
}

const props = withDefaults(
  defineProps<{
    lensFacing?: LensFacing;
    formats?: BarcodeFormat[];
    onBarcodeScanned?: (barcode: Barcode) => void;
  }>(),
  {
    lensFacing: LensFacing.Back,
    formats: () => [
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
      BarcodeFormat.UpcA,
      BarcodeFormat.UpcE,
    ],
  },
);

const scanLineContainer = ref<HTMLDivElement | undefined>(undefined);
const scanLineElement = ref<HTMLDivElement | undefined>(undefined);
const videoElement = ref<HTMLVideoElement | undefined>(undefined);
const isWeb = ref<boolean>(Capacitor.getPlatform() === "web");
const isTorchAvailable = ref(false);
const minZoomRatio = ref<number | undefined>(undefined);
const maxZoomRatio = ref<number | undefined>(undefined);

let listener: any = null;
let timeoutChecker: any = null;

onMounted(async () => {
  await nextTick();
  if (!isWeb.value) {
    const { available } = await BarcodeScanner.isTorchAvailable();
    isTorchAvailable.value = available;

    minZoomRatio.value = (await BarcodeScanner.getMinZoomRatio()).zoomRatio;
    maxZoomRatio.value = (await BarcodeScanner.getMaxZoomRatio()).zoomRatio;
    // BarcodeScanner.setZoomRatio({
    //   zoomRatio: Math.max(minZoomRatio.value * 1.2, Math.min(1.5, maxZoomRatio.value)),
    // });
  }
  await BarcodeScanner.requestPermissions();
  await startScan();
});

onBeforeUnmount(async () => {
  await stopScan();
});

const setZoomRatio = (event: CustomEvent) => {
  if (!event.detail.value) return;
  BarcodeScanner.setZoomRatio({ zoomRatio: parseInt(event.detail.value, 10) });
};

const closeModal = async (barcode: Barcode | null) => {
  modalController.dismiss(barcode, "confirm");
};

const toggleTorch = async () => {
  await BarcodeScanner.toggleTorch();
};

const startScan = async () => {
  // Hide everything behind the modal (see `src/theme/variables.scss`)
  document.querySelector("body")?.classList.add("barcode-scanning-active");
  const options: StartScanOptions = {
    formats: props.formats,
    lensFacing: props.lensFacing,
    videoElement: isWeb.value ? videoElement.value : undefined,
  };
  const setLineColor = (color: string) => {
    scanLineElement.value!.style.setProperty("--line-color", color);
  };

  await nextTick(); // Ensure elements are rendered before measuring
  const lineRect = scanLineElement.value!.getBoundingClientRect();
  const lineY = lineRect.top + lineRect.height / 2;
  const tolerance = lineRect.height * 3;

  // Controlled block to the listener from going off every frame that a barcode is on screen
  const ON_SCANNED_TIMEOUT = 500;
  let barcode_scan_succesful: boolean = false;
  let last_scan_time: number = Date.now();
  const colors = {
    ready: "#ef4444",
    blocked: "#334155",
    detected: "#22c55e",
  };
  timeoutChecker = setInterval(() => {
    if (barcode_scan_succesful && Date.now() - last_scan_time > ON_SCANNED_TIMEOUT) {
      barcode_scan_succesful = false;
      setLineColor(colors.ready);
    }
  }, ON_SCANNED_TIMEOUT);
  setLineColor(colors.ready);

  const getBarcodeBoundsY = (cp: NonNullable<Barcode["cornerPoints"]>) => {
    const ys = cp.map((p) => p[1]);
    return { minY: Math.min(...ys), maxY: Math.max(...ys) };
  };
  listener = await BarcodeScanner.addListener("barcodesScanned", async (event) => {
    last_scan_time = Date.now();
    const firstBarcode = event.barcodes.find((barcode) => {
      const cp = barcode.cornerPoints;
      if (!cp) return false;

      if (isWeb.value) {
        const video = videoElement.value!;
        const videoRect = video.getBoundingClientRect();
        const scaleY = videoRect.height / video.videoHeight;
        const { minY, maxY } = getBarcodeBoundsY(cp);
        const barcodeMinY = minY * scaleY + videoRect.top;
        const barcodeMaxY = maxY * scaleY + videoRect.top;
        return lineY >= barcodeMinY - tolerance && lineY <= barcodeMaxY + tolerance;
      } else {
        const { minY, maxY } = getBarcodeBoundsY(cp);
        return lineY >= minY - tolerance && lineY <= maxY + tolerance;
      }
    });

    if (!firstBarcode) return;

    if (barcode_scan_succesful) {
      setLineColor(colors.blocked);
      return;
    }
    barcode_scan_succesful = true;
    setLineColor(colors.detected);

    if (props.onBarcodeScanned) {
      await props.onBarcodeScanned(firstBarcode);
    } else {
      await closeModal(firstBarcode);
    }
  });

  await BarcodeScanner.startScan(options);
};
const stopScan = async () => {
  // Show everything behind the modal again
  document.querySelector("body")?.classList.remove("barcode-scanning-active");
  if (listener) listener.remove();
  clearInterval(timeoutChecker);
  await BarcodeScanner.stopScan();
};
</script>

<style scoped>
ion-content {
  --background: transparent;
}

.scan-line-container {
  position: absolute;
  left: 20%;
  right: 20%;
  top: 50%;
  transform: translateY(-50%);
  height: 160px;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(239, 68, 68, 0.08) 40%,
    rgba(239, 68, 68, 0.15) 50%,
    rgba(239, 68, 68, 0.08) 60%,
    transparent
  );
  box-shadow: 0 0 0 4000px rgba(0, 0, 0, 0.3);
}
.scan-line {
  --line-color: #ef4444;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 2px;
  background-color: var(--line-color);
  border-radius: 2px;
  box-shadow: 0 0 6px 2px var(--line-color);
  transition:
    background-color 0.2s ease,
    box-shadow 0.2s ease;
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
