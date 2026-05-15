import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  RiCheckLine,
  RiFlashlightLine,
  RiLogoutCircleRLine,
  RiShieldCheckLine,
  RiSparkling2Line,
  RiStackLine,
  RiTimerFlashLine,
} from "react-icons/ri";
import { useAuth } from "../context/useAuth";
import usePageTitle from "../utils/usePageTitle";
import ConfirmModal from "../components/ConfirmModal";

const landingNavItems = [
  { to: "#features", label: "Features" },
  { to: "#about", label: "About" },
  { to: "#start", label: "Start" },
];

const bentoCards = [
  {
    icon: RiSparkling2Line,
    title: "Brand-ready PDFs",
    description: "Your logo, colors, and payment details appear consistently on every invoice.",
  },
  {
    icon: RiTimerFlashLine,
    title: "Faster follow-ups",
    description: "Send reminders with one click and keep overdue invoices visible.",
  },
  {
    icon: RiShieldCheckLine,
    title: "Secure by design",
    description: "Data stays organized with role-safe access and controlled sharing.",
  },
  {
    icon: RiStackLine,
    title: "Client directory",
    description: "Store contacts, GSTIN, and billing details in one tidy library.",
  },
  {
    icon: RiFlashlightLine,
    title: "Revenue clarity",
    description: "Understand cash flow with real-time status summaries.",
  },
  {
    icon: RiCheckLine,
    title: "Smart defaults",
    description: "Reusable line items and saved drafts keep you in flow.",
  },
];

const steps = [
  {
    title: "Build the invoice",
    description: "Choose a client, add line items, and keep GST consistent automatically.",
  },
  {
    title: "Send with confidence",
    description: "Share a branded PDF or portal link without leaving your workspace.",
  },
  {
    title: "Stay on top of cash",
    description: "Track payment status and follow up quickly when needed.",
  },
];

const Landing = () => {
  usePageTitle("Home");
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [motionTick, setMotionTick] = useState(0);
  const [isHeaderCompact, setIsHeaderCompact] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setMotionTick((value) => value + 1);
    }, 45);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsHeaderCompact(window.scrollY > 28);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const heroCounters = useMemo(
    () => [
      {
        label: "Paid",
        value: Math.round(128 + Math.sin(motionTick / 12) * 14),
        description: "Invoices cleared this month",
        tone: "accent",
      },
      {
        label: "Unpaid",
        value: Math.round(34 + Math.sin((motionTick + 22) / 11) * 8),
        description: "Invoices awaiting payment",
        tone: "muted",
      },
      {
        label: "Overdue",
        value: Math.round(9 + Math.sin((motionTick + 45) / 9) * 4),
        description: "Invoices needing follow-up",
        tone: "muted",
      },
    ],
    [motionTick]
  );

  return (
    <main className="landing min-h-screen">
      <div className="landing-bg" aria-hidden="true">
        <span className="landing-orb orb-a" />
        <span className="landing-orb orb-b" />
        <span className="landing-orb orb-c" />
      </div>

      <header
        className={`relative z-40 mx-2 mb-5 rounded-full border border-(--line) bg-(--surface)/90 px-2 py-1.5 shadow-[0_16px_40px_-28px_rgba(0,0,0,0.8)] backdrop-blur transition-all duration-300 sm:mx-3 sm:px-3 sm:py-2 lg:sticky lg:top-4 lg:mx-8 lg:mt-4 lg:px-4 lg:py-2.5 ${
          isHeaderCompact ? "lg:mx-auto lg:max-w-5xl lg:py-2 lg:shadow-[0_14px_30px_-24px_rgba(0,0,0,0.8)]" : "lg:max-w-none"
        }`}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 lg:gap-4">
          <div className="flex items-center gap-2 lg:gap-3">
            <img
              src="/billifylogo.png"
              alt="Billify logo"
              className={`w-auto rounded-2xl border border-(--line) bg-(--surface-2) object-contain px-2 transition-all duration-300 ${
                isHeaderCompact ? "h-8 max-w-14 sm:h-9 sm:max-w-16" : "h-9 max-w-16 sm:h-11 sm:max-w-22"
              }`}
            />
            <span className="hidden items-center text-sm font-semibold tracking-tight text-(--ink) lg:inline-flex">
              <span className="brand-word text-(--accent) drop-shadow-[0_0_14px_rgba(183,255,60,0.45)]">Billify</span>
            </span>
          </div>

          <div className="flex w-full max-w-[16rem] items-center justify-center sm:max-w-[18rem] md:max-w-[20rem] lg:max-w-88">
            <nav className="flex w-full items-center justify-between gap-1 rounded-full border border-(--line) bg-(--surface-2) px-1 py-1 sm:gap-1.5 sm:px-1.5">
              {landingNavItems.map((item) => (
                <a
                  key={item.label}
                  href={item.to}
                  className="flex-1 whitespace-nowrap rounded-full px-1.5 py-1.25 text-center text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-(--muted) transition hover:text-(--ink) sm:px-2 sm:py-1.5 sm:text-xs lg:flex-none lg:px-3.5 lg:tracking-wide"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="flex items-center justify-end gap-2">
            {isAuthenticated ? (
              <>
                <button
                  type="button"
                  className="hidden items-center gap-2 rounded-full border border-(--accent) bg-(--accent) px-3 py-2 text-xs font-semibold text-[#0b0f14] transition hover:brightness-105 min-[1118px]:inline-flex"
                  onClick={() => navigate("/dashboard")}
                >
                  Open Dashboard
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full border border-(--line) bg-(--surface-2) px-2.5 py-2 text-(--ink) transition hover:border-(--accent)"
                  onClick={() => setConfirmOpen(true)}
                  aria-label="Logout"
                >
                  <RiLogoutCircleRLine className="text-base sm:text-lg" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hidden sm:inline-flex btn-muted">Login</Link>
                <Link to="/register" className="hidden sm:inline-flex btn-primary">Start free</Link>
              </>
            )}
          </div>
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

      <section className="landing-section mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8 lg:pt-14">
        <div className="space-y-6">
          <span className="landing-badge">Freelancer-first billing</span>
          <h2 className="landing-title">Clear invoicing that keeps payments, clients, and GST organized.</h2>
          <p className="landing-subtitle">
            Billify gives you a structured billing workspace with cleaner tracking, faster follow-ups, and fewer manual steps.
          </p>
          <div className="flex flex-wrap gap-3">
            {isAuthenticated ? (
              <Link to="/invoices/new" className="btn-primary">Create invoice</Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary">Start free</Link>
                <Link to="/login" className="btn-muted">View your workspace</Link>
              </>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "GST-ready invoices with clean totals",
              "Share branded PDFs and portal links",
              "Track paid, unpaid, and overdue",
              "Reusable clients and saved drafts",
            ].map((label) => (
              <div key={label} className="landing-pill">
                <RiCheckLine className="text-(--accent)" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="landing-mockup reveal">
          <div className="landing-mockup-frame">
            <div className="landing-mockup-bar">
              <span />
              <span />
              <span />
            </div>
            <div className="landing-mockup-screen">
              <div className="landing-mockup-glow" />
              <div className="landing-mockup-content">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-(--muted)">Billing overview</p>
                    <h3 className="mt-2 text-2xl font-semibold text-(--ink)">Numbers that tell you what needs attention now.</h3>
                  </div>
                </div>

                <p className="mt-3 max-w-md text-sm text-(--muted)">
                  Track paid, unpaid, and overdue work at a glance so you can act on the right invoice without digging through lists.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {heroCounters.map((counter, index) => (
                    <div key={counter.label} className="landing-mini-card landing-mini-card-animated">
                      <p className="text-xs font-semibold uppercase tracking-wide text-(--muted)">{counter.label}</p>
                      <p className={`mt-3 text-4xl font-semibold ${index % 2 === 0 ? "landing-counter-up" : "landing-counter-down"}`}>
                        {String(counter.value).padStart(3, "0")}
                      </p>
                      <p className="mt-2 text-sm text-(--muted)">{counter.description}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 landing-mini-card">
                  <p className="text-xs font-semibold uppercase tracking-wide text-(--muted)">Quality provided</p>
                  <p className="mt-2 text-sm text-(--ink)">Faster review, clearer prioritization, and less time spent chasing the wrong invoice.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="landing-section mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-(--muted)">Features</p>
          <h3 className="text-3xl font-semibold tracking-tight text-(--ink)">Everything you need to invoice with confidence.</h3>
          <p className="mx-auto max-w-2xl text-sm text-(--muted)">
            Focus on delivery while Billify handles the structure, status, and follow-ups.
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {bentoCards.map((card, index) => (
            <article key={card.title} className={`landing-card p-5 reveal delay-${(index % 3) + 1}`}>
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-(--line) bg-(--surface-2) text-(--accent)">
                <card.icon className="text-lg" />
              </div>
              <h4 className="text-base font-semibold text-(--ink)">{card.title}</h4>
              <p className="mt-2 text-sm text-(--muted)">{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="about" className="landing-section mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-(--muted)">About Billify</p>
          <h3 className="text-3xl font-semibold tracking-tight text-(--ink)">Built to make freelance billing feel premium.</h3>
          <p className="text-sm text-(--muted)">
            A focused workflow that keeps client data, GST totals, and follow-ups crisp and organized.
          </p>
          <div className="mt-4 grid gap-3">
            {steps.map((step, index) => (
              <article key={step.title} className="landing-card p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-(--muted)">Step {index + 1}</p>
                <h4 className="mt-2 text-base font-semibold text-(--ink)">{step.title}</h4>
                <p className="mt-2 text-sm text-(--muted)">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="landing-card overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=1400&q=80"
            alt="Freelancer reviewing invoices on a laptop"
            className="h-72 w-full object-cover sm:h-96"
            loading="lazy"
          />
        </div>
      </section>

      <section id="start" className="landing-section mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="landing-card overflow-hidden">
          <div className="grid gap-0 lg:grid-cols-2">
            <div className="p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-(--muted)">Ready when you are</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Make every invoice feel premium.</h3>
              <p className="mt-3 max-w-md text-sm text-(--muted)">
                Billify keeps your client communication polished and your billing workflow predictable.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                {isAuthenticated ? (
                  <Link to="/dashboard" className="btn-primary">Go to workspace</Link>
                ) : (
                  <>
                    <Link to="/register" className="btn-primary">Create free account</Link>
                    <Link to="/login" className="btn-muted">See existing invoices</Link>
                  </>
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

      <footer className="landing-section mt-10 border-t border-(--line) bg-(--surface)/80">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-5">
          <div>
            <p className="text-sm font-semibold text-(--ink)">Billify</p>
            <p className="text-sm text-(--muted)">Polished invoicing for independent professionals.</p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-(--muted)">
            {!isAuthenticated && (
              <>
                <Link to="/login" className="hover:text-(--ink)">Login</Link>
                <Link to="/register" className="hover:text-(--ink)">Register</Link>
                <span className="text-(--muted)">|</span>
              </>
            )}
            <span>© {new Date().getFullYear()} Billify</span>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Landing;
