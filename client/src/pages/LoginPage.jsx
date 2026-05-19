import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { useAuth } from "../context/AuthContext";

import toast from "react-hot-toast";

import {
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

import { auth } from "../firebase";

import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

const LoginPage = () => {

  const navigate = useNavigate();

  const { setUser } = useAuth();
  const getRedirectPath = (role) => {

  const validRoles = {
    employee: "/employee",
    manager: "/manager",
    admin: "/admin",
  };

  return validRoles[role] || "/";
};

  const [showPassword, setShowPassword] =
    useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        formData
      );

      const data = response.data;

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      setUser(data.user);

      toast.success("Login Success");

      navigate(getRedirectPath(data.user.role));
    } catch (error) {

      console.log(error);

      toast.error(
        error.response?.data?.message ||
        "Login Failed"
      );
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
        `${import.meta.env.VITE_API_URL}/api/auth/google-login`,
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

      navigate(getRedirectPath(data.user.role));
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

      <div className="w-full max-w-md border rounded-2xl p-6 shadow-md">

        <h1 className="text-3xl font-bold mb-2">
          Welcome back
        </h1>

        <p className="text-gray-500 mb-6">
          Sign in to your account
        </p>

        <form onSubmit={handleSubmit}>

          <div className="mb-4">

            <label className="block mb-2">
              Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 outline-none"
              required
            />

          </div>

          <div className="mb-4">

            <label className="block mb-2">
              Password
            </label>

            <div className="flex items-center border rounded-lg px-4 py-3">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="********"
                value={formData.password}
                onChange={handleChange}
                className="w-full outline-none"
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="text-gray-500"
              >

                {showPassword ? (
                  <FiEyeOff size={18} />
                ) : (
                  <FiEye size={18} />
                )}

              </button>

            </div>

          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg"
          >
            Sign In
          </button>

        </form>

        <button
          onClick={handleGoogleLogin}
          className="w-full mt-4 border py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100"
        >

          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="google"
            className="w-5 h-5"
          />

          Continue with Google

        </button>

        <p className="text-center mt-6">

          Don't have an account?{" "}

          <Link
            to="/register"
            className="text-indigo-600"
          >
            Register
          </Link>

        </p>

      </div>

    </div>
  );
};

export default LoginPage;