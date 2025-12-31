"use client";

import mongoose from "mongoose";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { addToCart, incrementQuantity, decrementQuantity } from "@/redux/cartSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export interface IGrocery {
  _id?: mongoose.Types.ObjectId | string;
  name: string;
  category: string;
  price: string;
  unit: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const GroceryItemCard = ({ item }: { item: IGrocery }) => {
  const dispatch = useDispatch<AppDispatch>();
  const cartItem = useSelector((state: RootState) =>
    state.cart.cartData.find((i) => i._id === item._id)
  );

  const quantity = cartItem?.quantity || 0;

  const handleAdd = () => {
    dispatch(addToCart({ ...item, quantity: 1 }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden"
    >
      {/* Image with scale only */}
      <motion.div
        whileHover={{ scale: 1.08 }}
        transition={{ duration: 0.3 }}
        className="relative w-full h-40 bg-gray-100 p-3 overflow-hidden"
      >
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name || "Grocery item"}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-cover rounded-xl"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No Image
          </div>
        )}
      </motion.div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-base font-semibold text-gray-800 line-clamp-1">
          {item.name}
        </h3>

        <p className="text-xs text-gray-500 capitalize">{item.category}</p>

        <div className="flex items-center justify-between mt-3">
          <p className="text-lg font-bold text-green-600">
            ₹{item.price}
            <span className="text-sm text-gray-500"> / {item.unit}</span>
          </p>

          {quantity === 0 ? (
            <motion.button
              onClick={handleAdd}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.08 }}
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-600 text-white rounded-full hover:bg-green-700 transition"
            >
              <ShoppingCart className="w-4 h-4" />
              Add
            </motion.button>
          ) : (
            <div className="flex items-center gap-2 bg-green-50 rounded-full px-3 py-1">
              <button
                onClick={() => dispatch(decrementQuantity(item._id as string))}
                className="w-6 h-6 flex items-center justify-center rounded-full bg-green-600 text-white"
              >
                <Minus className="w-3 h-3" />
              </button>

              <span className="text-sm font-semibold">{quantity}</span>

              <button
                onClick={() => dispatch(incrementQuantity(item._id as string))}
                className="w-6 h-6 flex items-center justify-center rounded-full bg-green-600 text-white"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default GroceryItemCard;
