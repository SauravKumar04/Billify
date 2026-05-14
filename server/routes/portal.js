const express = require("express");
const {
  getPortalInvoice,
  acknowledgeInvoice,
  getUpiQr,
} = require("../controllers/portalController");

const router = express.Router();

router.get("/:token", getPortalInvoice);
router.post("/:token/acknowledge", acknowledgeInvoice);
router.get("/:token/upi-qr", getUpiQr);

module.exports = router;
