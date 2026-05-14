import { useEffect } from "react";
import { useForm } from "react-hook-form";

const ClientForm = ({ isOpen, initialData, onClose, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      gstin: "",
      address: "",
    },
  });

  useEffect(() => {
    if (initialData) reset(initialData);
    else reset({ name: "", email: "", phone: "", gstin: "", address: "" });
  }, [initialData, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-xl rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface)] p-6 shadow-xl">
        <h3 className="mb-1 text-xl font-semibold tracking-tight text-[color:var(--ink)]">{initialData ? "Edit Client" : "Add Client"}</h3>
        <p className="mb-5 text-sm text-[color:var(--muted)]">Keep your client list accurate for cleaner invoice creation.</p>
        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="field-label">Client Name</label>
            <input
              {...register("name", { required: "Name is required" })}
              placeholder="Client Name"
              className="field-input"
            />
            {errors.name && <p className="text-xs text-[color:var(--danger)]">{errors.name.message}</p>}
          </div>
          <div>
            <label className="field-label">Email</label>
            <input
              {...register("email", { required: "Email is required" })}
              placeholder="Email"
              className="field-input"
            />
            {errors.email && <p className="text-xs text-[color:var(--danger)]">{errors.email.message}</p>}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="field-label">Phone</label>
              <input {...register("phone")} placeholder="Phone" className="field-input" />
            </div>
            <div>
              <label className="field-label">GSTIN</label>
              <input {...register("gstin")} placeholder="GSTIN" className="field-input" />
            </div>
          </div>
          <div>
            <label className="field-label">Address</label>
            <textarea {...register("address")} placeholder="Address" className="field-input" rows="3" />
          </div>
          <div className="flex flex-col-reverse justify-end gap-2 pt-2 sm:flex-row">
            <button type="button" onClick={onClose} className="btn-muted">Cancel</button>
            <button type="submit" className="btn-primary">Save Client</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientForm;
