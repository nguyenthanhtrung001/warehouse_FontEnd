// utils/apiRoutes.ts

const BASE_URL = 'http://localhost:8888/v1';

const API_ROUTES = {
    REVENUE:  (warehouseId : number) =>  `${BASE_URL}/api/return-notes/revenue/monthly?warehouseId=${warehouseId}`,
    RETURN_NOTES: (warehouseId : number) =>  `${BASE_URL}/api/return-notes/count/current-month?warehouseId=${warehouseId}`,
    PRODUCTS: `${BASE_URL}/api/products/count`,
    IMPORT_PRICES: (warehouseId : number)=>`${BASE_URL}/api/receipts/straightforwardness?warehouseId=${warehouseId}`,
    //products
    API_PRODUCTS : `${BASE_URL}/api/products`,
    API_PRODUCTS_HAS_LOCATION_BATCH :  (warehouse : number)=> `${BASE_URL}/api/products/has-batch-location-warehouse/${warehouse}`,
    API_BATCH_DETAILS: `${BASE_URL}/api/batch-details/quantity`,
    // Brands and Product Groups
    BRANDS: `${BASE_URL}/api/brands`,
    PRODUCT_GROUPS: `${BASE_URL}/api/product-groups`,
    // invoice
    INVOICES: `${BASE_URL}/api/invoices`,
    INVOICES_WAREHOUSE: (warehouseId : number) => `${BASE_URL}/api/invoices?warehouseId=${warehouseId}`,
    INVOICE_DETAILS: `${BASE_URL}/api/invoice-details/invoice`,
    INVOICES_BY_STATUS: (status: number, warehouseId : number) => `${BASE_URL}/api/invoices/status?status=${status}&&warehouseId=${warehouseId}`,
     // Update invoice status
     UPDATE_INVOICE_STATUS: (invoiceId: number) => `${BASE_URL}/api/invoices/${invoiceId}/status`,
     RETURN_DETAILS_BY_INVOICE_ID: (invoiceId: number) => `${BASE_URL}/api/return-details/return-order/${invoiceId}`,
    // DELETE Return Details by Invoice ID
    DELETE_RETURN_DETAILS_BY_INVOICE_ID: (invoiceId: number) => `${BASE_URL}/api/return-notes/${invoiceId}`,
 
  
    // Top Sale Products
    TOP_SALE_PRODUCTS: (top: number, warehouseId: number) => `${BASE_URL}/api/products/top-sale?top=${top}&warehouseId=${warehouseId}`,
    TOP_LOWEST_PRODUCTS: (top: number, warehouseId: number) => `${BASE_URL}/api/products/top-lowest?top=${top}&warehouseId=${warehouseId}`, 
    UPDATE_PRODUCT_STATUS_DELETE: (productId: number) => `${BASE_URL}/api/products/${productId}/status`,

    // Customers
    CUSTOMERS: `${BASE_URL}/api/customers`,
    CUSTOMER_DETAILS_BY_EMAIL: (email: string) => `${BASE_URL}/api/customers/email?email=${email}`, // Thêm endpoint động cho chi tiết khách hàng theo email

    //
    INVENTORY_CHECK_SLIPS: `${BASE_URL}/api/inventory-check-slips`,
    INVENTORY_CHECK_SLIPS_WAREHOUSE: (warehouseId : number) =>  `${BASE_URL}/api/inventory-check-slips?warehouseId=${warehouseId}`,
    API_BATCH_DETAILS_ALL_PRODUCT: `${BASE_URL}/api/batch-details/product`,
    // Receipts
    RECEIPTS: `${BASE_URL}/api/receipts`, 
    RECEIPTS_WAREHOUSE: (warehouseId : number) => `${BASE_URL}/api/receipts?warehouseId=${warehouseId}`,
    RECEIPT_DETAILS: (id: number) => `${BASE_URL}/api/receipt-details/${id}/details`, // Thêm endpoint động cho receipt details
    RECEIPT_DETAILS_CRE_RETURN: (id: number) => `${BASE_URL}/api/receipt-details/${id}/details-return`, 
    // Delivery Notes
    RECEIPTS_FOR_RETURN: (warehouseId : number) => `${BASE_URL}/api/receipts/for-return?warehouseId=${warehouseId}`,
    DELIVERY_NOTES: `${BASE_URL}/api/deliveryNotes`,
    DELIVERY_NOTES_WAREHOUSE:(warehouseId : number) =>  `${BASE_URL}/api/deliveryNotes?warehouseId=${warehouseId}`,
    DELIVERY_NOTE_DETAILS: (id: number) => `${BASE_URL}/api/deliveryNotes/${id}/details`, // New endpoint
    CANCEL_DELIVERY_NOTE : `${BASE_URL}/api/deliveryNotes/cancel`,
    CANCEL_DELIVERY_NOTE_WAREHOUSE :(warehouseId : number) =>`${BASE_URL}/api/deliveryNotes/cancel?warehouseId=${warehouseId}`,
   
    // Suppliers
    SUPPLIERS: `${BASE_URL}/api/suppliers`, // Thêm endpoint cho suppliers
     // Employees
    EMPLOYEES: `${BASE_URL}/api/employees`, // Thêm endpoint cho danh sách nhân viên
    EMPLOYEES_BY_WAREHOUSE_AND_NOT_EMPLOYEE: (warehouseId: number, employeeId: number) => 
        `${BASE_URL}/api/employees/warehouse?warehouseId=${warehouseId}&employeeId=${employeeId}`,

    EMPLOYEE_DETAILS: (id: number) => `${BASE_URL}/api/employees/${id}`, // Thêm endpoint động cho chi tiết nhân viên
    EMPLOYEE_BY_ACCOUNT_ID: (accountId: string) => `${BASE_URL}/api/employees/account/${accountId}`, 
    // report
    REPORT_IMPORT_EXPORT: (year: number, month: number, warehouseId: number) => 
        `${BASE_URL}/api/receipts/report/import-export?year=${year}&month=${month}&warehouseId=${warehouseId}`,
     // Locations
    LOCATIONS: `${BASE_URL}/api/locations`,

    WORK_SHIFTS: `${BASE_URL}/api/workshifts`,
    ATTENDANCES: `${BASE_URL}/api/attendances`,
    // product for warehouse
    BATCHES_BY_WAREHOUSE: (warehouseId: number) => `${BASE_URL}/api/batches/warehouse/${warehouseId}`,
    API_BATCH_DETAILS_SPECIFIC_PRODUCT: (productId: number, warehouseId: number) => 
        `${BASE_URL}/api/batch-details/product/${productId}?warehouseId=${warehouseId}`,


    // Product Quantities by Month and Year for Warehouse
    PRODUCT_QUANTITIES_BY_MONTH_YEAR: (month: number, year: number, warehouseId: number) => 
        `${BASE_URL}/api/invoice-details/products/quantities/by-month-year?month=${month}&year=${year}&warehouseId=${warehouseId}`,

    PRODUCT_SUMMARY_WAREHOUSE: (year: number, warehouseId: number) => 
        `${BASE_URL}/api/invoices/product-summary-warehouse?year=${year}&wareHouseId=${warehouseId}`,



};

export default API_ROUTES;
