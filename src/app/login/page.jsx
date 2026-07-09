"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "motion/react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
// Import your custom axios instance (adjust the path based on your project structure)
import instance from "../../lib/axios";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Switch between Login and Sign Up
  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    reset();
  };

  // Form submission handler using your custom Axios instance
 const onSubmit = async (data) => {
  setIsLoading(true);
  const endpoint = isSignUp ? "/api/auth/signup" : "/api/auth/login";
  try {
    const response = await instance.post(endpoint, data);
    document.cookie = `token=${response.data.token}; path=/; max-age=7200; SameSite=Lax`;

    const { id, email, username } = response.data;
    useStore.getState().setAuth({ id, email, username }, response.data.token);

    toast.success(isSignUp ? "Account created!" : "Welcome back!");
    router.push("/dashboard");
  } catch (error) {
    toast.error(error.response?.data?.message || "Something went wrong");
  } finally {
    setIsLoading(false);
  }
};
  return (
    <div className="min-h-screen bg-[#f3f7f9] flex flex-col justify-center items-center font-sans antialiased px-4 select-none">
      {/* Top Branding Logo */}
      <div className="mb-8 text-center  pt-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-[#0066cc] italic font-serif flex items-center justify-center gap-1">
          imagix<span className="text-[#0052cc] font-sans text-2xl"></span>
        </h1>
      </div>

      {/* Main Authentication Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-[500px] bg-white rounded-3xl border border-[#e2e8f0] shadow-[0_8px_30px_rgb(0,0,0,0.03)] px-10 py-12"
      >
        <h2 className="text-3xl font-semibold text-center text-[#1e293b] mb-8">
          {isSignUp ? "Create Account" : "Login"}
        </h2>

        {/* Google OAuth One-Tap Simulation Button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="button"
          className="w-full border border-[#cbd5e1] rounded-full py-2 px-4 flex items-center justify-between hover:bg-slate-50 transition-colors duration-200 group mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-[#e2e8f0] flex items-center justify-center text-[10px] font-bold text-slate-600">
              FA
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-slate-700">
                Sign in as Fayd
              </p>
              <p className="text-[11px] text-slate-400 -mt-0.5">
                arshanw94@gmail.com
              </p>
            </div>
          </div>
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.61c-.3 1.56-1.17 2.9-2.48 3.79v3.13h4.01c2.34-2.16 3.69-5.33 3.69-8.77z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-4.01-3.13c-1.12.75-2.55 1.19-3.95 1.19-3.05 0-5.63-2.06-6.55-4.83H1.31v3.23C3.28 22.21 7.37 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.45 14.32a7.15 7.15 0 0 1 0-4.64V6.45H1.31a11.94 11.94 0 0 0 0 11.1l4.14-3.23z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.43C17.96 1.19 15.24 0 12 0 7.37 0 3.28 1.79 1.31 5.14l4.14 3.23c.92-2.77 3.5-4.83 6.55-4.83z"
            />
          </svg>
        </motion.button>

        {/* Visual Separator */}
        <div className="relative flex py-2 items-center mb-6">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-4 text-xs font-semibold text-slate-400 tracking-wider">
            OR
          </span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        {/* Input Credentials Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Business Email
            </label>
            <input
              type="email"
              placeholder="name@company.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              })}
              className={`w-full bg-[#edf4fc] border text-slate-800 px-4 py-3.5 rounded-xl outline-none transition-all duration-200 text-base font-medium ${
                errors.email
                  ? "border-red-400 focus:border-red-500"
                  : "border-transparent focus:border-[#0066cc] focus:bg-white focus:ring-2 focus:ring-blue-100"
              }`}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1 font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Username
            </label>
            <input
              type="text"
              placeholder="enter username"
              {...register("username", {
                required: "Username is required",
                pattern: {
                  value: /^\S+$/i,
                  message: "Invalid username",
                },
              })}
              className={`w-full bg-[#edf4fc] border text-slate-800 px-4 py-3.5 rounded-xl outline-none transition-all duration-200 text-base font-medium ${
                errors.username
                  ? "border-red-400 focus:border-red-500"
                  : "border-transparent focus:border-[#0066cc] focus:bg-white focus:ring-2 focus:ring-blue-100"
              }`}
            />
            {errors.username && (
              <p className="text-xs text-red-500 mt-1 font-medium">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-slate-600">
                Password
              </label>
              {!isSignUp && (
                <a
                  href="#"
                  className="text-sm font-semibold text-[#0066cc] hover:underline"
                >
                  Forgot Password
                </a>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className={`w-full bg-[#edf4fc] border text-slate-800 px-4 py-3.5 pr-12 rounded-xl outline-none transition-all duration-200 text-base font-medium ${
                  errors.password
                    ? "border-red-400 focus:border-red-500"
                    : "border-transparent focus:border-[#0066cc] focus:bg-white focus:ring-2 focus:ring-blue-100"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1 font-medium">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Action Button */}
          <motion.button
            whileHover={{ scale: 1.01, backgroundColor: "#0052cc" }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0066cc] text-white py-2 rounded-xl font-semibold text-base shadow-sm transition-all duration-150 relative overflow-hidden flex items-center justify-center"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : isSignUp ? (
              "Sign Up"
            ) : (
              "Submit"
            )}
          </motion.button>
        </form>

        {/* Single Sign-On Option */}
        {isSignUp && (
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Username
            </label>
            <input
              type="text"
              placeholder="enter username"
              {...register("username", {
                required: isSignUp ? "Username is required" : false,
              })}
              className={`w-full bg-[#edf4fc] border text-slate-800 px-4 py-3.5 rounded-xl outline-none transition-all duration-200 text-base font-medium ${
                errors.username
                  ? "border-red-400 focus:border-red-500"
                  : "border-transparent focus:border-[#0066cc] focus:bg-white focus:ring-2 focus:ring-blue-100"
              }`}
            />
            {errors.username && (
              <p className="text-xs text-red-500 mt-1 font-medium">
                {errors.username.message}
              </p>
            )}
          </div>
        )}
      </motion.div>

      {/* Under-Card Context Toggle */}
      <p className="mt-8 text-sm text-slate-600 font-medium">
        {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
        <button
          onClick={toggleAuthMode}
          className="text-[#0066cc] font-semibold hover:underline bg-transparent border-none cursor-pointer outline-none ml-1"
        >
          {isSignUp ? "Log In" : "Sign Up"}
        </button>
      </p>

      {/* Footer Meta Terms Agreement Layout */}
      <div className="mt-12 max-w-[420px] text-center text-[11px] leading-relaxed text-slate-400 px-4">
        By signing in you agree to our{" "}
        <a href="#" className="underline hover:text-slate-600">
          Terms of use
        </a>
        ,{" "}
        <a href="#" className="underline hover:text-slate-600">
          Privacy policy
        </a>
        ,{" "}
        <a href="#" className="underline hover:text-slate-600">
          GDPR Privacy Notice
        </a>{" "}
        and{" "}
        <a href="#" className="underline hover:text-slate-600">
          Disclaimer Policy
        </a>
        .
      </div>
    </div>
  );
}
