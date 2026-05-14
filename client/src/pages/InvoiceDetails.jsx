import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  RiArrowLeftLine,
  RiCheckLine,
  RiDownloadLine,
  RiLoader4Line,
  RiMailSendLine,
  RiWhatsappLine,
} from "react-icons/ri";
import LoadingState from "../components/LoadingState";
import InvoiceStatusBadge from "../components/InvoiceStatusBadge";
import { downloadInvoice, fetchInvoiceById, markInvoicePaid, sendInvoiceEmail } from "../api/invoiceApi";
import formatCurrency from "../utils/formatCurrency";
import formatDate from "../utils/formatDate";
import usePageTitle from "../utils/usePageTitle";

const InvoiceDetails = () => {
  usePageTitle("Invoice Details");
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [markingPaid, setMarkingPaid] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await fetchInvoiceById(id);
        setInvoice(data);
      } catch {
        toast.error("Failed to load invoice");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleDownload = async () => {
    if (!invoice) return;
    try {
      setDownloading(true);
      const { data } = await downloadInvoice(invoice._id);
      const href = URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = href;
      link.download = `${invoice.invoiceNumber}.pdf`;
      link.click();
      URL.revokeObjectURL(href);
    } catch {
      toast.error("Failed to download PDF");
    } finally {
      setDownloading(false);
    }
  };

  const handleEmail = async () => {
    if (!invoice) return;
    try {
      setSendingEmail(true);
      await sendInvoiceEmail(invoice._id);
      toast.success("Invoice emailed successfully");
    } catch {
      toast.error("Failed to send email");
    } finally {
      setSendingEmail(false);
    }
  };

  const handleMarkPaid = async () => {
    if (!invoice || invoice.status === "paid") return;
    try {
      setMarkingPaid(true);
      const { data } = await markInvoicePaid(invoice._id);
      setInvoice(data);
      toast.success("Invoice marked as paid");
    } catch {
      toast.error("Failed to update invoice");
    } finally {
      setMarkingPaid(false);
    }
  };

  if (loading) {
    return <LoadingState label="Loading invoice" variant="page" />;
  }

  if (!invoice) {
    return (
      <div className="shell-card p-8 text-center text-sm text-[color:var(--muted)]">
        Invoice not found.
      </div>
    );
  }

  const issuedDate = invoice.issueDate || invoice.createdAt;
  const portalUrl = invoice.publicToken ? `${window.location.origin}/portal/${invoice.publicToken}` : "";

  const handleCopyPortalLink = async () => {
    if (!portalUrl) return;
    try {
      await navigator.clipboard.writeText(portalUrl);
      toast.success("Portal link copied");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleWhatsApp = () => {
    const rawPhone = invoice.client?.phone || "";
    let phone = rawPhone.replace(/[^\d]/g, "");
    if (!phone) {
      toast.error("Client phone number is missing");
      return;
    }

    if (!phone.startsWith("91") && phone.length <= 10) {
      phone = `91${phone}`;
    }

    const message = [
      `Hi ${invoice.client?.name || "there"},`,
      `Here is your invoice ${invoice.invoiceNumber} for ${formatCurrency(invoice.total)}.`,
      `Due date: ${formatDate(invoice.dueDate)}.`,
      portalUrl ? `View and pay here: ${portalUrl}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className="btn-muted" onClick={() => navigate("/invoices")}> 
            <RiArrowLeftLine /> Back to invoices
          </button>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--muted)]">Invoice</p>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-semibold tracking-tight text-[color:var(--ink)]">{invoice.invoiceNumber}</h2>
              <InvoiceStatusBadge status={invoice.status} />
            </div>
            <p className="mt-1 text-sm text-[color:var(--muted)]">Issued {formatDate(issuedDate)} · Due {formatDate(invoice.dueDate)}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-muted" onClick={handleCopyPortalLink} disabled={!portalUrl}>
            Copy portal link
          </button>
          <button
            type="button"
            className="btn-muted"
            onClick={handleWhatsApp}
            disabled={!invoice.client?.phone}
          >
            <span className="inline-flex items-center gap-2"><RiWhatsappLine /> WhatsApp</span>
          </button>
          <button type="button" className="btn-muted" onClick={handleEmail} disabled={sendingEmail}>
            {sendingEmail ? (
              <span className="inline-flex items-center gap-2"><RiLoader4Line className="animate-spin" /> Sending</span>
            ) : (
              <span className="inline-flex items-center gap-2"><RiMailSendLine /> Email</span>
            )}
          </button>
          <button type="button" className="btn-muted" onClick={handleDownload} disabled={downloading}>
            {downloading ? (
              <span className="inline-flex items-center gap-2"><RiLoader4Line className="animate-spin" /> Downloading</span>
            ) : (
              <span className="inline-flex items-center gap-2"><RiDownloadLine /> Download</span>
            )}
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={handleMarkPaid}
            disabled={markingPaid || invoice.status === "paid"}
          >
            {invoice.status === "paid" ? (
              <span className="inline-flex items-center gap-2"><RiCheckLine /> Paid</span>
            ) : markingPaid ? (
              <span className="inline-flex items-center gap-2"><RiLoader4Line className="animate-spin" /> Updating</span>
            ) : (
              <span className="inline-flex items-center gap-2"><RiCheckLine /> Mark Paid</span>
            )}
          </button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-5">
          <div className="shell-card p-5 sm:p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-3)] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--muted)]">Client</p>
                <p className="mt-2 text-base font-semibold text-[color:var(--ink)]">{invoice.client?.name || "-"}</p>
                <p className="text-sm text-[color:var(--muted)]">{invoice.client?.email || "-"}</p>
                <p className="text-sm text-[color:var(--muted)]">GSTIN: {invoice.client?.gstin || "-"}</p>
              </div>
              <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-3)] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--muted)]">Billing</p>
                <p className="mt-2 text-sm text-[color:var(--muted)]">Issue date: {formatDate(issuedDate)}</p>
                <p className="text-sm text-[color:var(--muted)]">Due date: {formatDate(invoice.dueDate)}</p>
                <p className="text-sm text-[color:var(--muted)]">GST rate: {invoice.gstRate}%</p>
              </div>
            </div>
          </div>

          <div className="shell-card overflow-hidden">
            <div className="hidden grid-cols-12 border-b border-[color:var(--line)] bg-[color:var(--surface-3)] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[color:var(--muted)] md:grid">
              <p className="col-span-6">Description</p>
              <p className="col-span-2">Qty</p>
              <p className="col-span-2">Rate</p>
              <p className="col-span-2">Amount</p>
            </div>
            <div className="hidden md:block">
              {invoice.lineItems?.map((item, idx) => (
                <div
                  key={`${item.description}-${idx}`}
                  className="grid grid-cols-12 px-4 py-3 text-sm text-[color:var(--muted)] odd:bg-[color:var(--surface)] even:bg-[color:var(--surface-3)]"
                >
                  <p className="col-span-6">{item.description}</p>
                  <p className="col-span-2">{item.quantity}</p>
                  <p className="col-span-2">{formatCurrency(item.rate)}</p>
                  <p className="col-span-2 font-semibold text-[color:var(--ink)]">{formatCurrency(item.amount)}</p>
                </div>
              ))}
            </div>
            <div className="grid gap-3 p-4 md:hidden">
              {invoice.lineItems?.map((item, idx) => (
                <div key={`${item.description}-${idx}`} className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-3)] p-3">
                  <p className="text-sm font-semibold text-[color:var(--ink)]">{item.description}</p>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-[color:var(--muted)]">
                    <div>
                      <p className="font-semibold uppercase tracking-wide text-[color:var(--muted)]">Qty</p>
                      <p className="text-sm text-[color:var(--ink)]">{item.quantity}</p>
                    </div>
                    <div>
                      <p className="font-semibold uppercase tracking-wide text-[color:var(--muted)]">Rate</p>
                      <p className="text-sm text-[color:var(--ink)]">{formatCurrency(item.rate)}</p>
                    </div>
                    <div>
                      <p className="font-semibold uppercase tracking-wide text-[color:var(--muted)]">Amount</p>
                      <p className="text-sm font-semibold text-[color:var(--ink)]">{formatCurrency(item.amount)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {invoice.notes ? (
            <div className="shell-card p-4 text-sm text-[color:var(--muted)]">
              <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--muted)]">Notes</p>
              <p className="mt-2 text-[color:var(--ink)]">{invoice.notes}</p>
            </div>
          ) : null}
        </div>

        <aside className="space-y-4">
          <div className="shell-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--muted)]">Summary</p>
            <div className="mt-3 space-y-2 text-sm text-[color:var(--muted)]">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-[color:var(--ink)]">{formatCurrency(invoice.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>GST</span>
                <span className="font-medium text-[color:var(--ink)]">{formatCurrency(invoice.gstAmount)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>GST Rate</span>
                <span className="font-medium text-[color:var(--ink)]">{invoice.gstRate}%</span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-[color:var(--line)] pt-3">
                <span className="text-base font-semibold text-[color:var(--ink)]">Total</span>
                <span className="text-base font-semibold text-[color:var(--ink)]">{formatCurrency(invoice.total)}</span>
              </div>
            </div>
          </div>
          <div className="shell-card p-5 bg-[color:var(--surface-2)] text-[color:var(--ink)]">
            <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--accent)]">Payment Note</p>
            <p className="mt-2 text-sm text-[color:var(--muted)]">
              Keep follow-ups concise and aim to clear open balances within 7 days.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default InvoiceDetails;
