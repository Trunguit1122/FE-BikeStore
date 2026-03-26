import { NavLink } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { cn } from "../../utils/helpers";

const commonLinks = [
  { to: "/orders", label: "Orders" },
  { to: "/customers", label: "Customers" },
  { to: "/products", label: "Products" },
  { to: "/profile", label: "My Profile" },
];

const adminLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/brands", label: "Brands" },
  { to: "/categories", label: "Categories" },
  { to: "/staffs", label: "Staffs" },
  { to: "/statistics", label: "Statistics" },
];

export default function Sidebar() {
  const { isAdmin } = useAuth();
  const links = isAdmin ? [...adminLinks, ...commonLinks] : commonLinks;

  return (
    <aside className="hidden w-[300px] flex-col bg-surface-container-low px-6 py-8 lg:flex">
      <div className="mb-10">
        <p className="font-headline text-2xl font-black uppercase tracking-[-0.03em] text-primary">Velos Atelier</p>
        <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">Mechanical Ledger</p>
      </div>

      <nav className="space-y-1.5">
        {links.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "block rounded-xl px-4 py-3 text-[13px] font-semibold uppercase tracking-[0.08em] transition",
                isActive
                  ? "bg-surface-container-lowest text-primary shadow-[inset_0_0_0_1px_rgba(194,199,209,0.32)]"
                  : "text-on-surface-variant hover:bg-surface-container-high hover:text-primary"
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto space-y-3 pt-8">
        <button className="w-full rounded-xl bg-primary-gradient px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white transition active:scale-[0.98]">
          New Work Order
        </button>
        <button className="w-full rounded-xl bg-surface-container-high px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-on-surface-variant transition hover:text-primary">
          Support
        </button>
      </div>
    </aside>
  );
}
