const nodemailer = require("nodemailer");

const buildTransportConfig = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = String(process.env.SMTP_SECURE || "false") === "true";
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || host === "smtp.example.com") {
    throw new Error("SMTP_HOST is not configured correctly");
  }

  if (!user || !pass) {
    throw new Error("SMTP_USER or SMTP_PASS is missing");
  }

  return {
    host,
    port,
    secure,
    auth: { user, pass },
  };
};

const sendInvoiceEmail = async ({
  to,
  freelancerName,
  invoiceNumber,
  pdfBuffer,
  subject,
  text,
  includeAttachment = Boolean(pdfBuffer),
}) => {
  const resolvedSubject = subject || `Invoice from ${freelancerName} via Billify`;
  const resolvedText =
    text || `Please find attached invoice ${invoiceNumber} from ${freelancerName}.`;

  try {
    const transporter = nodemailer.createTransport(buildTransportConfig());

    return await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to,
      subject: resolvedSubject,
      text: resolvedText,
      attachments:
        includeAttachment && pdfBuffer
          ? [
              {
                filename: `${invoiceNumber}.pdf`,
                content: pdfBuffer,
              },
            ]
          : [],
    });
  } catch (error) {
    if (error.code === "EAUTH") {
      throw new Error("SMTP authentication failed. Verify SMTP_USER and app password");
    }

    if (["ECONNECTION", "ETIMEDOUT", "ESOCKET"].includes(error.code)) {
      throw new Error("Could not connect to SMTP server. Check SMTP_HOST, SMTP_PORT, and SMTP_SECURE");
    }

    throw new Error(error.message || "Failed to send email");
  }
};

module.exports = sendInvoiceEmail;
