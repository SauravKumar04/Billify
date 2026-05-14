const crypto = require("crypto");
const Invoice = require("../models/Invoice");
const Client = require("../models/Client");

const calculateTotals = (lineItems, gstRate) => {
  const parsedItems = lineItems.map((item) => {
    const quantity = Number(item.quantity);
    const rate = Number(item.rate);
    return {
      description: item.description,
      quantity,
      rate,
      amount: Number((quantity * rate).toFixed(2)),
    };
  });

  const subtotal = Number(parsedItems.reduce((sum, item) => sum + item.amount, 0).toFixed(2));
  const gstAmount = Number(((subtotal * Number(gstRate)) / 100).toFixed(2));
  const total = Number((subtotal + gstAmount).toFixed(2));

  return { parsedItems, subtotal, gstAmount, total };
};

const getNextInvoiceNumber = async (userId) => {
  const latest = await Invoice.findOne({ user: userId }).sort({ createdAt: -1 }).select("invoiceNumber");
  if (!latest?.invoiceNumber) return "BILL-0001";
  const match = latest.invoiceNumber.match(/BILL-(\d+)/);
  const num = match ? Number(match[1]) + 1 : 1;
  return `BILL-${String(num).padStart(4, "0")}`;
};

const createInvoice = async (req, res) => {
  try {
    const { client, lineItems = [], gstRate, dueDate, notes } = req.body;

    if (!client || !Array.isArray(lineItems) || lineItems.length === 0 || !dueDate) {
      return res.status(400).json({ message: "Client, due date, and line items are required" });
    }

    const clientExists = await Client.findOne({ _id: client, user: req.user._id });
    if (!clientExists) return res.status(404).json({ message: "Client not found" });

    const { parsedItems, subtotal, gstAmount, total } = calculateTotals(lineItems, gstRate);
    const invoiceNumber = await getNextInvoiceNumber(req.user._id);

    const invoice = await Invoice.create({
      user: req.user._id,
      client,
      invoiceNumber,
      publicToken: crypto.randomUUID(),
      dueDate,
      notes,
      gstRate,
      lineItems: parsedItems,
      subtotal,
      gstAmount,
      total,
    });

    return res.status(201).json(invoice);
  } catch (error) {
    return res.status(500).json({ message: "Could not create invoice", error: error.message });
  }
};

const getInvoices = async (req, res) => {
  try {
    await Invoice.updateMany(
      { user: req.user._id, status: "unpaid", dueDate: { $lt: new Date() } },
      { status: "overdue" }
    );

    const query = { user: req.user._id };
    if (req.query.status && ["paid", "unpaid", "overdue"].includes(req.query.status)) {
      query.status = req.query.status;
    }

    const invoices = await Invoice.find(query)
      .populate("client", "name email gstin")
      .sort({ createdAt: -1 });

    return res.status(200).json(invoices);
  } catch (error) {
    return res.status(500).json({ message: "Could not fetch invoices", error: error.message });
  }
};

const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ _id: req.params.id, user: req.user._id }).populate("client");
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    return res.status(200).json(invoice);
  } catch (error) {
    return res.status(500).json({ message: "Could not fetch invoice", error: error.message });
  }
};

const deleteInvoice = async (req, res) => {
  try {
    const deleted = await Invoice.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deleted) return res.status(404).json({ message: "Invoice not found" });
    return res.status(200).json({ message: "Invoice deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Could not delete invoice", error: error.message });
  }
};

const markInvoicePaid = async (req, res) => {
  try {
    const updated = await Invoice.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { status: "paid" },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Invoice not found" });
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ message: "Could not mark invoice paid", error: error.message });
  }
};

const parseMonthInput = (monthInput) => {
  const match = /^\d{4}-\d{2}$/.test(monthInput || "") ? monthInput : null;
  if (!match) return new Date();
  const [year, month] = monthInput.split("-").map(Number);
  return new Date(year, month - 1, 1);
};

const getDashboardStats = async (req, res) => {
  try {
    const selectedMonthDate = parseMonthInput(req.query.month);
    const selectedMonthStart = new Date(
      selectedMonthDate.getFullYear(),
      selectedMonthDate.getMonth(),
      1,
      0,
      0,
      0,
      0
    );
    const selectedMonthEnd = new Date(
      selectedMonthDate.getFullYear(),
      selectedMonthDate.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    const invoices = await Invoice.find({ user: req.user._id });
    const totalInvoices = invoices.length;
    const paidCount = invoices.filter((i) => i.status === "paid").length;
    const unpaidCount = invoices.filter((i) => i.status !== "paid").length;
    const revenueThisMonth = invoices
      .filter(
        (i) =>
          i.status === "paid" &&
          i.updatedAt >= selectedMonthStart &&
          i.updatedAt <= selectedMonthEnd
      )
      .reduce((sum, i) => sum + i.total, 0);

    const monthly = Array.from({ length: 6 }, (_, index) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - index));
      const month = d.toLocaleString("en-IN", { month: "short" });
      const year = d.getFullYear();
      const value = invoices
        .filter((i) => {
          const created = new Date(i.createdAt);
          return created.getMonth() === d.getMonth() && created.getFullYear() === year;
        })
        .reduce((sum, i) => sum + i.total, 0);
      return { month, amount: Number(value.toFixed(2)) };
    });

    const daysInMonth = selectedMonthEnd.getDate();
    const dayWise = Array.from({ length: daysInMonth }, (_, index) => {
      const day = index + 1;
      const value = invoices
        .filter((invoice) => {
          const created = new Date(invoice.createdAt);
          return (
            created.getFullYear() === selectedMonthDate.getFullYear() &&
            created.getMonth() === selectedMonthDate.getMonth() &&
            created.getDate() === day
          );
        })
        .reduce((sum, invoice) => sum + invoice.total, 0);

      return {
        day,
        amount: Number(value.toFixed(2)),
      };
    });

    return res.status(200).json({
      totalInvoices,
      paidCount,
      unpaidCount,
      revenueThisMonth: Number(revenueThisMonth.toFixed(2)),
      monthly,
      dayWise,
      selectedMonth: `${selectedMonthDate.getFullYear()}-${String(
        selectedMonthDate.getMonth() + 1
      ).padStart(2, "0")}`,
    });
  } catch (error) {
    return res.status(500).json({ message: "Could not fetch dashboard stats", error: error.message });
  }
};

module.exports = {
  createInvoice,
  getInvoices,
  getInvoiceById,
  deleteInvoice,
  markInvoicePaid,
  getDashboardStats,
};
