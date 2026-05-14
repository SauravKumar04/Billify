import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const SERVER_BASE = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

const maskAccountNumber = (value = "") => {
  const digits = String(value || "").replace(/\s+/g, "");
  if (digits.length <= 4) return digits;
  const last4 = digits.slice(-4);
  return `XXXX XXXX ${last4}`;
};

const statusClass = (status) => {
  switch (status) {
    case "paid":
      return "status paid";
    case "overdue":
      return "status overdue";
    default:
      return "status unpaid";
  }
};

const Portal = () => {
  const { token } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);
  const [ackLoading, setAckLoading] = useState(false);

  const logoUrl = useMemo(() => {
    if (!invoice?.brandLogo) return "";
    if (invoice.brandLogo.startsWith("http")) return invoice.brandLogo;
    return `${SERVER_BASE}${invoice.brandLogo}`;
  }, [invoice]);

  useEffect(() => {
    let active = true;

    const loadInvoice = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/portal/${token}`);
        if (!response.ok) {
          if (response.status === 404) throw new Error("Invoice not found");
          throw new Error("Unable to load invoice");
        }
        const data = await response.json();
        if (!active) return;
        setInvoice(data);
        setError("");
      } catch (err) {
        if (!active) return;
        setError(err.message || "Unable to load invoice");
        setInvoice(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadInvoice();

    return () => {
      active = false;
    };
  }, [token]);

  const acknowledge = useCallback(async () => {
    try {
      setAckLoading(true);
      const response = await fetch(`${API_BASE}/portal/${token}/acknowledge`, { method: "POST" });
      if (response.ok) {
        setAcknowledged(true);
      }
    } finally {
      setAckLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!invoice) return;
    acknowledge();
  }, [acknowledge, invoice]);

  if (loading) {
    return (
      <main className="portal">
        <style>{portalStyles}</style>
        <section className="card">
          <div className="skeleton title" />
          <div className="skeleton line" />
          <div className="skeleton line" />
          <div className="skeleton block" />
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="portal">
        <style>{portalStyles}</style>
        <section className="card">
          <h1 className="title">Invoice not found</h1>
          <p className="muted">{error}</p>
        </section>
      </main>
    );
  }

  if (!invoice) return null;

  const totals = [
    { label: "Subtotal", value: invoice.subtotal },
    { label: "GST", value: invoice.gstAmount },
  ];

  const hasUpi = Boolean(invoice.bankDetails?.upi);

  return (
    <main className="portal">
      <style>{portalStyles}</style>
      <section className="card">
        <header className="header">
          <div className="brand">
            {logoUrl ? (
              <img src={logoUrl} alt="Brand logo" className="logo" />
            ) : (
              <img src="/billifylogo.png" alt="Billify logo" className="logo" />
            )}
          </div>
          <div className="header-meta">
            <span className="pill">{invoice.invoiceNumber}</span>
            <span className={statusClass(invoice.status)}>{invoice.status}</span>
          </div>
        </header>

        <div className="divider" />

        <section className="section">
          <h2 className="section-title">Billed to</h2>
          <p className="body-text">{invoice.client?.name}</p>
          <p className="muted">{invoice.client?.email}</p>
        </section>

        <section className="section">
          <table className="table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Qty</th>
                <th>Rate</th>
                <th className="align-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.lineItems?.map((item, index) => (
                <tr key={`${item.description}-${index}`}>
                  <td>{item.description}</td>
                  <td>{item.quantity}</td>
                  <td>{formatCurrency(item.rate)}</td>
                  <td className="align-right">{formatCurrency(item.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="totals">
            {totals.map((row) => (
              <div key={row.label} className="total-row">
                <span className="muted">{row.label}</span>
                <span>{formatCurrency(row.value)}</span>
              </div>
            ))}
            <div className="total-row total">
              <span>Total</span>
              <span>{formatCurrency(invoice.total)}</span>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="payment-card">
            <div>
              <h3 className="section-title">Payment details</h3>
              <p className="body-text">{invoice.bankDetails?.bankName || ""}</p>
              <p className="muted">Account: {maskAccountNumber(invoice.bankDetails?.accountNumber)}</p>
              <p className="muted">IFSC: {invoice.bankDetails?.ifsc || ""}</p>
            </div>
            {hasUpi ? (
              <div className="qr-block">
                <img src={`${API_BASE}/portal/${token}/upi-qr`} alt="UPI QR" className="qr" />
                <p className="muted">Scan to pay via UPI</p>
              </div>
            ) : null}
          </div>
        </section>

        <section className="section">
          <button
            type="button"
            className="primary"
            onClick={acknowledge}
            disabled={ackLoading || acknowledged}
          >
            {acknowledged ? "Acknowledged" : ackLoading ? "Marking..." : "Mark as Acknowledged"}
          </button>
          {acknowledged ? <p className="success">Thanks for confirming receipt.</p> : null}
        </section>

        <footer className="footer">Powered by Billify</footer>
      </section>
    </main>
  );
};

const formatCurrency = (value = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

const portalStyles = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display&display=swap');

:root {
  --bg: #0a0f14;
  --text: #e7eefc;
  --muted: #93a0b8;
  --accent: #b7ff3c;
  --card: #0f141b;
  --soft: #131a24;
  --border: rgba(255, 255, 255, 0.08);
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: "DM Sans", sans-serif;
  color: var(--text);
  background:
    radial-gradient(800px 420px at 10% -10%, rgba(183, 255, 60, 0.12), transparent 60%),
    radial-gradient(700px 420px at 90% 10%, rgba(49, 64, 92, 0.4), transparent 60%),
    var(--bg);
}

.portal {
  min-height: 100vh;
  background: var(--bg);
  padding: 48px 24px;
  display: flex;
  justify-content: center;
}

.card {
  width: 100%;
  max-width: 680px;
  background: var(--card);
  border-radius: 24px;
  padding: 32px;
  border: 1px solid var(--border);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  height: 54px;
  width: auto;
  max-width: 120px;
  object-fit: contain;
  border-radius: 14px;
  border: 1px solid var(--border);
  padding: 6px 8px;
  background: #0f141b;
}

.brand-text {
  font-family: "DM Serif Display", serif;
  font-size: 22px;
  letter-spacing: 0.08em;
  font-style: italic;
}

.header-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pill {
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(183, 255, 60, 0.12);
  color: var(--accent);
  font-size: 12px;
  font-weight: 600;
}

.status {
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  text-transform: capitalize;
}

.status.paid {
  background: rgba(183, 255, 60, 0.15);
  color: var(--accent);
}

.status.unpaid {
  background: rgba(255, 255, 255, 0.06);
  color: var(--muted);
}

.status.overdue {
  background: rgba(255, 93, 93, 0.15);
  color: #ff8f8f;
}

.divider {
  height: 1px;
  background: var(--border);
  margin: 24px 0;
}

.section {
  margin-bottom: 28px;
}

.section-title {
  font-family: "DM Serif Display", serif;
  font-size: 18px;
  margin: 0 0 8px 0;
}

.body-text {
  margin: 0 0 4px 0;
  font-weight: 600;
}

.muted {
  color: var(--muted);
  margin: 0;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table thead th {
  text-align: left;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
  color: var(--muted);
}

.table tbody td {
  padding: 12px 0;
  font-size: 14px;
}

.align-right {
  text-align: right;
}

.totals {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.total-row.total {
  font-size: 24px;
  font-weight: 700;
}

.payment-card {
  background: var(--soft);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  border: 1px solid var(--border);
}

.qr-block {
  text-align: center;
}

.qr {
  width: 140px;
  height: 140px;
  border-radius: 12px;
  background: #0f141b;
  padding: 8px;
  border: 1px solid var(--border);
}

.primary {
  width: 100%;
  padding: 14px 18px;
  border: none;
  border-radius: 14px;
  background: var(--accent);
  color: #0a0f14;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}

.primary:disabled {
  opacity: 0.7;
  cursor: default;
}

.success {
  margin-top: 10px;
  color: var(--accent);
  font-size: 13px;
}

.footer {
  text-align: center;
  color: var(--muted);
  font-size: 12px;
  padding-top: 8px;
}

.title {
  font-family: "DM Serif Display", serif;
  font-size: 24px;
  margin: 0 0 8px 0;
}

.skeleton {
  background: linear-gradient(90deg, #121823 25%, #1a2230 50%, #121823 75%);
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite;
  border-radius: 12px;
  margin-bottom: 12px;
}

.skeleton.title {
  height: 28px;
  width: 55%;
}

.skeleton.line {
  height: 14px;
  width: 75%;
}

.skeleton.block {
  height: 120px;
  width: 100%;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@media (max-width: 640px) {
  .card {
    padding: 24px;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
  }

  .payment-card {
    flex-direction: column;
    align-items: flex-start;
  }
}
`;

export default Portal;
