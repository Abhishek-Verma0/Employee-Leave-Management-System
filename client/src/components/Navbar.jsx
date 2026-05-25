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
  const [hovered, setHovered] = useState(null);

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
    <>
      <nav
        className="border-b px-4 py-3 sm:px-6"
        style={{
          backgroundColor: "var(--bg-nav)",
          borderColor: "var(--border-color)",
          boxShadow: "0 1px 3px var(--shadow-color)",
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link
            to={user ? getDashboardPath() : "/"}
            className="text-lg font-bold tracking-tight sm:text-xl"
            style={{ color: "var(--text-primary)" }}
          >
            <span style={{ color: "#6366f1" }}>Swiftly</span>
          </Link>

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
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
              style={{
                color: "var(--text-secondary)",
                backgroundColor: "var(--bg-secondary)",
              }}
              title="Toggle theme"
            >
              {dark ? <FiSun size={16} /> : <FiMoon size={16} />}
              <span>Theme</span>
            </button>

            {user ? (
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-white transition-colors"
                style={{ backgroundColor: "#6366f1" }}
              >
                <FiLogOut size={14} />
                Logout
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  onMouseEnter={() => setHovered("login")}
                  onMouseLeave={() => setHovered(null)}
                  className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold border border-indigo-500 transition-all duration-300 ${
                    hovered === "login"
                      ? "bg-indigo-500 text-white"
                      : "bg-transparent text-indigo-500"
                  }`}
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onMouseEnter={() => setHovered("register")}
                  onMouseLeave={() => setHovered(null)}
                  className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold border border-indigo-500 transition-all duration-300 ${
                    hovered === "register"
                      ? "bg-indigo-500 text-white"
                      : "bg-transparent text-indigo-500"
                  }`}
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          <button
            className="flex h-11 w-11 items-center justify-center rounded-xl border transition-colors sm:hidden"
            style={{
              color: "var(--text-primary)",
              borderColor: "var(--border-color)",
              backgroundColor: "var(--bg-secondary)",
            }}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
          >
            {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <>
          <aside
            className="fixed inset-y-0 left-0 z-50 w-72 max-w-full transform border-r bg-[var(--bg-nav)] px-4 py-5 transition-transform duration-300 sm:hidden"
            style={{ borderColor: "var(--border-color)", boxShadow: "0 0 40px rgba(15, 23, 42, 0.08)" }}
          >
            <div className="flex items-center justify-between gap-4 border-b pb-5" style={{ borderColor: "var(--border-color)" }}>
              <Link
                to={user ? getDashboardPath() : "/"}
                className="text-xl font-bold tracking-tight"
                style={{ color: "var(--text-primary)" }}
                onClick={() => setMenuOpen(false)}
              >
                <span style={{ color: "#6366f1" }}>Swiftly</span>
              </Link>

              <button
                className="rounded-xl p-2 text-xl"
                style={{ color: "var(--text-primary)" }}
                onClick={() => setMenuOpen(false)}
                aria-label="Close navigation"
              >
                <FiX />
              </button>
            </div>

            <div className="mt-6 flex flex-col gap-4">
              {user && (
                <span
                  className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium uppercase"
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
                className="inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors"
                style={{
                  color: "var(--text-primary)",
                  backgroundColor: "var(--bg-secondary)",
                }}
                title="Toggle theme"
              >
                {dark ? <FiSun size={18} /> : <FiMoon size={18} />}
                <span>Theme</span>
              </button>

              {user ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-white transition-colors"
                  style={{ backgroundColor: "#6366f1" }}
                >
                  <FiLogOut size={16} />
                  Logout
                </button>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    onMouseEnter={() => setHovered("login")}
                    onMouseLeave={() => setHovered(null)}
                    className={`inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold border transition-all duration-300 ${
                      hovered === "login"
                        ? "border-indigo-500 bg-indigo-500 text-white"
                        : "border-indigo-500 bg-transparent text-indigo-500"
                    }`}
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    onMouseEnter={() => setHovered("register")}
                    onMouseLeave={() => setHovered(null)}
                    className={`inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold border transition-all duration-300 ${
                      hovered === "register"
                        ? "border-indigo-500 bg-indigo-500 text-white"
                        : "border-indigo-500 bg-transparent text-indigo-500"
                    }`}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </aside>

          <div
            className="fixed inset-0 z-40 sm:hidden"
            onClick={() => setMenuOpen(false)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setMenuOpen(false);
              }
            }}
            aria-label="Close sidebar overlay"
            style={{ backgroundColor: 'rgba(15,23,42,0.3)' }}
          />
        </>
      )}
    </>
  );
};

export default Navbar;