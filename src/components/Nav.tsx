"use client";
import {
  Search,
  ShoppingCart,
  User,
  LogOut,
  ShoppingBag,
} from "lucide-react";
import mongoose from "mongoose";
import { AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { signOut } from "next-auth/react";

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
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const profileDropDown = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileDropDown.current &&
        !profileDropDown.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }

      if (
        searchRef.current &&
        !searchRef.current.contains(e.target as Node)
      ) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div
        className="
          w-[95%] fixed top-4 left-1/2 -translate-x-1/2 z-50
          rounded-2xl bg-gradient-to-r from-green-500 via-emerald-400 to-green-600
          backdrop-blur-lg shadow-xl shadow-green-300/40 border border-white/20
          px-4 py-3 h-20 md:px-8 flex items-center justify-between
        "
      >
        <Link href="/" className="text-2xl font-extrabold text-white tracking-wide hover:opacity-80">
          Snapcart
        </Link>

        {/* Desktop Search */}
        <form className="hidden md:flex items-center bg-white/90 rounded-full px-4 py-2 shadow-sm w-[380px] focus-within:ring-2 focus-within:ring-green-400">
          <Search className="w-5 h-5 text-gray-500" />
          <input type="text" placeholder="Search groceries..." className="ml-2 w-full bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400" />
        </form>

        {/* Mobile Search Icon */}

        <div className="flex items-center gap-3 md:gap-6 relative">
        <button
          onClick={() => setSearchOpen(true)}
          className="md:hidden w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
        >
          <Search className="w-5 h-5" />
        </button>
          <Link href="/cart" className="relative flex items-center justify-center w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 text-white">
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center shadow-md">
              0
            </span>
          </Link>

          <div className="relative" ref={profileDropDown}>
            <div
              className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-white/40 bg-white/20 flex items-center justify-center shadow-md cursor-pointer hover:bg-white/30"
              onClick={() => setOpen(!open)}
            >
              {user.image ? (
                <Image src={user.image} alt="profile" fill className="object-cover" />
              ) : (
                <User className="w-6 h-6 text-white" />
              )}
            </div>

            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 w-52 rounded-xl bg-white/90 shadow-lg border border-gray-200 z-50 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b">
                    <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>

                  <div className="flex flex-col">
                    <button className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100">
                      <User className="w-4 h-4" /> Profile
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100">
                      <ShoppingBag className="w-4 h-4" /> Orders
                    </button>
                    <button
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            onClick={() => setSearchOpen(false)}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm flex items-start justify-center pt-24"
          >
            <div
              ref={searchRef}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl px-4 py-3 w-[90%] max-w-md shadow-xl flex items-center gap-2"
            >
              <Search className="w-5 h-5 text-gray-500" />
              <input autoFocus type="text" placeholder="Search groceries..." className="flex-1 outline-none text-sm text-gray-700" />
              <button onClick={() => setSearchOpen(false)} className="text-gray-500 text-sm">
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Nav;
