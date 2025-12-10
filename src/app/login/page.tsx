"use client";
import { Eye, EyeOff, Leaf, Loader2, Lock, LogIn, Mail } from "lucide-react";
import React, { FormEvent, useState } from "react";
import googleImage from "@/assesst/google.png";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

const Login = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Auto redirect if already logged in
  if (status === "authenticated") {
    router.push("/");
  }

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) return;
    router.push("/");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!res?.error) {
        router.push("/");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 py-10 min-h-screen bg-white relative">
      <motion.h1
        className="text-4xl font-extrabold text-green-700 mb-2"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        Welcome Back
      </motion.h1>

      <p className="text-gray-600 mb-8 flex items-center gap-1">
        Login To snapCart <Leaf className="w-5 h-5 text-green-600" />
      </p>

      <motion.form
        onSubmit={handleLogin}
        className="mt-3 flex flex-col gap-5 w-full max-w-sm"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Email */}
        <div className="relative">
          <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full border rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-green-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="relative">
          <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type={show ? "text" : "password"}
            placeholder="Your Password"
            className="w-full border rounded-xl py-3 pl-10 pr-10 focus:ring-2 focus:ring-green-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {show ? (
            <EyeOff
              onClick={() => setShow(false)}
              className="absolute right-3 top-3.5 w-5 h-5 cursor-pointer"
            />
          ) : (
            <Eye
              onClick={() => setShow(true)}
              className="absolute right-3 top-3.5 w-5 h-5 cursor-pointer"
            />
          )}
        </div>

        {/* ✅ Error Message */}
        {error && (
          <p className="text-red-500 text-sm text-center font-medium">
            {error}
          </p>
        )}

        {/* Login Button */}
        <button
          disabled={!email || !password || loading}
          className={`w-full font-semibold py-3 rounded-lg flex justify-center items-center gap-2  
            ${
              email && password
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }
          `}
        >
          {loading ? <Loader2 className="animate-spin" /> : "Login"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-2 text-gray-400 text-sm mt-2">
          <span className="flex-1 h-px bg-gray-200" />
          OR
          <span className="flex-1 h-px bg-gray-200" />
        </div>

        {/* ✅ Google Login FIXED */}
        <button
          type="button"
          onClick={() => signIn("google")}
          className="w-full flex items-center justify-center gap-3 border py-3 rounded-xl bg-white hover:bg-gray-50"
        >
          <Image src={googleImage} width={20} height={20} alt="google" />
          Continue with Google
        </button>

        {/* Register Redirect */}
        <p className="text-gray-600 mt-6 text-sm flex items-center justify-center gap-1">
          Want to create an account?
          <LogIn className="w-4 h-4" />
          <span
            className="text-green-500 font-bold cursor-pointer"
            onClick={() => router.push("/register")}
          >
            Sign Up
          </span>
        </p>
      </motion.form>
    </div>
  );
};

export default Login;
