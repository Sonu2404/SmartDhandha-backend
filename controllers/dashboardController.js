// import mongoose from 'mongoose';
// // NOTE: Ensure these models are correctly defined and imported from your project's structure
// import { Invoice, Cashflow, Product } from '../models/Inventory.js'; 
// import Visitor from '../models/Visitor.js'; 

// // Helper function to safely convert ID or throw
// const getObjectId = (id, res) => {
//     if (!id || !mongoose.Types.ObjectId.isValid(id)) {
//         res.status(400).json({ message: "Invalid User ID provided." });
//         // NOTE: Throwing here ensures the subsequent Promise.all does not execute if the ID is bad.
//         throw new Error("Invalid ID for aggregation pipeline."); 
//     }
//     // FIX: Use 'new' to resolve TypeError
//     return new mongoose.Types.ObjectId(id); 
// };

// // --- 1. Get Main KPI Stats (FIXED) ---
// // --- 1. Get Main KPI Stats (FINAL FIX) ---
// export const getDashboardStats = async (req, res) => {
//     try {
//         const today = new Date();
       
//        const todayString = today.toISOString().slice(0, 10); 
        
//         const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

//         const userId = getObjectId(req.user.id, res);

//         const [
//             salesAndProfitToday, 
//             totalReceivables, 
//             expensesThisMonth, 
//             lowStockCount,
//             inventoryValueResult
//         ] = await Promise.all([
//             // Sales & Profit Today (FIXED)
//             Invoice.aggregate([
//                 { $match: { 
//                     userId: userId, 
//                     type: 'sale', 
//                     date: todayString 
//                 } },
//                 { $unwind: "$items" },
//                 { 
//                     $group: { 
//                         _id: null, 
//                         totalSales: { $sum: { $multiply: [{$ifNull: ["$items.price", 0]}, {$ifNull: ["$items.qty", 0]}] } },
//                         totalCost: { $sum: { $multiply: [{$ifNull: ["$items.cost", 0]}, {$ifNull: ["$items.qty", 0]}] } } 
//                     } 
//                 }
//             ]),
//             // Total Receivables (Working)
//             Invoice.aggregate([
//                 { $match: { userId: userId, type: 'sale' } },
//                 { $group: { _id: null, total: { $sum: '$totalGrand' }, paid: { $sum: '$paidAmount' } } }
//             ]),
//             // Expenses This Month (Working)
//             Cashflow.aggregate([
//                 { $match: { userId: userId, kind: 'expense', date: { $gte: startOfMonth.toISOString().slice(0, 10) } } },
//                 { $group: { _id: null, total: { $sum: '$amount' } } }
//             ]),
//             // Low Stock Items Count (Working)
//             Product.countDocuments({ userId: req.user.id, $expr: { $lte: ['$stock', '$lowStock'] } }),
            
//             // Total Inventory Value (NOW FIXED)
//             Product.aggregate([
//                 { $match: { userId: userId } },
//                 { 
//                     $group: { 
//                         _id: null, 
//                         // --- THIS IS THE FIX ---
//                         totalValue: { $sum: { $multiply: [{$ifNull: ["$stock", 0]}, {$ifNull: ["$unitPrice", 0]}] } } 
//                     } 
//                 } 
//             ])
//         ]);

//         const salesTodayTotal = salesAndProfitToday[0]?.totalSales || 0;
//         const profitTodayTotal = (salesAndProfitToday[0]?.totalSales || 0) - (salesAndProfitToday[0]?.totalCost || 0);
//         const receivables = (totalReceivables[0]?.total || 0) - (totalReceivables[0]?.paid || 0);
//         const expensesTotal = expensesThisMonth[0]?.total || 0;
//         const inventoryValueTotal = inventoryValueResult[0]?.totalValue || 0; // This will now use the correct value

//         res.json({
//             salesToday: salesTodayTotal,
//             profitToday: profitTodayTotal,
//             totalReceivables: receivables,
//             expensesThisMonth: expensesTotal,
//             lowStockCount: lowStockCount,
//             inventoryValue: inventoryValueTotal
//         });

//     } catch (error) {
//         if (error.message !== "Invalid ID for aggregation pipeline.") {
//              console.error("Error fetching dashboard stats:", error);
//              res.status(500).json({ message: "Server Error", details: error.message });
//         }
//     }
// };

// // --- 2. Get Sales Chart Data (This was working, no changes) ---
// export const getSalesChartData = async (req, res) => {
//     try {
//         const dateLabels = [];
//         const salesData = [];
//         const today = new Date();

//         const userId = getObjectId(req.user.id, res);

//         for (let i = 6; i >= 0; i--) {
//             const date = new Date(today);
//             date.setDate(today.getDate() - i);
//             const dateString = date.toISOString().slice(0, 10);
            
//             dateLabels.push(date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }));

//             const dailySales = await Invoice.aggregate([
//                 { $match: { userId: userId, type: 'sale', date: dateString } },
//                 { $group: { _id: null, total: { $sum: '$totalGrand' } } }
//             ]);

//             salesData.push(dailySales[0]?.total || 0);
//         }

//         res.json({
//             labels: dateLabels,
//             datasets: [{
//                 label: 'Sales',
//                 data: salesData,
//                 backgroundColor: '#0066A3',
//                 borderRadius: 5,
//             }],
//         });

//     } catch (error) {
//         if (error.message !== "Invalid ID for aggregation pipeline.") {
//             console.error("Error fetching sales chart data:", error);
//             res.status(500).json({ message: "Server Error", details: error.message });
//         }
//     }
// };


// // --- 3. Get Recent Activity Feed (No changes) ---
// export const getRecentActivity = async (req, res) => {
//     try {
//         const [invoices, cashflows, visitors] = await Promise.all([
//             Invoice.find({ userId: req.user.id }).populate('customerName', 'name').sort({ createdAt: -1 }).limit(5),
//             Cashflow.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(5),
//             Visitor.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(5),
//         ]);

//         const mappedInvoices = invoices.map(i => {
//             let customerDisplayName = 'N/A';
//             if (i.customerName && typeof i.customerName === 'object' && i.customerName.name) {
//                 customerDisplayName = i.customerName.name;
//             } 
//             else if (i.customerName && typeof i.customerName === 'string') {
//                 customerDisplayName = i.customerName;
//             }
            
//             return {
//                 id: i._id, 
//                 type: 'INVOICE', 
//                 text: `Invoice to ${customerDisplayName}`, 
//                 date: i.createdAt, 
//                 amount: i.totalGrand
//             };
//         });

//         const mappedCashflows = cashflows.map(c => ({
//             id: c._id, type: c.kind.toUpperCase(), text: `${c.kind === 'income' ? 'Income' : 'Expense'} for ${c.category}`,
//             date: c.createdAt, amount: c.amount
//         }));
//         const mappedVisitors = visitors.map(v => ({
//             id: v._id, type: 'VISITOR', text: `Visitor ${v.name} checked in`,
//             date: v.createdAt, amount: null
//         }));

//         const combinedActivities = [...mappedInvoices, ...mappedCashflows, ...mappedVisitors]
//             .sort((a, b) => new Date(b.date) - new Date(a.date))
//             .slice(0, 7);

//         res.json(combinedActivities);
//     } catch (error) {
//         console.error("Error fetching recent activity:", error);
//         res.status(500).json({ message: "Server Error", details: error.message });
//     }
// };

// // --- 4. Get Low Stock Items (No changes) ---
// export const getLowStockItems = async (req, res) => {
//     try {
//         const items = await Product.find({ userId: req.user.id, $expr: { $lte: ['$stock', '$lowStock'] } })
//             .sort({ stock: 1 })
//             .limit(10)
//             .select('name stock category'); 
//         res.json(items);
//     } catch (error) {
//         console.error("Error fetching low stock items:", error);
//         res.status(500).json({ message: "Server Error", details: error.message });
//     }
// };

// // --- 5. Get Overdue Invoices (No changes) ---
// export const getOverdueInvoices = async (req, res) => {
// // (This function is unchanged)
//     try {
//         const today = new Date();
//         const invoices = await Invoice.find({
//             userId: req.user.id, 
//             type: 'sale',
//             dueDate: { $lt: today },
//             $expr: { $lt: ["$paidAmount", "$totalGrand"] }
//         })
//             .populate('customerName', 'name')
//             .sort({ dueDate: 1 })
//             .limit(10);

//         const mappedInvoices = invoices.map(inv => {
//             let customerDisplayName = 'N/A';
//             if (inv.customerName && typeof inv.customerName === 'object' && inv.customerName.name) {
//                 customerDisplayName = inv.customerName.name;
//             } else if (inv.customerName && typeof inv.customerName === 'string') {
//                 customerDisplayName = inv.customerName;
//             }

//             return {
//                 id: inv._id,
//                 customerName: customerDisplayName,
//                 totalAmount: inv.totalGrand,
//                 paidAmount: inv.paidAmount,
//                 overdueDays: Math.floor((today - inv.dueDate) / (1000 * 60 * 60 * 24)),
//                 dueDate: inv.dueDate
//             };
//         });

//         res.json(mappedInvoices);
//     } catch (error) {
//         console.error("Error fetching overdue invoices:", error);
//         res.status(500).json({ message: "Server Error", details: error.message });
//     }
// };





import mongoose from "mongoose";
import { Invoice, Cashflow, Product } from "../models/Inventory.js";
import Visitor from "../models/Visitor.js";

// ================= HELPER =================
const toObjectId = (id) => new mongoose.Types.ObjectId(id);

// ================= DASHBOARD STATS =================
export const getDashboardStats = async (req, res) => {
  try {
    const userId = toObjectId(req.user.id);
    const today = new Date().toISOString().slice(0, 10);
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    )
      .toISOString()
      .slice(0, 10);

    const [
      salesToday,
      receivables,
      expenses,
      lowStockCount,
      inventoryValue,
    ] = await Promise.all([
      Invoice.aggregate([
        { $match: { userId, type: "sale", date: today } },
        { $unwind: "$items" },
        {
          $group: {
            _id: null,
            totalSales: {
              $sum: { $multiply: ["$items.price", "$items.qty"] },
            },
            totalCost: {
              $sum: { $multiply: ["$items.cost", "$items.qty"] },
            },
          },
        },
      ]),

      Invoice.aggregate([
        { $match: { userId, type: "sale" } },
        {
          $group: {
            _id: null,
            total: { $sum: "$totalGrand" },
            paid: { $sum: "$paidAmount" },
          },
        },
      ]),

      Cashflow.aggregate([
        {
          $match: {
            userId,
            kind: "expense",
            date: { $gte: startOfMonth },
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),

      Product.countDocuments({
        userId,
        $expr: { $lte: ["$stock", "$lowStock"] },
      }),

      Product.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: null,
            totalValue: {
              $sum: { $multiply: ["$stock", "$unitPrice"] },
            },
          },
        },
      ]),
    ]);

    res.json({
      salesToday: salesToday[0]?.totalSales || 0,
      profitToday:
        (salesToday[0]?.totalSales || 0) -
        (salesToday[0]?.totalCost || 0),
      totalReceivables:
        (receivables[0]?.total || 0) - (receivables[0]?.paid || 0),
      expensesThisMonth: expenses[0]?.total || 0,
      lowStockCount,
      inventoryValue: inventoryValue[0]?.totalValue || 0,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= SALES CHART =================
export const getSalesChartData = async (req, res) => {
  try {
    const userId = toObjectId(req.user.id);
    const labels = [];
    const data = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const d = date.toISOString().slice(0, 10);

      labels.push(
        date.toLocaleDateString("en-IN", { day: "numeric", month: "short" })
      );

      const sale = await Invoice.aggregate([
        { $match: { userId, type: "sale", date: d } },
        { $group: { _id: null, total: { $sum: "$totalGrand" } } },
      ]);

      data.push(sale[0]?.total || 0);
    }

    res.json({
      labels,
      datasets: [
        {
          label: "Sales",
          data,
          backgroundColor: "#2563eb",
          borderRadius: 6,
        },
      ],
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= RECENT ACTIVITY =================
export const getRecentActivity = async (req, res) => {
  try {
    const userId = req.user.id;

    const [invoices, cashflows, visitors] = await Promise.all([
      Invoice.find({ userId }).sort({ createdAt: -1 }).limit(5),
      Cashflow.find({ userId }).sort({ createdAt: -1 }).limit(5),
      Visitor.find({ userId }).sort({ createdAt: -1 }).limit(5),
    ]);

    const activity = [
      ...invoices.map((i) => ({
        id: i._id,
        type: "INVOICE",
        text: `Invoice ₹${i.totalGrand}`,
        date: i.createdAt,
        amount: i.totalGrand,
      })),
      ...cashflows.map((c) => ({
        id: c._id,
        type: c.kind.toUpperCase(),
        text: `${c.category}`,
        date: c.createdAt,
        amount: c.amount,
      })),
      ...visitors.map((v) => ({
        id: v._id,
        type: "VISITOR",
        text: `${v.name} visited`,
        date: v.createdAt,
      })),
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 7);

    res.json(activity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= LOW STOCK =================
export const getLowStockItems = async (req, res) => {
  const items = await Product.find({
    userId: req.user.id,
    $expr: { $lte: ["$stock", "$lowStock"] },
  }).limit(10);

  res.json(items);
};

// ================= TOP SELLING PRODUCTS =================
export const getTopSellingProducts = async (req, res) => {
  try {
    const userId = toObjectId(req.user.id);

    const products = await Invoice.aggregate([
      { $match: { userId, type: "sale" } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          name: { $first: "$items.name" },
          category: { $first: "$items.category" },
          revenue: {
            $sum: { $multiply: ["$items.price", "$items.qty"] },
          },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
    ]);

    const max = products[0]?.revenue || 1;

    res.json(
      products.map((p) => ({
        id: p._id,
        name: p.name,
        category: p.category || "General",
        revenue: p.revenue,
        percentage: Math.round((p.revenue / max) * 100),
      }))
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= INCOME VS EXPENSE =================
export const getIncomeVsExpenseChart = async (req, res) => {
  try {
    const userId = toObjectId(req.user.id);
    const labels = [];
    const income = [];
    const expense = [];

    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const d = date.toISOString().slice(0, 10);

      labels.push(
        date.toLocaleDateString("en-IN", { day: "numeric", month: "short" })
      );

      const [inc] = await Cashflow.aggregate([
        { $match: { userId, kind: "income", date: d } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]);

      const [exp] = await Cashflow.aggregate([
        { $match: { userId, kind: "expense", date: d } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]);

      income.push(inc?.total || 0);
      expense.push(exp?.total || 0);
    }

    res.json({
      labels,
      datasets: [
        {
          label: "Income",
          data: income,
          fill: true,
          borderColor: "#22c55e",
          backgroundColor: "rgba(34,197,94,0.2)",
        },
        {
          label: "Expense",
          data: expense,
          fill: true,
          borderColor: "#f97316",
          backgroundColor: "rgba(249,115,22,0.2)",
        },
      ],
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
