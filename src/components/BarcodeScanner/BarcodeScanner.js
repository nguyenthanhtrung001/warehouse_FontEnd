import { useEffect, useRef } from 'react';
import Quagga from 'quagga';

const BarcodeScanner = ({ onDetected, scanFromFile }) => {
  const scannerRef = useRef(null);

  // Quét từ camera
  useEffect(() => {
    if (!scanFromFile) {
      Quagga.init({
        inputStream: {
          type: 'LiveStream',
          constraints: {
            facingMode: 'environment', // Camera sau
          },
          target: scannerRef.current,
        },
        decoder: {
          readers: ['code_128_reader', 'ean_reader', 'ean_8_reader', 'code_39_reader', 'upc_reader'], // Hỗ trợ nhiều loại mã vạch
        },
      }, (err) => {
        if (err) {
          console.error('Quagga init error:', err);
          return;
        }
        Quagga.start();
      });

      Quagga.onDetected((result) => {
        if (result && result.codeResult && result.codeResult.code) {
          onDetected(result.codeResult.code);
        }
      });

      return () => {
        Quagga.stop();
      };
    }
  }, [scanFromFile, onDetected]);

  return !scanFromFile ? (
    <div>
      <div ref={scannerRef} style={{ width: '100%', height: '400px', border: '1px solid black' }} />
      <p>Đang quét mã vạch từ camera...</p>
    </div>
  ) : null;
};

export default BarcodeScanner;
