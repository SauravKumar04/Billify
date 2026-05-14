import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { RiArrowRightSLine } from "react-icons/ri";
import { fetchDashboardStats, fetchInvoices } from "../api/invoiceApi";
import LoadingState from "../components/LoadingState";
import formatCurrency from "../utils/formatCurrency";
import formatDate from "../utils/formatDate";
import usePageTitle from "../utils/usePageTitle";

const Dashboard = () => {
  usePageTitle("Dashboard");
  const today = new Date();
  const defaultMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
  const [stats, setStats] = useState({
    totalInvoices: 0,
    paidCount: 0,
    unpaidCount: 0,
    revenueThisMonth: 0,
    monthly: [],
    dayWise: [],
  });
  const [invoiceList, setInvoiceList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data: statsData } = await fetchDashboardStats(selectedMonth);
        setStats(statsData);
        if (statsData.selectedMonth) setSelectedMonth(statsData.selectedMonth);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [selectedMonth]);

  useEffect(() => {
    let isMounted = true;
    const loadInvoices = async () => {
      try {
        const { data } = await fetchInvoices();
        if (isMounted) setInvoiceList(data);
      } catch {
        if (isMounted) setInvoiceList([]);
      }
    };

    loadInvoices();
    return () => {
      isMounted = false;
    };
  }, []);

  const trendPoints = stats.dayWise || [];
  const weeklyRevenue = useMemo(() => {
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    return invoiceList
      .filter((invoice) => {
        if (invoice.status !== "paid") return false;
        const paidAt = new Date(invoice.updatedAt || invoice.createdAt);
        return paidAt >= sevenDaysAgo && paidAt <= now;
      })
      .reduce((sum, invoice) => sum + (invoice.total || 0), 0);
  }, [invoiceList]);

  const invoiceInsights = useMemo(() => {
    const totalsByClient = new Map();
    let pendingTotal = 0;

    invoiceList.forEach((invoice) => {
      const name = invoice.client?.name || "Unknown client";
      totalsByClient.set(name, (totalsByClient.get(name) || 0) + (invoice.total || 0));
      if (invoice.status !== "paid") pendingTotal += invoice.total || 0;
    });

    let topClient = "No client data";
    let topClientValue = 0;
    totalsByClient.forEach((value, name) => {
      if (value > topClientValue) {
        topClientValue = value;
        topClient = name;
      }
    });

    return {
      topClient,
      pendingTotal,
    };
  }, [invoiceList]);

  const paidInvoices = useMemo(
    () => invoiceList.filter((invoice) => invoice.status === "paid"),
    [invoiceList]
  );

  const [quickFilter, setQuickFilter] = useState("unpaid");
  const filteredInvoices = useMemo(() => {
    if (quickFilter === "paid") return invoiceList.filter((invoice) => invoice.status === "paid");
    if (quickFilter === "unpaid") return invoiceList.filter((invoice) => invoice.status !== "paid");
    return invoiceList;
  }, [invoiceList, quickFilter]);

  const recentInvoices = useMemo(() => {
    return [...filteredInvoices]
      .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
      .slice(0, 5);
  }, [filteredInvoices]);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState("");

  useEffect(() => {
    if (!recentInvoices.length) {
      setSelectedInvoiceId("");
      return;
    }
    const stillExists = recentInvoices.some((invoice) => invoice._id === selectedInvoiceId);
    if (!selectedInvoiceId || !stillExists) {
      setSelectedInvoiceId(recentInvoices[0]._id);
    }
  }, [selectedInvoiceId, recentInvoices]);

  const selectedInvoice = recentInvoices.find((invoice) => invoice._id === selectedInvoiceId) || recentInvoices[0] || null;
  const monthlyTrend = (stats.monthly || []).slice(-4);
  const monthlyMax = Math.max(...monthlyTrend.map((item) => item.total || 0), 1);
  const averageDaysToPay = useMemo(() => {
    if (!paidInvoices.length) return null;
    const totalDays = paidInvoices.reduce((sum, invoice) => {
      const start = new Date(invoice.issueDate || invoice.createdAt);
      const end = new Date(invoice.updatedAt || invoice.createdAt);
      const diffMs = Math.max(0, end - start);
      return sum + diffMs / (1000 * 60 * 60 * 24);
    }, 0);
    return Math.round(totalDays / paidInvoices.length);
  }, [paidInvoices]);
  const paidRate = stats.totalInvoices ? Math.round((stats.paidCount / stats.totalInvoices) * 100) : 0;

  if (loading) {
    return <LoadingState label="Loading dashboard analytics" variant="page" />;
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--muted)]">Workspace</p>
          <h1 className="text-3xl font-semibold tracking-tight text-[color:var(--ink)]">Invoices</h1>
          <p className="mt-1 text-sm text-[color:var(--muted)]">Track overdue balances, revenue, and active invoices.</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[2.1fr_1.1fr]">
        <div className="shell-card neo-border p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-3)] px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--muted)]">Overdue</p>
              <p className="mt-2 text-2xl font-semibold text-[color:var(--ink)]">{formatCurrency(invoiceInsights.pendingTotal)}</p>
              <p className="mt-1 text-xs text-[color:var(--muted)]">Unpaid + overdue</p>
            </div>
            <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-3)] px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--muted)]">Due next month</p>
              <p className="mt-2 text-2xl font-semibold text-[color:var(--ink)]">{formatCurrency(stats.revenueThisMonth || 0)}</p>
              <p className="mt-1 text-xs text-[color:var(--muted)]">Projected revenue</p>
            </div>
            <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-3)] px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--muted)]">Average time to pay</p>
              <p className="mt-2 text-2xl font-semibold text-[color:var(--ink)]">
                {averageDaysToPay === null ? "—" : `${averageDaysToPay} days`}
              </p>
              <p className="mt-1 text-xs text-[color:var(--muted)]">
                {averageDaysToPay === null ? "No paid invoices yet" : "Based on paid invoices"}
              </p>
            </div>
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between text-xs text-[color:var(--muted)]">
              <span>Monthly trend</span>
              <span>{selectedMonth}</span>
            </div>
            <div className="mt-3 grid gap-2">
              {monthlyTrend.length ? (
                monthlyTrend.map((item) => (
                  <div key={item.month || item.label} className="flex items-center gap-3">
                    <span className="w-12 text-[10px] font-semibold uppercase tracking-wide text-[color:var(--muted)]">
                      {item.month || item.label}
                    </span>
                    <div className="h-2 flex-1 rounded-full bg-[color:var(--surface-3)]">
                      <div
                        className="h-2 rounded-full bg-[color:var(--accent)]"
                        style={{ width: `${Math.max(12, (item.total || 0) / monthlyMax * 100)}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[color:var(--muted)]">No monthly activity yet.</p>
              )}
            </div>
          </div>

          <div className="mt-5 h-24">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendPoints} margin={{ top: 6, right: 6, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="dayTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#b7ff3c" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#0a0f14" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255, 255, 255, 0.08)" vertical={false} horizontal={false} />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  minTickGap={24}
                  tick={{ fill: "#93a0b8", fontSize: 10 }}
                />
                <YAxis hide />
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  cursor={{ stroke: "rgba(183, 255, 60, 0.4)", strokeWidth: 1, strokeDasharray: "3 3" }}
                  contentStyle={{ borderRadius: 12, borderColor: "rgba(255, 255, 255, 0.08)", fontSize: 12, background: "#10161f", color: "#e7eefc" }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#b7ff3c"
                  strokeWidth={2}
                  fill="url(#dayTrend)"
                  dot={false}
                  activeDot={{ r: 3, fill: "#b7ff3c", stroke: "#0a0f14", strokeWidth: 1 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {!trendPoints.length ? (
            <p className="mt-2 text-xs text-[color:var(--muted)]">No trend data yet for this month.</p>
          ) : null}

          <div className="mt-4 flex items-center gap-2">
            {recentInvoices.map((invoice) => (
              <span
                key={invoice._id}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[color:var(--line)] bg-[color:var(--surface-2)] text-xs font-semibold text-[color:var(--accent)]"
                title={invoice.client?.name || "Client"}
              >
                {(invoice.client?.name || "C").charAt(0).toUpperCase()}
              </span>
            ))}
          </div>
        </div>

        <div className="shell-card neo-border p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--muted)]">Quick insights</p>
          <div className="mt-4 grid gap-3">
            <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-3)] px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[color:var(--muted)]">Weekly revenue</p>
              <p className="mt-2 text-2xl font-semibold text-[color:var(--ink)]">{formatCurrency(weeklyRevenue)}</p>
              <p className="mt-1 text-xs text-[color:var(--muted)]">Last 7 days (paid)</p>
            </div>
            <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-3)] px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[color:var(--muted)]">Top client</p>
              <p className="mt-2 text-lg font-semibold text-[color:var(--ink)]">{invoiceInsights.topClient}</p>
              <p className="mt-1 text-xs text-[color:var(--muted)]">By billed total</p>
            </div>
            <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-3)] px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[color:var(--muted)]">Pending amount</p>
              <p className="mt-2 text-2xl font-semibold text-[color:var(--ink)]">{formatCurrency(invoiceInsights.pendingTotal)}</p>
              <p className="mt-1 text-xs text-[color:var(--muted)]">Unpaid + overdue</p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-3)] px-4 py-3">
            <div className="flex items-center justify-between text-xs text-[color:var(--muted)]">
              <span>Payment split</span>
              <span>{stats.paidCount} paid</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-[color:var(--surface-2)]">
              <div
                className="h-2 rounded-full bg-[color:var(--accent)]"
                style={{ width: `${paidRate}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_1.9fr]">
        <div className="shell-card neo-border p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--muted)]">Recent invoices</h3>
            <Link to="/invoices" className="btn-muted px-3 py-1 text-xs">View all</Link>
          </div>
          <div className="mt-4 space-y-2">
            {recentInvoices.length ? (
              recentInvoices.map((invoice) => (
                <button
                  key={invoice._id}
                  type="button"
                  onClick={() => setSelectedInvoiceId(invoice._id)}
                  className={`w-full rounded-2xl border px-3 py-3 text-left transition ${
                    selectedInvoiceId === invoice._id
                      ? "border-[color:var(--accent)] bg-[color:var(--surface-2)]"
                      : "border-[color:var(--line)] bg-[color:var(--surface-3)] hover:border-[color:var(--accent)]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[color:var(--ink)]">{invoice.invoiceNumber}</p>
                      <p className="text-xs text-[color:var(--muted)]">{invoice.client?.name || "Client"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-[color:var(--ink)]">{formatCurrency(invoice.total)}</p>
                      <p className="text-xs text-[color:var(--muted)]">Due {formatDate(invoice.dueDate)}</p>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <p className="text-sm text-[color:var(--muted)]">
                {quickFilter === "paid" ? "No paid invoices yet." : "No unpaid invoices yet."}
              </p>
            )}
          </div>
        </div>

        <div className="shell-card neo-border p-5">
          {selectedInvoice ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--muted)]">Invoice details</p>
                  <div className="mt-1 flex items-center gap-2">
                    <h3 className="text-2xl font-semibold text-[color:var(--ink)]">{selectedInvoice.invoiceNumber}</h3>
                    <span className="rounded-full border border-[color:var(--line)] bg-[color:var(--surface-3)] px-3 py-1 text-xs font-semibold text-[color:var(--muted)]">
                      {selectedInvoice.status}
                    </span>
                  </div>
                </div>
                <Link to={`/invoices/${selectedInvoice._id}`} className="btn-primary">View invoice</Link>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-3)] px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--muted)]">Company</p>
                  <p className="mt-2 text-base font-semibold text-[color:var(--ink)]">Billify</p>
                </div>
                <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-3)] px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--muted)]">Customer</p>
                  <p className="mt-2 text-base font-semibold text-[color:var(--ink)]">{selectedInvoice.client?.name || "Client"}</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {(selectedInvoice.lineItems || []).slice(0, 3).map((item, index) => (
                  <div key={`${item.description}-${index}`} className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-3)] px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--muted)]">{item.description || "Line item"}</p>
                    <p className="mt-2 text-sm font-semibold text-[color:var(--ink)]">{formatCurrency(item.amount)}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-3)] px-4 py-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--muted)]">Balance due</p>
                  <p className="mt-2 text-lg font-semibold text-[color:var(--ink)]">{formatCurrency(selectedInvoice.total)}</p>
                </div>
                <Link to={`/invoices/${selectedInvoice._id}`} className="btn-muted px-3 py-1 text-xs">
                  View details <RiArrowRightSLine className="text-base" />
                </Link>
              </div>
            </div>
          ) : (
            <p className="text-sm text-[color:var(--muted)]">Select an invoice to see details.</p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <div className="rounded-full border border-[color:var(--line)] bg-[color:var(--surface-2)] p-1">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setQuickFilter("paid")}
              className={`rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-wide transition ${
                quickFilter === "paid"
                  ? "bg-[color:var(--accent)] text-[#0b0f14]"
                  : "text-[color:var(--muted)]"
              }`}
            >
              Paid {stats.paidCount}
            </button>
            <button
              type="button"
              onClick={() => setQuickFilter("unpaid")}
              className={`rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-wide transition ${
                quickFilter === "unpaid"
                  ? "bg-[color:var(--accent)] text-[#0b0f14]"
                  : "text-[color:var(--muted)]"
              }`}
            >
              Unpaid {stats.unpaidCount}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
