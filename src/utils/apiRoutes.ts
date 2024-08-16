// utils/apiRoutes.ts

const BASE_URL = 'http://localhost:8888/v1';

const API_ROUTES = {
    REVENUE: `${BASE_URL}/api/return-notes/revenue/monthly`,
    RETURN_NOTES: `${BASE_URL}/api/return-notes/count/current-month`,
    PRODUCTS: `${BASE_URL}/api/products/count`,
    PURCHASE: `${BASE_URL}/api/receipts/summary`,
    //products
    API_PRODUCTS : `${BASE_URL}/api/products`,
    API_PRODUCTS_HAS_LOCATION_BATCH : `${BASE_URL}/api/products/has-batch-location`,
    API_BATCH_DETAILS: `${BASE_URL}/api/batch-details/quantity`,
    // Brands and Product Groups
    BRANDS: `${BASE_URL}/api/brands`,
    PRODUCT_GROUPS: `${BASE_URL}/api/product-groups`,
    // invoice
    INVOICES: `${BASE_URL}/api/invoices`,
    INVOICE_DETAILS: `${BASE_URL}/api/invoice-details/invoice`,
    INVOICES_BY_STATUS: (status: number) => `${BASE_URL}/api/invoices/status?status=${status}`,
     // Update invoice status
     UPDATE_INVOICE_STATUS: (invoiceId: number) => `${BASE_URL}/api/invoices/${invoiceId}/status`,
     RETURN_DETAILS_BY_INVOICE_ID: (invoiceId: number) => `${BASE_URL}/api/return-details/return-order/${invoiceId}`,
    // DELETE Return Details by Invoice ID
    DELETE_RETURN_DETAILS_BY_INVOICE_ID: (invoiceId: number) => `${BASE_URL}/api/return-notes/${invoiceId}`,
 
  
    // Top Sale Products
    TOP_SALE_PRODUCTS: `${BASE_URL}/api/products/top-sale`,
    TOP_LOWEST_PRODUCTS: `${BASE_URL}/api/products/top-lowest`,
    UPDATE_PRODUCT_STATUS_DELETE: (productId: number) => `${BASE_URL}/api/products/${productId}/status`,

    // Customers
    CUSTOMERS: `${BASE_URL}/api/customers`,
    //
    INVENTORY_CHECK_SLIPS: `${BASE_URL}/api/inventory-check-slips`,
    API_BATCH_DETAILS_ALL_PRODUCT: `${BASE_URL}/api/batch-details/product`,
    // Receipts
    RECEIPTS: `${BASE_URL}/api/receipts`, 
    RECEIPT_DETAILS: (id: number) => `${BASE_URL}/api/receipt-details/${id}/details`, // Thêm endpoint động cho receipt details
    RECEIPT_DETAILS_CRE_RETURN: (id: number) => `${BASE_URL}/api/receipt-details/${id}/details-return`, 
    // Delivery Notes
    RECEIPTS_FOR_RETURN: `${BASE_URL}/api/receipts/for-return`,
    DELIVERY_NOTES: `${BASE_URL}/api/deliveryNotes`,
    DELIVERY_NOTE_DETAILS: (id: number) => `${BASE_URL}/api/deliveryNotes/${id}/details`, // New endpoint
    CANCEL_DELIVERY_NOTE: `${BASE_URL}/api/deliveryNotes/cancel`,
    // Suppliers
    SUPPLIERS: `${BASE_URL}/api/suppliers`, // Thêm endpoint cho suppliers
     // Employees
    EMPLOYEES: `${BASE_URL}/api/employees`, // Thêm endpoint cho danh sách nhân viên
    EMPLOYEE_DETAILS: (id: number) => `${BASE_URL}/api/employees/${id}`, // Thêm endpoint động cho chi tiết nhân viên
    EMPLOYEE_BY_ACCOUNT_ID: (accountId: string) => `${BASE_URL}/api/employees/account/${accountId}`, 
    // report
    REPORT_IMPORT_EXPORT: (year: number, month: number) => `${BASE_URL}/api/receipts/report/import-export?year=${year}&month=${month}`,
    // Locations
    LOCATIONS: `${BASE_URL}/api/locations`,

    WORK_SHIFTS: `${BASE_URL}/api/workshifts`,
    ATTENDANCES: `${BASE_URL}/api/attendances`,
    
    



};

export default API_ROUTES;
