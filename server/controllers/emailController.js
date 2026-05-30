const Invoice = require("../models/Invoice");
const generatePDF = require("../utils/generatePDF");
const { sendInvoiceEmail } = require("../services/emailService");

const emailInvoice = async (req, res) => {
  try {
    const customSubject = String(req.body?.subject || "").trim();
    const customMessage = String(req.body?.message || "").trim();
    const includePdf = req.body?.includePdf !== false;

    const invoice = await Invoice.findOne({ _id: req.params.id, user: req.user._id }).populate("client");

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const pdfBuffer = includePdf ? await generatePDF(invoice, req.user) : null;

    const result = await sendInvoiceEmail(invoice.client?.email, null, {
      invoiceNumber: invoice.invoiceNumber,
      clientName: invoice.client?.name,
      issueDate: invoice.issueDate,
      dueDate: invoice.dueDate,
      total: invoice.total,
      senderName: req.user?.name,
      message: customMessage || undefined,
      subject: customSubject || undefined,
      pdfBuffer,
      allowNoAttachment: !includePdf,
    });

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: "Could not send invoice email",
        error: result.error,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Invoice email sent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not send invoice email",
      error: error.message,
    });
  }
};

module.exports = { emailInvoice };
