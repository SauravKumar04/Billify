import { RiDeleteBinLine, RiEdit2Line } from "react-icons/ri";

const ClientCard = ({ client, onEdit, onDelete }) => (
  <article className="shell-card client-card overflow-hidden">
    <div className="px-5 pt-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-3)] text-sm font-semibold text-[color:var(--accent)]">
            {(client.name || "?").charAt(0).toUpperCase()}
          </span>
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-[color:var(--ink)]">{client.name}</h3>
            <p className="mt-1 text-sm text-[color:var(--muted)]">{client.email}</p>
          </div>
        </div>
        <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:justify-end">
          <button type="button" onClick={() => onEdit(client)} className="btn-muted flex-1 px-3 py-2 sm:flex-none">
            <RiEdit2Line className="text-base" />
          </button>
          <button type="button" onClick={() => onDelete(client._id)} className="btn-danger flex-1 px-3 py-2 sm:flex-none">
            <RiDeleteBinLine className="text-base" />
          </button>
        </div>
      </div>
    </div>

    <div className="px-5 pb-5 pt-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-3)] px-3 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[color:var(--muted)]">Phone</p>
          <p className="mt-2 text-sm font-semibold text-[color:var(--ink)]">{client.phone || "No phone added"}</p>
        </div>
        <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-3)] px-3 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[color:var(--muted)]">GSTIN</p>
          <p className="mt-2 text-sm font-semibold text-[color:var(--ink)]">{client.gstin || "-"}</p>
        </div>
      </div>
      <div className="mt-3 rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-3)] px-3 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[color:var(--muted)]">Address</p>
        <p className="mt-2 text-sm text-[color:var(--ink)]">{client.address || "No address"}</p>
      </div>
    </div>
  </article>
);

export default ClientCard;
