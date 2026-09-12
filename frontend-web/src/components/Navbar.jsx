import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/scan/soil", label: "Scan soil" },
  { to: "/scan/disease", label: "Diagnose a plant" },
  { to: "/history", label: "History" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-white flex flex-col justify-between">
      <div>
        <div className="px-6 py-6">
          <span className="text-lg font-semibold text-forest-dark">
            KisanLens
          </span>
        </div>
        <nav className="flex flex-col gap-1 px-3">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-forest-light text-forest-dark"
                    : "text-muted hover:bg-forest-light hover:text-forest-dark"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="px-6 py-6 border-t border-border">
        {user && (
          <p className="text-sm text-muted mb-2 truncate">{user.email}</p>
        )}
        <button
          onClick={handleLogout}
          className="text-sm font-medium text-rust hover:underline"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
