import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { registeraction } from '../../services/auth';
import { toast } from "react-toastify";
import bg from "../../assets/images/bgimage.avif";


const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  //const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch("password");
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  


  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE}/auth/google`;
  };

  const handleGithubLogin = () => {
    window.location.href = `${API_BASE}/auth/github`;
  };


  const onSubmit = async (data) => {
    console.log("FORM DATA:", data);
    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      userName: data.userName,
      email: data.email,
      profession: data.profession,
      password: data.password,
      role: "USER",
    };

    const res = await registeraction(payload);
    if (!res) return;
    reset();
    toast.info('Please check your email to verify your account before logging in');
    //navigate('/login', { replace: true });
  };



  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center bg-no-repeat" 
    style={{
        backgroundImage: `url(${bg}`,
      }}>
    
      <div className="w-full max-w-2xl rounded-2xl border border-purple-400 backdrop-blur-xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-white">
            Signup to Coding Platform
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          <div className="relative mb-6">
            <fieldset
              className="border border-purple-300 rounded-lg px-3 py-1"
            >
              <legend className="px-1 text-sm text-purple-300">
                Firstname *
              </legend>

              <input
                {...register("firstName", {
                  // required: "Firstname is required",
                  minLength: { value: 3, message: "Minimum 3 characters" },
                })}
                placeholder="Enter your Firstname"
                className="w-full bg-transparent px-1 py-1 text-white placeholder-purple-300 focus:outline-none"
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
                Lastname *
              </legend>

              <input
                {...register("lastName", {
                  // required: "Username is required",
                  minLength: { value: 3, message: "Minimum 3 characters" },
                })}
                placeholder="Enter your Lastname"
                className="w-full bg-transparent px-1 py-1 text-white placeholder-purple-300 focus:outline-none"
              />
            </fieldset>

            {errors.lastName && (
              <p className="absolute left-2 -bottom-4 text-xs text-red-400 pointer-events-none">
                {errors.lastName.message}
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
                {...register("userName", {
                  required: "Username is required",
                  minLength: { value: 3, message: "Minimum 3 characters" },
                })}
                placeholder="Enter your Username"
                className="w-full bg-transparent px-1 py-1 text-white placeholder-purple-300 focus:outline-none"
              />
            </fieldset>

            {errors.userName && (
              <p className="absolute left-2 -bottom-4 text-xs text-red-400 pointer-events-none">
                {errors.userName.message}
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
                className="w-full bg-transparent px-1 py-1 text-white placeholder-purple-300 focus:outline-none"
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
              className="border border-purple-300 rounded-lg px-3 py-1"
            >
              <legend className="px-1 text-sm text-purple-300">
                Profession *
              </legend>

              <input
                {...register("profession", {
                  required: "profession is required",
                  minLength: { value: 3, message: "Minimum 3 characters" },
                })}
                placeholder="Enter your profession(developer/test eng..)"
                className="w-full bg-transparent px-1 py-1 text-white placeholder-purple-300 focus:outline-none"
              />
            </fieldset>

            {errors.profession && (
              <p className="absolute left-2 -bottom-4 text-xs text-red-400 pointer-events-none">
                {errors.profession.message}
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
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-white hover:text-black"
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
              className="w-full flex items-center cursor-pointer justify-center gap-3 border border-gray-600  hover:bg-purple-400 text-white py-2 rounded-lg transition"
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
              className="w-full flex cursor-pointer items-center justify-center gap-3 border border-gray-600  hover:bg-purple-400 text-white py-2 rounded-lg transition"
            >
              <img
                src="https://www.svgrepo.com/show/512317/github-142.svg"
                alt="github"
                className="w-5 h-5"
              />
              Continue with github
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
