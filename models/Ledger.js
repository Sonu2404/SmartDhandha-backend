// import mongoose from "mongoose";

// // =================================================================================
// // 1. Customer Model
// // =================================================================================
// const customerSchema = new mongoose.Schema({
//   // --- ADD THIS BLOCK ---
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//     index: true // Add an index for faster queries
//   },
//   // ---
//   name: { type: String, required: true, trim: true },
//   phone: { type: String, default: "" },
//   email: { type: String, default: "" },
//   address: { type: String, default: "" },
// });
// const Customer = mongoose.model("Customer", customerSchema);

// // 2. Transaction Model

// const transactionSchema = new mongoose.Schema({
//   // --- ADD THIS BLOCK ---
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//     index: true
//   },
//   // ---
//   customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
//   type: { type: String, enum: ["credit", "debit"], required: true },
//   amount: { type: Number, required: true, min: 0 },
//   date: { type: String, required: true }, 
//   note: { type: String, default: "" },
// });
// const Transaction = mongoose.model("Transaction", transactionSchema);


// // 3. Reminder Model
// const reminderSchema = new mongoose.Schema({
 
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//     index: true
//   },
//   // ---
//   customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
//   dueDate: { type: Date, required: true },
//   message: { type: String, default: "" },
//   isCompleted: { type: Boolean, default: false },
// });
// const Reminder = mongoose.model("Reminder", reminderSchema);

// // Export all models
// export { Customer, Transaction, Reminder };




import mongoose from "mongoose";

// =======================
// Customer Model
// =======================
const customerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  name: { type: String, required: true, trim: true },
  phone: { type: String, default: "" },
  email: { type: String, default: "" },
  address: { type: String, default: "" }
}, { timestamps: true });

const Customer = mongoose.model("Customer", customerSchema);

// =======================
// Transaction Model
// =======================
const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  type: { type: String, enum: ["credit", "debit"], required: true },
  amount: { type: Number, required: true, min: 0 },
  date: { type: Date, required: true },
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    default: null
  },
  note: { type: String, default: "" }
}, { timestamps: true });

const Transaction = mongoose.model("Transaction", transactionSchema);

// =======================
// Reminder Model
// =======================
const reminderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  dueDate: { type: Date, required: true },
  message: { type: String, default: "" },
  isCompleted: { type: Boolean, default: false }
}, { timestamps: true });

const Reminder = mongoose.model("Reminder", reminderSchema);

export { Customer, Transaction, Reminder };
