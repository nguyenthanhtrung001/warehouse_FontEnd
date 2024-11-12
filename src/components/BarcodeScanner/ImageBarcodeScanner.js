import { useState } from 'react';
import Quagga from 'quagga';

const ImageBarcodeScanner = ({ onDetected }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
        startQuagga(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const startQuagga = (src) => {
    Quagga.onDetected((result) => {
      if (result && result.codeResult && result.codeResult.code) {
        onDetected(result.codeResult.code);
      } else {
        setErrorMessage('Không tìm thấy mã vạch trong hình ảnh.');
      }
    });

    Quagga.decodeSingle({
      src: src,
      numOfWorkers: 0, // Hạn chế sử dụng worker cho đơn giản
      inputStream: {
        type: 'ImageStream',
        // Thêm thuộc tính này nếu bạn tạo canvas tùy chỉnh
        willReadFrequently: true,
      },
      decoder: {
        readers: ['code_128_reader', 'ean_reader', 'ean_8_reader', 'code_39_reader', 'upc_reader'],
      },
    }, (result) => {
      if (result && result.codeResult && result.codeResult.code) {
        onDetected(result.codeResult.code);
      } else {
        setErrorMessage('Không tìm thấy mã vạch trong hình ảnh.');
      }
    });
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {imageSrc && <img src={imageSrc} alt="Mã vạch" style={{ width: '100%', height: 'auto' }} />}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default ImageBarcodeScanner;
