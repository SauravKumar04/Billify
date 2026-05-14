import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { RiFileList3Line, RiSearchLine, RiLoader4Line, RiMagicLine } from "react-icons/ri";
import { generateReminder } from "../api/aiApi";
import InvoiceTable from "../components/InvoiceTable";
import { deleteInvoice, downloadInvoice, fetchInvoices, markInvoicePaid, sendInvoiceEmail } from "../api/invoiceApi";
import ConfirmModal from "../components/ConfirmModal";
import LoadingState from "../components/LoadingState";
import formatCurrency from "../utils/formatCurrency";
import usePageTitle from "../utils/usePageTitle";

const filterItems = [
  { key: "all", label: "All" },
  { key: "paid", label: "Paid" },
  { key: "unpaid", label: "Unpaid" },
  { key: "overdue", label: "Overdue" },
];

const Invoices = () => {
  usePageTitle("Invoices");
  const [status, setStatus] = useState("all");
  const [query, setQuery] = useState("");
  const [invoices, setInvoices] = useState([]);
  const [pendingPaidId, setPendingPaidId] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState("");
  const [deletingInvoice, setDeletingInvoice] = useState(false);
  const [loadingInvoices, setLoadingInvoices] = useState(true);
  const [markingPaid, setMarkingPaid] = useState(false);
  const [reminderInvoice, setReminderInvoice] = useState(null);
    const navigate = useNavigate();
  const [reminderTone, setReminderTone] = useState("professional");
  const [reminderSubject, setReminderSubject] = useState("");
  const [reminderMessage, setReminderMessage] = useState("");
  const [reminderLoading, setReminderLoading] = useState(false);
  const [sendingReminder, setSendingReminder] = useState(false);

  const loadInvoices = async () => {
    try {
      setLoadingInvoices(true);
      const { data } = await fetchInvoices();
      setInvoices(data);
    } finally {
      setLoadingInvoices(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const statusMatch = status === "all" ? true : invoice.status === status;
      const keyword = query.trim().toLowerCase();
      const queryMatch = !keyword
        ? true
        : [invoice.invoiceNumber, invoice.client?.name, invoice.client?.email]
            .filter(Boolean)
            .some((value) => value.toLowerCase().includes(keyword));

      return statusMatch && queryMatch;
    });
  }, [invoices, query, status]);

  const counts = useMemo(
    () => ({
      all: invoices.length,
      paid: invoices.filter((invoice) => invoice.status === "paid").length,
      unpaid: invoices.filter((invoice) => invoice.status === "unpaid").length,
      overdue: invoices.filter((invoice) => invoice.status === "overdue").length,
    }),
    [invoices]
  );
  const amountSummary = useMemo(() => {
    return invoices.reduce(
      (acc, invoice) => {
        acc.total += invoice.total || 0;
        if (invoice.status === "paid") acc.paid += invoice.total || 0;
        else acc.pending += invoice.total || 0;
        return acc;
      },
      { total: 0, paid: 0, pending: 0 }
    );
  }, [invoices]);

  const handleMarkPaid = async (id) => {
    try {
      setMarkingPaid(true);
      await markInvoicePaid(id);
      toast.success("Invoice marked as paid");
      setPendingPaidId("");
      await loadInvoices();
    } catch {
      toast.error("Failed to update invoice");
    } finally {
      setMarkingPaid(false);
    }
  };

  const handleDownload = async (id, invoiceNumber) => {
    try {
      const { data } = await downloadInvoice(id);
      const href = URL.createObjectURL(new Blob([data]));
      const a = document.createElement("a");
      a.href = href;
      a.download = `${invoiceNumber}.pdf`;
      a.click();
      URL.revokeObjectURL(href);
    } catch {
      toast.error("Failed to download PDF");
    }
  };

  const handleEmail = async (id) => {
    try {
      await sendInvoiceEmail(id);
      toast.success("Invoice emailed successfully");
    } catch {
      toast.error("Failed to send email");
    }
  };

  const handleViewInvoice = (id) => {
    navigate(`/invoices/${id}`);
  };

  const handleDeleteInvoice = async (id) => {
    try {
      setDeletingInvoice(true);
      await deleteInvoice(id);
      toast.success("Invoice deleted successfully");
      setPendingDeleteId("");
      await loadInvoices();
    } catch {
      toast.error("Failed to delete invoice");
    } finally {
      setDeletingInvoice(false);
    }
  };

  const handleOpenReminder = async (invoice) => {
    try {
      setReminderInvoice(invoice);
      setReminderLoading(true);
      const { data } = await generateReminder(invoice._id, { tone: reminderTone });
      setReminderSubject(data?.data?.subject || `Payment reminder: ${invoice.invoiceNumber}`);
      setReminderMessage(data?.data?.reminder || "");
    } catch {
      toast.error("Failed to generate AI reminder");
      setReminderInvoice(null);
    } finally {
      setReminderLoading(false);
    }
  };

  const handleRegenerateReminder = async () => {
    if (!reminderInvoice) return;
    try {
      setReminderLoading(true);
      const { data } = await generateReminder(reminderInvoice._id, { tone: reminderTone });
      setReminderSubject(data?.data?.subject || `Payment reminder: ${reminderInvoice.invoiceNumber}`);
      setReminderMessage(data?.data?.reminder || "");
    } catch {
      toast.error("Failed to regenerate reminder");
    } finally {
      setReminderLoading(false);
    }
  };

  const handleSendReminder = async () => {
    if (!reminderInvoice) return;
    try {
      setSendingReminder(true);
      await sendInvoiceEmail(reminderInvoice._id, {
        subject: reminderSubject,
        message: reminderMessage,
        includePdf: false,
      });
      toast.success("AI reminder sent successfully");
      setReminderInvoice(null);
      setReminderMessage("");
      setReminderSubject("");
    } catch {
      toast.error("Failed to send reminder");
    } finally {
      setSendingReminder(false);
    }
  };

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-[color:var(--ink)]">
            <RiFileList3Line className="text-[color:var(--muted)]" /> Invoice List
          </h2>
          <p className="mt-1 text-sm text-[color:var(--muted)]">Track payment state, download, email invoices, and send AI reminders.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <RiSearchLine className="pointer-events-none absolute left-3 top-3 text-[color:var(--muted)]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="field-input pl-10"
            placeholder="Search invoice or client"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {filterItems.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setStatus(item.key)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
              status === item.key
                ? "border-[color:var(--accent)] bg-[color:var(--accent)] text-[#0b0f14]"
                : "border-[color:var(--line)] bg-[color:var(--surface-2)] text-[color:var(--ink)] hover:border-[color:var(--accent)]"
            }`}
          >
            <span>{item.label}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                status === item.key ? "bg-black/25 text-black" : "bg-[color:var(--surface-3)] text-[color:var(--muted)]"
              }`}
            >
              {counts[item.key]}
            </span>
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface)] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--muted)]">Total billed</p>
          <p className="mt-2 text-2xl font-semibold text-[color:var(--ink)]">{formatCurrency(amountSummary.total)}</p>
          <p className="mt-1 text-xs text-[color:var(--muted)]">Across {counts.all} invoices</p>
        </div>
        <div className="rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface)] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--accent)]">Paid</p>
          <p className="mt-2 text-2xl font-semibold text-[color:var(--ink)]">{formatCurrency(amountSummary.paid)}</p>
          <p className="mt-1 text-xs text-[color:var(--muted)]">{counts.paid} invoices collected</p>
        </div>
        <div className="rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface)] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--muted)]">Pending</p>
          <p className="mt-2 text-2xl font-semibold text-[color:var(--ink)]">{formatCurrency(amountSummary.pending)}</p>
          <p className="mt-1 text-xs text-[color:var(--muted)]">{counts.unpaid + counts.overdue} invoices open</p>
        </div>
      </div>

      <InvoiceTable
        invoices={filteredInvoices}
        onMarkPaid={(id) => setPendingPaidId(id)}
        onDownload={handleDownload}
        onEmail={handleEmail}
        onView={handleViewInvoice}
        onDelete={(id) => setPendingDeleteId(id)}
        onAiReminder={handleOpenReminder}
      />

      {loadingInvoices ? (
        <LoadingState label="Loading invoices" variant="card" />
      ) : null}

      {!loadingInvoices && !filteredInvoices.length ? (
        <div className="shell-card p-8 text-center text-sm text-[color:var(--muted)]">No invoices found for this filter/search.</div>
      ) : null}

      <ConfirmModal
        isOpen={Boolean(pendingPaidId)}
        title="Mark invoice as paid?"
        description="This updates the invoice status and dashboard metrics immediately."
        confirmText="Mark Paid"
        loading={markingPaid}
        onCancel={() => setPendingPaidId("")}
        onConfirm={() => handleMarkPaid(pendingPaidId)}
      />

      <ConfirmModal
        isOpen={Boolean(pendingDeleteId)}
        title="Delete this invoice?"
        description="This action is permanent and cannot be undone."
        confirmText="Delete Invoice"
        confirmClassName="btn-danger"
        loading={deletingInvoice}
        onCancel={() => setPendingDeleteId("")}
        onConfirm={() => handleDeleteInvoice(pendingDeleteId)}
      />

      {reminderInvoice ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface)] p-5 shadow-xl sm:p-6">
            <div className="flex flex-col gap-3 border-b border-[color:var(--line)] pb-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold tracking-tight text-[color:var(--ink)]">AI Payment Reminder</h3>
                <p className="mt-1 text-sm text-[color:var(--muted)]">
                  {reminderInvoice.invoiceNumber} · {reminderInvoice.client?.name || "Client"}
                </p>
              </div>
              <select
                value={reminderTone}
                onChange={(event) => setReminderTone(event.target.value)}
                className="field-input w-full sm:w-44"
              >
                <option value="friendly">Friendly</option>
                <option value="professional">Professional</option>
                <option value="strict">Strict</option>
              </select>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <p className="field-label">Subject</p>
                <input
                  value={reminderSubject}
                  onChange={(event) => setReminderSubject(event.target.value)}
                  className="field-input"
                />
              </div>
              <div>
                <p className="field-label">Message</p>
                <textarea
                  rows={7}
                  value={reminderMessage}
                  onChange={(event) => setReminderMessage(event.target.value)}
                  className="field-input"
                  placeholder={reminderLoading ? "Generating AI reminder..." : "Reminder message"}
                />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                className="btn-muted"
                onClick={() => {
                  setReminderInvoice(null);
                  setReminderMessage("");
                  setReminderSubject("");
                }}
              >
                Cancel
              </button>
              <button type="button" className="btn-muted" onClick={handleRegenerateReminder} disabled={reminderLoading || sendingReminder}>
                {reminderLoading ? (
                  <span className="inline-flex items-center gap-2"><RiLoader4Line className="animate-spin" /> Generating</span>
                ) : (
                  <span className="inline-flex items-center gap-2"><RiMagicLine /> Regenerate</span>
                )}
              </button>
              <button type="button" className="btn-primary" onClick={handleSendReminder} disabled={sendingReminder || reminderLoading || !reminderMessage.trim()}>
                {sendingReminder ? (
                  <span className="inline-flex items-center gap-2"><RiLoader4Line className="animate-spin" /> Sending</span>
                ) : (
                  "Send Reminder"
                )}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default Invoices;
