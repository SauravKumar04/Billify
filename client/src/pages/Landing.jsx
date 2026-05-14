import { Link } from "react-router-dom";
import { useState } from "react";
import { RiCheckLine, RiLineChartLine, RiShieldCheckLine } from "react-icons/ri";
import { useAuth } from "../context/useAuth";
import usePageTitle from "../utils/usePageTitle";
import ConfirmModal from "../components/ConfirmModal";

const features = [
  {
    icon: RiLineChartLine,
    title: "Smart Invoice Operations",
    description: "Create GST-ready invoices, track payment health, and monitor revenue with clean analytics.",
  },
  {
    icon: RiShieldCheckLine,
    title: "Reliable Billing Workflow",
    description: "Email, download, and manage invoices securely in one focused workflow designed for freelancers.",
  },
  {
    icon: RiCheckLine,
    title: "Minimal Professional UI",
    description: "A fast, distraction-free interface with responsive layouts and premium typography.",
  },
];

const workflows = [
  {
    title: "Create in minutes",
    description: "Set up clients and line items with GST fields that stay reusable for future invoices.",
  },
  {
    title: "Share instantly",
    description: "Export polished PDFs and send directly over email without switching tools.",
  },
  {
    title: "Track payment health",
    description: "Watch due invoices and payment status at a glance from your dashboard.",
  },
];

const Landing = () => {
  usePageTitle("Home");
  const { isAuthenticated, logout } = useAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <main className="min-h-screen">
      <header className="border-b border-[color:var(--line)] bg-[color:var(--surface)]/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <img
              src="/billifylogo.png"
              alt="Billify logo"
              className="h-11 w-auto max-w-22 rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-2)] object-contain px-2"
            />
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-[color:var(--ink)]"><span className="brand-word">Billify</span></h1>
              <p className="text-xs text-[color:var(--muted)]">Invoicing made simple for modern freelancers</p>
            </div>
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link to="/dashboard" className="btn-primary">Open Dashboard</Link>
              <button type="button" className="btn-muted" onClick={() => setConfirmOpen(true)}>
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </header>
      <ConfirmModal
        isOpen={confirmOpen}
        title="Log out of Billify?"
        description="You will need to sign in again to access your workspace."
        confirmText="Log out"
        confirmClassName="btn-danger"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          logout();
          setConfirmOpen(false);
        }}
      />

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
        <div>
          <p className="mb-3 neo-pill">
            Micro SaaS for Freelancers
          </p>
          <h2 className="text-4xl font-semibold tracking-tight text-[color:var(--ink)] sm:text-5xl">
            Professional invoicing with a bold, neon-finance workflow.
          </h2>
          <p className="mt-4 max-w-xl text-base text-[color:var(--muted)]">
            Billify helps freelancers manage clients, generate tax-ready invoices, send email-ready PDFs, and keep every payment organized.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {isAuthenticated ? (
              <Link to="/invoices/new" className="btn-primary">Create Invoice</Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary">Start Free</Link>
                <Link to="/login" className="btn-muted">I already have an account</Link>
              </>
            )}
          </div>
        </div>

        <div className="shell-card p-6 sm:p-7">
          <div className="grid gap-3">
            {features.map((feature) => (
              <article key={feature.title} className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-3)] p-4">
                <div className="mb-2 inline-flex rounded-lg border border-[color:var(--line)] bg-[color:var(--surface-2)] p-2 text-[color:var(--accent)]">
                  <feature.icon className="text-lg" />
                </div>
                <h3 className="text-base font-semibold tracking-tight text-[color:var(--ink)]">{feature.title}</h3>
                <p className="mt-1 text-sm text-[color:var(--muted)]">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface)]">
          <img
            src="https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=1400&q=80"
            alt="Freelancer reviewing invoices on a laptop"
            className="h-72 w-full object-cover sm:h-80"
            loading="lazy"
          />
        </div>
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--muted)]">How it works</p>
          <h3 className="text-3xl font-semibold tracking-tight text-[color:var(--ink)]">A confident billing flow from draft to paid.</h3>
          <div className="space-y-3 pt-2">
            {workflows.map((item, index) => (
              <article key={item.title} className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--muted)]">Step {index + 1}</p>
                <h4 className="mt-1 text-base font-semibold text-[color:var(--ink)]">{item.title}</h4>
                <p className="mt-1 text-sm text-[color:var(--muted)]">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--ink)]">
          <div className="grid gap-0 lg:grid-cols-2">
            <div className="p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--accent)]">Why Billify</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Built for independent professionals.</h3>
              <p className="mt-3 max-w-md text-sm text-[color:var(--muted)]">
                Stay focused on your work while Billify handles clean documents, organized records, and reliable follow-up.
              </p>
              <div className="mt-5">
                {isAuthenticated ? (
                  <Link to="/dashboard" className="btn-muted border-[color:var(--line)] bg-[color:var(--surface-2)] text-[color:var(--ink)] hover:border-[color:var(--accent)]">
                    Go to workspace
                  </Link>
                ) : (
                  <Link to="/register" className="btn-muted border-[color:var(--line)] bg-[color:var(--surface-2)] text-[color:var(--ink)] hover:border-[color:var(--accent)]">
                    Create free account
                  </Link>
                )}
              </div>
            </div>
            <img
              src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1400&q=80"
              alt="Invoice paperwork and notebook on desk"
              className="h-64 w-full object-cover lg:h-full"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <footer className="mt-14 border-t border-[color:var(--line)] bg-[color:var(--surface)]/80">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-sm font-semibold text-[color:var(--ink)]">Billify</p>
            <p className="text-sm text-[color:var(--muted)]">Minimal invoicing for modern freelancers.</p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-[color:var(--muted)]">
            <Link to="/login" className="hover:text-[color:var(--ink)]">Login</Link>
            <Link to="/register" className="hover:text-[color:var(--ink)]">Register</Link>
            <span className="text-[color:var(--muted)]">|</span>
            <span>© {new Date().getFullYear()} Billify</span>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Landing;
