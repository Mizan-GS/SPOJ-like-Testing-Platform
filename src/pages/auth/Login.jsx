import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { loginaction } from "../../services/auth";
import { toast } from "react-toastify";

import bg from "../../assets/images/bgimage.avif";
import { getToken, isTokenExpired } from "../../utils/jwtUtil";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const redirectedRef = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  useEffect(() => {
    if (redirectedRef.current) return;
    const token = getToken();
    if (token && !isTokenExpired()) {
      redirectedRef.current = true;
      if (window.location.pathname !== "/dashboard") {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [navigate]);

  const isVerified = searchParams.get("verified");
  const canShowLoginForm = isVerified === "true";

  useEffect(() => {
    if (searchParams.get("verified") === "true") {
      toast.success("Email vrified successfully Please login");
    }

    if (searchParams.get("verified") === "false") {
      toast.error("Email verification failed or expired");
    }
  }, []);

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      console.log("token from url:", tokenFromUrl);
    }
  }, [searchParams]);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE}/auth/google`;
  };

  const handleGithubLogin = () => {
    window.location.href = `${API_BASE}/auth/github`;
  };
  

  const onSubmit = async (data) => {
    const res = await loginaction(data.email, data.password);
    if (!res) return;

    reset();

    const user = res.data?.data;
    const token = user?.token;

    console.log("LOGIN RESPONSE:", res.data);
    console.log("USER:", user);
    console.log("TOKEN:", token);

    if (token) {
      sessionStorage.setItem("token", token);
    }

    if (user) {
      sessionStorage.setItem("currentUser", JSON.stringify(user));
      sessionStorage.setItem("role", user.role || "");
    }
    if (user?.role === "USER") {
      navigate("/dashboard", { replace: true });
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="w-full max-w-2xl rounded-2xl border border-purple-400 backdrop-blur-xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-white">
            Login to Coding Platform
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="relative mb-6">
            <fieldset className="border border-purple-300 rounded-lg px-3 py-1">
              <legend className="px-1 text-sm text-purple-300">Email *</legend>

              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                })}
                placeholder="Enter your Email"
                className="w-full bg-transparent px-1 py-1 text-white placeholder-purple-300 focus:outline-none"
              />
            </fieldset>

            {errors.email && (
              <p className="absolute left-2 -bottom-4 text-xs text-red-400 pointer-events-none">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="relative mb-2">
            <fieldset className="border border-purple-300 rounded-lg px-3 py-1">
              <legend className="px-1 text-sm text-purple-300">
                Password *
              </legend>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                  })}
                  placeholder="Enter your Password"
                  className="w-full bg-transparent px-1 py-1 text-white placeholder-purple-300 focus:outline-none pr-10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-purple-300 hover:text-black"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </fieldset>

            {errors.password && (
              <p className="absolute left-2 -bottom-4 text-xs text-red-400 pointer-events-none">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="text-right">
            <span
              className="text-sm text-purple-500 cursor-pointer hover:underline"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot password?
            </span>
          </div>

          <button
            disabled={isSubmitting}
            className="w-full rounded-lg cursor-pointer bg-purple-500 from-purple-500  py-4 font-semibold text-white text-2xl hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
             
             {/*
          <div className="space-y-3 mb-5">
            <div className="flex items-center gap-3 my-4">
              <hr className="flex-1 border-gray-700" />
              <span className="text-gray-400 text-sm">OR</span>
              <hr className="flex-1 border-gray-700" />
            </div>

            <button
              className="w-full flex items-center justify-center cursor-pointer gap-3 border border-gray-600  hover:bg-purple-400 text-white py-2 rounded-lg transition"
              onClick={handleGoogleLogin}
              type="button"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="google"
                className="w-5 h-5"
              />
              Continue with Google
            </button>

            <button
              onClick={handleGithubLogin}
              type="button"
              className="w-full flex items-center cursor-pointer justify-center gap-3 border border-gray-600 hover:bg-purple-400  text-white py-2 rounded-lg transition"
            >
              <img
                src="https://www.svgrepo.com/show/512317/github-142.svg"
                alt="github"
                className="w-5 h-5"
              />
              Continue with Github
            </button>
          </div>
          */}
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don’t have an account?{" "}
          <span
            className="cursor-pointer underline text-purple-500"
            onClick={() => navigate("/")}
          >
            Signup
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
