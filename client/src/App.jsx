import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { useAuth } from "./context/useAuth";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import NewInvoice from "./pages/NewInvoice";
import Invoices from "./pages/Invoices";
import InvoiceDetails from "./pages/InvoiceDetails";
import Settings from "./pages/Settings";
import Landing from "./pages/Landing";
import Portal from "./pages/Portal";

const ProtectedRoute = () => {
  const { loading, isAuthenticated } = useAuth();
  if (loading) return <p className="p-6 text-sm text-[color:var(--muted)]">Preparing your workspace...</p>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
};

const AppLayout = () => (
  <div className="min-h-screen">
    <Navbar />
    <div className="md:hidden">
      <Sidebar />
    </div>
    <main className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
      <Outlet />
    </main>
  </div>
);

const App = () => (
  <>
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          borderRadius: "12px",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          color: "#e7eefc",
          background: "#10161f",
        },
      }}
    />
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/portal/:token" element={<Portal />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/invoices/new" element={<NewInvoice />} />
          <Route path="/invoices/:id" element={<InvoiceDetails />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </>
);

export default App;
