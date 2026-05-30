const path = require("path");
const { getTransporter } = require("../utils/mailer");

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatCurrency = (value) => {
  const amount = Number(value || 0);
  return `INR ${amount.toFixed(2)}`;
};

const escapeHtml = (value) =>
  String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");

const buildInvoiceHtml = (invoiceData = {}) => {
  const invoiceNumber = escapeHtml(invoiceData.invoiceNumber || "-");
  const clientName = escapeHtml(invoiceData.clientName || "Client");
  const issueDate = escapeHtml(formatDate(invoiceData.issueDate));
  const dueDate = escapeHtml(formatDate(invoiceData.dueDate));
  const total = escapeHtml(formatCurrency(invoiceData.total));
  const senderName = escapeHtml(invoiceData.senderName || "Billify");
  const message = escapeHtml(
    invoiceData.message || "Please find your invoice attached.",
  );

  return [
    '<div style="font-family:Arial,Helvetica,sans-serif;color:#0f172a;line-height:1.6">',
    `<h2 style="margin:0 0 12px 0">Your Invoice from ${senderName}</h2>`,
    `<p style="margin:0 0 16px 0">${message}</p>`,
    '<table style="border-collapse:collapse;width:100%;margin-bottom:16px">',
    `<tr><td style="padding:6px 0;color:#64748b">Invoice</td><td style="padding:6px 0">${invoiceNumber}</td></tr>`,
    `<tr><td style="padding:6px 0;color:#64748b">Client</td><td style="padding:6px 0">${clientName}</td></tr>`,
    `<tr><td style="padding:6px 0;color:#64748b">Issue date</td><td style="padding:6px 0">${issueDate}</td></tr>`,
    `<tr><td style="padding:6px 0;color:#64748b">Due date</td><td style="padding:6px 0">${dueDate}</td></tr>`,
    `<tr><td style="padding:6px 0;color:#64748b">Total</td><td style="padding:6px 0">${total}</td></tr>`,
    "</table>",
    "<p style=\"margin:0\">Thank you for your business.</p>",
    "</div>",
  ].join("");
};

const buildInvoiceText = (invoiceData = {}) => {
  const invoiceNumber = invoiceData.invoiceNumber || "-";
  const clientName = invoiceData.clientName || "Client";
  const issueDate = formatDate(invoiceData.issueDate);
  const dueDate = formatDate(invoiceData.dueDate);
  const total = formatCurrency(invoiceData.total);
  const senderName = invoiceData.senderName || "Billify";
  const message = invoiceData.message || "Please find your invoice attached.";

  return [
    `Your Invoice from ${senderName}`,
    "",
    message,
    "",
    `Invoice: ${invoiceNumber}`,
    `Client: ${clientName}`,
    `Issue date: ${issueDate}`,
    `Due date: ${dueDate}`,
    `Total: ${total}`,
  ].join("\n");
};

const buildAttachments = ({ pdfPath, pdfBuffer, invoiceNumber, allowNoAttachment }) => {
  if (pdfPath) {
    return [
      {
        filename: path.basename(pdfPath),
        path: pdfPath,
      },
    ];
  }

  if (pdfBuffer) {
    return [
      {
        filename: `invoice-${invoiceNumber || "billify"}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ];
  }

  if (!allowNoAttachment) {
    throw new Error("Invoice PDF attachment is missing");
  }

  return [];
};

const sendInvoiceEmail = async (toEmail, pdfPath, invoiceData = {}) => {
  try {
    if (!toEmail) {
      return { success: false, error: "Recipient email is required" };
    }

    const transporter = getTransporter();
    const subject = invoiceData.subject || "Your Invoice from Billify";

    const attachments = buildAttachments({
      pdfPath,
      pdfBuffer: invoiceData.pdfBuffer,
      invoiceNumber: invoiceData.invoiceNumber,
      allowNoAttachment: Boolean(invoiceData.allowNoAttachment),
    });

    const info = await transporter.sendMail({
      from: `Billify <${process.env.EMAIL}>`,
      to: toEmail,
      subject,
      html: buildInvoiceHtml(invoiceData),
      text: buildInvoiceText(invoiceData),
      attachments,
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("SMTP email error", error);
    return { success: false, error: error.message || "Failed to send email" };
  }
};

module.exports = { sendInvoiceEmail };
