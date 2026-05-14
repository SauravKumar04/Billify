import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import { RiAddLine, RiDeleteBinLine, RiFilePaper2Line, RiLoader4Line } from "react-icons/ri";
import { fetchClients } from "../api/clientApi";
import { createInvoice, fetchInvoices } from "../api/invoiceApi";
import { GST_RATES, calculateInvoiceTotals } from "../utils/gstHelpers";
import formatCurrency from "../utils/formatCurrency";
import LoadingState from "../components/LoadingState";
import ConfirmModal from "../components/ConfirmModal";
import usePageTitle from "../utils/usePageTitle";

const EMPTY_LINE_ITEMS = [];
const EMPTY_DRAFT = {};

const NewInvoice = () => {
  usePageTitle("New Invoice");
  const [clients, setClients] = useState([]);
  const [invoiceNumber, setInvoiceNumber] = useState("BILL-0001");
  const [loadingData, setLoadingData] = useState(true);
  const [pendingRemoveIndex, setPendingRemoveIndex] = useState(null);
  const navigate = useNavigate();

  const { register, control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      client: "",
      dueDate: "",
      gstRate: 18,
      notes: "",
      lineItems: [{ description: "", quantity: 1, rate: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "lineItems" });
  const watchedItems = useWatch({ control, name: "lineItems" });
  const gstRate = useWatch({ control, name: "gstRate" }) || 0;
  const watchedDraft = useWatch({ control });
  const safeItems = watchedItems ?? EMPTY_LINE_ITEMS;
  const draftValues = watchedDraft ?? EMPTY_DRAFT;
  const draftKey = "billify.invoiceDraft";

  const totals = useMemo(() => calculateInvoiceTotals(safeItems, gstRate), [safeItems, gstRate]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [clientsRes, invoicesRes] = await Promise.all([fetchClients(), fetchInvoices()]);
        setClients(clientsRes.data);
        const last = invoicesRes.data[0]?.invoiceNumber;
        if (last) {
          const num = Number(last.split("-")[1] || "0") + 1;
          setInvoiceNumber(`BILL-${String(num).padStart(4, "0")}`);
        }
      } finally {
        setLoadingData(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(draftKey);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (saved?.values) {
        reset({
          client: saved.values.client || "",
          dueDate: saved.values.dueDate || "",
          gstRate: saved.values.gstRate ?? 18,
          notes: saved.values.notes || "",
          lineItems: Array.isArray(saved.values.lineItems) && saved.values.lineItems.length
            ? saved.values.lineItems
            : [{ description: "", quantity: 1, rate: 0 }],
        });
      }
    } catch {
      localStorage.removeItem(draftKey);
    }
  }, [reset]);

  useEffect(() => {
    if (isSubmitting) return undefined;
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(
          draftKey,
          JSON.stringify({
            updatedAt: Date.now(),
            values: draftValues,
          })
        );
      } catch {
        // Ignore storage errors silently
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [draftValues, isSubmitting]);

  const onSubmit = async (values) => {
    try {
      const { data } = await createInvoice({
        ...values,
        lineItems: totals.lineItems,
        subtotal: totals.subtotal,
        gstAmount: totals.gstAmount,
        total: totals.total,
      });
      localStorage.removeItem(draftKey);
      toast.success("Invoice created successfully");
      if (data?._id) {
        navigate(`/invoices/${data._id}`);
      } else {
        navigate("/invoices");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create invoice");
    }
  };

  return (
    <section className="shell-card p-5 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-[color:var(--ink)]">
            <RiFilePaper2Line className="text-[color:var(--muted)]" /> Invoice Builder
          </h2>
          <p className="mt-1 text-sm text-[color:var(--muted)]">Invoice Number: {invoiceNumber}</p>
        </div>
        <div className="rounded-full border border-[color:var(--line)] bg-[color:var(--surface-3)] px-4 py-2 text-sm text-[color:var(--muted)]">Draft</div>
      </div>

      {loadingData ? (
        <div className="mt-6">
          <LoadingState label="Loading invoice setup" variant="card" />
        </div>
      ) : null}

      {!loadingData ? <form className="mt-6 space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <label className="field-label">Client</label>
            <select {...register("client", { required: "Client is required" })} className="field-input">
              <option value="">Select client</option>
              {clients.map((client) => <option key={client._id} value={client._id}>{client.name}</option>)}
            </select>
            {errors.client && <p className="text-xs text-[color:var(--danger)]">{errors.client.message}</p>}
          </div>
          <div>
            <label className="field-label">Due Date</label>
            <input {...register("dueDate", { required: "Due date is required" })} type="date" className="field-input" />
          </div>
          <div>
            <label className="field-label">GST</label>
            <select {...register("gstRate")} className="field-input">
              {GST_RATES.map((rate) => <option key={rate} value={rate}>{rate}% GST</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-2 rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface-2)] p-3 sm:p-4">
          {fields.map((field, index) => (
            <div key={field.id} className="grid gap-2 md:grid-cols-12">
              <input {...register(`lineItems.${index}.description`, { required: true })} placeholder="Description" className="field-input md:col-span-5" />
              <input {...register(`lineItems.${index}.quantity`, { required: true, min: 1 })} type="number" placeholder="Qty" className="field-input md:col-span-2" />
              <input {...register(`lineItems.${index}.rate`, { required: true, min: 0 })} type="number" step="0.01" placeholder="Rate" className="field-input md:col-span-3" />
              <button type="button" onClick={() => setPendingRemoveIndex(index)} className="btn-danger px-3 py-2 md:col-span-2">
                <RiDeleteBinLine className="mx-auto" />
              </button>
            </div>
          ))}
          <button type="button" onClick={() => append({ description: "", quantity: 1, rate: 0 })} className="btn-muted">
            <RiAddLine /> Add Item
          </button>
        </div>

        <div>
          <label className="field-label">Notes</label>
          <textarea {...register("notes")} rows="3" placeholder="Notes" className="field-input" />
        </div>

        <div className="rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface-2)] p-4 text-sm text-[color:var(--muted)]">
          <p>Subtotal: {formatCurrency(totals.subtotal)}</p>
          <p>GST: {formatCurrency(totals.gstAmount)}</p>
          <p className="mt-1 text-base font-semibold text-[color:var(--ink)]">Total: {formatCurrency(totals.total)}</p>
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2"><RiLoader4Line className="animate-spin" /> Saving</span>
          ) : (
            "Create Invoice"
          )}
        </button>
      </form> : null}

      <ConfirmModal
        isOpen={pendingRemoveIndex !== null}
        title="Remove this line item?"
        description="This will delete the selected line item from the invoice draft."
        confirmText="Remove"
        confirmClassName="btn-danger"
        onCancel={() => setPendingRemoveIndex(null)}
        onConfirm={() => {
          if (pendingRemoveIndex !== null) remove(pendingRemoveIndex);
          setPendingRemoveIndex(null);
        }}
      />
    </section>
  );
};

export default NewInvoice;
