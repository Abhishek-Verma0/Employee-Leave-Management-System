import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  FiUser,
  FiMail,
  FiLock,
  FiAlertCircle,
} from "react-icons/fi";

import axios from "axios";

import { auth } from "../firebase";

import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

const RegisterPage = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, setUser } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    setLoading(true);

    try {

      const user = await register(
        name,
        email,
        password
      );

      toast.success(
        "Account created successfully"
      );

      navigate(`/${user.role}`);

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

  const handleGoogleLogin = async () => {

    try {

      const provider =
        new GoogleAuthProvider();

      const result =
        await signInWithPopup(
          auth,
          provider
        );

      const googleUser = result.user;

      const response = await axios.post(
        "http://localhost:5000/api/auth/google-login",
        {
          name: googleUser.displayName,
          email: googleUser.email,
        }
      );

      const data = response.data;

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      setUser(data.user);

      toast.success(
        "Google Login Success"
      );

      navigate(`/${data.user.role}`);

    } catch (error) {

      console.log(error);

      toast.error(
        error.response?.data?.message ||
        error.message
      );
    }
  };

  return (
    <div className="flex items-center justify-center py-8 px-4">
      <div
        className="w-full max-w-md border rounded-2xl p-6 shadow-md"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-color)",
        }}
      >

        <h1
          className="text-3xl font-bold mb-2"
          style={{
            color: "var(--text-primary)",
          }}
        >
          Create account
        </h1>

        <p
          className="text-gray-500 mb-6"
          style={{
            color: "var(--text-secondary)",
          }}
        >
          Register to get started
        </p>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">

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
                type="password"
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

            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg" style={{
              backgroundColor: "#6366f1",
            }}
          >
            {loading
              ? "Creating account..."
              : "Create Account"}
          </button>

        </form>

        <button
          onClick={handleGoogleLogin}
          className="w-full mt-4 border border-gray-300 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100"
        >

          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="google"
            className="w-5 h-5"
          />

          Continue with Google

        </button>

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
            style={{
              color: "#6366f1",
            }}
          >
            Sign In
          </Link>

        </p>

      </div>
    </div>
  );
};

export default RegisterPage;