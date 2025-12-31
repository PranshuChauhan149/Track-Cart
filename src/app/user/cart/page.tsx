"use client";

import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { incrementQuantity, decrementQuantity, removeFromCart } from "@/redux/cartSlice";
import { Plus, Minus, Trash2 } from "lucide-react";

const CartPage = () => {
  const { cartData } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch<AppDispatch>();

  const subtotal = cartData.reduce(
    (acc, item) => acc + Number(item.price) * item.quantity,
    0
  );

  const tax = subtotal * 0.05;
  const delivery = subtotal > 500 ? 0 : 40;
  const total = subtotal + tax + delivery;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
      
      {/* LEFT — Items */}
      <div className="md:col-span-2 space-y-4">
        <h2 className="text-xl font-bold mb-4">Your Cart</h2>

        {cartData.length === 0 && (
          <p className="text-gray-500">Your cart is empty.</p>
        )}

        {cartData.map(item => (
          <div
            key={item._id}
            className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm"
          >
            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
              <Image src={item.image} alt={item.name} fill className="object-cover" />
            </div>

            <div className="flex-1">
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-gray-500 capitalize">{item.category}</p>
              <p className="text-green-600 font-semibold">
                ₹{item.price} / {item.unit}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => dispatch(decrementQuantity(item._id))}
                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
              >
                <Minus className="w-4 h-4" />
              </button>

              <span className="min-w-[24px] text-center">{item.quantity}</span>

              <button
                onClick={() => dispatch(incrementQuantity(item._id))}
                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => dispatch(removeFromCart(item._id))}
              className="text-red-500 hover:text-red-600"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      {/* RIGHT — Summary */}
      <div className="bg-white p-6 rounded-xl shadow-md h-fit space-y-4">
        <h2 className="text-xl font-bold">Summary</h2>

        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span>Tax (5%)</span>
          <span>₹{tax.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span>Delivery</span>
          <span>{delivery === 0 ? "Free" : `₹${delivery}`}</span>
        </div>

        <hr />

        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>

        <button className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;
