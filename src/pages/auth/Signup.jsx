import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    console.log("Signup Data:", data);
  };



  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE}/auth/google`;
  };

  const handleGithubLogin = () => {
    window.location.href = `${API_BASE}/auth/github`;
  };


  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-2xl rounded-2xl border backdrop-blur-xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-black">
            Signup to Coding Platform
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          <div className="relative mb-6">
            <fieldset
              className="border border-purple-300 rounded-lg px-3 py-1"
            >
              <legend className="px-1 text-sm text-purple-300">
                Username *
              </legend>

              <input
                {...register("username", {
                  required: "Username is required",
                  minLength: { value: 3, message: "Minimum 3 characters" },
                })}
                placeholder="Enter your Username"
                className="w-full bg-transparent px-1 py-1 text-gray-700 placeholder-purple-300 focus:outline-none"
              />
            </fieldset>

            {errors.username && (
              <p className="absolute left-2 -bottom-4 text-xs text-red-400 pointer-events-none">
                {errors.username.message}
              </p>
            )}
          </div>

          <div className="relative mb-6">
            <fieldset
              className="border border-purple-300 rounded-lg px-3 py-1"
            >
              <legend className="px-1 text-sm text-purple-300">
                Firstname *
              </legend>

              <input
                {...register("firstName", {
                  required: "Firstname is required",
                  minLength: { value: 3, message: "Minimum 3 characters" },
                })}
                placeholder="Enter your Firstname"
                className="w-full bg-transparent px-1 py-1 text-gray-700 placeholder-purple-300 focus:outline-none"
              />
            </fieldset>

            {errors.firstName && (
              <p className="absolute left-2 -bottom-4 text-xs text-red-400 pointer-events-none">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div className="relative mb-6">
            <fieldset
              className="border border-purple-300 rounded-lg px-3 py-1"
            >
              <legend className="px-1 text-sm text-purple-300">
                Username *
              </legend>

              <input
                {...register("lastName", {
                  // required: "Username is required",
                  minLength: { value: 3, message: "Minimum 3 characters" },
                })}
                placeholder="Enter your Username"
                className="w-full bg-transparent px-1 py-1 text-gray-700 placeholder-purple-300 focus:outline-none"
              />
            </fieldset>

            {errors.lastName && (
              <p className="absolute left-2 -bottom-4 text-xs text-red-400 pointer-events-none">
                {errors.lastname.message}
              </p>
            )}
          </div>

          <div className="relative mb-6">
            <fieldset
              className="border border-purple-300 rounded-lg px-3 py-1"
            >
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
                placeholder="Enter your Email Address"
                className="w-full bg-transparent px-1 py-1 text-gray-700 placeholder-purple-300 focus:outline-none"
              />
            </fieldset>

            {errors.email && (
              <p className="absolute left-2 -bottom-4 text-xs text-red-400 pointer-events-none">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="relative mb-6">
            <fieldset
              className="border rounded-lg px-3 py-1 border-purple-300">
              <legend className="px-1 text-sm text-purple-300">
                Password *
              </legend>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Minimum 8 characters",
                    },
                  })}
                  placeholder="Enter your Password"
                  className="w-full bg-transparent px-1 py-1 text-gray-700 placeholder-purple-300 focus:outline-none pr-10"
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

          

        
          <button
            disabled={isSubmitting}
            className="w-full rounded-lg cursor-pointer bg-linear-to-r from-purple-500 to-fuchsia-500 py-3 font-semibold text-white hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? "Creating Account..." : "Signup"}
          </button>

          <div className="space-y-3 mb-5">
            <div className="flex items-center gap-3 my-4">
              <hr className="flex-1 border-gray-700" />
              <span className="text-gray-400 text-sm">OR</span>
              <hr className="flex-1 border-gray-700" />
            </div>
            <button
              className="w-full flex items-center justify-center gap-3 border border-gray-600 bg-gray-900 hover:bg-gray-700 text-white py-2 rounded-lg transition"
              onClick={handleGoogleLogin}
              type="button"
            >
              {" "}
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="google"
                className="w-5 h-5"
              />
              Continue with google
            </button>

            <button
              onClick={handleGithubLogin}
              type="button"
              className="w-full flex items-center justify-center gap-3 border border-gray-600 bg-gray-900 hover:bg-gray-700 text-white py-2 rounded-lg transition"
            >
              <img
                src="https://www.svgrepo.com/show/512317/github-142.svg"
                alt="github"
                className="w-5 h-5"
              />
              Continue with guthub
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <span
            className="cursor-pointer underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
