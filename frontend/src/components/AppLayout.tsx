import { NavLink, Outlet } from "react-router-dom";
import type { Role } from "../types";

type AppLayoutProps = {
  role: Role;
  onLogout: () => void;
};

export function AppLayout({ role, onLogout }: AppLayoutProps) {
  return (
    <>
      <header className="topbar">
        <div>
          <strong>Vehical Booking</strong>
          <span className="muted">Role: {role}</span>
        </div>
        <nav className="nav-links">
          <NavLink
            to="/customers"
            className={({ isActive }: { isActive: boolean }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Customers
          </NavLink>
          <NavLink
            to="/vehicles"
            className={({ isActive }: { isActive: boolean }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Vehicles
          </NavLink>
          <NavLink
            to="/bookings"
            className={({ isActive }: { isActive: boolean }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Bookings
          </NavLink>
          {role === "admin" ? (
            <NavLink
              to="/dashboard"
              className={({ isActive }: { isActive: boolean }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Dashboard
            </NavLink>
          ) : null}
        </nav>
        <button type="button" className="danger" onClick={onLogout}>
          Logout
        </button>
      </header>
      <Outlet />
    </>
  );
}
