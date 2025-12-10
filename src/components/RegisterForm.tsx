"use client";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Leaf,
  Loader2,
  Lock,
  LogIn,
  Mail,
  User,
} from "lucide-react";
import React, { useState } from "react";
import googleImage from "@/assesst/google.png";
import Image from "next/image";

import { motion } from "framer-motion";
import axios from "axios";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

type propType = {
  nextStep: (s: number) => void;
};

const RegisterFrom = ({ nextStep }: propType) => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) return;

    setLoading(true);

    try {
      await axios.post("/api/auth/register", {
        name,
        email,
        password,
      });

 
      router.push("/login");
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Registration failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const formValidation = name && email && password;

  return (
    <div className="flex flex-col items-center justify-center px-6 py-10 min-h-screen bg-white relative">
      <div
        className="absolute top-6 left-6 flex items-center gap-2 text-green-700 hover:text-green-800 transition cursor-pointer"
        onClick={() => nextStep(1)}
      >
        <ArrowLeft />
        <span className="font-medium">Back</span>
      </div>

      <motion.h1
        className="text-4xl font-extrabold text-green-700 mb-2"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        Create Account
      </motion.h1>

      <p className="text-gray-600 mb-8 flex items-center gap-1">
        Join snapCart today <Leaf className="w-5 h-5 text-green-600" />
      </p>

      <motion.form
        onSubmit={handleSubmit}
        className="mt-3 flex flex-col gap-5 w-full max-w-sm"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Name */}
        <div className="relative">
          <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Your Name"
            className="w-full border rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-green-500"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </div>

        {/* Email */}
        <div className="relative">
          <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full border rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-green-500"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        {/* Password */}
        <div className="relative">
          <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type={show ? "text" : "password"}
            placeholder="Your Password"
            className="w-full border rounded-xl py-3 pl-10 pr-10 focus:ring-2 focus:ring-green-500"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
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

        {/* Error */}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        {/* Button */}
        <button
          disabled={!formValidation || loading}
          className={`w-full font-semibold py-3 rounded-lg flex justify-center items-center gap-2 ${
            formValidation
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          {loading ? <Loader2 className="animate-spin" /> : "Register"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-2 text-gray-400 text-sm mt-2">
          <span className="flex-1 h-px bg-gray-200" />
          OR
          <span className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Google Sign In */}
 <button
  type="button"
  onClick={() => signIn("google", { callbackUrl: "/" })}
  className="w-full flex items-center justify-center gap-3 border py-3 rounded-xl bg-white hover:bg-gray-50"
>
  <Image src={googleImage} width={20} height={20} alt="google" />
  Continue with Google
</button>

        {/* Login Redirect */}
        <p className="text-gray-600 mt-6 text-sm flex items-center justify-center gap-1">
          Already have an account? <LogIn className="w-4 h-4" />
          <span
            className="text-green-500 font-bold cursor-pointer"
            onClick={() => router.push("/login")}
          >
            Sign in
          </span>
        </p>
      </motion.form>
    </div>
  );
};

export default RegisterFrom;
