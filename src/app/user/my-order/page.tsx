"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  MapPin,
  Package,
  CreditCard,
  Loader2,
} from "lucide-react";

interface OrderItem {
  name: string;
  quantity: number;
  image: string;
  price: number;
}

interface Order {
  _id: string;
  createdAt: string;
  paymentMethod: string;
  address: { fullAddress: string };
  items: OrderItem[];
  totalAmount: number;
  status: string;
  paymentStatus?: string;
}

const MyOrder = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("/api/user/my-order");
        setOrders(res.data.orders);
      } catch (err: any) {
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-green-600">
        <Loader2 className="animate-spin" />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white px-4 py-10">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
          <Package className="text-green-600" /> My Orders
        </h1>

        {orders.map((order) => (
          <motion.div
            key={order._id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden"
          >
            {/* Header */}
            <button
              onClick={() => setOpen(open === order._id ? null : order._id)}
              className="w-full p-5 flex justify-between items-start text-left"
            >
              <div className="space-y-2">
                <p className="text-sm text-green-700 font-semibold">
                  Order #{order._id.slice(-6)}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(order.createdAt).toLocaleString()}
                </p>

                <div className="flex gap-2">
                  <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                    {order.status}
                  </span>
                  <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                    {order.paymentMethod}
                  </span>
                </div>

                <p className="flex items-center gap-1 text-sm text-gray-600">
                  <MapPin size={14} /> {order.address.fullAddress}
                </p>
              </div>

              <motion.div animate={{ rotate: open === order._id ? 180 : 0 }}>
                <ChevronDown className="text-gray-500" />
              </motion.div>
            </button>

            {/* Items */}
            <AnimatePresence>
              {open === order._id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t px-5 py-4 bg-gray-50"
                >
                  {order.items.map((item: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          className="w-14 h-14 rounded-lg object-cover border"
                        />
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold text-sm text-gray-700">
                        ₹{item.price}
                      </p>
                    </div>
                  ))}

                  <div className="flex justify-between border-t pt-3 mt-3 font-semibold text-sm">
                    <span>Total</span>
                    <span className="text-green-700">₹{order.totalAmount}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MyOrder;
