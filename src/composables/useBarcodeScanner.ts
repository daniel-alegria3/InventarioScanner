import { modalController } from '@ionic/vue';

import { ref } from 'vue';
import ModalBarcodeScanner from '@/components/ModalBarcodeScanner.vue';

export function useBarcodeScanner() {
  const barcode = ref<Object>({});

  const openBarcodeScanner = async () => {
    const modal = await modalController.create({
      component: ModalBarcodeScanner,
      cssClass: 'barcode-scanning-modal',
    });

    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (data) {
      // data.valor/formato/tipo_valor
      barcode.value = data.valor;
    }
  };

  return { barcode, openBarcodeScanner };
}
