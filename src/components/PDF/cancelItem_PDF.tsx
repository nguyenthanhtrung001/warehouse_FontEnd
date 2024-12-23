import { jsPDF } from 'jspdf';
import { format } from 'date-fns';

// Function to convert array buffer to base64
const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

// Function to calculate totals
const calculateTotals = (invoiceDetails: any[]) => {
  const totalQuantity = invoiceDetails.reduce((acc: any, detail: { quantity: any; }) => acc + detail.quantity, 0);
  const totalItems = invoiceDetails.length;
  const totalPrice = invoiceDetails.reduce((acc: number, detail: { deliveryNote: { price: any; }; quantity: number; }) => acc + (detail.deliveryNote?.price || 0) * detail.quantity, 0);

  return { totalQuantity, totalItems, totalPrice };
};

// Function to handle PDF printing
export const handlePrintPDF = async (cancel: { date: any; supplier: any; price?: number; status?: string; id: any; purchasePrice?: number; employee: any; warehouseTransfer?: string; }, details: any[]) => {
  const { totalQuantity, totalItems, totalPrice } = calculateTotals(details);

  // Fetch the font file
  const fontUrl = '/fonts/Roboto-Regular.ttf';
  const fontData = await fetch(fontUrl).then((response) => response.arrayBuffer());
  const fontBinary = arrayBufferToBase64(fontData);

  const doc = new jsPDF();

  // Add the font to jsPDF
  doc.addFileToVFS('Roboto-Regular.ttf', fontBinary);
  doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
  doc.setFont('Roboto');

  // Add header
  doc.setFontSize(20);
  doc.text('PHIẾU HỦY', 105, 20, { align: 'center' });

  // Add sub-header with invoice info
  doc.setFontSize(12);
  doc.text(`Mã phiếu hủy: DH000${cancel.id}`, 20, 30);
  doc.text(`Ngày: ${format(new Date(cancel.date), 'dd/MM/yyyy - HH:mm:ss')}`, 20, 40);
  doc.text(`Nhân viên thực hiện: NV000${cancel.employee}`, 20, 50);
 
  // Add separator line
  doc.setLineWidth(0.5);
  doc.line(20, 70, 190, 70);

  // Add table header for item details
  doc.setFontSize(12);
  doc.text('STT', 20, 75);
  doc.text('Mã Sản Phẩm', 30, 75);
  doc.text('Tên Sản Phẩm', 70, 75);
  doc.text('Số Lượng', 130, 75);
  doc.text('Thành Tiền', 160, 75);

  // Add table contents
  let yPosition = 85;
  details.forEach((detail: { quantity: number; deliveryNote: { price: any; }; batchDetail_Id: any; nameProduct: any; }, index: number) => {
    const totalPricePerItem = detail.quantity * (detail.deliveryNote?.price || 0);
    doc.text(`${index + 1}`, 20, yPosition);
    doc.text(`MKH000${detail.batchDetail_Id || 'N/A'}`, 30, yPosition);
    doc.text(detail.nameProduct || 'Không rõ', 70, yPosition);
    doc.text(detail.quantity.toString(), 130, yPosition);
    doc.text(totalPricePerItem.toFixed(2), 160, yPosition);
    yPosition += 10;
  });

  // Add total summary
  yPosition += 10;
  doc.setFontSize(14);
  doc.text(`Tổng Số Lượng: ${totalQuantity}`, 20, yPosition);
  yPosition += 10;
  doc.text(`Tổng Mặt Hàng: ${totalItems}`, 20, yPosition);
  yPosition += 10;
  doc.text(`Tổng Tiền: ${totalPrice.toFixed(2)} VND`, 20, yPosition);

  // Add footer
  yPosition += 20;
  doc.setFontSize(10);
  doc.text('Cảm ơn quý khách đã sử dụng dịch vụ!', 105, yPosition, { align: 'center' });

  // Open the PDF in a new window
  doc.output('dataurlnewwindow');
};
