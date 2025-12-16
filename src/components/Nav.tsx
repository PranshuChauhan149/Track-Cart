import mongoose from "mongoose";
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
    px-6 py-3
    flex items-center justify-between
  "
    ></div>
  );
};

export default Nav;
