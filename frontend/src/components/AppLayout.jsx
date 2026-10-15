import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  Truck,
  Users,
  Wrench,
} from "lucide-react";

function AppLayout() {
  const navigate = useNavigate();

  async function handleLogout() {
    await fetch(
      "http://localhost:8080/api/auth/logout",
      {
        method: "POST",
        credentials: "include",
      }
    );

    navigate("/");
  }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          Fleet<span>Forge</span>
        </div>

        <nav className="sidebar-navigation">
          <NavLink to="/dashboard">
            <LayoutDashboard size={19} />
            Dashboard
          </NavLink>

          <NavLink to="/vehicles">
            <Truck size={19} />
            Vehicles
          </NavLink>

          <NavLink to="/drivers">
            <Users size={19} />
            Drivers
          </NavLink>

          <NavLink to="/assignments">
            <ClipboardList size={19} />
            Assignments
          </NavLink>

          <NavLink to="/maintenance">
            <Wrench size={19} />
            Maintenance
          </NavLink>

          <NavLink to="/reports">
            <FileText size={19} />
            Reports
          </NavLink>
        </nav>

        <button
          className="logout-button"
          type="button"
          onClick={handleLogout}
        >
          <LogOut size={19} />
          Log Out
        </button>
      </aside>

      <div className="page-content">
        <Outlet />
      </div>
    </div>
  );
}

export default AppLayout;