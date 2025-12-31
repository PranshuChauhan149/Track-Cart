"use client";

import { AppDispatch } from "@/redux/store";
import { setUserData } from "@/redux/UserSlice";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const useGetMe = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const getMe = async () => {
      try {
        const res = await axios.get("/api/me");
      
        
        dispatch(setUserData(res.data.user));
      } catch (err) {
        console.error(err);
      }
    };

    getMe();
  }, []);

  return null;
};

export default useGetMe;
