// import express from 'express';
// // const router = express.Router();
// import router from express.Router();
// import reportController from '../controllers/reportController.js';

// import { protect, isBusinessMember } from '../middleware/authMiddleware.js';

// router.get('/invoices', protect, isBusinessMember, reportController.getInvoices);

// router.get('/products', protect, isBusinessMember, reportController.getProducts);

// router.get('/cashflows', protect, isBusinessMember, reportController.getCashflows);

// router.get('/ledger', protect, isBusinessMember, reportController.getLedgers);

// export default router;


// import express from 'express';
// import { getInvoices, getProducts, getCashflows, getLedgers } from '../controllers/reportController.js';
// import { protect, isBusinessMember } from '../middleware/authMiddleware.js';

// const router = express.Router(); // ✅ Correct router creation

// // Routes
// router.get('/invoices', protect, isBusinessMember, getInvoices);
// router.get('/products', protect, isBusinessMember, getProducts);
// router.get('/cashflows', protect, isBusinessMember, getCashflows);
// router.get('/ledger', protect, isBusinessMember, getLedgers);

// export default router;


import express from 'express';
import {
  getInvoicesReport,
  getProductsReport,
  getCashflowsReport,
  getLedgerReport
} from '../controllers/reportController.js';
import { protect, isBusinessMember } from '../middleware/authMiddleware.js';

const router = express.Router();

// Reports Routes with /api/report prefix
router.get('/invoices', protect, isBusinessMember, getInvoicesReport);
router.get('/products', protect, isBusinessMember, getProductsReport);
router.get('/cashflows', protect, isBusinessMember, getCashflowsReport);
router.get('/ledger', protect, isBusinessMember, getLedgerReport);

export default router;