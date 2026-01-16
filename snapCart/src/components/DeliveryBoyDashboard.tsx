"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { getsocket } from "@/lib/socket";

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
                Order #{a?.order?._id.slice(-6)}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                {a?.order?.address?.fullAddress}
              </p>

              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => handleAccept(a?._id)}
                  disabled={acceptingId === a?._id}
                  className={`px-4 py-2 rounded-lg text-white font-medium transition ${
                    acceptingId === a?._id
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {acceptingId === a?._id ? "Accepting..." : "Accept"}
                </button>

                <button className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition">
                  Reject
                </button>
              </div>
            </div>
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
