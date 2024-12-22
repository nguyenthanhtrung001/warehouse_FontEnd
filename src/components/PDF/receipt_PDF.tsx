import { jsPDF } from 'jspdf';
import { format } from 'date-fns';

/**
 * Convert an array buffer to a base64 string.
 * @param {ArrayBuffer} buffer - The array buffer to convert.
 * @returns {string} - The base64 string.
 */
const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

/**
 * Calculate total values from invoice details.
 * @param {any[]} invoiceDetails - The details of the invoice.
 * @returns {Object} - An object containing total quantity, items, and price.
 */
const calculateTotals = (invoiceDetails: any[]) => {
  const totalQuantity = invoiceDetails.reduce(
    (acc, detail) => acc + detail.quantity,
    0
  );
  const totalItems = invoiceDetails.length;
  const totalPrice = invoiceDetails.reduce(
    (acc, detail) => acc + detail.purchasePrice * detail.quantity,
    0
  );

  return { totalQuantity, totalItems, totalPrice };
};

/**
 * Generate and print a PDF for the receipt.
 * @param {Object} receipt - The receipt data.
 * @param {any[]} details - The list of items in the receipt.
 */
export const handlePrintPDF = async (
  receipt: { date: string; supplier: string; id: number; employee: string },
  details: any[]
) => {
  const { totalQuantity, totalItems, totalPrice } = calculateTotals(details);

  // Fetch and convert font file
  const fontUrl = '/fonts/Roboto-Regular.ttf';
  const fontData = await fetch(fontUrl).then((response) =>
    response.arrayBuffer()
  );
  const fontBinary = arrayBufferToBase64(fontData);

  // Initialize jsPDF
  const doc = new jsPDF();
  doc.addFileToVFS('Roboto-Regular.ttf', fontBinary);
  doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
  doc.setFont('Roboto');

  // Header Section
  doc.setFontSize(20);
  doc.text('PHIẾU NHẬP HÀNG', 105, 20, { align: 'center' });

  // Sub-header Section
  doc.setFontSize(12);
  doc.text(`Mã phiếu hàng: DH000${receipt.id}`, 20, 30);
  doc.text(`Ngày: ${format(new Date(receipt.date), 'dd/MM/yyyy - HH:mm:ss')}`, 20, 40);
  doc.text(`Nhà cung cấp: ${receipt.supplier}`, 20, 50);
  doc.text(`Nhân viên thực hiện: ${receipt.employee}`, 20, 60);

  // Separator Line
  doc.setLineWidth(0.5);
  doc.line(20, 70, 190, 70);

  // Table Header
  doc.setFontSize(12);
  doc.text('STT', 20, 75);
  doc.text('Mã Sản Phẩm', 40, 75);
  doc.text('Tên Sản Phẩm', 80, 75);
  doc.text('Số Lượng', 130, 75);
  doc.text('Thành Tiền', 160, 75);

  // Table Contents
  let yPosition = 85;
  details.forEach((detail, index) => {
    const totalPricePerItem = detail.quantity * detail.purchasePrice;
    doc.text(`${index + 1}`, 20, yPosition);
    doc.text(`MKH000${detail.batchDetail_Id || 'N/A'}`, 40, yPosition);
    doc.text(detail.nameProduct || 'Không rõ', 80, yPosition);
    doc.text(detail.quantity.toString(), 130, yPosition);
    doc.text(totalPricePerItem.toFixed(2), 160, yPosition);
    yPosition += 10;
  });

  // Total Summary
  yPosition += 10;
  doc.setFontSize(14);
  doc.text(`Tổng Số Lượng: ${totalQuantity}`, 20, yPosition);
  yPosition += 10;
  doc.text(`Tổng Mặt Hàng: ${totalItems}`, 20, yPosition);
  yPosition += 10;
  doc.text(`Tổng Tiền: ${totalPrice.toFixed(2)} VND`, 20, yPosition);

  // Footer
  yPosition += 20;
  doc.setFontSize(10);
  doc.text('Cảm ơn quý khách đã sử dụng dịch vụ!', 105, yPosition, { align: 'center' });

  // Output the PDF
  doc.output('dataurlnewwindow'); // Open in a new browser tab/window
};
