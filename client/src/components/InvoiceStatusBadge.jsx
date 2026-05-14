const statusStyle = {
  paid: "border-[color:var(--accent)] bg-[color:var(--accent)]/15 text-[color:var(--accent)]",
  unpaid: "border-[color:var(--line)] bg-[color:var(--surface-3)] text-[color:var(--muted)]",
  overdue: "border-[color:var(--danger)] bg-[color:var(--danger)]/15 text-[color:var(--danger)]",
};

const statusLabel = {
  paid: "Paid",
  unpaid: "Unpaid",
  overdue: "Overdue",
};

const InvoiceStatusBadge = ({ status }) => (
  <span
    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide ${
      statusStyle[status] || "border-[color:var(--line)] bg-[color:var(--surface-3)] text-[color:var(--muted)]"
    }`}
  >
    {statusLabel[status] || status}
  </span>
);

export default InvoiceStatusBadge;
