// Định nghĩa kiểu dữ liệu cho từng sản phẩm trong itemForecastTotal
export type ItemForecast = {
    itemId: string;        // ID sản phẩm
    productName: string;   // Tên sản phẩm
    forecastValue: number; // Giá trị dự đoán
    inventory: number;     // Tồn kho
  };
  
  // Định nghĩa kiểu dữ liệu cho từng dự báo trong forecastResults
  export type ForecastResult = {
    timestamp: any;
    itemId: string;                      // ID sản phẩm
    forecastTimestamp: string;           // Thời gian dự đoán
    forecastValue: number;               // Giá trị dự đoán
    standardError: number;               // Sai số tiêu chuẩn
    confidenceLevel?: number;            // Mức độ tin cậy (không bắt buộc)
    predictionIntervalLowerBound?: number; // Giới hạn dưới khoảng dự đoán
    predictionIntervalUpperBound?: number; // Giới hạn trên khoảng dự đoán
    confidenceIntervalLowerBound: number; // Giới hạn dưới khoảng tin cậy
    confidenceIntervalUpperBound: number; // Giới hạn trên khoảng tin cậy
  };
  
  // Định nghĩa kiểu dữ liệu tổng hợp cho phản hồi từ API
  export type ForecastAPIResponse = {
    itemForecastTotal: { [key: string]: ItemForecast }; // Object với key là ID sản phẩm
    forecastResults: ForecastResult[];                 // Mảng các dự báo
  };
  