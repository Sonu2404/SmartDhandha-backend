// // Import all models required
// import { Product, Cashflow, Invoice, Supplier, InventoryCustomer } from "../models/Inventory.js";
// import mongoose from 'mongoose';

// // Helper function for ObjectId validation
// const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// // Customer Controllers
// // --- Customer Controllers (ADD THIS ENTIRE NEW SECTION) ---
// exports.getCustomers = async (req, res) => {
//   try {
//     const customers = await InventoryCustomer.find({ userId: req.user.id }).sort({ name: 1 });
//     res.status(200).json(customers);
//   } catch (error) {
//     console.error("Error fetching customers:", error);
//     res.status(500).json({ message: "Error fetching customers", error: error.message });
//   }
// };

// exports.addCustomer = async (req, res) => {
//   try {
//     const existing = await InventoryCustomer.findOne({
//         name: { $regex: new RegExp(`^${req.body.name}$`, 'i') },
//         userId: req.user.id
//     });
//     if (existing) {
//         return res.status(400).json({ message: `A customer with the name '${req.body.name}' already exists.` });
//     }
//     const newCustomer = new InventoryCustomer({ ...req.body, userId: req.user.id });
//     await newCustomer.save();
//     res.status(201).json(newCustomer);
//   } catch (error) {
//     console.error("Error adding customer:", error);
//     if (error.name === 'ValidationError') {
//         return res.status(400).json({ message: "Validation Failed", errors: error.errors });
//     }
//     res.status(500).json({ message: "Failed to add customer", error: error.message });
//   }
// };

// exports.updateCustomer = async (req, res) => {
//   const { id } = req.params;
//   if (!isValidObjectId(id)) {
//       return res.status(400).json({ message: "Invalid customer ID format" });
//   }
//   try {
//     const updatedCustomer = await InventoryCustomer.findOneAndUpdate(
//       { _id: id, userId: req.user.id },
//       req.body,
//       { new: true, runValidators: true }
//     );
//     if (!updatedCustomer) {
//       return res.status(404).json({ message: "Customer not found or you do not have permission" });
//     }
//     res.status(200).json(updatedCustomer);
//   } catch (error) {
//     console.error("Error updating customer:", error);
//     res.status(500).json({ message: "Failed to update customer", error: error.message });
//   }
// };

// exports.deleteCustomer = async (req, res) => {
//     const { id } = req.params;
//     if (!isValidObjectId(id)) {
//         return res.status(400).json({ message: "Invalid customer ID format" });
//     }
//     try {
//         const customerToDelete = await InventoryCustomer.findOne({ _id: id, userId: req.user.id });
//         if (!customerToDelete) {
//             return res.status(404).json({ message: "Customer not found or you do not have permission." });
//         }

//         // Check if customer is used in any sale invoices
//         const saleInvoiceExists = await Invoice.findOne({
//             type: "sale",
//             customerName: customerToDelete.name,
//             userId: req.user.id
//         });

//         if (saleInvoiceExists) {
//             return res.status(400).json({ message: "Cannot delete customer: They are linked to existing sales invoices." });
//         }

//         await InventoryCustomer.findByIdAndDelete(id);
//         res.status(200).json({ message: "Customer deleted successfully", id: id });
//     } catch (error) {
//         console.error("Error deleting customer:", error);
//         res.status(500).json({ message: "Failed to delete customer", error: error.message });
//     }
// };

// // --- Product Controllers ---
// exports.getProducts = async (req, res) => {
//   try {
//     const products = await Product.find({ userId: req.user.id }).sort({ name: 1 });
//     res.status(200).json(products);
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     res.status(500).json({ message: "Error fetching products", error: error.message });
//   }
// };

// exports.addProduct = async (req, res) => {
//   try {
//     const newProduct = new Product({ ...req.body, userId: req.user.id });
//     await newProduct.save();
//     res.status(201).json(newProduct);
//   } catch (error) {
//      console.error("Error adding product:", error);
//      if (error.name === 'ValidationError') {
//        console.error("Validation Errors:", JSON.stringify(error.errors, null, 2));
//        return res.status(400).json({ message: "Validation Failed", errors: error.errors });
//      }
//      if (error.code === 11000 && error.keyPattern && error.keyPattern.sku) {
//        return res.status(400).json({ message: `Product with SKU '${error.keyValue.sku}' already exists.` });
//      }
//     res.status(500).json({ message: "Failed to add product", error: error.message });
//   }
// };

// exports.updateProduct = async (req, res) => {
//   const { id } = req.params;
//   if (!isValidObjectId(id)) {
//      return res.status(400).json({ message: "Invalid product ID format" });
//   }
//   try {
//     const updatedProduct = await Product.findOneAndUpdate(
//       { _id: id, userId: req.user.id },
//       req.body,
//       { new: true, runValidators: true }
//     );
//     if (!updatedProduct) {
//       return res.status(404).json({ message: "Product not found or you do not have permission" });
//     }
//     res.status(200).json(updatedProduct);
//   } catch (error) {
//      console.error("Error updating product:", error);
//      if (error.name === 'ValidationError') {
//        console.error("Validation Errors:", JSON.stringify(error.errors, null, 2));
//        return res.status(400).json({ message: "Validation Failed", errors: error.errors });
//      }
//      if (error.code === 11000 && error.keyPattern && error.keyPattern.sku) {
//        return res.status(400).json({ message: `Product with SKU '${error.keyValue.sku}' already exists.` });
//      }
//     res.status(500).json({ message: "Failed to update product", error: error.message });
//   }
// };

// exports.deleteProduct = async (req, res) => {
//     const { id } = req.params;
//     if (!isValidObjectId(id)) {
//        return res.status(400).json({ message: "Invalid product ID format" });
//     }
//   try {
//     const invoiceUsingProduct = await Invoice.findOne({ "items.productId": id, userId: req.user.id });
//     if (invoiceUsingProduct) {
//         return res.status(400).json({ message: "Cannot delete product: It is associated with your existing invoices/bills." });
//     }

//     const deletedProduct = await Product.findOneAndDelete({ _id: id, userId: req.user.id });
//     if (!deletedProduct) {
//       return res.status(404).json({ message: "Product not found or you do not have permission" });
//     }
//     res.status(200).json({ message: "Product deleted successfully", id: id });
//   } catch (error) {
//      console.error("Error deleting product:", error);
//     res.status(500).json({ message: "Failed to delete product", error: error.message });
//   }
// };

// // --- Invoice Controllers ---

// exports.getInvoices = async (req, res) => {
//   try {
//     const invoices = await Invoice.find({ userId: req.user.id }).sort({ date: -1, createdAt: -1 });
//     res.status(200).json(invoices);
//   } catch (error) {
//      console.error("Error fetching invoices:", error);
//     res.status(500).json({ message: "Error fetching invoices", error: error.message });
//   }
// };

// exports.addInvoice = async (req, res) => {
//     try {
//         const invoiceData = req.body;
//         const newInvoiceData = { ...invoiceData, userId: req.user.id, paidAmount: 0, paymentStatus: 'unpaid' };

//         if (!newInvoiceData.items || !Array.isArray(newInvoiceData.items) || newInvoiceData.items.length === 0) {
//             throw new Error("Invoice must contain at least one item.");
//         }
//         if (!newInvoiceData.customerName || typeof newInvoiceData.customerName !== 'string' || newInvoiceData.customerName.trim() === '') {
//              throw new Error("Customer or Supplier name is required.");
//         }

//         for (const item of newInvoiceData.items) {
//             if (!item.productId || !isValidObjectId(item.productId)) {
//                  throw new Error(`Invalid or missing productId in invoice items: ${item.productId || 'undefined'}`);
//             }
//             const product = await Product.findOne({ _id: item.productId, userId: req.user.id });
//             if (!product) {
//                  throw new Error(`Product with ID ${item.productId} (${item.name || 'N/A'}) not found or you do not have permission.`);
//             }
//             const quantityChange = Number(item.qty);
//             if (isNaN(quantityChange) || quantityChange <= 0) {
//                 throw new Error(`Invalid quantity (${item.qty}) for item ${item.name || item.productId}.`);
//             }
//             if (newInvoiceData.type === "sale" && product.stock < quantityChange) {
//                  throw new Error(`Insufficient stock for product ${product.name}. Available: ${product.stock}, Required: ${quantityChange}.`);
//             }
//         }

//         const newInvoice = new Invoice(newInvoiceData);
//         await newInvoice.save();

//         for (const item of newInvoice.items) {
//             const quantityChange = Number(item.qty);
//             const updateOperation = newInvoice.type === "sale"
//                 ? { $inc: { stock: -quantityChange } }
//                 : { $inc: { stock: +quantityChange } };
//             await Product.findByIdAndUpdate(item.productId, updateOperation);
//         }

//         res.status(201).json(newInvoice.toJSON());

//     } catch (error) {
//         console.error("Error adding invoice:", error.message);
//         if (error.name === 'ValidationError') {
//              return res.status(400).json({ message: "Invoice Validation Failed", error: error.message, details: error.errors });
//         }
//         if (error.message.includes("Invoice must contain") || error.message.includes("Insufficient stock")) {
//              return res.status(400).json({ message: error.message, error: error.message });
//         }
//         res.status(500).json({ message: "Failed to add invoice due to an unexpected error.", error: error.message });
//     }
// };

// // highlight-start
// // --- UPDATED CONTROLLER: Delete Invoice (Without Transactions) ---
// exports.deleteInvoice = async (req, res) => {
//     const { id: invoiceId } = req.params;
//     const userId = req.user.id;

//     if (!isValidObjectId(invoiceId)) {
//         return res.status(400).json({ message: "Invalid Invoice ID format." });
//     }

//     try {
//         // 1. Find the invoice to be deleted
//         const invoice = await Invoice.findOne({ _id: invoiceId, userId });
//         if (!invoice) {
//             return res.status(404).json({ message: "Invoice not found or you do not have permission." });
//         }

//         // 2. Reverse the stock changes for each item in the invoice
//         for (const item of invoice.items) {
//             const quantityChange = Number(item.qty);
//             const stockUpdate = invoice.type === 'sale' ? quantityChange : -quantityChange;
//             await Product.findByIdAndUpdate(item.productId, { $inc: { stock: stockUpdate } });
//         }

//         // 3. Delete all cashflow entries (payments) linked to this invoice
//         await Cashflow.deleteMany({ invoiceId: invoiceId, userId });

//         // 4. Delete the invoice itself
//         await Invoice.findByIdAndDelete(invoiceId);

//         res.status(200).json({ message: "Invoice and related records deleted successfully!", id: invoiceId });

//     } catch (error) {
//         console.error("Error deleting invoice:", error);
//         res.status(500).json({ message: "Failed to delete invoice due to a server error.", error: error.message });
//     }
// };
// // highlight-end

// exports.recordInvoicePayment = async (req, res) => {
//     const { id: invoiceId } = req.params;
//     const { amount, date, paymentMethod, note } = req.body;
//     const userId = req.user.id;

//     if (!isValidObjectId(invoiceId)) {
//         return res.status(400).json({ message: "Invalid Invoice ID format" });
//     }

//     const paymentAmount = Number(amount);
//     if (isNaN(paymentAmount) || paymentAmount <= 0) {
//         return res.status(400).json({ message: "Invalid payment amount." });
//     }

//     try {
//         const invoice = await Invoice.findOne({ _id: invoiceId, userId: userId });
//         if (!invoice) {
//             return res.status(404).json({ message: "Invoice not found or you do not have permission." });
//         }

//         const balanceDue = invoice.balanceDue;
//         if (paymentAmount > balanceDue + 0.01) {
//             return res.status(400).json({ message: `Payment amount (₹${paymentAmount.toFixed(2)}) exceeds balance due (₹${balanceDue.toFixed(2)}).` });
//         }

//         const cashflowEntry = new Cashflow({
//             userId: userId,
//             invoiceId: invoice._id,
//             kind: invoice.type === 'sale' ? 'income' : 'expense',
//             date: date || new Date().toISOString().slice(0, 10),
//             category: invoice.type === 'sale' ? 'Payment Received' : 'Payment Made',
//             amount: paymentAmount,
//             paymentMethod: paymentMethod || 'Cash',
//             note: note || `Payment for ${invoice.type === 'sale' ? 'Invoice' : 'Bill'} #${invoice._id.toString().slice(-6)} (${invoice.customerName})`,
//         });
//         await cashflowEntry.save();

//         invoice.paidAmount += paymentAmount;
//         const newBalanceDue = invoice.balanceDue;
//         if (Math.abs(newBalanceDue) < 0.01) {
//             invoice.paymentStatus = 'paid';
//         } else if (invoice.paidAmount > 0) {
//             invoice.paymentStatus = 'partially_paid';
//         } else {
//             invoice.paymentStatus = 'unpaid';
//         }

//         const updatedInvoice = await invoice.save();

//         res.status(200).json({
//             message: "Payment recorded successfully!",
//             updatedInvoice: updatedInvoice.toJSON(),
//             cashflowEntry: cashflowEntry.toJSON()
//         });

//     } catch (error) {
//         console.error("Error recording payment:", error);
//         res.status(500).json({ message: "Failed to record payment", error: error.message });
//     }
// };


// // --- Cashflow Controllers ---
// exports.getCashflows = async (req, res) => {
//   try {
//     const cashflows = await Cashflow.find({ userId: req.user.id }).sort({ date: -1, createdAt: -1 });
//     res.status(200).json(cashflows);
//   } catch (error) {
//      console.error("Error fetching cashflows:", error);
//     res.status(500).json({ message: "Error fetching cashflow entries", error: error.message });
//   }
// };

// exports.addCashflow = async (req, res) => {
//   try {
//     const { invoiceId, ...cashflowData } = req.body;
//     const newCashflow = new Cashflow({ ...cashflowData, userId: req.user.id });
//     await newCashflow.save();
//     res.status(201).json(newCashflow);
//   } catch (error) {
//      console.error("Error adding cashflow:", error);
//      if (error.name === 'ValidationError') {
//          console.error("Validation Errors:", JSON.stringify(error.errors, null, 2));
//          return res.status(400).json({ message: "Validation Failed", errors: error.errors });
//      }
//     res.status(500).json({ message: "Failed to add cashflow entry", error: error.message });
//   }
// };

// exports.deleteCashflow = async (req, res) => {
//     const { id } = req.params;
//     if (!isValidObjectId(id)) {
//        return res.status(400).json({ message: "Invalid cashflow ID format" });
//     }
//   try {
//     const cashflowToDelete = await Cashflow.findOne({ _id: id, userId: req.user.id });
//      if (!cashflowToDelete) {
//        return res.status(404).json({ message: "Cashflow entry not found or you do not have permission" });
//      }

//      if (cashflowToDelete.invoiceId) {
//          const relatedInvoice = await Invoice.findOne({ _id: cashflowToDelete.invoiceId, userId: req.user.id });
//          if (relatedInvoice) {
//              relatedInvoice.paidAmount = Math.max(0, relatedInvoice.paidAmount - cashflowToDelete.amount);

//              const newBalanceDue = relatedInvoice.totalGrand - relatedInvoice.paidAmount;
//              if (Math.abs(newBalanceDue) < 0.01) relatedInvoice.paymentStatus = 'paid';
//              else if (relatedInvoice.paidAmount > 0) relatedInvoice.paymentStatus = 'partially_paid';
//              else relatedInvoice.paymentStatus = 'unpaid';

//              await relatedInvoice.save();
//          }
//      }

//     await Cashflow.findByIdAndDelete(id);
//     res.status(200).json({ message: "Cashflow entry deleted successfully", id: id });
//   } catch (error) {
//      console.error("Error deleting cashflow:", error);
//     res.status(500).json({ message: "Failed to delete cashflow entry", error: error.message });
//   }
// };


// // --- Supplier Controllers ---
// exports.getSuppliers = async (req, res) => {
//   try {
//     const suppliers = await Supplier.find({ userId: req.user.id }).sort({ name: 1 });
//     res.status(200).json(suppliers);
//   } catch (error) {
//     console.error("Error fetching suppliers:", error);
//     res.status(500).json({ message: "Error fetching suppliers", error: error.message });
//   }
// };

// exports.addSupplier = async (req, res) => {
//   try {
//     const existing = await Supplier.findOne({
//         name: { $regex: new RegExp(`^${req.body.name}$`, 'i') },
//         userId: req.user.id
//     });
//     if (existing) {
//         return res.status(400).json({ message: `Supplier with name '${req.body.name}' already exists.` });
//     }

//     const newSupplier = new Supplier({ ...req.body, userId: req.user.id });
//     await newSupplier.save();
//     res.status(201).json(newSupplier);
//   } catch (error) {
//     console.error("Error adding supplier:", error);
//     if (error.name === 'ValidationError') {
//         console.error("Validation Errors:", JSON.stringify(error.errors, null, 2));
//         return res.status(400).json({ message: "Validation Failed", errors: error.errors });
//     }
//      if (error.code === 11000) {
//          return res.status(400).json({ message: "Supplier name must be unique for your account." });
//      }
//     res.status(500).json({ message: "Failed to add supplier", error: error.message });
//   }
// };

// exports.updateSupplier = async (req, res) => {
//   const { id } = req.params;
//   if (!isValidObjectId(id)) {
//      return res.status(400).json({ message: "Invalid supplier ID format" });
//   }
//   try {
//     if (req.body.name) {
//         const existing = await Supplier.findOne({
//             name: { $regex: new RegExp(`^${req.body.name}$`, 'i') },
//             _id: { $ne: id },
//             userId: req.user.id
//         });
//         if (existing) {
//             return res.status(400).json({ message: `Another supplier with name '${req.body.name}' already exists.` });
//         }
//     }

//     const updatedSupplier = await Supplier.findOneAndUpdate(
//       { _id: id, userId: req.user.id },
//       req.body,
//       { new: true, runValidators: true }
//     );
//     if (!updatedSupplier) {
//       return res.status(404).json({ message: "Supplier not found or you do not have permission" });
//     }
//     res.status(200).json(updatedSupplier);
//   } catch (error) {
//     console.error("Error updating supplier:", error);
//      if (error.name === 'ValidationError') {
//          console.error("Validation Errors:", JSON.stringify(error.errors, null, 2));
//         return res.status(400).json({ message: "Validation Failed", errors: error.errors });
//      }
//      if (error.code === 11000) {
//          return res.status(400).json({ message: "Supplier name must be unique for your account." });
//      }
//     res.status(500).json({ message: "Failed to update supplier", error: error.message });
//   }
// };

// exports.deleteSupplier = async (req, res) => {
//     const { id } = req.params;
//     if (!isValidObjectId(id)) {
//        return res.status(400).json({ message: "Invalid supplier ID format" });
//     }
//   try {
//     const supplierToDelete = await Supplier.findOne({ _id: id, userId: req.user.id });
//     if (!supplierToDelete) {
//         return res.status(404).json({ message: "Supplier not found or you do not have permission" });
//     }

//     const purchaseBillUsingSupplier = await Invoice.findOne({
//         type: "purchase",
//         customerName: supplierToDelete.name,
//         userId: req.user.id
//     });
//     if (purchaseBillUsingSupplier) {
//         return res.status(400).json({ message: "Cannot delete supplier: They are associated with your existing purchase bills." });
//     }

//     await Supplier.findByIdAndDelete(id);
//     res.status(200).json({ message: "Supplier deleted successfully", id: id });
//   } catch (error) {
//      console.error("Error deleting supplier:", error);
//     res.status(500).json({ message: "Failed to delete supplier", error: error.message });
//   }
// };

// // Default export for backward compatibility
// export default {
//   getCustomers,
//   addCustomer,
//   updateCustomer,
//   deleteCustomer,
//   getProducts,
//   addProduct,
//   updateProduct,
//   deleteProduct,
//   getInvoices,
//   addInvoice,
//   deleteInvoice,
//   recordInvoicePayment,
//   getCashflows,
//   addCashflow,
//   deleteCashflow,
//   getSuppliers,
//   addSupplier,
//   updateSupplier,
//   deleteSupplier
// };

// // Import your models
// import { Product, Invoice, InventoryCustomer } from '../models/Inventory.js';

// /**
//  * Get all customers
//  */
// export const getCustomers = async (req, res) => {
//     try {
//         const vendorId = req.user.id;
//         const customers = await InventoryCustomer.find({ userId: vendorId }).lean();
//         res.status(200).json(customers);
//     } catch (error) {
//         console.error("Error fetching customers:", error);
//         res.status(500).json({ message: "Failed to fetch customers.", error: error.message });
//     }
// };

// /**
//  * Create a new customer
//  */
// export const createCustomer = async (req, res) => {
//     try {
//         const vendorId = req.user.id;
//         const { name, email, mobile } = req.body;
//         const newCustomer = await InventoryCustomer.create({ userId: vendorId, name, email, mobile });
//         res.status(201).json(newCustomer);
//     } catch (error) {
//         console.error("Error creating customer:", error);
//         res.status(500).json({ message: "Failed to create customer.", error: error.message });
//     }
// };

// /**
//  * Update an existing customer
//  */
// export const updateCustomer = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const updatedCustomer = await InventoryCustomer.findByIdAndUpdate(id, req.body, { new: true }).lean();
//         if (!updatedCustomer) {
//             return res.status(404).json({ message: "Customer not found." });
//         }
//         res.status(200).json(updatedCustomer);
//     } catch (error) {
//         console.error("Error updating customer:", error);
//         res.status(500).json({ message: "Failed to update customer.", error: error.message });
//     }
// };

// /**
//  * Delete a customer
//  */
// export const deleteCustomer = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const deletedCustomer = await InventoryCustomer.findByIdAndDelete(id).lean();
//         if (!deletedCustomer) {
//             return res.status(404).json({ message: "Customer not found." });
//         }
//         res.status(200).json({ message: "Customer deleted successfully." });
//     } catch (error) {
//         console.error("Error deleting customer:", error);
//         res.status(500).json({ message: "Failed to delete customer.", error: error.message });
//     }
// };

// /**
//  * Get all invoices
//  */
// export const getInvoices = async (req, res) => {
//     try {
//         const vendorId = req.user.id;
//         const invoices = await Invoice.find({ userId: vendorId }).lean();
//         res.status(200).json(invoices);
//     } catch (error) {
//         console.error("Error fetching invoices:", error);
//         res.status(500).json({ message: "Failed to fetch invoices.", error: error.message });
//     }
// };

// /**
//  * Get all products
//  */
// export const getProducts = async (req, res) => {
//     try {
//         const vendorId = req.user.id;
//         const products = await Product.find({ userId: vendorId }).lean();
//         res.status(200).json(products);
//     } catch (error) {
//         console.error("Error fetching products:", error);
//         res.status(500).json({ message: "Failed to fetch products.", error: error.message });
//     }
// };







// // Import your models
// import { Product, Invoice, InventoryCustomer } from '../models/Inventory.js';
// import mongoose from 'mongoose';

// /**
//  * Get all customers
//  */
// export const getCustomers = async (req, res) => {
//     try {
//         const vendorId = req.user.id;
//         const customers = await InventoryCustomer.find({ userId: vendorId }).lean();
//         res.status(200).json(customers);
//     } catch (error) {
//         console.error("Error fetching customers:", error);
//         res.status(500).json({ message: "Failed to fetch customers.", error: error.message });
//     }
// };

// /**
//  * Get single customer by ID
//  */
// export const getCustomerById = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const customer = await InventoryCustomer.findById(id).lean();
        
//         if (!customer) {
//             return res.status(404).json({ message: "Customer not found." });
//         }
        
//         // Verify customer belongs to the logged-in user
//         if (customer.userId.toString() !== req.user.id) {
//             return res.status(403).json({ message: "Unauthorized access to customer." });
//         }
        
//         res.status(200).json(customer);
//     } catch (error) {
//         console.error("Error fetching customer:", error);
//         res.status(500).json({ message: "Failed to fetch customer.", error: error.message });
//     }
// };

// /**
//  * Create a new customer
//  */
// export const createCustomer = async (req, res) => {
//     try {
//         const vendorId = req.user.id;
//         const { name, email, mobile, address, company, gstNumber } = req.body;
        
//         const newCustomer = await InventoryCustomer.create({ 
//             userId: vendorId, 
//             name, 
//             email, 
//             mobile,
//             address,
//             company,
//             gstNumber
//         });
        
//         res.status(201).json(newCustomer);
//     } catch (error) {
//         console.error("Error creating customer:", error);
//         res.status(500).json({ message: "Failed to create customer.", error: error.message });
//     }
// };

// /**
//  * Update an existing customer
//  */
// export const updateCustomer = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const vendorId = req.user.id;
        
//         // Verify customer belongs to the logged-in user
//         const existingCustomer = await InventoryCustomer.findById(id);
//         if (!existingCustomer) {
//             return res.status(404).json({ message: "Customer not found." });
//         }
        
//         if (existingCustomer.userId.toString() !== vendorId) {
//             return res.status(403).json({ message: "Unauthorized access to customer." });
//         }
        
//         const updatedCustomer = await InventoryCustomer.findByIdAndUpdate(id, req.body, { new: true }).lean();
//         res.status(200).json(updatedCustomer);
//     } catch (error) {
//         console.error("Error updating customer:", error);
//         res.status(500).json({ message: "Failed to update customer.", error: error.message });
//     }
// };

// /**
//  * Delete a customer
//  */
// export const deleteCustomer = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const vendorId = req.user.id;
        
//         // Verify customer belongs to the logged-in user
//         const existingCustomer = await InventoryCustomer.findById(id);
//         if (!existingCustomer) {
//             return res.status(404).json({ message: "Customer not found." });
//         }
        
//         if (existingCustomer.userId.toString() !== vendorId) {
//             return res.status(403).json({ message: "Unauthorized access to customer." });
//         }
        
//         // Check if customer has any invoices
//         const customerInvoices = await Invoice.find({ customerId: id });
//         if (customerInvoices.length > 0) {
//             return res.status(400).json({ 
//                 message: "Cannot delete customer with existing invoices. Delete invoices first or archive instead." 
//             });
//         }
        
//         const deletedCustomer = await InventoryCustomer.findByIdAndDelete(id).lean();
//         res.status(200).json({ message: "Customer deleted successfully." });
//     } catch (error) {
//         console.error("Error deleting customer:", error);
//         res.status(500).json({ message: "Failed to delete customer.", error: error.message });
//     }
// };

// /**
//  * Get all products
//  */
// export const getProducts = async (req, res) => {
//     try {
//         const vendorId = req.user.id;
//         const { category, lowStock } = req.query;
        
//         let query = { userId: vendorId };
        
//         // Filter by category if provided
//         if (category) {
//             query.category = category;
//         }
        
//         // Filter low stock items
//         if (lowStock === 'true') {
//             query.$expr = { $lt: ["$stock", "$lowStock"] };
//         }
        
//         const products = await Product.find(query).lean().sort({ createdAt: -1 });
//         res.status(200).json(products);
//     } catch (error) {
//         console.error("Error fetching products:", error);
//         res.status(500).json({ message: "Failed to fetch products.", error: error.message });
//     }
// };

// /**
//  * Get single product by ID
//  */
// export const getProductById = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const product = await Product.findById(id).lean();
        
//         if (!product) {
//             return res.status(404).json({ message: "Product not found." });
//         }
        
//         // Verify product belongs to the logged-in user
//         if (product.userId.toString() !== req.user.id) {
//             return res.status(403).json({ message: "Unauthorized access to product." });
//         }
        
//         res.status(200).json(product);
//     } catch (error) {
//         console.error("Error fetching product:", error);
//         res.status(500).json({ message: "Failed to fetch product.", error: error.message });
//     }
// };

// /**
//  * Create a new product
//  */
// export const createProduct = async (req, res) => {
//     try {
//         const vendorId = req.user.id;
//         const { 
//             name, 
//             category, 
//             sku, 
//             unitPrice, 
//             sellingPrice, 
//             gstRate, 
//             stock, 
//             lowStock, 
//             description,
//             image 
//         } = req.body;
        
//         // Validate required fields
//         if (!name || !unitPrice || stock === undefined) {
//             return res.status(400).json({ 
//                 message: "Name, unitPrice, and stock are required fields." 
//             });
//         }
        
//         // Generate SKU if not provided
//         const generatedSku = sku || `SKU-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        
//         const newProduct = await Product.create({ 
//             userId: vendorId,
//             name,
//             category: category || "Uncategorized",
//             sku: generatedSku,
//             unitPrice: parseFloat(unitPrice),
//             sellingPrice: sellingPrice ? parseFloat(sellingPrice) : parseFloat(unitPrice) * 1.2, // Default 20% markup
//             gstRate: parseFloat(gstRate) || 18,
//             stock: parseInt(stock),
//             lowStock: parseInt(lowStock) || 5,
//             description: description || "",
//             image: image || ""
//         });
        
//         res.status(201).json(newProduct);
//     } catch (error) {
//         console.error("Error creating product:", error);
//         res.status(500).json({ message: "Failed to create product.", error: error.message });
//     }
// };

// /**
//  * Update a product
//  */
// export const updateProduct = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const vendorId = req.user.id;
        
//         // Verify product belongs to the logged-in user
//         const existingProduct = await Product.findById(id);
//         if (!existingProduct) {
//             return res.status(404).json({ message: "Product not found." });
//         }
        
//         if (existingProduct.userId.toString() !== vendorId) {
//             return res.status(403).json({ message: "Unauthorized access to product." });
//         }
        
//         const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true }).lean();
//         res.status(200).json(updatedProduct);
//     } catch (error) {
//         console.error("Error updating product:", error);
//         res.status(500).json({ message: "Failed to update product.", error: error.message });
//     }
// };

// /**
//  * Delete a product
//  */
// export const deleteProduct = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const vendorId = req.user.id;
        
//         // Verify product belongs to the logged-in user
//         const existingProduct = await Product.findById(id);
//         if (!existingProduct) {
//             return res.status(404).json({ message: "Product not found." });
//         }
        
//         if (existingProduct.userId.toString() !== vendorId) {
//             return res.status(403).json({ message: "Unauthorized access to product." });
//         }
        
//         // Check if product is referenced in any invoices
//         const productInvoices = await Invoice.find({ 
//             "items.productId": id 
//         });
        
//         if (productInvoices.length > 0) {
//             return res.status(400).json({ 
//                 message: "Cannot delete product that exists in invoices. Consider archiving instead." 
//             });
//         }
        
//         await Product.findByIdAndDelete(id);
//         res.status(200).json({ message: "Product deleted successfully." });
//     } catch (error) {
//         console.error("Error deleting product:", error);
//         res.status(500).json({ message: "Failed to delete product.", error: error.message });
//     }
// };

// /**
//  * Get all invoices
//  */
// export const getInvoices = async (req, res) => {
//     try {
//         const vendorId = req.user.id;
//         const { status, customerId, startDate, endDate } = req.query;
        
//         let query = { userId: vendorId };
        
//         // Apply filters
//         if (status) {
//             query.status = status;
//         }
        
//         if (customerId) {
//             query.customerId = customerId;
//         }
        
//         if (startDate || endDate) {
//             query.invoiceDate = {};
//             if (startDate) {
//                 query.invoiceDate.$gte = new Date(startDate);
//             }
//             if (endDate) {
//                 query.invoiceDate.$lte = new Date(endDate);
//             }
//         }
        
//         const invoices = await Invoice.find(query)
//             .populate('customerId', 'name email mobile')
//             .lean()
//             .sort({ invoiceDate: -1 });
        
//         res.status(200).json(invoices);
//     } catch (error) {
//         console.error("Error fetching invoices:", error);
//         res.status(500).json({ message: "Failed to fetch invoices.", error: error.message });
//     }
// };

// /**
//  * Get single invoice by ID
//  */
// export const getInvoiceById = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const invoice = await Invoice.findById(id)
//             .populate('customerId', 'name email mobile address company gstNumber')
//             .populate('items.productId', 'name sku unitPrice sellingPrice gstRate')
//             .lean();
        
//         if (!invoice) {
//             return res.status(404).json({ message: "Invoice not found." });
//         }
        
//         // Verify invoice belongs to the logged-in user
//         if (invoice.userId.toString() !== req.user.id) {
//             return res.status(403).json({ message: "Unauthorized access to invoice." });
//         }
        
//         res.status(200).json(invoice);
//     } catch (error) {
//         console.error("Error fetching invoice:", error);
//         res.status(500).json({ message: "Failed to fetch invoice.", error: error.message });
//     }
// };

// /**
//  * Create a new invoice
//  */
// export const createInvoice = async (req, res) => {
//     const session = await mongoose.startSession();
//     session.startTransaction();
    
//     try {
//         const vendorId = req.user.id;
//         const {
//             customerId,
//             invoiceDate,
//             dueDate,
//             items,
//             notes,
//             termsAndConditions,
//             discount,
//             paymentMethod
//         } = req.body;
        
//         // Validate required fields
//         if (!customerId || !items || items.length === 0) {
//             await session.abortTransaction();
//             return res.status(400).json({ 
//                 message: "Customer ID and items are required." 
//             });
//         }
        
//         // Verify customer exists and belongs to user
//         const customer = await InventoryCustomer.findOne({
//             _id: customerId,
//             userId: vendorId
//         }).session(session);
        
//         if (!customer) {
//             await session.abortTransaction();
//             return res.status(404).json({ message: "Customer not found or unauthorized." });
//         }
        
//         // Calculate totals and update product stock
//         let subtotal = 0;
//         let gstTotal = 0;
//         const updatedItems = [];
        
//         for (const item of items) {
//             const product = await Product.findOne({
//                 _id: item.productId,
//                 userId: vendorId
//             }).session(session);
            
//             if (!product) {
//                 await session.abortTransaction();
//                 return res.status(404).json({ 
//                     message: `Product with ID ${item.productId} not found or unauthorized.` 
//                 });
//             }
            
//             if (product.stock < item.quantity) {
//                 await session.abortTransaction();
//                 return res.status(400).json({ 
//                     message: `Insufficient stock for product: ${product.name}. Available: ${product.stock}` 
//                 });
//             }
            
//             const price = item.price || product.sellingPrice;
//             const gstRate = item.gstRate || product.gstRate;
//             const itemTotal = price * item.quantity;
//             const itemGST = itemTotal * (gstRate / 100);
            
//             subtotal += itemTotal;
//             gstTotal += itemGST;
            
//             // Reduce product stock
//             product.stock -= item.quantity;
//             await product.save({ session });
            
//             updatedItems.push({
//                 productId: product._id,
//                 name: product.name,
//                 quantity: item.quantity,
//                 price: price,
//                 gstRate: gstRate,
//                 total: itemTotal,
//                 gstAmount: itemGST
//             });
//         }
        
//         const discountAmount = discount || 0;
//         const totalAmount = subtotal + gstTotal - discountAmount;
        
//         // Generate invoice number
//         const invoiceCount = await Invoice.countDocuments({ userId: vendorId }).session(session);
//         const invoiceNumber = `INV-${Date.now().toString().slice(-6)}-${invoiceCount + 1}`;
        
//         const newInvoice = await Invoice.create([{
//             userId: vendorId,
//             customerId: customerId,
//             invoiceNumber: invoiceNumber,
//             invoiceDate: invoiceDate || new Date(),
//             dueDate: dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days default
//             items: updatedItems,
//             subtotal: subtotal,
//             gstTotal: gstTotal,
//             discount: discountAmount,
//             totalAmount: totalAmount,
//             notes: notes || "",
//             termsAndConditions: termsAndConditions || "",
//             paymentMethod: paymentMethod || "Cash",
//             status: "Pending"
//         }], { session });
        
//         await session.commitTransaction();
        
//         const populatedInvoice = await Invoice.findById(newInvoice[0]._id)
//             .populate('customerId', 'name email mobile')
//             .populate('items.productId', 'name sku');
        
//         res.status(201).json(populatedInvoice);
//     } catch (error) {
//         await session.abortTransaction();
//         console.error("Error creating invoice:", error);
//         res.status(500).json({ message: "Failed to create invoice.", error: error.message });
//     } finally {
//         session.endSession();
//     }
// };

// /**
//  * Update invoice status
//  */
// export const updateInvoiceStatus = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const vendorId = req.user.id;
//         const { status, paymentDate, transactionId } = req.body;
        
//         // Verify invoice belongs to the logged-in user
//         const existingInvoice = await Invoice.findById(id);
//         if (!existingInvoice) {
//             return res.status(404).json({ message: "Invoice not found." });
//         }
        
//         if (existingInvoice.userId.toString() !== vendorId) {
//             return res.status(403).json({ message: "Unauthorized access to invoice." });
//         }
        
//         const updateData = {};
//         if (status) updateData.status = status;
//         if (paymentDate) updateData.paymentDate = paymentDate;
//         if (transactionId) updateData.transactionId = transactionId;
        
//         // If marking as paid, set payment date if not provided
//         if (status === 'Paid' && !paymentDate) {
//             updateData.paymentDate = new Date();
//         }
        
//         const updatedInvoice = await Invoice.findByIdAndUpdate(id, updateData, { new: true })
//             .populate('customerId', 'name email mobile')
//             .lean();
        
//         res.status(200).json(updatedInvoice);
//     } catch (error) {
//         console.error("Error updating invoice:", error);
//         res.status(500).json({ message: "Failed to update invoice.", error: error.message });
//     }
// };

// /**
//  * Delete an invoice (and restore product stock)
//  */
// export const deleteInvoice = async (req, res) => {
//     const session = await mongoose.startSession();
//     session.startTransaction();
    
//     try {
//         const { id } = req.params;
//         const vendorId = req.user.id;
        
//         // Verify invoice belongs to the logged-in user
//         const existingInvoice = await Invoice.findOne({
//             _id: id,
//             userId: vendorId
//         }).session(session);
        
//         if (!existingInvoice) {
//             await session.abortTransaction();
//             return res.status(404).json({ message: "Invoice not found or unauthorized." });
//         }
        
//         // Restore product stock
//         for (const item of existingInvoice.items) {
//             const product = await Product.findOne({
//                 _id: item.productId,
//                 userId: vendorId
//             }).session(session);
            
//             if (product) {
//                 product.stock += item.quantity;
//                 await product.save({ session });
//             }
//         }
        
//         // Delete the invoice
//         await Invoice.findByIdAndDelete(id).session(session);
        
//         await session.commitTransaction();
//         res.status(200).json({ message: "Invoice deleted and stock restored successfully." });
//     } catch (error) {
//         await session.abortTransaction();
//         console.error("Error deleting invoice:", error);
//         res.status(500).json({ message: "Failed to delete invoice.", error: error.message });
//     } finally {
//         session.endSession();
//     }
// };

// /**
//  * Get dashboard statistics
//  */
// export const getDashboardStats = async (req, res) => {
//     try {
//         const vendorId = req.user.id;
        
//         const [
//             totalProducts,
//             totalCustomers,
//             totalInvoices,
//             pendingInvoices,
//             paidInvoices,
//             lowStockProducts,
//             recentInvoices,
//             monthlyRevenue
//         ] = await Promise.all([
//             Product.countDocuments({ userId: vendorId }),
//             InventoryCustomer.countDocuments({ userId: vendorId }),
//             Invoice.countDocuments({ userId: vendorId }),
//             Invoice.countDocuments({ userId: vendorId, status: 'Pending' }),
//             Invoice.countDocuments({ userId: vendorId, status: 'Paid' }),
//             Product.countDocuments({ 
//                 userId: vendorId,
//                 $expr: { $lt: ["$stock", "$lowStock"] }
//             }),
//             Invoice.find({ userId: vendorId })
//                 .populate('customerId', 'name')
//                 .sort({ invoiceDate: -1 })
//                 .limit(5)
//                 .lean(),
//             Invoice.aggregate([
//                 {
//                     $match: {
//                         userId: new mongoose.Types.ObjectId(vendorId),
//                         status: 'Paid',
//                         invoiceDate: {
//                             $gte: new Date(new Date().setMonth(new Date().getMonth() - 6))
//                         }
//                     }
//                 },
//                 {
//                     $group: {
//                         _id: {
//                             year: { $year: "$invoiceDate" },
//                             month: { $month: "$invoiceDate" }
//                         },
//                         total: { $sum: "$totalAmount" },
//                         count: { $sum: 1 }
//                     }
//                 },
//                 { $sort: { "_id.year": 1, "_id.month": 1 } }
//             ])
//         ]);
        
//         // Calculate total revenue
//         const revenueResult = await Invoice.aggregate([
//             {
//                 $match: {
//                     userId: new mongoose.Types.ObjectId(vendorId),
//                     status: 'Paid'
//                 }
//             },
//             {
//                 $group: {
//                     _id: null,
//                     totalRevenue: { $sum: "$totalAmount" }
//                 }
//             }
//         ]);
        
//         const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;
        
//         res.status(200).json({
//             stats: {
//                 totalProducts,
//                 totalCustomers,
//                 totalInvoices,
//                 pendingInvoices,
//                 paidInvoices,
//                 lowStockProducts,
//                 totalRevenue
//             },
//             recentInvoices,
//             monthlyRevenue
//         });
//     } catch (error) {
//         console.error("Error fetching dashboard stats:", error);
//         res.status(500).json({ message: "Failed to fetch dashboard statistics.", error: error.message });
//     }
// };

















// Import all models required
import { Product, Cashflow, Invoice, Supplier, InventoryCustomer } from "../models/Inventory.js";
import mongoose from 'mongoose';

// Helper function for ObjectId validation
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Customer Controllers
export const getCustomers = async (req, res) => {
  try {
    const customers = await InventoryCustomer.find({ userId: req.user.id }).sort({ name: 1 });
    res.status(200).json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ message: "Error fetching customers", error: error.message });
  }
};

export const addCustomer = async (req, res) => {
  try {
    const existing = await InventoryCustomer.findOne({
      name: { $regex: new RegExp(`^${req.body.name}$`, 'i') },
      userId: req.user.id
    });
    if (existing) {
      return res.status(400).json({ message: `A customer with the name '${req.body.name}' already exists.` });
    }
    const newCustomer = new InventoryCustomer({ ...req.body, userId: req.user.id });
    await newCustomer.save();
    res.status(201).json(newCustomer);
  } catch (error) {
    console.error("Error adding customer:", error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: "Validation Failed", errors: error.errors });
    }
    res.status(500).json({ message: "Failed to add customer", error: error.message });
  }
};

export const updateCustomer = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid customer ID format" });
  }
  try {
    const updatedCustomer = await InventoryCustomer.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found or you do not have permission" });
    }
    res.status(200).json(updatedCustomer);
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ message: "Failed to update customer", error: error.message });
  }
};

export const deleteCustomer = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid customer ID format" });
  }
  try {
    const customerToDelete = await InventoryCustomer.findOne({ _id: id, userId: req.user.id });
    if (!customerToDelete) {
      return res.status(404).json({ message: "Customer not found or you do not have permission." });
    }

    // Check if customer is used in any sale invoices
    const saleInvoiceExists = await Invoice.findOne({
      type: "sale",
      customerName: customerToDelete.name,
      userId: req.user.id
    });

    if (saleInvoiceExists) {
      return res.status(400).json({ message: "Cannot delete customer: They are linked to existing sales invoices." });
    }

    await InventoryCustomer.findByIdAndDelete(id);
    res.status(200).json({ message: "Customer deleted successfully", id: id });
  } catch (error) {
    console.error("Error deleting customer:", error);
    res.status(500).json({ message: "Failed to delete customer", error: error.message });
  }
};

// Product Controllers
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ userId: req.user.id }).sort({ name: 1 });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

// export const addProduct = async (req, res) => {
//   try {
//     const newProduct = new Product({ ...req.body, userId: req.user.id });
//     await newProduct.save();
//     res.status(201).json(newProduct);
//   } catch (error) {
//     console.error("Error adding product:", error);
//     if (error.name === 'ValidationError') {
//       console.error("Validation Errors:", JSON.stringify(error.errors, null, 2));
//       return res.status(400).json({ message: "Validation Failed", errors: error.errors });
//     }
//     if (error.code === 11000 && error.keyPattern && error.keyPattern.sku) {
//       return res.status(400).json({ message: `Product with SKU '${error.keyValue.sku}' already exists.` });
//     }
//     res.status(500).json({ message: "Failed to add product", error: error.message });
//   }
// };


export const addProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      sku,
      unitPrice,
      sellingPrice,
      gstRate,
      stock,
      lowStock,
      image
    } = req.body;

    // ✅ Manual validation (important)
    if (!name || unitPrice === undefined) {
      return res.status(400).json({
        message: "Product name and unit price are required"
      });
    }

    const product = await Product.create({
      userId: req.user._id,
      name,
      category,
      sku,
      unitPrice,
      sellingPrice,
      gstRate,
      stock,
      lowStock,
      image
    });

    res.status(201).json(product);

  } catch (error) {
    console.error("Add Product Error:", error);
    res.status(500).json({ message: error.message });
  }
};


export const updateProduct = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid product ID format" });
  }
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found or you do not have permission" });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    if (error.name === 'ValidationError') {
      console.error("Validation Errors:", JSON.stringify(error.errors, null, 2));
      return res.status(400).json({ message: "Validation Failed", errors: error.errors });
    }
    if (error.code === 11000 && error.keyPattern && error.keyPattern.sku) {
      return res.status(400).json({ message: `Product with SKU '${error.keyValue.sku}' already exists.` });
    }
    res.status(500).json({ message: "Failed to update product", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid product ID format" });
  }
  try {
    const invoiceUsingProduct = await Invoice.findOne({ "items.productId": id, userId: req.user.id });
    if (invoiceUsingProduct) {
      return res.status(400).json({ message: "Cannot delete product: It is associated with your existing invoices/bills." });
    }

    const deletedProduct = await Product.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found or you do not have permission" });
    }
    res.status(200).json({ message: "Product deleted successfully", id: id });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Failed to delete product", error: error.message });
  }
};

// Invoice Controllers
export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ userId: req.user.id }).sort({ date: -1, createdAt: -1 });
    res.status(200).json(invoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    res.status(500).json({ message: "Error fetching invoices", error: error.message });
  }
};

export const addInvoice = async (req, res) => {
  try {
    const invoiceData = req.body;
    const newInvoiceData = { ...invoiceData, userId: req.user.id, paidAmount: 0, paymentStatus: 'unpaid' };

    if (!newInvoiceData.items || !Array.isArray(newInvoiceData.items) || newInvoiceData.items.length === 0) {
      throw new Error("Invoice must contain at least one item.");
    }
    if (!newInvoiceData.customerName || typeof newInvoiceData.customerName !== 'string' || newInvoiceData.customerName.trim() === '') {
      throw new Error("Customer or Supplier name is required.");
    }

    for (const item of newInvoiceData.items) {
      if (!item.productId || !isValidObjectId(item.productId)) {
        throw new Error(`Invalid or missing productId in invoice items: ${item.productId || 'undefined'}`);
      }
      const product = await Product.findOne({ _id: item.productId, userId: req.user.id });
      if (!product) {
        throw new Error(`Product with ID ${item.productId} (${item.name || 'N/A'}) not found or you do not have permission.`);
      }
      const quantityChange = Number(item.qty);
      if (isNaN(quantityChange) || quantityChange <= 0) {
        throw new Error(`Invalid quantity (${item.qty}) for item ${item.name || item.productId}.`);
      }
      if (newInvoiceData.type === "sale" && product.stock < quantityChange) {
        throw new Error(`Insufficient stock for product ${product.name}. Available: ${product.stock}, Required: ${quantityChange}.`);
      }
    }

    const newInvoice = new Invoice(newInvoiceData);
    await newInvoice.save();

    for (const item of newInvoice.items) {
      const quantityChange = Number(item.qty);
      const updateOperation = newInvoice.type === "sale"
        ? { $inc: { stock: -quantityChange } }
        : { $inc: { stock: +quantityChange } };
      await Product.findByIdAndUpdate(item.productId, updateOperation);
    }

    res.status(201).json(newInvoice.toJSON());

  } catch (error) {
    console.error("Error adding invoice:", error.message);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: "Invoice Validation Failed", error: error.message, details: error.errors });
    }
    if (error.message.includes("Invoice must contain") || error.message.includes("Insufficient stock")) {
      return res.status(400).json({ message: error.message, error: error.message });
    }
    res.status(500).json({ message: "Failed to add invoice due to an unexpected error.", error: error.message });
  }
};

// Delete Invoice (Without Transactions)
export const deleteInvoice = async (req, res) => {
  const { id: invoiceId } = req.params;
  const userId = req.user.id;

  if (!isValidObjectId(invoiceId)) {
    return res.status(400).json({ message: "Invalid Invoice ID format." });
  }

  try {
    // 1. Find the invoice to be deleted
    const invoice = await Invoice.findOne({ _id: invoiceId, userId });
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found or you do not have permission." });
    }

    // 2. Reverse the stock changes for each item in the invoice
    for (const item of invoice.items) {
      const quantityChange = Number(item.qty);
      const stockUpdate = invoice.type === 'sale' ? quantityChange : -quantityChange;
      await Product.findByIdAndUpdate(item.productId, { $inc: { stock: stockUpdate } });
    }

    // 3. Delete all cashflow entries (payments) linked to this invoice
    await Cashflow.deleteMany({ invoiceId: invoiceId, userId });

    // 4. Delete the invoice itself
    await Invoice.findByIdAndDelete(invoiceId);

    res.status(200).json({ message: "Invoice and related records deleted successfully!", id: invoiceId });

  } catch (error) {
    console.error("Error deleting invoice:", error);
    res.status(500).json({ message: "Failed to delete invoice due to a server error.", error: error.message });
  }
};

export const recordInvoicePayment = async (req, res) => {
  const { id: invoiceId } = req.params;
  const { amount, date, paymentMethod, note } = req.body;
  const userId = req.user.id;

  if (!isValidObjectId(invoiceId)) {
    return res.status(400).json({ message: "Invalid Invoice ID format" });
  }

  const paymentAmount = Number(amount);
  if (isNaN(paymentAmount) || paymentAmount <= 0) {
    return res.status(400).json({ message: "Invalid payment amount." });
  }

  try {
    const invoice = await Invoice.findOne({ _id: invoiceId, userId: userId });
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found or you do not have permission." });
    }

    const balanceDue = invoice.balanceDue;
    if (paymentAmount > balanceDue + 0.01) {
      return res.status(400).json({ message: `Payment amount (₹${paymentAmount.toFixed(2)}) exceeds balance due (₹${balanceDue.toFixed(2)}).` });
    }

    const cashflowEntry = new Cashflow({
      userId: userId,
      invoiceId: invoice._id,
      kind: invoice.type === 'sale' ? 'income' : 'expense',
      date: date || new Date().toISOString().slice(0, 10),
      category: invoice.type === 'sale' ? 'Payment Received' : 'Payment Made',
      amount: paymentAmount,
      paymentMethod: paymentMethod || 'Cash',
      note: note || `Payment for ${invoice.type === 'sale' ? 'Invoice' : 'Bill'} #${invoice._id.toString().slice(-6)} (${invoice.customerName})`,
    });
    await cashflowEntry.save();

    invoice.paidAmount += paymentAmount;
    const newBalanceDue = invoice.balanceDue;
    if (Math.abs(newBalanceDue) < 0.01) {
      invoice.paymentStatus = 'paid';
    } else if (invoice.paidAmount > 0) {
      invoice.paymentStatus = 'partially_paid';
    } else {
      invoice.paymentStatus = 'unpaid';
    }

    const updatedInvoice = await invoice.save();

    res.status(200).json({
      message: "Payment recorded successfully!",
      updatedInvoice: updatedInvoice.toJSON(),
      cashflowEntry: cashflowEntry.toJSON()
    });

  } catch (error) {
    console.error("Error recording payment:", error);
    res.status(500).json({ message: "Failed to record payment", error: error.message });
  }
};

// Cashflow Controllers
export const getCashflows = async (req, res) => {
  try {
    const cashflows = await Cashflow.find({ userId: req.user.id }).sort({ date: -1, createdAt: -1 });
    res.status(200).json(cashflows);
  } catch (error) {
    console.error("Error fetching cashflows:", error);
    res.status(500).json({ message: "Error fetching cashflow entries", error: error.message });
  }
};

export const addCashflow = async (req, res) => {
  try {
    const { invoiceId, ...cashflowData } = req.body;
    const newCashflow = new Cashflow({ ...cashflowData, userId: req.user.id });
    await newCashflow.save();
    res.status(201).json(newCashflow);
  } catch (error) {
    console.error("Error adding cashflow:", error);
    if (error.name === 'ValidationError') {
      console.error("Validation Errors:", JSON.stringify(error.errors, null, 2));
      return res.status(400).json({ message: "Validation Failed", errors: error.errors });
    }
    res.status(500).json({ message: "Failed to add cashflow entry", error: error.message });
  }
};

export const deleteCashflow = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid cashflow ID format" });
  }
  try {
    const cashflowToDelete = await Cashflow.findOne({ _id: id, userId: req.user.id });
    if (!cashflowToDelete) {
      return res.status(404).json({ message: "Cashflow entry not found or you do not have permission" });
    }

    if (cashflowToDelete.invoiceId) {
      const relatedInvoice = await Invoice.findOne({ _id: cashflowToDelete.invoiceId, userId: req.user.id });
      if (relatedInvoice) {
        relatedInvoice.paidAmount = Math.max(0, relatedInvoice.paidAmount - cashflowToDelete.amount);

        const newBalanceDue = relatedInvoice.totalGrand - relatedInvoice.paidAmount;
        if (Math.abs(newBalanceDue) < 0.01) relatedInvoice.paymentStatus = 'paid';
        else if (relatedInvoice.paidAmount > 0) relatedInvoice.paymentStatus = 'partially_paid';
        else relatedInvoice.paymentStatus = 'unpaid';

        await relatedInvoice.save();
      }
    }

    await Cashflow.findByIdAndDelete(id);
    res.status(200).json({ message: "Cashflow entry deleted successfully", id: id });
  } catch (error) {
    console.error("Error deleting cashflow:", error);
    res.status(500).json({ message: "Failed to delete cashflow entry", error: error.message });
  }
};

// Supplier Controllers
export const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find({ userId: req.user.id }).sort({ name: 1 });
    res.status(200).json(suppliers);
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    res.status(500).json({ message: "Error fetching suppliers", error: error.message });
  }
};

export const addSupplier = async (req, res) => {
  try {
    const existing = await Supplier.findOne({
      name: { $regex: new RegExp(`^${req.body.name}$`, 'i') },
      userId: req.user.id
    });
    if (existing) {
      return res.status(400).json({ message: `Supplier with name '${req.body.name}' already exists.` });
    }

    const newSupplier = new Supplier({ ...req.body, userId: req.user.id });
    await newSupplier.save();
    res.status(201).json(newSupplier);
  } catch (error) {
    console.error("Error adding supplier:", error);
    if (error.name === 'ValidationError') {
      console.error("Validation Errors:", JSON.stringify(error.errors, null, 2));
      return res.status(400).json({ message: "Validation Failed", errors: error.errors });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: "Supplier name must be unique for your account." });
    }
    res.status(500).json({ message: "Failed to add supplier", error: error.message });
  }
};

export const updateSupplier = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid supplier ID format" });
  }
  try {
    if (req.body.name) {
      const existing = await Supplier.findOne({
        name: { $regex: new RegExp(`^${req.body.name}$`, 'i') },
        _id: { $ne: id },
        userId: req.user.id
      });
      if (existing) {
        return res.status(400).json({ message: `Another supplier with name '${req.body.name}' already exists.` });
      }
    }

    const updatedSupplier = await Supplier.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedSupplier) {
      return res.status(404).json({ message: "Supplier not found or you do not have permission" });
    }
    res.status(200).json(updatedSupplier);
  } catch (error) {
    console.error("Error updating supplier:", error);
    if (error.name === 'ValidationError') {
      console.error("Validation Errors:", JSON.stringify(error.errors, null, 2));
      return res.status(400).json({ message: "Validation Failed", errors: error.errors });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: "Supplier name must be unique for your account." });
    }
    res.status(500).json({ message: "Failed to update supplier", error: error.message });
  }
};

export const deleteSupplier = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid supplier ID format" });
  }
  try {
    const supplierToDelete = await Supplier.findOne({ _id: id, userId: req.user.id });
    if (!supplierToDelete) {
      return res.status(404).json({ message: "Supplier not found or you do not have permission" });
    }

    const purchaseBillUsingSupplier = await Invoice.findOne({
      type: "purchase",
      customerName: supplierToDelete.name,
      userId: req.user.id
    });
    if (purchaseBillUsingSupplier) {
      return res.status(400).json({ message: "Cannot delete supplier: They are associated with your existing purchase bills." });
    }

    await Supplier.findByIdAndDelete(id);
    res.status(200).json({ message: "Supplier deleted successfully", id: id });
  } catch (error) {
    console.error("Error deleting supplier:", error);
    res.status(500).json({ message: "Failed to delete supplier", error: error.message });
  }
};