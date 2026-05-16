import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  RiAddLine,
} from "react-icons/ri";

const navItems = [
  { to: "/dashboard", label: "Dashboard", end: true },
  { to: "/clients", label: "Clients" },
  { to: "/invoices", label: "Invoices", end: true },
  { to: "/invoices/new", label: "New Invoice" },
  { to: "/settings", label: "Settings" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const hour = new Date().getHours();
  const part = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";

  return (
    <header className="relative z-30 mx-3 mb-4 px-1 py-2 min-[963px]:mx-6 min-[963px]:mb-6 min-[963px]:mt-4 min-[963px]:rounded-3xl min-[963px]:border min-[963px]:border-[color:var(--line)] min-[963px]:bg-[color:var(--surface)]/90 min-[963px]:px-4 min-[963px]:py-4 min-[963px]:shadow-[0_16px_40px_-28px_rgba(0,0,0,0.8)] min-[963px]:backdrop-blur min-[963px]:sticky min-[963px]:top-4 lg:mx-8 lg:mt-6">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 min-[963px]:grid min-[963px]:grid-cols-[auto_1fr_auto] min-[963px]:items-center min-[963px]:gap-4">
        <div className="flex items-center gap-3 min-[963px]:w-auto min-[963px]:justify-start">
          <Link to="/" aria-label="Go to landing page" className="inline-flex">
            <img
              src="/billifylogo.png"
              alt="Billify logo"
              className="h-9 w-auto max-w-16 rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-2)] object-contain px-2 sm:h-11 sm:max-w-22"
            />
          </Link>
          <h2 className="text-sm font-semibold tracking-tight text-[color:var(--ink)] min-[963px]:hidden">
            <span className="brand-word text-[color:var(--accent)] drop-shadow-[0_0_14px_rgba(183,255,60,0.45)]">Billify</span> Workspace
          </h2>
          <div className="hidden min-[963px]:block">
            <p className="text-xs font-medium uppercase tracking-wide text-[color:var(--muted)]">Good {part}</p>
            <h2 className="text-base font-semibold tracking-tight text-[color:var(--ink)] sm:text-lg">
              <span className="brand-word">Billify</span> Workspace
            </h2>
          </div>
        </div>

        <div className="hidden items-center justify-center min-[963px]:flex">
          <nav className="flex items-center gap-1.5 rounded-full border border-[color:var(--line)] bg-[color:var(--surface-2)] p-0.5 md:px-1.5">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
                    isActive
                      ? "bg-[color:var(--accent)] text-[#0b0f14]"
                      : "text-[color:var(--muted)] hover:text-[color:var(--ink)]"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="hidden items-center justify-end gap-2 min-[963px]:flex min-[963px]:w-auto min-[963px]:justify-end">
          <button
            type="button"
            className="hidden items-center gap-2 rounded-full border border-[color:var(--accent)] bg-[color:var(--accent)] px-3 py-2 text-xs font-semibold text-[#0b0f14] transition hover:brightness-105 min-[1118px]:inline-flex"
            onClick={() => navigate("/invoices/new")}
          >
            <RiAddLine className="text-base" />
            Create an invoice
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
