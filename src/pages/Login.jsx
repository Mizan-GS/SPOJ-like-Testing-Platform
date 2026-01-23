import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { loginaction } from "../services/auth.api";
import bg from "../../assets/images/photo_2026-01-22_13-42-38.jpg";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const {login}=useAuth();
  const [rememberMe,setRememberMe] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  /* ------------------------------------
     EMAIL VERIFICATION FEEDBACK
  ------------------------------------ */
  useEffect(() => {
    if (searchParams.get("verified") === "true") {
      toast.success("Email verified successfully. Please login.");
    }

    if (searchParams.get("verified") === "false") {
      toast.error("Email verification failed or expired.");
    }
  }, [searchParams]);

  useEffect(()=>{
    const remembered = localStorage.getItem("rememberMe")==="true";

    if (remembered) {
      const email = localStorage.getItem("rememberEmail") || "";
      const password = localStorage.getItem("rememberPassword")||"";

      reset({
        email,
        password,
      });
      setRememberMe(true)
    }
  },[reset])

  /* ------------------------------------
     LOGIN SUBMIT HANDLER
  ------------------------------------ */
  const onSubmit = async (data) => {
    let res;

    try {
      res = await loginaction(data.email, data.password);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
      return;
    }

    if (!res?.data?.success) {
      toast.error("Invalid login response");
      return;
    }

    reset();

    const user = res.data.data;

    if (rememberMe) {
      localStorage.setItem("rememberMe", "true");
      localStorage.setItem("rememberEmail", data.email);
      localStorage.setItem("rememberPassword", data.password);
    } else {
      localStorage.removeItem("rememberMe");
      localStorage.removeItem("rememberEmail");
      localStorage.removeItem("rememberPassword");
    }

    login({
      token : user.token,
      role : user.role,
    });
e
    localStorage.setItem("token", user.token);
    localStorage.setItem("role", user.role.toLowerCase());
    localStorage.setItem("userId", user.id);

    // 🎯 Role-based redirect
    if (user.role === "ADMIN") {
      navigate("/admin", { replace: true });
    } else if (user.role === "USER") {
      navigate("/userhome", { replace: true });
    } else {
      toast.error("Invalid user role");
    }
  };

  /* ------------------------------------
     OAUTH HANDLERS (BACKEND READY)
  ------------------------------------ */
  // const API_BASE = import.meta.env.VITE_API_BASE_URL;

  // const handleGoogleLogin = () => {
  //   window.location.href = `${API_BASE}/auth/google`;
  // };

  // const handleGithubLogin = () => {
  //   window.location.href = `${API_BASE}/auth/github`;
  // };

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
          {/* EMAIL */}
          <div className="relative mb-6">
            <fieldset className="border border-purple-300 rounded-lg px-3 py-1">
              <legend className="px-1 text-sm text-purple-300">
                Email *
              </legend>

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
              <p className="absolute left-2 -bottom-4 text-xs text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* PASSWORD */}
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
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-purple-300"
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </fieldset>

            {errors.password && (
              <p className="absolute left-2 -bottom-4 text-xs text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* FORGOT PASSWORD */}
          <div className="text-right">
            <span
              className="text-sm text-purple-500 cursor-pointer hover:underline"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot password?
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 accent-purple-500"
            />
            <label
              htmlFor="rememberMe"
              className="text-sm text-purple-300 cursor-pointer"
            >
              Remember me
            </label>
          </div>


          {/* SUBMIT */}
          <button
            disabled={isSubmitting}
            className="w-full rounded-lg bg-purple-500 py-4 font-semibold text-white text-2xl hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>

          {/* OAUTH */}
          {/* <div className="space-y-3 mb-5">
            <div className="flex items-center gap-3 my-4">
              <hr className="flex-1 border-gray-700" />
              <span className="text-gray-400 text-sm">OR</span>
              <hr className="flex-1 border-gray-700" />
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 border border-gray-600 hover:bg-purple-400 text-white py-2 rounded-lg"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="google"
                className="w-5 h-5"
              />
              Continue with Google
            </button>

            <button
              type="button"
              onClick={handleGithubLogin}
              className="w-full flex items-center justify-center gap-3 border border-gray-600 hover:bg-purple-400 text-white py-2 rounded-lg"
            >
              <img
                src="https://www.svgrepo.com/show/512317/github-142.svg"
                alt="github"
                className="w-5 h-5"
              />
              Continue with Github
            </button>
          </div> */}
        </form>

        {/* <p className="mt-6 text-center text-sm text-gray-500">
          Don’t have an account?{" "}
          <span
            className="cursor-pointer underline"
            onClick={() => navigate("/")}
          >
            Signup
          </span>
        </p> */}
      </div>
    </div>
  );
};

export default Login;
