import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiMail, FiLock, FiAlertCircle } from "react-icons/fi";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(email, password);
      navigate(`/${user.role}`);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-57px)] items-center justify-center px-4 py-8">
      <div
        className="w-full max-w-sm rounded-xl border p-6"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-color)",
        }}
      >
        <h1
          className="mb-1 text-xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          Welcome back
        </h1>
        <p
          className="mb-6 text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          Sign in to your account
        </p>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
            <FiAlertCircle size={16} className="shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              className="mb-1 block text-xs font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              Email
            </label>
            <div
              className="flex items-center gap-2 rounded-lg border px-3 py-2"
              style={{
                borderColor: "var(--border-color)",
                backgroundColor: "var(--bg-secondary)",
              }}
            >
              <FiMail size={14} style={{ color: "var(--text-secondary)" }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-transparent text-sm outline-none"
                style={{ color: "var(--text-primary)" }}
              />
            </div>
          </div>

          <div>
            <label
              className="mb-1 block text-xs font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              Password
            </label>
            <div
              className="flex items-center gap-2 rounded-lg border px-3 py-2"
              style={{
                borderColor: "var(--border-color)",
                backgroundColor: "var(--bg-secondary)",
              }}
            >
              <FiLock size={14} style={{ color: "var(--text-secondary)" }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-transparent text-sm outline-none"
                style={{ color: "var(--text-primary)" }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer rounded-lg py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-50"
            style={{ backgroundColor: "#6366f1" }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p
          className="mt-4 text-center text-xs"
          style={{ color: "var(--text-secondary)" }}
        >
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium"
            style={{ color: "#6366f1" }}
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
