const toneStyle = {
  slate: {
    card: "border-[color:var(--line)] bg-[color:var(--surface-2)]",
    icon: "border-[color:var(--line)] bg-[color:var(--surface-3)] text-[color:var(--muted)]",
    accent: "bg-[color:var(--accent)]",
  },
  emerald: {
    card: "border-[color:var(--line)] bg-[color:var(--surface-2)]",
    icon: "border-[color:var(--line)] bg-[color:var(--surface-3)] text-[color:var(--accent)]",
    accent: "bg-[color:var(--accent)]",
  },
  indigo: {
    card: "border-[color:var(--line)] bg-[color:var(--surface-2)]",
    icon: "border-[color:var(--line)] bg-[color:var(--surface-3)] text-[color:var(--accent)]",
    accent: "bg-[color:var(--accent)]",
  },
  blue: {
    card: "border-[color:var(--line)] bg-[color:var(--surface-2)]",
    icon: "border-[color:var(--line)] bg-[color:var(--surface-3)] text-[color:var(--accent)]",
    accent: "bg-[color:var(--accent)]",
  },
};

const StatCard = ({ title, value, icon: Icon, tone = "slate", helper }) => {
  const styles = toneStyle[tone] || toneStyle.slate;

  return (
    <div className={`relative overflow-hidden rounded-3xl border p-4 sm:p-5 ${styles.card} neo-border`}>
      <span className={`absolute inset-x-0 top-0 h-1 ${styles.accent}`} />
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--muted)]">{title}</p>
        {Icon ? (
          <span className={`rounded-xl border p-2 ${styles.icon}`}>
            <Icon className="text-lg" />
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-3xl font-semibold leading-none tracking-tight text-[color:var(--ink)]">{value}</p>
      {helper ? <p className="mt-2 text-xs text-[color:var(--muted)]">{helper}</p> : null}
    </div>
  );
};

export default StatCard;
