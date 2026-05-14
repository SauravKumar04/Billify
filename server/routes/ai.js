const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  generatePaymentReminder,
} = require("../controllers/aiController");

const router = express.Router();

router.use(authMiddleware);
router.post("/reminder/:invoiceId", generatePaymentReminder);

module.exports = router;
