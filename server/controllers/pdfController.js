const Invoice = require("../models/Invoice");
const generatePDF = require("../utils/generatePDF");

const downloadInvoicePDF = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ _id: req.params.id, user: req.user._id }).populate("client");

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const pdfBuffer = await generatePDF(invoice, req.user);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${invoice.invoiceNumber}.pdf`);
    return res.status(200).send(pdfBuffer);
  } catch (error) {
    return res.status(500).json({ message: "Could not generate PDF", error: error.message });
  }
};

module.exports = { downloadInvoicePDF };
