"use client"
import { SetStateAction, useState } from 'react';
import BarcodeScanner from '@/components/BarcodeScanner/BarcodeScanner';
import BarcodeResult from '@/components/BarcodeScanner/BarcodeResult';
import ImageBarcodeScanner from '@/components/BarcodeScanner/ImageBarcodeScanner';


const ScanBarcodePage = () => {
  const [barcode, setBarcode] = useState('');
  const [scanFromFile, setScanFromFile] = useState(false);

  const handleDetected = (code: SetStateAction<string>) => {
    setBarcode(code);
    console.log('Mã vạch đã được quét:', code);
  };

  return (
    <div>
      <h1>Quét mã vạch sản phẩm</h1>

      {/* Tùy chọn quét từ camera hoặc tải hình ảnh */}
      <div className="mb-4">
        <button
          onClick={() => setScanFromFile(false)}
          className={`p-2 rounded mr-2 ${!scanFromFile ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Quét từ Camera
        </button>
        <button
          onClick={() => setScanFromFile(true)}
          className={`p-2 rounded ${scanFromFile ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Quét từ Hình ảnh
        </button>
      </div>

      {/* Component quét mã vạch */}
      {!scanFromFile ? (
        <BarcodeScanner onDetected={handleDetected} scanFromFile={scanFromFile} />
      ) : (
        <ImageBarcodeScanner onDetected={handleDetected} />
      )}

      {/* Hiển thị kết quả mã vạch */}
      <BarcodeResult barcode={barcode} />
    </div>
  );
};

export default ScanBarcodePage;



// "use client"
// import BarcodeScanner from '@/components/BarcodeScanner/test';

// const MyPage = () => {
//   const handleScan = (barcode: any) => {
//     console.log('Mã vạch đã quét:', barcode);
//     // Gửi dữ liệu mã vạch lên server hoặc thực hiện các xử lý khác
//   };

//   return (
//     <div>
//       <BarcodeScanner onDetected={handleScan} />
//     </div>
//   );
// };

// export default MyPage;