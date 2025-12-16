"use client";

import React, { useState } from "react";
import { Bike, User, UserCog, CheckCircle, Phone } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

const EditRoleAndMoble = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");

  const roles = [
    { id: "admin", label: "Admin", icon: UserCog },
    { id: "user", label: "User", icon: User },
    { id: "deliveryBoy", label: "Delivery Boy", icon: Bike },
  ];

  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setMobile(value);

    if (value.length !== 10) {
      setError("Mobile number must be 10 digits");
    } else {
      setError("");
    }
  };

  const handleEdit = async () => {
    try {
      const res = await axios.post("/api/user/edit-role-mobile", {
        role: selectedRole,
        mobile,
      });
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-br from-green-100 via-gray-100 to-green-50 p-6">
      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-4xl font-extrabold text-green-700 text-center mt-8"
      >
        Select Your Role
      </motion.h1>

      {/* Role cards */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-6 mt-12">
        {roles.map((role, index) => {
          const Icon = role.icon;
          const isActive = selectedRole === role.id;

          return (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedRole(role.id)}
              className={`relative cursor-pointer w-72 rounded-2xl border-2 p-6 shadow-lg transition-all
                ${
                  isActive
                    ? "border-green-600 bg-green-50 shadow-green-300"
                    : "border-gray-200 bg-white hover:border-green-400"
                }`}
            >
              {isActive && (
                <CheckCircle className="absolute top-4 right-4 text-green-600" />
              )}

              <div
                className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full
                  ${
                    isActive
                      ? "bg-green-600 text-white"
                      : "bg-green-100 text-green-700"
                  }`}
              >
                <Icon size={32} />
              </div>

              <h2 className="text-center text-xl font-semibold text-gray-800">
                {role.label}
              </h2>
              <p className="mt-2 text-center text-sm text-gray-500">
                Continue as {role.label}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Mobile input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-14 mx-auto w-full max-w-md"
      >
        <label className="block mb-2 text-sm font-semibold text-gray-700">
          Mobile Number
        </label>

        <div className="relative">
          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600" />
          <input
            type="text"
            maxLength={10}
            value={mobile}
            onChange={handleMobileChange}
            placeholder="Enter 10-digit mobile number"
            className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-12 pr-4 text-gray-800 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
          />
        </div>

        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </motion.div>

      {/* Continue button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-10 flex justify-center"
      >
        <button onClick={handleEdit}
          disabled={!selectedRole || mobile.length !== 10}
          className={`rounded-xl px-10 py-3 font-semibold text-white transition-all
            ${
              selectedRole && mobile.length === 10
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
        >
          go to Home
        </button>
      </motion.div>
    </div>
  );
};

export default EditRoleAndMoble;
