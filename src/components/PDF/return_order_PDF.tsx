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
const calculateTotals = (invoiceDetails: any[]) => {
  const totalQuantity = invoiceDetails.reduce((acc, detail) => acc + detail.quantity, 0);
  const totalItems = invoiceDetails.length;
  const totalPrice = invoiceDetails.reduce((acc, detail) => acc + detail.purchasePrice * detail.quantity, 0);

  return { totalQuantity, totalItems, totalPrice };
};

// Hàm in PDF
export const handlePrintPDF = async (returnNote: any, invoiceDetails: any[]) => {
  const { totalQuantity, totalItems, totalPrice } = calculateTotals(invoiceDetails);

  // Fetch the font file
  const fontUrl = '/fonts/Roboto-Regular.ttf';
  const fontData = await fetch(fontUrl).then(response => response.arrayBuffer());
  const fontBinary = arrayBufferToBase64(fontData);

  const doc = new jsPDF();

  // Add the font to jsPDF
  doc.addFileToVFS('Roboto-Regular.ttf', fontBinary);
  doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
  doc.setFont('Roboto');

  // Add header
  doc.setFontSize(20);
  doc.text('BIÊN LAI TRẢ HÀNG', 105, 20, { align: 'center' });

  // Add sub-header with invoice info
  doc.setFontSize(12);
  doc.text(`Mã biên lai: TH000${returnNote.id}`, 20, 30);
  doc.text(`Ngày: ${format(new Date(returnNote.returnDate), 'dd/MM/yyyy - HH:mm:ss')}`, 20, 40);
  doc.text(`Khách Hàng: ${returnNote.contactInfo}`, 20, 50);
  // doc.text(`Trạng Thái: ${returnNote.status}`, 20, 60);

  // Add separator line
  doc.setLineWidth(0.5);
  doc.line(20, 65, 190, 65);

  // Add table header for item details
  doc.setFontSize(12);
  doc.text('STT', 20, 70);
  doc.text('Tên Sản Phẩm', 30, 70);
  doc.text('Số Lượng', 100, 70);
  doc.text('Đơn Giá', 130, 70);
  doc.text('Thành Tiền', 160, 70);

  // Add table contents
  let yPosition = 80;
  invoiceDetails.forEach((detail, index) => {
    doc.text(`${index + 1}`, 20, yPosition);
    doc.text(detail.nameProduct, 30, yPosition);
    doc.text(detail.quantity.toString(), 100, yPosition);
    doc.text(detail.purchasePrice.toFixed(2), 130, yPosition);
    doc.text((detail.quantity * detail.purchasePrice).toFixed(2), 160, yPosition);
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
  // doc.text('Cảm ơn quý khách đã mua hàng!', 105, yPosition, { align: 'center' });

  // // Mở cửa sổ in ngay lập tức
  doc.output('dataurlnewwindow'); // Mở PDF trong cửa sổ mới
};
