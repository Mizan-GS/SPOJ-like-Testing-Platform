
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import bg from "../../assets/images/photo_2026-01-22_13-42-38.jpg";
import axiosClient from "../services/axiosClient";
const ForgotPassword = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    const maxRetries = 2;
    let lastError = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`[Attempt ${attempt}] Sending forgot password request with email:`, data.email);
        
        const response = await axiosClient.post("/auth/forgot-password", {
          email: data.email,
        });
        
        console.log("Response from backend:", response);
        console.log("Response status:", response.status);
        console.log("Response data:", response.data);
        
        toast.success("Password reset link sent to your email");
        //navigate("/login", { replace: true });
        return; 
        
      } catch (err) {
        console.error(`[Attempt ${attempt} Failed]`, {
          status: err.response?.status,
          message: err.response?.data?.message,
          errorCode: err.code,
          errorMessage: err.message,
        });
        
        
        if (attempt === maxRetries) {
          console.error("All retry attempts failed");
          toast.error(
            err.response?.data?.message || "Failed to send reset link. Please try again."
          );
        } else {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${bg})` }}
        >
      <div className="w-full max-w-2xl rounded-2xl border border-purple-400 backdrop-blur-xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-white">
            Forgot Password
          </h1>
        </div>

      
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

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
                placeholder="Enter your Email Address"
                className="w-full bg-transparent px-1 py-1 text-white placeholder-purple-300 focus:outline-none"
              />
            </fieldset>

            {errors.email && (
              <p className="absolute left-2 -bottom-4 text-xs text-red-400 pointer-events-none">
                {errors.email.message}
              </p>
            )}
          </div>

          <button
            disabled={isSubmitting}
            className="w-full rounded-lg cursor-pointer bg-linear-to-r from-purple-500 to-fuchsia-500 py-3 font-semibold text-white hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
         {" "}
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

export default ForgotPassword;