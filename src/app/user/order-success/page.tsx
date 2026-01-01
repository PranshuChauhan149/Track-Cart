"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const floating = {
  animate: {
    y: [0, -12, 0],
  },
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

const pulseRing = {
  animate: {
    scale: [1, 1.15, 1],
    opacity: [0.4, 0, 0.4],
  },
  transition: {
    duration: 2.5,
    repeat: Infinity,
    ease: "easeOut",
  },
};

const OrderSuccess = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-50 to-white">
      
      {/* Floating blobs */}
      <motion.div {...floating} className="absolute w-64 h-64 bg-green-200 rounded-full blur-3xl opacity-30 -top-10 -left-10" />
      <motion.div {...floating} transition={{ ...floating.transition, delay: 1 }} className="absolute w-64 h-64 bg-green-300 rounded-full blur-3xl opacity-20 top-1/2 -right-10" />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center z-10"
      >
        {/* Pulsing ring */}
        <motion.div
          {...pulseRing}
          className="absolute inset-0 rounded-full border-2 border-green-400"
        />

        {/* Check Icon */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex justify-center"
        >
          <CheckCircle className="text-green-500 w-20 h-20" />
        </motion.div>

        <h1 className="text-2xl font-bold mt-6 text-gray-800">
          Order Placed Successfully 🎉
        </h1>

        <p className="text-gray-600 mt-2">
          Thank you for your order! Your groceries will be delivered soon.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/orders")}
            className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition"
          >
            View My Orders
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/")}
            className="w-full border border-gray-300 py-3 rounded-xl hover:bg-gray-100 transition"
          >
            Continue Shopping
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;
