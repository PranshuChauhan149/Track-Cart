"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { getsocket } from "@/lib/socket";
import { motion } from "framer-motion";
import { Package, MapPin, Truck } from "lucide-react";

const DeliveryBoyDashboard = () => {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await axios.get("/api/delivery/get-assignments");
        setAssignments(res.data.assignments || []);
      } catch (error) {
        console.error("Fetch assignments failed:", error);
      }
    };

    fetchAssignments();
  }, []);

  const handleAccept = async (id: string) => {
    try {
      setAcceptingId(id);

     const res =  await axios.get(`/api/delivery/assignment/${id}/accept-assignment`);
console.log(res.data);

      setAssignments((prev) => prev.filter((a) => a._id !== id));
    } catch (error) {
      console.error("Accept failed:", error);
    } finally {
      setAcceptingId(null);
    }
  };

  useEffect(() => {
    const socket = getsocket();

    const handler = (deliveryAssignment: any) => {
      setAssignments((prev) => {
        const exists = prev.find((a) => a._id === deliveryAssignment._id);
        if (exists) return prev;
        return [deliveryAssignment, ...prev];
      });
    };

    socket.on("new-assignment", handler);

    return () => {
      socket.off("new-assignment", handler);
    };
  }, []);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mt-28 mb-8"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
            <Truck className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600">
            Delivery Assignments
          </h2>
        </motion.div>

        <div className="space-y-4">
          {assignments.map((a) => (
            <motion.div
              key={a._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-3xl shadow-lg hover:shadow-2xl p-6 border border-gray-100 transition-all"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-800">
                    Order #{a?.order?._id.slice(-6)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {a?.order?.address?.fullAddress}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 mt-4">
                <motion.button
                  onClick={() => handleAccept(a?._id)}
                  disabled={acceptingId === a?._id}
                  whileHover={{ scale: acceptingId !== a?._id ? 1.05 : 1 }}
                  whileTap={{ scale: acceptingId !== a?._id ? 0.95 : 1 }}
                  className={`flex-1 px-6 py-3 rounded-2xl text-white font-bold transition-all shadow-lg ${
                    acceptingId === a?._id
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-green-500/30"
                  }`}
                >
                  {acceptingId === a?._id ? "Accepting..." : "Accept"}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-6 py-3 rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold hover:from-red-600 hover:to-pink-600 transition-all shadow-lg shadow-red-500/30"
                >
                  Reject
                </motion.button>
              </div>
            </motion.div>
          ))}

          {!assignments?.length && (
            <p className="text-center text-gray-500 mt-10">
              No delivery assignments yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryBoyDashboard;
