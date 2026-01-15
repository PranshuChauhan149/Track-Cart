"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { getsocket } from "@/lib/socket";

const DeliveryBoyDashboard = () => {
  const [assignments, setAssignments] = useState<any[]>([]);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await axios.get("/api/delivery/get-assignments");
        setAssignments(res.data.assignments || []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAssignments();
  }, []);

  useEffect(() => {
    const socket = getsocket();

    socket.on("new-assignment", (deliveryAssignment: any) => {
      setAssignments((prev) => {
        const exists = prev.find((a) => a._id === deliveryAssignment._id);
        if (exists) return prev;
        return [deliveryAssignment, ...prev];
      });
    });

    return () => {
      socket.off("new-assignment");
    };
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-green-700 mt-[120px] mb-[30px] text-center">
          Delivery Assignments
        </h2>

        <div className="space-y-4">
          {assignments.map((a) => (
            <div
              key={a._id}
              className="bg-white rounded-xl shadow-md p-5 border border-gray-200"
            >
              <p className="text-lg font-semibold text-gray-800">
                Order #{a.order._id.slice(-6)}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                {a.order.address.fullAddress}
              </p>

              <div className="flex gap-4 mt-4">
                <button className="px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition">
                  Accept
                </button>

                <button className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition">
                  Reject
                </button>
              </div>
            </div>
          ))}

          {!assignments.length && (
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
