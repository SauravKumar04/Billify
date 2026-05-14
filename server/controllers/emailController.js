const Invoice = require("../models/Invoice");
const generatePDF = require("../utils/generatePDF");
const sendInvoiceEmail = require("../utils/sendEmail");

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

    await sendInvoiceEmail({
      to: invoice.client.email,
      freelancerName: req.user.name,
      invoiceNumber: invoice.invoiceNumber,
      pdfBuffer,
      subject: customSubject || undefined,
      text: customMessage || undefined,
      includeAttachment: includePdf,
    });

    return res.status(200).json({ message: "Invoice email sent successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Could not send invoice email", error: error.message });
  }
};

module.exports = { emailInvoice };
