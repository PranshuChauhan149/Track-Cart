"use client";
import React from "react";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
          <ShieldAlert className="w-8 h-8 text-red-600" />
        </div>

        <h1 className="text-2xl font-extrabold text-gray-800 mb-2">
          Access Denied
        </h1>
        <p className="text-gray-600 mb-6">
          You do not have permission to access this page. This area is restricted to administrators only.
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>

          <button
            onClick={() => router.push("/")}
            className="px-5 py-2 rounded-full bg-green-500 hover:bg-green-600 text-white font-medium shadow transition"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
