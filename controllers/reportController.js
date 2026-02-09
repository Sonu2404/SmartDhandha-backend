// // controllers/reportController.js

// // Import your models (THIS MUST BE CORRECT)
// import { Invoice, Product, Cashflow } from '../models/Inventory.js'; 
// import { Transaction, Customer } from '../models/Ledger.js'; 

// /**
//  * Controller to fetch all sales and purchase invoices
//  */
// const getInvoices = async (req, res) => {
//     try {
//         const vendorId = req.user.id; // 👈 CHANGED from req.user.userId
//         const invoices = await Invoice.find({ 
//             userId: vendorId, 
//             type: { $in: ['sale', 'purchase'] } 
//         }).lean();
//         res.status(200).json(invoices);
//     } catch (error) {
//         console.error("Error fetching invoices for reports:", error);
//         res.status(500).json({ message: "Failed to fetch invoices data." });
//     }
// };

// /**
//  * Controller to fetch all product inventory items
//  */
// const getProducts = async (req, res) => {
//     try {
//         const vendorId = req.user.id; // 👈 CHANGED from req.user.userId
//         const products = await Product.find({ 
//             userId: vendorId 
//         }).lean(); 
//         res.status(200).json(products);
//     } catch (error) {
//         console.error("Error fetching products for reports:", error);
//         res.status(500).json({ message: "Failed to fetch products data." });
//     }
// };

// /**
//  * Controller to fetch all cashflow entries
//  */
// const getCashflows = async (req, res) => {
//     try {
//         const vendorId = req.user.id; // 👈 CHANGED from req.user.userId
//         const cashflows = await Cashflow.find({ 
//             userId: vendorId 
//         }).lean(); 
//         res.status(200).json(cashflows);
//     } catch (error) {
//         console.error("Error fetching cashflows for reports:", error);
//         res.status(500).json({ message: "Failed to fetch cashflows data." });
//     }
// };

// /**
//  * 🚨 UNCHANGED: Controller to fetch all ledger transactions
//  * We leave this as req.user.userId because you said it works.
//  */
// const getLedgers = async (req, res) => {
//     try {
//         const vendorId = req.user.userId; // 👈 KEPT AS IS
//         
//         const ledgers = await Transaction.find({ 
//             userId: vendorId 
//         })
//         .populate('customerId', 'name') 
//         .lean(); 

//         const formattedLedgers = ledgers.map(t => ({
//             _id: t._id,
//             date: t.date,
//             type: t.type,
//             amount: t.amount,
//             note: t.note,
//             customerName: t.customerId.name, 
//            customerId: t.customerId._id
//         }));

//         res.status(200).json(formattedLedgers);
//     } catch (error) {
//         console.error("Error fetching ledgers for reports:", error);
//         res.status(500).json({ message: "Failed to fetch ledger data." });
//     }
// };

// export { getInvoices, getProducts, getCashflows, getLedgers };


import { Invoice, Product, Cashflow } from '../models/Inventory.js';
import { Transaction } from '../models/Ledger.js';

/**
 * GET Invoices (Sales + Purchase)
 */
export const getInvoicesReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const invoices = await Invoice.find({ userId })
      .sort({ date: -1 })
      .lean();
    res.status(200).json(invoices);
  } catch (error) {
    console.error('Invoice Report Error:', error);
    res.status(500).json({ message: 'Failed to fetch invoices' });
  }
};

/**
 * GET Products
 */
export const getProductsReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const products = await Product.find({ userId })
      .sort({ name: 1 })
      .lean();
    res.status(200).json(products);
  } catch (error) {
    console.error('Product Report Error:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

/**
 * GET Cashflows
 */
export const getCashflowsReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const cashflows = await Cashflow.find({ userId })
      .sort({ date: -1 })
      .lean();
    res.status(200).json(cashflows);
  } catch (error) {
    console.error('Cashflow Report Error:', error);
    res.status(500).json({ message: 'Failed to fetch cashflows' });
  }
};

/**
 * GET Ledger Transactions
 */
export const getLedgerReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await Transaction.find({ userId })
      .populate('customerId', 'name')
      .populate('supplierId', 'name')
      .sort({ date: -1 })
      .lean();

    const ledgers = transactions.map(txn => ({
      _id: txn._id,
      date: txn.date,
      type: txn.type,
      amount: txn.amount,
      note: txn.note,
      customerId: txn.customerId?._id || null,
      customerName: txn.customerId?.name || null,
      supplierId: txn.supplierId?._id || null,
      supplierName: txn.supplierId?.name || null,
      partyName: txn.customerId?.name || txn.supplierId?.name || 'Unknown Party',
    }));

    res.status(200).json(ledgers);
  } catch (error) {
    console.error('Ledger Report Error:', error);
    res.status(500).json({ message: 'Failed to fetch ledger data' });
  }
};