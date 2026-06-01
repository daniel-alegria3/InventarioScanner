import { modalController } from "@ionic/vue";

import { ref } from "vue";
import ModalBarcodeScanner from "@/components/ModalBarcodeScanner.vue";
import { Barcode } from "@capacitor-mlkit/barcode-scanning";

const barcodeToString = (barcode: Barcode) => {
  // barcode.format/displayValue/valueType
  return `${barcode.format}:${barcode.displayValue}`;
};

export function useBarcodeScanner() {
  const openBarcodeScanner = async () => {
    const modal = await modalController.create({
      component: ModalBarcodeScanner,
      cssClass: "barcode-scanning-modal",
    });

    modal.present();

    const { data, role } = await modal.onDidDismiss();

    if (data) {
      return barcodeToString(data);
    }
    return null;
  };

  return { openBarcodeScanner };
}

export function useBarcodeScannerMultiple(onScanned: (barcode: string) => void) {
  const openBarcodeScannerMultiple = async () => {
    const modal = await modalController.create({
      component: ModalBarcodeScanner,
      cssClass: "barcode-scanning-modal",
      componentProps: {
        onBarcodeScanned: (barcode: Barcode) => {
          onScanned(barcodeToString(barcode));
        },
      },
    });

    modal.present();

    const { data, role } = await modal.onDidDismiss();
  };

  return { openBarcodeScannerMultiple };
}
