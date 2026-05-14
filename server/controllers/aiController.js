const Invoice = require("../models/Invoice");
const sendInvoiceEmail = require("../utils/sendEmail");
const { generateWithGroq } = require("../utils/groq");

const ALLOWED_TONES = ["friendly", "professional", "strict"];

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const toneInstruction = {
  friendly: "Warm and polite. Avoid pressure. Keep it concise.",
  professional: "Professional and neutral. Clear payment request with no emotional language.",
  strict: "Firm and direct. Mention due date urgency while staying respectful.",
};

const fallbackReminder = ({ clientName, invoiceNumber, dueDate, amount, tone, senderName }) => {
  const opener = {
    friendly: `Hi ${clientName}, hope you are doing well.`,
    professional: `Hello ${clientName},`,
    strict: `Hello ${clientName}, this is a payment reminder.`,
  };

  const closingName = senderName || "";
  return `${opener[tone] || opener.professional} This is a reminder that invoice ${invoiceNumber} for ${amount} was due on ${dueDate}. Please share the payment update at your earliest convenience. Thank you.${closingName ? `\n\nThanks,\n${closingName}` : ""}`;
};

const buildReminderPrompt = ({ tone, clientName, invoiceNumber, amount, dueDate, senderName }) => {
  return [
    "You write short B2B payment reminder emails.",
    `Tone: ${tone}. ${toneInstruction[tone] || toneInstruction.professional}`,
    "Rules:",
    "- 6 to 10 lines, plain text only",
    "- Use short bullet points with leading hyphen",
    "- Keep each bullet under 18 words",
    "- Include client name, sender name, invoice number, amount, and due date",
    "- Ask for a payment timeline",
    "- End with a courteous closing line with sender name",
    "Data:",
    `Client name: ${clientName}`,
    `Sender name: ${senderName}`,
    `Invoice number: ${invoiceNumber}`,
    `Amount: ${amount}`,
    `Due date: ${dueDate}`,
    "Write the email body now.",
  ].join("\n");
};


const createReminderFromInvoice = async (invoice, tone, senderName) => {
  const clientName = invoice.client?.name || "Client";
  const invoiceNumber = invoice.invoiceNumber;
  const amount = Number(invoice.total || 0).toFixed(2);
  const dueDate = formatDate(invoice.dueDate);

  const prompt = buildReminderPrompt({
    tone,
    clientName,
    invoiceNumber,
    amount,
    dueDate,
    senderName,
  });

  try {
    return await generateWithGroq(prompt);
  } catch {
    return fallbackReminder({
      clientName,
      invoiceNumber,
      dueDate,
      amount,
      tone,
      senderName,
    });
  }
};

const generatePaymentReminder = async (req, res) => {
  try {
    const toneInput = String(req.body?.tone || "professional").toLowerCase();
    const tone = ALLOWED_TONES.includes(toneInput) ? toneInput : "professional";
    const sendNow = Boolean(req.body?.sendNow);
    const editedMessage = String(req.body?.message || "").trim();

    const invoice = await Invoice.findOne({ _id: req.params.invoiceId, user: req.user._id }).populate("client");
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    if (!invoice.client?.email) {
      return res.status(400).json({ message: "Client email is missing for this invoice" });
    }

    const generatedMessage = editedMessage || (await createReminderFromInvoice(invoice, tone, req.user?.name));
    const subject = `Payment reminder: ${invoice.invoiceNumber}`;

    if (sendNow) {
      await sendInvoiceEmail({
        to: invoice.client.email,
        freelancerName: req.user.name,
        invoiceNumber: invoice.invoiceNumber,
        subject,
        text: generatedMessage,
      });

      return res.status(200).json({
        message: "AI reminder generated and sent",
        data: {
          invoiceId: invoice._id,
          tone,
          subject,
          reminder: generatedMessage,
          sent: true,
        },
      });
    }

    return res.status(200).json({
      message: "AI reminder generated",
      data: {
        invoiceId: invoice._id,
        clientEmail: invoice.client.email,
        tone,
        subject,
        reminder: generatedMessage,
        sent: false,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Could not generate AI reminder", error: error.message });
  }
};

module.exports = {
  generatePaymentReminder,
};
