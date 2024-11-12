const BarcodeResult = ({ barcode }) => {
    return (
      <div>
        {barcode ? (
          <div>
            <h2>Mã vạch đã quét:</h2>
            <p>{barcode}</p>
          </div>
        ) : (
          <p>Chưa có mã vạch nào được quét.</p>
        )}
      </div>
    );
  };
  
  export default BarcodeResult;
  