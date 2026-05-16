import { RiAlarmWarningLine } from "react-icons/ri";
import { Spinner } from "./LoadingState";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-(--line) bg-(--surface) p-6 shadow-xl max-h-[calc(100vh-2rem)] overflow-auto">
        <div className="mb-4 flex items-start gap-3">
          <div className="rounded-xl border border-(--line) bg-(--surface-3) p-2.5 text-(--accent)">
            <RiAlarmWarningLine className="text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-(--ink)">{title}</h3>
            <p className="mt-1 text-sm text-(--muted)">{description}</p>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onCancel} className="btn-muted" disabled={loading}>
            {cancelText}
          </button>
          <button type="button" onClick={onConfirm} className={confirmClassName} disabled={loading}>
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Spinner size={16} glow inline />
                <span>Processing...</span>
              </span>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
