import React from 'react';

interface PrintPDFProps {
  pdfUrl: string; // Đường dẫn đến tài liệu PDF
}

const PrintPDF: React.FC<PrintPDFProps> = ({ pdfUrl }) => {
  const handlePrint = () => {
    // Mở URL PDF trong cửa sổ mới và tự động in
    const printWindow = window.open(pdfUrl, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  return (
    <button onClick={handlePrint} className="px-4 py-2 bg-blue-500 text-white rounded">
      In tài liệu PDF
    </button>
  );
};

export default PrintPDF;
