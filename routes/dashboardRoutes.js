// import express from 'express';
// const router = express.Router();

// import { 
//   getDashboardStats,
//   getSalesChartData,
//   getRecentActivity,
//   getLowStockItems,
//   getOverdueInvoices
// } from '../controllers/dashboardController.js';

// import { protect, isBusinessMember } from "../middleware/authMiddleware.js";

// router.use(protect, isBusinessMember);

// // --- Existing Routes ---
// router.get('/stats', getDashboardStats);
// router.get('/sales-chart', getSalesChartData);
// router.get('/recent-activity', getRecentActivity);
// router.get('/low-stock', getLowStockItems);

// // --- NEW Routes for Advanced Dashboard ---
// router.get('/overdue-invoices', getOverdueInvoices);

// export default router;




import express from "express";
import {
  getDashboardStats,
  getSalesChartData,
  getRecentActivity,
  getLowStockItems,
  getTopSellingProducts,
  getIncomeVsExpenseChart,
} from "../controllers/dashboardController.js";

import { protect, isBusinessMember } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, isBusinessMember);

router.get("/stats", getDashboardStats);
router.get("/sales-chart", getSalesChartData);
router.get("/recent-activity", getRecentActivity);
router.get("/low-stock", getLowStockItems);
router.get("/top-selling-products", getTopSellingProducts);
router.get("/income-expense-chart", getIncomeVsExpenseChart);

export default router;
