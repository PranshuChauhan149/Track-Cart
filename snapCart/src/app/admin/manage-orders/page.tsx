"use client";

import { IOrder } from "@/models/order.model";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Package,
  User,
  Phone,
  MapPin,
  CreditCard,
  Truck,
} from "lucide-react";
import { motion } from "framer-motion";
import { getsocket } from "@/lib/socket";

const statusColors: any = {
  pending: "bg-yellow-100 text-yellow-700",
  out_for_delivery: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemAnim = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 },
};

const ManageOrders = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const result = await axios.get("/api/admin/get-orders");
        setOrders(result.data.data || result.data);
      } catch (error) {
        console.log(error);
      }
    };
    getOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingId(orderId);

      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );

      await axios.post(`/api/admin/update-order-status/${orderId}`, {
        status: newStatus,
      });
    } catch (error) {
      console.error("Failed to update order status", error);
      alert("Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    const socket = getsocket();
    const handler = (order: IOrder) => {
      setOrders((prev) => [order, ...prev]);
    };

    socket?.on("new-order", handler);

    return () => {
      socket?.off("new-order", handler);
    };
  }, []);
console.log(orders);

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={container}
      className="min-h-screen bg-gray-50 px-6 py-8"
    >
      <motion.div variants={itemAnim} className="flex items-center gap-3 mb-8">
        <ArrowLeft className="cursor-pointer hover:text-green-600 transition" />
        <h1 className="text-2xl font-semibold">Manage Orders</h1>
      </motion.div>

      <div className="space-y-6">
        {orders.map((order) => (
          <motion.div
            key={order._id}
            variants={itemAnim}
            whileHover={{ scale: 1.01 }}
            className="bg-white rounded-2xl shadow-sm border p-6 transition"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-green-600 font-semibold">
                  <Package size={18} />
                  Order #{order._id.slice(-6)}
                </div>

                <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-red-100 text-red-600">
                  {order.isPaid ? "Paid" : "Unpaid"}
                </span>

                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleString()}
                </p>

                <div className="text-sm space-y-2 mt-3 text-gray-700">
                  <p className="flex items-center gap-2">
                    <User size={14} /> {order.address.fullName}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone size={14} /> {order.address.mobile}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin size={14} />
                    {order.address.city}, {order.address.state},{" "}
                    {order.address.pincode}
                  </p>
                  <p className="flex items-center gap-2">
                    <CreditCard size={14} />
                    {order.paymentMethod === "online"
                      ? "Online Payment"
                      : "Cash on Delivery"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs capitalize ${
                    statusColors[order.status]
                  }`}
                >
                  {order.status.replaceAll("_", " ")}
                </span>

                <select
                  value={order.status}
                  disabled={updatingId === order._id}
                  onChange={(e) =>
                    handleStatusChange(order._id.toString(), e.target.value)
                  }
                  className="border rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-green-400 disabled:opacity-50"
                >
                  <option value="pending">Pending</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="mt-5 border-t pt-4">
              <p className="text-sm text-gray-600 mb-3">
                {order.items.length} Items
              </p>

              <div className="space-y-2">
                {order.items.map((item: any, i: number) => (
                  <motion.div
                    key={i}
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-3"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={40}
                      height={40}
                      className="rounded-md border"
                    />
                    <p className="text-sm font-medium">
                      {item.name} — ₹{item.price}/{item.unit}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center mt-5 border-t pt-4">
              <p className="flex items-center gap-2 text-sm text-gray-500 capitalize">
                <Truck size={14} /> {order.status.replaceAll("_", " ")}
              </p>
              <p className="text-lg font-semibold text-green-600">
                Total: ₹{order.totalAmount}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ManageOrders;
