const nodemailer = require("nodemailer");

const buildTransportConfig = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 465);

  const secure =
    String(process.env.SMTP_SECURE || "true") === "true";

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

    auth: {
      user,
      pass,
    },

    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,

    tls: {
      rejectUnauthorized: false,
    },
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
  const resolvedSubject =
    subject || `Invoice from ${freelancerName} via Billify`;

  const resolvedText =
    text ||
    `Please find attached invoice ${invoiceNumber} from ${freelancerName}.`;

  try {
    console.log("Creating transporter...");

    const transporter = nodemailer.createTransport(
      buildTransportConfig()
    );

    console.log("Verifying SMTP connection...");

    await transporter.verify();

    console.log("SMTP VERIFIED");

    const result = await transporter.sendMail({
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
                contentType: "application/pdf",
              },
            ]
          : [],
    });

    console.log("EMAIL SENT SUCCESSFULLY");

    return result;
  } catch (error) {
    console.error("FULL NODEMAILER ERROR:", error);

    throw error;
  }
};

module.exports = sendInvoiceEmail;