"use client";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Leaf,
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
type propType = {
  nextStep: (s: number) => void;
};
const RegisterFrom = ({ nextStep }: propType) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const handleSubmit = async (e: React.FocusEvent) => {
    e.preventDefault();
    try {
      const result = await axios.post("/api/auth/register", {
        name,
        email,
        password,
      });
      console.log(result.data);
    } catch (error) {}
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 py-10 min-h-screen bg-white relative">
      <div
        className="absolute top-6 left-6 flex items-center gap-2 text-green-700 hover:text-green-800 transition-colors cursor-pointer"
        onClick={() => nextStep(1)}
      >
        <ArrowLeft />
        <span
          className="
      font-medium"
        >
          Back
        </span>
      </div>
      <motion.h1
        className="text-4xl font-extrabold text-green-700 mb-2 "
        initial={{
          y: -10,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.6,
        }}
      >
        Create Account
      </motion.h1>
      <p className="text-gray-600 mb-8 flex items-center ">
        Join snapCart today <Leaf className="w-5 h-5 text-green-600" />{" "}
      </p>
      <motion.form
        onSubmit={handleSubmit}
        className=" mt-3 flex flex-col gap-5 w-full max-w-sm"
        initial={{
          y: -10,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.6,
        }}
      >
        <div className="relative">
          <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Your Name"
            className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </div>
        <div className="relative">
          <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type={show ? "text" : "password"}
            placeholder="Your Password"
            className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          {show ? (
            <EyeOff
              className="absolute right-3 top-3.5 w-5 h-5 text-gray-500 cursor-pointer"
              onClick={() => setShow(!show)}
            />
          ) : (
            <Eye
              className="absolute right-3 top-3.5 w-5 h-5 text-gray-500 cursor-pointer"
              onClick={() => setShow(!show)}
            />
          )}
        </div>
        {(() => {
          const formValidation = name !== "" && email !== "" && password !== "";
          return (
            <button
              disabled={!formValidation}
              className={`w-full font-semibold py-3 rounded-lg transition-all duration-200 shadow-md inline-flex items-center justify-center gap-2  
    ${
      formValidation
        ? "bg-green-600 hover:bg-green-700 text-white"
        : "bg-gray-300 text-gray-500 cursor-not-allowed"
    }
  `}
            >
              Register
            </button>
          );
        })()}

        <div className="flex items-center gap-2 text-gray-400 text-sm mt-2">
          <span className="flex-1 h-px bg-gray-200"></span>
          OR
          <span className="flex-1 h-px bg-gray-200"></span>
        </div>

        <button
          className="
    w-full 
    flex items-center justify-center gap-3
    border border-gray-300 
    py-3 rounded-xl 
    bg-white 
    hover:bg-gray-50 
    transition-all duration-200 
    shadow-sm 
    hover:shadow-md
    text-gray-700 font-medium
  "
        >
          <Image src={googleImage} width={20} height={20} alt="google" />
          Continue with Google
        </button>

        <p className="text-gray-600 mt-6 text-sm flex items-center justify-center gap-1">
          Already have an account ? <LogIn className="w-4 h-4" />
          <span className="text-green-500 font-bold"> Sign in</span>
        </p>
      </motion.form>
    </div>
  );
};

export default RegisterFrom;
