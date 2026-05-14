const qrcode = require("qrcode");
const Invoice = require("../models/Invoice");

const buildUpiPayload = ({ upiId, accountName, amount }) => {
  const name = encodeURIComponent(accountName || "Billify");
  const total = Number(amount || 0).toFixed(2);
  return `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${name}&am=${total}&cu=INR`;
};

const getPortalInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ publicToken: req.params.token })
      .populate("client", "name email")
      .populate("user", "bankDetails logoUrl");

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const bank = invoice.user?.bankDetails || {};

    return res.status(200).json({
      invoiceNumber: invoice.invoiceNumber,
      lineItems: invoice.lineItems,
      subtotal: invoice.subtotal,
      gstAmount: invoice.gstAmount,
      total: invoice.total,
      status: invoice.status,
      dueDate: invoice.dueDate,
      client: {
        name: invoice.client?.name || "",
        email: invoice.client?.email || "",
      },
      bankDetails: {
        accountName: bank.accountName || "",
        accountNumber: bank.accountNumber || "",
        ifsc: bank.ifsc || "",
        bankName: bank.bankName || "",
        upi: bank.upiId || "",
      },
      brandLogo: invoice.user?.logoUrl || "",
    });
  } catch (error) {
    return res.status(500).json({ message: "Could not load portal invoice", error: error.message });
  }
};

const acknowledgeInvoice = async (req, res) => {
  try {
    const updated = await Invoice.findOneAndUpdate(
      { publicToken: req.params.token },
      { clientViewedAt: new Date() },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    return res.status(200).json({ message: "Invoice acknowledged", clientViewedAt: updated.clientViewedAt });
  } catch (error) {
    return res.status(500).json({ message: "Could not acknowledge invoice", error: error.message });
  }
};

const getUpiQr = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ publicToken: req.params.token })
      .populate("user", "bankDetails");

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const upiId = invoice.user?.bankDetails?.upiId;
    if (!upiId) {
      return res.status(404).json({ message: "UPI ID not available" });
    }

    const payload = buildUpiPayload({
      upiId,
      accountName: invoice.user?.bankDetails?.accountName,
      amount: invoice.total,
    });

    const buffer = await qrcode.toBuffer(payload, {
      type: "png",
      width: 220,
      errorCorrectionLevel: "M",
    });

    res.setHeader("Content-Type", "image/png");
    return res.status(200).send(buffer);
  } catch (error) {
    return res.status(500).json({ message: "Could not generate QR code", error: error.message });
  }
};

module.exports = {
  getPortalInvoice,
  acknowledgeInvoice,
  getUpiQr,
};
