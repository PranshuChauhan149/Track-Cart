import { Search, ShoppingCart, User } from "lucide-react";
import mongoose from "mongoose";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface IUser {
  _id?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  mobile?: string;
  role: "user" | "deliveryBoy" | "admin";
  image?: string;
}

const Nav = ({ user }: { user: IUser }) => {
  return (
    <div
      className="
        w-[95%]
        fixed top-4 left-1/2 -translate-x-1/2
        z-50
        rounded-2xl
        bg-gradient-to-r from-green-500 via-emerald-400 to-green-600
        backdrop-blur-lg
        shadow-xl shadow-green-300/40
        border border-white/20
        px-4 py-3 h-20 md:px-8 
        flex items-center justify-between
      "
    >
      {/* Logo */}
      <Link
        href="/"
        className="
          text-2xl font-extrabold
          text-white
          tracking-wide
          hover:opacity-80
          transition
        "
      >
        Snapcart
      </Link>

      {/* Search Bar */}
      <form
        className="
          hidden md:flex items-center
          bg-white/90 backdrop-blur
          rounded-full px-4 py-2
          shadow-sm
          w-[380px] max-w-full
          focus-within:ring-2 focus-within:ring-green-400
          transition
        "
      >
        <Search className="w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search groceries..."
          className="
            ml-2 w-full
            bg-transparent outline-none
            text-sm text-gray-700
            placeholder:text-gray-400
          "
        />
      </form>

      {/* Cart */}
      <div className="flex items-center gap-3 md:gap-6 relative">
        <Link
          href="/cart"
          className="
            relative flex items-center justify-center
            w-11 h-11 rounded-full
            bg-white/20 hover:bg-white/30
            text-white
            transition
          "
        >
          <ShoppingCart className="w-6 h-6" />

          {/* Badge */}
          <span
            className="
              absolute -top-1 -right-1
              min-w-[20px] h-[20px]
              px-1
              rounded-full
              bg-red-500
              text-white text-xs font-bold
              flex items-center justify-center
              shadow-md
            "
          >
            0
          </span>
        </Link>
        <div
          className="
    relative
    w-11 h-11
    rounded-full
    overflow-hidden
    border-2 border-white/40
    bg-white/20
    flex items-center justify-center
    shadow-md
  "
        >
          {user.image ? (
            <Image
              src={user.image}
              alt="profile"
              fill
              className="object-cover"
            />
          ) : (
            <User className="w-6 h-6 text-white" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Nav;
