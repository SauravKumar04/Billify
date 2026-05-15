const { google } = require("googleapis");

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const sendInvoiceEmail = async ({
  to,
  freelancerName,
  invoiceNumber,
  pdfBuffer,
  subject,
  text,
}) => {
  try {
    const gmail = google.gmail({
      version: "v1",
      auth: oauth2Client,
    });

    const mail = [
      `From: Billify <${process.env.EMAIL_FROM}>`,
      `To: ${to}`,
      `Subject: ${subject || `Invoice from ${freelancerName} via Billify`}`,
      "MIME-Version: 1.0",
      'Content-Type: multipart/mixed; boundary="foo_bar"',
      "",
      "--foo_bar",
      'Content-Type: text/plain; charset="UTF-8"',
      "",
      text ||
        `Please find attached invoice ${invoiceNumber} from ${freelancerName}.`,
      "",
      "--foo_bar",
      'Content-Type: application/pdf; name="invoice.pdf"',
      "Content-Transfer-Encoding: base64",
      'Content-Disposition: attachment; filename="invoice.pdf"',
      "",
      pdfBuffer.toString("base64"),
      "",
      "--foo_bar--",
    ].join("\n");

    const encodedMessage = Buffer.from(mail)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const result = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedMessage,
      },
    });

    return result.data;
  } catch (error) {
    console.error("GMAIL API ERROR:", error);
    throw error;
  }
};

module.exports = sendInvoiceEmail;
