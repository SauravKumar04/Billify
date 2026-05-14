import { RiAlarmWarningLine } from "react-icons/ri";

const ConfirmModal = ({
  isOpen,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmClassName = "btn-primary",
  loading = false,
  onCancel,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface)] p-6 shadow-xl">
        <div className="mb-4 flex items-start gap-3">
          <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-3)] p-2.5 text-[color:var(--accent)]">
            <RiAlarmWarningLine className="text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[color:var(--ink)]">{title}</h3>
            <p className="mt-1 text-sm text-[color:var(--muted)]">{description}</p>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onCancel} className="btn-muted" disabled={loading}>
            {cancelText}
          </button>
          <button type="button" onClick={onConfirm} className={confirmClassName} disabled={loading}>
            {loading ? "Please wait..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
