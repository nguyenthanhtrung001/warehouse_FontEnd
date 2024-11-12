declare module 'react-barcode-reader' {
    import { Component } from 'react';
  
    interface BarcodeReaderProps {
      onError?: (err: any) => void;
      onScan?: (data: string | null) => void;
      onKeyDetect?: (key: string) => void;
      timeBeforeScanTest?: number;
      errorMessage?: string;
      startScanning?: boolean;
      stopPropagation?: boolean;
      minLength?: number;
    }
  
    export default class BarcodeReader extends Component<BarcodeReaderProps> {}
  }
  