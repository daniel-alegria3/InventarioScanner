import { modalController } from '@ionic/vue';

import { ref } from 'vue';
import ModalBarcodeScanner from '@/components/ModalBarcodeScanner.vue';

export function useBarcodeScanner(onScanned?: (barcode: string) => void) {
  const barcodeToString = (barcodeData: any) => {
    // data.value/format/type
    return `${barcodeData.format}:${barcodeData.value}`;
  };

  const openBarcodeScanner = async () => {
    const modal = await modalController.create({
      component: ModalBarcodeScanner,
      cssClass: 'barcode-scanning-modal',
    });

    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (data) {
      return barcodeToString(data);
    }
    return null;
  };

  const openBarcodeScannerMultiple = async () => {
    const modal = await modalController.create({
      component: ModalBarcodeScanner,
      cssClass: 'barcode-scanning-modal',
      componentProps: {
        onBarcodeScanned: (barcodeData: any) => {
          onScanned(barcodeToString(barcodeData));
        },
      },
    });

    modal.present();

    const { data, role } = await modal.onWillDismiss();
  };

  return { openBarcodeScanner, openBarcodeScannerMultiple };
}
