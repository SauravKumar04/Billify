import { RiLoader4Line } from "react-icons/ri";

const variants = {
  page: "shell-card flex min-h-[220px] items-center justify-center p-10",
  card: "shell-card flex items-center justify-between gap-4 p-6",
  inline: "flex items-center gap-3",
};

const LoadingState = ({ label = "Loading...", variant = "page" }) => {
  const wrapper = variants[variant] || variants.page;

  return (
    <div className={wrapper}>
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-3)] text-[color:var(--accent)]">
          <RiLoader4Line className="animate-spin text-lg" />
        </span>
        <div>
          <p className="text-sm font-semibold text-[color:var(--ink)]">{label}</p>
          <p className="text-xs text-[color:var(--muted)]">Hang tight, polishing the details.</p>
        </div>
      </div>
      {variant === "card" ? <div className="hidden h-10 w-24 rounded-full bg-[color:var(--surface-3)] sm:block" /> : null}
    </div>
  );
};

export default LoadingState;
