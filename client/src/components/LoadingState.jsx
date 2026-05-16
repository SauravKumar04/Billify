import { RiLoader4Line } from "react-icons/ri";

const variants = {
  page: "shell-card flex min-h-[220px] items-center justify-center p-10",
  card: "shell-card flex items-center justify-between gap-4 p-6",
  inline: "flex items-center gap-3",
};

const Spinner = ({ size = 12, glow = true, inline = false }) => {
  const dim = `${size}px`;
  const base = `inline-block rounded-full animate-spin border-[3px] border-[color:var(--accent)] border-t-transparent`;
  const glowClass = glow ? "shadow-[0_0_20px_rgba(183,255,60,0.12)]" : "";
  const style = { height: dim, width: dim };
  return <span className={`${base} ${glowClass} ${inline ? "inline-flex items-center justify-center" : ""}`} style={style} />;
};

const LoadingState = ({ label = "Loading...", variant = "page" }) => {
  const wrapper = variants[variant] || variants.page;

  if (variant === "page") {
    return (
      <div className={wrapper}>
        <div className="flex flex-col items-center justify-center gap-4">
          <Spinner size={56} glow />
          {label ? <p className="text-sm font-semibold text-(--ink)">{label}</p> : null}
          <p className="text-xs text-(--muted)">Fetching the latest data.</p>
        </div>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className={wrapper}>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center rounded-full bg-(--surface-3)">
            <Spinner size={28} glow={true} />
          </span>
          <div>
            <p className="text-sm font-semibold text-(--ink)">{label}</p>
            <p className="text-xs text-(--muted)">Fetching the latest data.</p>
          </div>
        </div>
        <div className="hidden h-10 w-24 rounded-full bg-(--surface-3) sm:block" />
      </div>
    );
  }

  // inline
  return (
    <div className={wrapper}>
      <Spinner size={16} glow inline />
      {label ? <span className="ml-2 text-sm text-(--muted)">{label}</span> : null}
    </div>
  );
};

export { Spinner };
export default LoadingState;
