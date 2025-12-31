"use client";

import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import {
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
} from "@/redux/cartSlice";
import { Plus, Minus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";


const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemAnim = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
  exit: { opacity: 0, x: 100 },
};

const CartPage = () => {
  const router = useRouter();
  const { cartData, subTotal, finalTotal, deliveryFee } = useSelector(
    (state: RootState) => state.cart
  );
  const dispatch = useDispatch<AppDispatch>();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8"
    >
      {/* LEFT — Items */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="md:col-span-2 space-y-4"
      >
        <h2 className="text-xl font-bold mb-4">Your Cart</h2>

        {cartData.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-500"
          >
            Your cart is empty.
          </motion.p>
        )}

        <AnimatePresence>
          {cartData.map((item) => (
            <motion.div
              key={item._id}
              variants={itemAnim}
              initial="hidden"
              animate="show"
              exit="exit"
              layout
              className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </motion.div>

              <div className="flex-1">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-500 capitalize">
                  {item.category}
                </p>
                <p className="text-green-600 font-semibold">
                  ₹{item.price} / {item.unit}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => dispatch(decrementQuantity(item._id))}
                  className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
                >
                  <Minus className="w-4 h-4" />
                </motion.button>

                <span className="min-w-[24px] text-center">
                  {item.quantity}
                </span>

                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => dispatch(incrementQuantity(item._id))}
                  className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
                >
                  <Plus className="w-4 h-4" />
                </motion.button>
              </div>

              <motion.button
                whileHover={{ rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => dispatch(removeFromCart(item._id))}
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 className="w-5 h-5" />
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* RIGHT — Summary */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white p-6 rounded-xl shadow-md h-fit space-y-4"
      >
        <h2 className="text-xl font-bold">Summary</h2>

        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>₹{subTotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span>Delivery</span>
          <span>{deliveryFee}</span>
        </div>

        <hr />

        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>₹{finalTotal.toFixed(2)}</span>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition"
          onClick={() => router.push("/user/checkOut")}
        >
          Proceed to Checkout
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default CartPage;
