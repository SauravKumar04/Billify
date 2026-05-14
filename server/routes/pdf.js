const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { downloadInvoicePDF } = require("../controllers/pdfController");

const router = express.Router();

router.get("/:id", authMiddleware, downloadInvoicePDF);

module.exports = router;
