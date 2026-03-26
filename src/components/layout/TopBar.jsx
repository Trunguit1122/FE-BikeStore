import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export default function TopBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between bg-surface-container-lowest/85 px-4 shadow-sm backdrop-blur lg:px-8">
      <div className="flex items-center gap-4">
        <h1 className="font-headline text-xl font-extrabold tracking-tight text-primary">Bike Store Console</h1>
        <div className="glass-panel hidden min-w-[320px] items-center gap-2 rounded-full px-4 py-2 lg:flex">
          <span className="text-xs uppercase tracking-[0.16em] text-on-surface-variant">Search</span>
          <input
            className="w-full bg-transparent text-sm text-on-surface outline-none placeholder:text-on-surface-variant"
            placeholder="Products, orders, staff..."
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-semibold text-on-surface">{user?.first_name} {user?.last_name}</p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">{user?.role}</p>
        </div>
        <button onClick={handleLogout} className="rounded-xl bg-primary-gradient px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white transition active:scale-[0.98]">
          Logout
        </button>
      </div>
    </header>
  );
}
