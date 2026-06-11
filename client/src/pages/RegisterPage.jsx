import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  FiUser,
  FiMail,
  FiLock,
  FiAlertCircle,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

const passwordRequirements = [
  { label: "At least 8 characters", test: (pw) => pw.length >= 8 },
  { label: "At least one uppercase letter (A-Z)", test: (pw) => /[A-Z]/.test(pw) },
  { label: "At least one lowercase letter (a-z)", test: (pw) => /[a-z]/.test(pw) },
  { label: "At least one number (0-9)", test: (pw) => /[0-9]/.test(pw) },
  { label: "At least one special character (e.g., @, #, $, !, %, &, *)", test: (pw) => /[!@#$%^&*(),.?":{}|<>]/.test(pw) },
];

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    // Password Strength Validation
    const allMet = passwordRequirements.every((req) => req.test(password));
    if (!allMet) {
      setError("Password does not meet all security requirements");
      toast.error("Password does not meet all security requirements");
      setLoading(false);
      return;
    }

    // Password Match Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const data = await register(
        name,
        email,
        password
      );

      toast.success(
        data.message ||
          "Account created successfully! Please wait for Admin approval."
      );

      navigate("/login");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Registration failed";

      setError(msg);
      toast.error(msg);
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
          style={{
            color: "var(--text-primary)",
          }}
        >
          Create account
        </h1>

        <p
          className="mb-6 text-sm"
          style={{
            color: "var(--text-secondary)",
          }}
        >
          Register to get started
        </p>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
            <FiAlertCircle
              size={16}
              className="shrink-0"
            />

            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          {/* Name */}
          <div>
            <label
              className="mb-1 block text-xs font-medium"
              style={{
                color: "var(--text-secondary)",
              }}
            >
              Name
            </label>

            <div
              className="flex items-center gap-2 rounded-lg border px-3 py-2"
              style={{
                borderColor:
                  "var(--border-color)",
                backgroundColor:
                  "var(--bg-secondary)",
              }}
            >
              <FiUser
                size={14}
                style={{
                  color:
                    "var(--text-secondary)",
                }}
              />

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Your Name"
                required
                className="w-full bg-transparent text-sm outline-none"
                style={{
                  color:
                    "var(--text-primary)",
                }}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              className="mb-1 block text-xs font-medium"
              style={{
                color: "var(--text-secondary)",
              }}
            >
              Email
            </label>

            <div
              className="flex items-center gap-2 rounded-lg border px-3 py-2"
              style={{
                borderColor:
                  "var(--border-color)",
                backgroundColor:
                  "var(--bg-secondary)",
              }}
            >
              <FiMail
                size={14}
                style={{
                  color:
                    "var(--text-secondary)",
                }}
              />

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="you@example.com"
                required
                className="w-full bg-transparent text-sm outline-none"
                style={{
                  color:
                    "var(--text-primary)",
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              className="mb-1 block text-xs font-medium"
              style={{
                color: "var(--text-secondary)",
              }}
            >
              Password
            </label>

            <div
              className="flex items-center gap-2 rounded-lg border px-3 py-2"
              style={{
                borderColor:
                  "var(--border-color)",
                backgroundColor:
                  "var(--bg-secondary)",
              }}
            >
              <FiLock
                size={14}
                style={{
                  color:
                    "var(--text-secondary)",
                }}
              />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="••••••••"
                required
                className="w-full bg-transparent text-sm outline-none"
                style={{
                  color:
                    "var(--text-primary)",
                }}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="flex items-center justify-center text-gray-500 hover:text-gray-700 focus:outline-none"
                style={{
                  color:
                    "var(--text-secondary)",
                }}
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <FiEyeOff size={14} />
                ) : (
                  <FiEye size={14} />
                )}
              </button>
            </div>

            {password && (
              <ul className="mt-2 space-y-1 text-xs">
                {passwordRequirements.map((req, index) => {
                  const isMet = req.test(password);
                  return (
                    <li
                      key={index}
                      className="flex items-center gap-1.5 font-medium"
                      style={{
                        color: isMet ? "#10B981" : "#EF4444",
                      }}
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{
                          backgroundColor: isMet ? "#10B981" : "#EF4444",
                        }}
                      />
                      {req.label}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              className="mb-1 block text-xs font-medium"
              style={{
                color: "var(--text-secondary)",
              }}
            >
              Confirm Password
            </label>

            <div
              className="flex items-center gap-2 rounded-lg border px-3 py-2"
              style={{
                borderColor:
                  "var(--border-color)",
                backgroundColor:
                  "var(--bg-secondary)",
              }}
            >
              <FiLock
                size={14}
                style={{
                  color:
                    "var(--text-secondary)",
                }}
              />

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                placeholder="••••••••"
                required
                className="w-full bg-transparent text-sm outline-none"
                style={{
                  color:
                    "var(--text-primary)",
                }}
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                className="flex items-center justify-center text-gray-500 hover:text-gray-700 focus:outline-none"
                style={{
                  color:
                    "var(--text-secondary)",
                }}
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                {showConfirmPassword ? (
                  <FiEyeOff size={14} />
                ) : (
                  <FiEye size={14} />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer rounded-lg py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-50"
            style={{
              backgroundColor: "#6366f1",
            }}
          >
            {loading
              ? "Creating account..."
              : "Create Account"}
          </button>
        </form>

        <p
          className="mt-4 text-center text-xs"
          style={{
            color: "var(--text-secondary)",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium"
            style={{ color: "#6366f1" }}
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;