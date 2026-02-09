// import express from 'express';
// const router = express.Router();
// import * as inventoryController from '../controllers/inventoryController.js'; 


// import { protect, isBusinessMember } from '../middleware/authMiddleware.js';

// router.use(protect, isBusinessMember);

// // --- Product Routes ---
// router.get("/products", inventoryController.getProducts);
// router.post("/products", inventoryController.addProduct);
// router.put("/products/:id", inventoryController.updateProduct);
// router.delete("/products/:id", inventoryController.deleteProduct);

// // --- Invoice Routes (Sales & Purchases) ---
// router.get("/invoices", inventoryController.getInvoices);
// router.post("/invoices", inventoryController.addInvoice);
// router.post("/invoices/:id/payments", inventoryController.recordInvoicePayment);
// router.delete("/invoices/:id", inventoryController.deleteInvoice);


// // --- Cashflow Routes ---
// router.get("/cashflows", inventoryController.getCashflows);
// router.post("/cashflows", inventoryController.addCashflow);
// router.delete("/cashflows/:id", inventoryController.deleteCashflow);

// // --- Supplier Routes ---
// router.get("/suppliers", inventoryController.getSuppliers);
// router.post("/suppliers", inventoryController.addSupplier);
// router.put("/suppliers/:id", inventoryController.updateSupplier);
// router.delete("/suppliers/:id", inventoryController.deleteSupplier);

// // --- Customer Routes ---
// router.get("/customers", inventoryController.getCustomers);
// router.post("/customers", inventoryController.addCustomer);
// router.put("/customers/:id", inventoryController.updateCustomer);
// router.delete("/customers/:id", inventoryController.deleteCustomer);

// export default router;


// // routes/inventoryRoutes.js
// import express from 'express';
// import { protect, isBusinessMember } from '../middleware/authMiddleware.js';
// import { getCustomers, createCustomer, updateCustomer, deleteCustomer, getInvoices, getProducts } from '../controllers/inventoryController.js';

// const router = express.Router();

// // Customers
// router.get('/customers', protect, isBusinessMember, getCustomers);
// router.post('/customers', protect, isBusinessMember, createCustomer);
// router.put('/customers/:id', protect, isBusinessMember, updateCustomer);
// router.delete('/customers/:id', protect, isBusinessMember, deleteCustomer);

// // Products & Invoices
// router.get('/products', protect, isBusinessMember, getProducts);
// router.get('/invoices', protect, isBusinessMember, getInvoices);

// export default router;





// // routes/inventoryRoutes.js
// import express from 'express';
// import { protect, isBusinessMember } from '../middleware/authMiddleware.js';
// import { 
//     getCustomers, 
//     createCustomer, 
//     updateCustomer, 
//     deleteCustomer,
//     getCustomerById,
//     getProducts, 
//     getProductById,
//     createProduct,
//     updateProduct,
//     deleteProduct,
//     getInvoices, 
//     getInvoiceById,
//     createInvoice,
//     updateInvoiceStatus,
//     deleteInvoice,
//     getDashboardStats
// } from '../controllers/inventoryController.js';

// const router = express.Router();

// // Dashboard
// router.get('/dashboard', protect, isBusinessMember, getDashboardStats);

// // Customers
// router.get('/customers', protect, isBusinessMember, getCustomers);
// router.get('/customers/:id', protect, isBusinessMember, getCustomerById);
// router.post('/customers', protect, isBusinessMember, createCustomer);
// router.put('/customers/:id', protect, isBusinessMember, updateCustomer);
// router.delete('/customers/:id', protect, isBusinessMember, deleteCustomer);

// // Products
// router.get('/products', protect, isBusinessMember, getProducts);
// router.get('/products/:id', protect, isBusinessMember, getProductById);
// router.post('/products', protect, isBusinessMember, createProduct);
// router.put('/products/:id', protect, isBusinessMember, updateProduct);
// router.delete('/products/:id', protect, isBusinessMember, deleteProduct);

// // Invoices
// router.get('/invoices', protect, isBusinessMember, getInvoices);
// router.get('/invoices/:id', protect, isBusinessMember, getInvoiceById);
// router.post('/invoices', protect, isBusinessMember, createInvoice);
// router.put('/invoices/:id/status', protect, isBusinessMember, updateInvoiceStatus);
// router.delete('/invoices/:id', protect, isBusinessMember, deleteInvoice);

// export default router;















import express from 'express';
const router = express.Router();
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getInvoices,
  addInvoice,
  deleteInvoice,
  recordInvoicePayment,
  getCashflows,
  addCashflow,
  deleteCashflow,
  getSuppliers,
  addSupplier,
  updateSupplier,
  deleteSupplier,
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer
} from '../controllers/inventoryController.js';

import { protect, isBusinessMember } from '../middleware/authMiddleware.js';

router.use(protect, isBusinessMember);

// --- Product Routes ---
router.get("/products", getProducts);
router.post("/products",  addProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

// --- Invoice Routes (Sales & Purchases) ---
router.get("/invoices", getInvoices);
router.post("/invoices", addInvoice);
router.post("/invoices/:id/payments", recordInvoicePayment);
router.delete("/invoices/:id", deleteInvoice);

// --- Cashflow Routes ---
router.get("/cashflows", getCashflows);
router.post("/cashflows", addCashflow);
router.delete("/cashflows/:id", deleteCashflow);

// --- Supplier Routes ---
router.get("/suppliers", getSuppliers);
router.post("/suppliers", addSupplier);
router.put("/suppliers/:id", updateSupplier);
router.delete("/suppliers/:id", deleteSupplier);

// --- Customer Routes ---
router.get("/customers", getCustomers);
router.post("/customers", addCustomer);
router.put("/customers/:id", updateCustomer);
router.delete("/customers/:id", deleteCustomer);

export default router;