import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import toast from "react-hot-toast";
import { FiSun, FiMoon, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const getDashboardPath = () => {
    if (!user) return "/";
    return `/${user.role}`;
  };

  return (
    <nav
      className="sticky top-0 z-50 border-b px-4 py-3 sm:px-6"
      style={{
        backgroundColor: "var(--bg-nav)",
        borderColor: "var(--border-color)",
        boxShadow: "0 1px 3px var(--shadow-color)",
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo */}
        <Link
          to={user ? getDashboardPath() : "/"}
          className="text-lg font-bold tracking-tight sm:text-xl"
          style={{ color: "var(--text-primary)" }}
        >
          <span style={{ color: "#6366f1" }}>Leave</span>Manager
        </Link>

        {/* Mobile menu toggle */}
        <button
          className="block cursor-pointer text-xl sm:hidden"
          style={{ color: "var(--text-primary)" }}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* Desktop nav */}
        <div className="hidden items-center gap-3 sm:flex">
          {user && (
            <span
              className="rounded-full px-3 py-1 text-xs font-medium uppercase"
              style={{
                backgroundColor: "var(--bg-secondary)",
                color: "var(--text-secondary)",
              }}
            >
              {user.role}
            </span>
          )}

          <button
            onClick={toggleTheme}
            className="cursor-pointer rounded-lg p-2 transition-colors"
            style={{
              color: "var(--text-secondary)",
              backgroundColor: "var(--bg-secondary)",
            }}
            title="Toggle theme"
          >
            {dark ? <FiSun size={16} /> : <FiMoon size={16} />}
          </button>

          {user ? (
            <button
              onClick={handleLogout}
              className="flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-white transition-colors"
              style={{ backgroundColor: "#6366f1" }}
            >
              <FiLogOut size={14} />
              Logout
            </button>
          ) : (
            <div className="flex gap-2">
              <Link
                to="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                style={{
                  color: "#6366f1",
                  border: "1px solid #6366f1",
                }}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
                style={{ backgroundColor: "#6366f1" }}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="mt-3 flex flex-col gap-2 border-t pt-3 sm:hidden"
          style={{ borderColor: "var(--border-color)" }}
        >
          {user && (
            <span
              className="self-start rounded-full px-3 py-1 text-xs font-medium uppercase"
              style={{
                backgroundColor: "var(--bg-secondary)",
                color: "var(--text-secondary)",
              }}
            >
              {user.role}
            </span>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="cursor-pointer rounded-lg p-2 transition-colors"
              style={{
                color: "var(--text-secondary)",
                backgroundColor: "var(--bg-secondary)",
              }}
            >
              {dark ? <FiSun size={16} /> : <FiMoon size={16} />}
            </button>

            {user ? (
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-white"
                style={{ backgroundColor: "#6366f1" }}
              >
                <FiLogOut size={14} />
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-4 py-2 text-sm font-medium"
                  style={{ color: "#6366f1", border: "1px solid #6366f1" }}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-white"
                  style={{ backgroundColor: "#6366f1" }}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
