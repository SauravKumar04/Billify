const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  createInvoice,
  getInvoices,
  getInvoiceById,
  deleteInvoice,
  markInvoicePaid,
  getDashboardStats,
} = require("../controllers/invoiceController");

const router = express.Router();

router.use(authMiddleware);
router.get("/stats", getDashboardStats);
router.post("/", createInvoice);
router.get("/", getInvoices);
router.get("/:id", getInvoiceById);
router.delete("/:id", deleteInvoice);
router.patch("/:id/mark-paid", markInvoicePaid);

module.exports = router;
