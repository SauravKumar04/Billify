import { RiCheckLine, RiDeleteBinLine, RiDownloadLine, RiEyeLine, RiMailSendLine } from "react-icons/ri";
import formatCurrency from "../utils/formatCurrency";
import formatDate from "../utils/formatDate";
import InvoiceStatusBadge from "./InvoiceStatusBadge";

const InvoiceTable = ({ invoices, onMarkPaid, onDownload, onEmail, onView, onDelete, onAiReminder }) => (
  <>
    <div className="grid gap-3 md:hidden">
      {invoices.map((invoice) => (
        <article key={invoice._id} className="shell-card overflow-hidden">
          <div className="border-b border-[color:var(--line)] bg-[color:var(--surface-3)] px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-[color:var(--ink)]">{invoice.invoiceNumber}</h3>
                <p className="text-xs text-[color:var(--muted)]">{invoice.client?.name}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-[color:var(--ink)]">{formatCurrency(invoice.total)}</p>
                <InvoiceStatusBadge status={invoice.status} />
              </div>
            </div>
          </div>
          <div className="px-4 py-3">
            <div className="flex items-center justify-between text-xs text-[color:var(--muted)]">
              <span>Due</span>
              <span className="font-medium text-[color:var(--ink)]">{formatDate(invoice.dueDate)}</span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <button type="button" onClick={() => onView(invoice._id)} className="btn-muted px-2 py-2 text-xs">
                <RiEyeLine className="text-base" />
              </button>
              <button type="button" onClick={() => onAiReminder(invoice)} className="btn-muted px-2 py-2 text-[11px] font-semibold" title="Create reminder">
                Remind
              </button>
              <button type="button" onClick={() => onDownload(invoice._id, invoice.invoiceNumber)} className="btn-primary px-2 py-2 text-xs">
                <RiDownloadLine className="text-base" />
              </button>
              <button type="button" onClick={() => onEmail(invoice._id)} className="btn-muted px-2 py-2 text-xs">
                <RiMailSendLine className="text-base" />
              </button>
              {(() => {
                const isPaid = invoice.status === "paid";
                return (
                  <button
                    type="button"
                    onClick={() => onMarkPaid(invoice._id)}
                    className={`btn-muted px-2 py-2 text-xs ${isPaid ? "opacity-60" : ""}`}
                    disabled={isPaid}
                    title={isPaid ? "Already paid" : "Mark as paid"}
                  >
                    {isPaid ? "Paid" : <RiCheckLine className="text-base" />}
                  </button>
                );
              })()}
              <button type="button" onClick={() => onDelete(invoice._id)} className="btn-danger px-2 py-2 text-xs">
                <RiDeleteBinLine className="text-base" />
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>

    <div className="hidden overflow-x-auto rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface)] md:block">
      <table className="min-w-full text-sm">
        <thead className="bg-[color:var(--surface-2)] text-left text-[color:var(--muted)]">
        <tr>
          <th className="px-5 py-3">Invoice</th>
          <th className="px-5 py-3">Client</th>
          <th className="px-5 py-3">Due</th>
          <th className="px-5 py-3">Total</th>
          <th className="px-5 py-3">Status</th>
          <th className="px-5 py-3">Actions</th>
        </tr>
        </thead>
        <tbody>
          {invoices.map((invoice, index) => (
            <tr key={invoice._id} className={`border-t border-[color:var(--line)] ${index % 2 ? "bg-[color:var(--surface-3)]" : "bg-[color:var(--surface)]"}`}>
              <td className="px-5 py-4 font-medium text-[color:var(--ink)]">{invoice.invoiceNumber}</td>
              <td className="px-5 py-4 text-[color:var(--muted)]">{invoice.client?.name}</td>
              <td className="px-5 py-4 text-[color:var(--muted)]">{formatDate(invoice.dueDate)}</td>
              <td className="px-5 py-4 text-[color:var(--muted)]">{formatCurrency(invoice.total)}</td>
              <td className="px-5 py-4">
                <InvoiceStatusBadge status={invoice.status} />
              </td>
              <td className="px-5 py-4">
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => onView(invoice._id)} className="btn-muted px-2.5 py-2" title="View invoice details">
                    <RiEyeLine className="text-base" />
                  </button>
                  {(() => {
                    const isPaid = invoice.status === "paid";
                    return (
                      <button
                        type="button"
                        onClick={() => onMarkPaid(invoice._id)}
                        className={`btn-muted px-2.5 py-2 ${isPaid ? "opacity-60" : ""}`}
                        disabled={isPaid}
                        title={isPaid ? "Already paid" : "Mark as paid"}
                      >
                        {isPaid ? "Paid" : <RiCheckLine className="text-base" />}
                      </button>
                    );
                  })()}
                  <button type="button" onClick={() => onAiReminder(invoice)} className="btn-muted px-3 py-2 text-xs font-semibold" title="Create reminder">
                    Reminder
                  </button>
                  <button type="button" onClick={() => onDownload(invoice._id, invoice.invoiceNumber)} className="btn-primary px-2.5 py-2">
                    <RiDownloadLine className="text-base" />
                  </button>
                  <button type="button" onClick={() => onEmail(invoice._id)} className="btn-muted px-2.5 py-2">
                    <RiMailSendLine className="text-base" />
                  </button>
                  <button type="button" onClick={() => onDelete(invoice._id)} className="btn-danger px-2.5 py-2" title="Delete invoice">
                    <RiDeleteBinLine className="text-base" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
);

export default InvoiceTable;
