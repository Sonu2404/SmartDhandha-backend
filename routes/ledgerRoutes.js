// import express from "express";
// const router = express.Router();

// // --- 1. CHANGE THIS LINE ---
// // Import the specific functions you need
// import { 
//   getCustomers, 
//   addCustomer, 
//   updateCustomer, 
//   deleteCustomer, 
//   getTransactions, 
//   addTransaction, 
//   deleteTransaction, 
//   getReminders, 
//   addReminder, 
//   updateReminder, 
//   deleteReminder 
// } from "../controllers/ledgerController.js";

// import { protect, isBusinessMember } from "../middleware/authMiddleware.js";

// router.use(protect, isBusinessMember);

// // --- Customer Routes ---
// router.get("/customers", getCustomers);
// router.post("/customers", addCustomer);
// router.put("/customers/:id", updateCustomer);
// router.delete("/customers/:id", deleteCustomer);
// // router.post('/customers/:id/send-whatsapp-offer', sendOfferViaWhatsapp);

// // --- Transaction Routes ---
// router.get("/transactions", getTransactions);
// router.post("/transactions", addTransaction);
// router.delete("/transactions/:id", deleteTransaction);

// // --- Reminder Routes ---
// router.get("/reminders", getReminders);
// router.post("/reminders", addReminder);
// router.put("/reminders/:id", updateReminder);
// router.delete("/reminders/:id", deleteReminder);
// // router.post('/reminders/:id/send-whatsapp', sendReminderViaWhatsapp);

// export default router;




import express from "express";
const router = express.Router();

import { 
  getCustomers, addCustomer, updateCustomer, deleteCustomer,
  getTransactions, addTransaction, updateTransaction, deleteTransaction,
  getReminders, addReminder, updateReminder, deleteReminder
} from "../controllers/ledgerController.js";

import { protect, isBusinessMember } from "../middleware/authMiddleware.js";

router.use(protect, isBusinessMember);

// --- Customer Routes ---
router.get("/customers", getCustomers);
router.post("/customers", addCustomer);
router.put("/customers/:id", updateCustomer);
router.delete("/customers/:id", deleteCustomer);

// --- Transaction Routes ---
router.get("/transactions", getTransactions);
router.post("/transactions", addTransaction);
router.put("/transactions/:id", updateTransaction);
router.delete("/transactions/:id", deleteTransaction);

// --- Reminder Routes ---
router.get("/reminders", getReminders);
router.post("/reminders", addReminder);
router.put("/reminders/:id", updateReminder);
router.delete("/reminders/:id", deleteReminder);

export default router;
