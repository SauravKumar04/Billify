import { NavLink } from "react-router-dom";
import {
  RiDashboardLine,
  RiGroupLine,
  RiFileList3Line,
  RiSettings3Line,
  RiAddCircleLine,
} from "react-icons/ri";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: RiDashboardLine, end: true },
  { to: "/clients", label: "Clients", icon: RiGroupLine },
  { to: "/invoices/new", label: "New Invoice", icon: RiAddCircleLine },
  { to: "/invoices", label: "Invoices", icon: RiFileList3Line, end: true },
  { to: "/settings", label: "Settings", icon: RiSettings3Line },
];

const Sidebar = () => (
  <aside className="w-full border-b border-[color:var(--line)] bg-[color:var(--surface)]">
    <nav className="flex gap-2 overflow-x-auto px-4 py-3">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            `inline-flex min-w-max items-center gap-2.5 rounded-full border px-3 py-2 text-sm font-medium transition ${
              isActive
                ? "border-[color:var(--accent)] bg-[color:var(--accent)] text-[#0b0f14]"
                : "border-[color:var(--line)] bg-[color:var(--surface-2)] text-[color:var(--ink)] hover:border-[color:var(--accent)]"
            }`
          }
        >
          <item.icon className="text-base" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  </aside>
);

export default Sidebar;
