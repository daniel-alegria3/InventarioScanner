import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

export class ScannerService {

    constructor() {
    }

    async init() {
        if (!(await BarcodeScanner.isSupported())) {
            // data = "BarcodeScanner not supported in this platform";
            return;
        }

        if (!(await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable())) {
            BarcodeScanner.installGoogleBarcodeScannerModule();
        }

    }

    async escanear_uno(): Promise<any> {
        let data: any;
        const listener = await BarcodeScanner.addListener(
            'barcodesScanned',
            async result => {
                await listener.remove();
                await BarcodeScanner.stopScan();
                data = result.barcodes;
            },
        );

        await BarcodeScanner.startScan();
        return data;
    }

    // async startScan(): Promise<any> {
    //     let data: any;
    //     try {
    //         const result = await BarcodeScanner.scan();
    //         if (result.hasContent) {
    //             data = result.content;
    //         } else {
    //             data = 'No barcode detected.';
    //             console.log('No barcode detected.');
    //         }
    //     } catch (error) {
    //         data = 'Barcode scanning failed:'.concat(" ", error);
    //         console.error('Barcode scanning failed', error);
    //     }
    //
    //     return data;
    // }
}


