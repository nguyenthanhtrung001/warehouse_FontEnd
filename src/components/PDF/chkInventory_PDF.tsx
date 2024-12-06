import { jsPDF } from 'jspdf';
import { format } from 'date-fns';

// Function to convert array buffer to base64
const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

// Hàm tính toán các giá trị tổng hợp
const calculateTotals = (inventoryDetails: any[]) => {
  const totalQuantity = inventoryDetails.reduce((acc, detail) => acc + detail.quantity, 0);
  const totalItems = inventoryDetails.length;
  // const totalPrice = inventoryDetails.reduce((acc, detail) => acc + detail.purchasePrice * detail.quantity, 0);

  return { totalQuantity, totalItems };
};

// Hàm in phiếu kiểm kho PDF
export const handlePrintPDF = async (inventoryCheck: any, inventoryDetails: any[]) => {
  // const { totalQuantity, totalItems } = calculateTotals(inventoryDetails);

  // Fetch the font file
  const fontUrl = '/fonts/Roboto-Regular.ttf'; // Đảm bảo rằng đường dẫn này chính xác
  const fontData = await fetch(fontUrl).then(response => response.arrayBuffer());
  const fontBinary = arrayBufferToBase64(fontData);

  const doc = new jsPDF();

  // Add the font to jsPDF
  doc.addFileToVFS('Roboto-Regular.ttf', fontBinary);
  doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
  doc.setFont('Roboto');

  // Add header
  doc.setFontSize(20);
  doc.text('PHIẾU KIỂM KHO', 105, 20, { align: 'center' });

  // Add sub-header with receipt info
  doc.setFontSize(12);
  doc.text(`Mã phiếu kiểm kho: ${inventoryCheck.id}`, 20, 40);
  doc.text(`Ngày kiểm kho: ${format(new Date(inventoryCheck.dateCheck), 'dd/MM/yyyy')}`, 20, 50);
  doc.text(`Nhân viên kiểm kho: ${inventoryCheck.employee}`, 20, 60);
  doc.text(`Kho: ${inventoryCheck.total}`, 20, 70);

  // Add a separator line
  doc.setLineWidth(0.5);
  doc.line(20, 75, 190, 75);

  // Add inventory details table header
  doc.setFontSize(10);
  doc.text('Mã sản phẩm', 20, 85);
  doc.text('Tên sản phẩm', 60, 85);
  doc.text('Số lượng kiểm kho', 120, 85);
  doc.text('Giá trị', 160, 85);

  // Add inventory items details
  let yPosition = 95;
  inventoryDetails.forEach((item, index) => {
    console.log("data: ",JSON.stringify(item, null,2) );
    // doc.text(item.batchDetail.productId, 20, yPosition);
    doc.text(item.batchDetail.batch.batchName, 60, yPosition);
    // doc.text(String(item.inventory), 120, yPosition);
    // doc.text(`${item.purchasePrice * item.quantity} VND`, 160, yPosition);
    yPosition += 10; // Space between rows
  });

  // Add total summary
  doc.setFontSize(12);
  // doc.text(`Tổng số sản phẩm: ${totalItems}`, 20, yPosition + 10);
  // doc.text(`Tổng số lượng: ${totalQuantity}`, 20, yPosition + 20);
  // // doc.text(`Tổng giá trị kiểm kho: ${totalPrice} VND`, 20, yPosition + 30);

  // Finalize the PDF and open it in a new tab
  doc.output('dataurlnewwindow'); 
};
