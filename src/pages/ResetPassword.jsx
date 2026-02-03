import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";

import { toast } from "react-toastify";
import bg from "../../assets/images/photo_2026-01-22_13-42-38.jpg";
import axiosClient from "../services/axiosClient";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      console.log("Reset password form submitted");
      console.log("Token from URL:", token);
      console.log("Password data:", { password: data.password, confirmPassword: data.confirmPassword });

      if (!token) {
        toast.error("Invalid reset link - token not found");
        return;
      }

      if (data.password !== data.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      console.log("Sending reset password request to backend...");
      const response = await axiosClient.post(`/auth/reset-password/${token}`, {
        newPassword: data.password,
      });

      console.log("Reset password response:", response);

      if (response.status === 200) {
        toast.success("Password reset successfully. Please login.");
        reset();
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.error("Reset password error:", err);
      console.error("Error response status:", err.response?.status);
      console.error("Error response data:", err.response?.data);
      console.error("Error message:", err.message);
      
      toast.error(
        err.response?.data?.message || "Failed to reset password"
      );
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
            Reset Password
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="relative mb-6">
            <fieldset className="border border-purple-300 rounded-lg px-3 py-1">
              <legend className="px-1 text-sm text-purple-300">
                New Password *
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
                  placeholder="Enter your new password"
                  className="w-full bg-transparent px-1 py-1 text-white placeholder-purple-300 focus:outline-none pr-10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-purple-300 hover:text-white"
                >
                  {/* {showPassword ? "🙈" : "👁️"} */}
                </button>
              </div>
            </fieldset>

            {errors.password && (
              <p className="absolute left-2 -bottom-4 text-xs text-red-400 pointer-events-none">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="relative mb-6">
            <fieldset className="border border-purple-300 rounded-lg px-3 py-1">
              <legend className="px-1 text-sm text-purple-300">
                Confirm Password *
              </legend>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                  placeholder="Confirm your password"
                  className="w-full bg-transparent px-1 py-1 text-white placeholder-purple-300 focus:outline-none pr-10"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-purple-300 hover:text-white"
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </fieldset>

            {errors.confirmPassword && (
              <p className="absolute left-2 -bottom-4 text-xs text-red-400 pointer-events-none">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            disabled={isSubmitting}
            className="w-full rounded-lg cursor-pointer bg-linear-to-r from-purple-500 to-fuchsia-500 py-3 font-semibold text-white hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Remember your password?{" "}
          <span
            className="cursor-pointer underline text-purple-500"
            onClick={() => navigate("/")}
          >
            Back to Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;