import { modalController } from '@ionic/vue';

import { ref } from 'vue';
import ModalBarcodeScanner from '@/components/ModalBarcodeScanner.vue';

export function useBarcodeScanner(onScanned?: (barcode: string) => void) {
  const openBarcodeScanner = async () => {
    const modal = await modalController.create({
      component: ModalBarcodeScanner,
      cssClass: 'barcode-scanning-modal',
    });

    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (data) {
      // data.value/format/type
      return data.value;
    }
    return null;
  };

  const openBarcodeScannerMultiple = async () => {
    const modal = await modalController.create({
      component: ModalBarcodeScanner,
      cssClass: 'barcode-scanning-modal',
      componentProps: {
        onBarcodeScanned: (barcodeData: any) => {
          // barcodeData.value/format/type
          onScanned(barcodeData.value);
        },
      },
    });

    modal.present();

    const { data, role } = await modal.onWillDismiss();
  };

  return { openBarcodeScanner, openBarcodeScannerMultiple };
}
