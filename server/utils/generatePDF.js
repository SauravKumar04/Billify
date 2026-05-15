const PDFDocument = require("pdfkit");

const COLORS = {
  ink: "#0f172a",
  muted: "#64748b",
  light: "#f8fafc",
  line: "#e2e8f0",
  accent: "#2563eb",
};

const formatCurrency = (value) =>
  `INR ${Number(value || 0).toFixed(2)}`;

const drawHeader = (doc, invoice) => {
  const pageWidth = doc.page.width;

  doc.rect(0, 0, pageWidth, 120).fill(COLORS.light);

  doc
    .moveTo(50, 120)
    .lineTo(pageWidth - 50, 120)
    .strokeColor(COLORS.line)
    .stroke();

  // Removed filesystem logo loading
  // because it breaks on Render

  doc
    .fontSize(22)
    .fillColor(COLORS.accent)
    .text("Billify", 50, 42);

  doc
    .fontSize(10)
    .fillColor(COLORS.muted)
    .text("Professional Invoice", 50, 72);

  const right = pageWidth - 50;

  doc
    .fillColor(COLORS.ink)
    .fontSize(10)
    .text("Invoice No", right - 160, 42, {
      align: "right",
    });

  doc
    .fontSize(12)
    .fillColor(COLORS.accent)
    .text(invoice.invoiceNumber || "-", right - 160, 58, {
      align: "right",
    });

  doc.fillColor(COLORS.muted).fontSize(9);

  doc.text(
    `Issue Date: ${new Date(
      invoice.issueDate
    ).toLocaleDateString()}`,
    right - 160,
    78,
    {
      align: "right",
    }
  );

  doc.text(
    `Due Date: ${new Date(
      invoice.dueDate
    ).toLocaleDateString()}`,
    right - 160,
    92,
    {
      align: "right",
    }
  );
};

const drawParties = (doc, invoice, user) => {
  const top = 138;

  const boxHeight = 86;

  doc
    .roundedRect(50, top, 240, boxHeight, 8)
    .strokeColor(COLORS.line)
    .stroke();

  doc
    .roundedRect(305, top, 240, boxHeight, 8)
    .strokeColor(COLORS.line)
    .stroke();

  doc
    .fontSize(10)
    .fillColor(COLORS.muted)
    .text("From", 62, top + 10);

  doc
    .fontSize(10)
    .fillColor(COLORS.ink)
    .text(user.name || "", 62, top + 26);

  doc
    .fillColor(COLORS.muted)
    .text(user.email || "", 62, top + 40);

  doc.text(user.phone || "", 62, top + 54);

  doc.text(
    user.gstin ? `GSTIN: ${user.gstin}` : "",
    62,
    top + 68,
    {
      width: 210,
    }
  );

  doc
    .fontSize(10)
    .fillColor(COLORS.muted)
    .text("Bill To", 317, top + 10);

  doc
    .fontSize(10)
    .fillColor(COLORS.ink)
    .text(invoice.client?.name || "-", 317, top + 26);

  doc
    .fillColor(COLORS.muted)
    .text(invoice.client?.email || "", 317, top + 40);

  doc.text(invoice.client?.phone || "", 317, top + 54);

  doc.text(
    invoice.client?.gstin
      ? `GSTIN: ${invoice.client.gstin}`
      : "",
    317,
    top + 68,
    {
      width: 210,
    }
  );
};

const drawLineItems = (doc, invoice) => {
  const top = 250;

  doc
    .roundedRect(50, top, 510, 26, 6)
    .fill("#eef2ff");

  doc.fillColor(COLORS.ink).fontSize(9);

  doc.text("Description", 62, top + 8);

  doc.text("Qty", 310, top + 8);

  doc.text("Rate", 360, top + 8);

  doc.text("Amount", 470, top + 8);

  let y = top + 30;

  (invoice.lineItems || []).forEach((item) => {
    doc.fillColor(COLORS.ink);

    doc.text(item.description || "-", 62, y, {
      width: 230,
    });

    doc.text(String(item.quantity || 0), 315, y);

    doc.text(formatCurrency(item.rate), 360, y);

    doc.text(formatCurrency(item.amount), 470, y);

    doc
      .moveTo(50, y + 16)
      .lineTo(560, y + 16)
      .strokeColor(COLORS.line)
      .stroke();

    y += 24;
  });

  return y + 6;
};

const drawTotals = (doc, invoice, y, user) => {
  const x = 350;

  let row = y + 10;

  doc
    .roundedRect(x - 10, row - 6, 220, 78, 8)
    .fill("#f8fafc");

  doc
    .fillColor(COLORS.muted)
    .fontSize(10)
    .text("Subtotal", x, row);

  doc.fillColor(COLORS.ink).text(
    formatCurrency(invoice.subtotal),
    420,
    row,
    {
      width: 100,
      align: "right",
    }
  );

  row += 20;

  doc
    .fillColor(COLORS.muted)
    .text(`GST (${invoice.gstRate || 0}%)`, x, row);

  doc.fillColor(COLORS.ink).text(
    formatCurrency(invoice.gstAmount),
    420,
    row,
    {
      width: 100,
      align: "right",
    }
  );

  row += 22;

  doc
    .fontSize(12)
    .fillColor(COLORS.ink)
    .text("Total", x, row);

  doc
    .fontSize(12)
    .fillColor(COLORS.ink)
    .text(formatCurrency(invoice.total), 420, row, {
      width: 100,
      align: "right",
    });

  row = y + 100;

  doc
    .roundedRect(50, row, 510, 110, 10)
    .strokeColor(COLORS.line)
    .stroke();

  doc
    .fontSize(11)
    .fillColor(COLORS.ink)
    .text("Payment details", 62, row + 12);

  doc.fontSize(10).fillColor(COLORS.muted);

  doc.text(
    `Account Name: ${
      user.bankDetails?.accountName || ""
    }`,
    62,
    row + 30
  );

  doc.text(
    `Account Number: ${
      user.bankDetails?.accountNumber || ""
    }`,
    62,
    row + 46
  );

  doc.text(
    `IFSC: ${user.bankDetails?.ifsc || ""}`,
    62,
    row + 62
  );

  doc.text(
    `Bank Name: ${user.bankDetails?.bankName || ""}`,
    320,
    row + 30
  );

  doc.text(
    `UPI: ${user.bankDetails?.upiId || ""}`,
    320,
    row + 46
  );

  if (invoice.notes) {
    doc
      .fontSize(10)
      .fillColor(COLORS.muted)
      .text("Notes", 62, row + 96);

    doc
      .fillColor(COLORS.ink)
      .text(invoice.notes, 110, row + 96, {
        width: 430,
      });
  }

  doc
    .fontSize(9)
    .fillColor(COLORS.muted)
    .text(
      "Thank you for your business!",
      50,
      770,
      {
        align: "center",
      }
    );
};

const generatePDF = (invoice, user) =>
  new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margin: 50,
      });

      const chunks = [];

      doc.on("data", (chunk) => {
        chunks.push(chunk);
      });

      doc.on("end", () => {
        console.log("PDF GENERATED");

        resolve(Buffer.concat(chunks));
      });

      doc.on("error", (err) => {
        console.error("PDF ERROR:", err);

        reject(err);
      });

      drawHeader(doc, invoice);

      drawParties(doc, invoice, user);

      const y = drawLineItems(doc, invoice);

      drawTotals(doc, invoice, y, user);

      doc.end();
    } catch (error) {
      console.error("PDF GENERATION FAILED:", error);

      reject(error);
    }
  });

module.exports = generatePDF;