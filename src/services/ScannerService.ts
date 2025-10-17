// NOTA: este modulo no se usara en las vistas, solo esta de referencia

import {
  Barcode,
  BarcodeFormat,
  BarcodeValueType,
  BarcodeScanner,
  LensFacing,
  GoogleBarcodeScannerModuleInstallState,
} from '@capacitor-mlkit/barcode-scanning';


export interface CodigoBarra {
    valor: string;
    formato: BarcodeFormat;
    tipo_valor: BarcodeValueType;
}

export class ScannerService {
    private formats: BarcodeFormat[] = [
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

    constructor() {
    }

    async init(): Promise<void> {
      await this.installar_modulo_de_google();
    }

    async installar_modulo_de_google(): Promise<void> {
      let estado: GoogleBarcodeScannerModuleInstallState;
      BarcodeScanner.removeAllListeners().then(() => {
        BarcodeScanner.addListener('googleBarcodeScannerModuleInstallProgress', (event) => {
              const { state, progress } = event;
              estado = state;
        });
      });

      switch(estado!) {

        case GoogleBarcodeScannerModuleInstallState.UNKNOWN: { }
        case GoogleBarcodeScannerModuleInstallState.PENDING: { }
        case GoogleBarcodeScannerModuleInstallState.COMPLETED: { }
        case GoogleBarcodeScannerModuleInstallState.DOWNLOADING: { }
        case GoogleBarcodeScannerModuleInstallState.INSTALLING: { }
        case GoogleBarcodeScannerModuleInstallState.DOWNLOAD_PAUSED: {
          // Do nothing
          break
        }

        case GoogleBarcodeScannerModuleInstallState.CANCELED: { }
        case GoogleBarcodeScannerModuleInstallState.FAILED: {
          if (await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable()) {
            await BarcodeScanner.installGoogleBarcodeScannerModule();
          }
          break;
        }

        default: {
          if (await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable()) {
            await BarcodeScanner.installGoogleBarcodeScannerModule();
          }
          break;
        }
      }
    }

    async escanea_uno(): Promise<CodigoBarra> {
      const formats = this.formats;
      const { barcodes } = await BarcodeScanner.scan({
        formats,
      });

      const barcode = barcodes[0];
      return {
        valor: barcode.displayValue,
        formato: barcode.format,
        tipo_valor: barcode.valueType,
      } as CodigoBarra;
    }
}

