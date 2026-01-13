"use client";
import React, { useEffect, useState } from "react";
import { ShoppingBag, Truck, Leaf } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const slides = [
  {
    id: 1,
    icon: ShoppingBag,
    title: "Fresh Groceries Delivered",
    subtitle: "Order farm-fresh fruits, vegetables and daily essentials from local stores in minutes.",
    btnText: "Shop Now",
    bg: "https://plus.unsplash.com/premium_photo-1664551734602-49640bd82eba?w=1000&auto=format&fit=crop&q=60",
  },
  {
    id: 2,
    icon: Truck,
    title: "Fast & Reliable Delivery",
    subtitle: "Get your groceries delivered to your doorstep within 30 minutes.",
    btnText: "Track Order",
    bg: "https://images.unsplash.com/photo-1695654390723-479197a8c4a3?w=1000&auto=format&fit=crop&q=60",
  },
  {
    id: 3,
    icon: Leaf,
    title: "100% Fresh & Organic",
    subtitle: "We partner with trusted farmers to bring you healthy, organic food every day.",
    btnText: "Explore Organic",
    bg: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=1000&auto=format&fit=crop&q=60",
  },
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];
  const Icon = slide.icon;

  return (
    <div className="relative w-full h-[90vh] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${slide.bg})` }}
        >
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-center text-white px-6 max-w-2xl">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex justify-center mb-6"
              >
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur shadow-lg">
                  <Icon className="w-8 h-8 text-white" />
                </div>
              </motion.div>

              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-4xl md:text-5xl font-extrabold mb-4"
              >
                {slide.title}
              </motion.h1>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-lg text-gray-200 mb-6"
              >
                {slide.subtitle}
              </motion.p>

              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="px-8 py-3 rounded-full bg-green-500 hover:bg-green-600 text-white font-semibold shadow-lg transition"
              >
                {slide.btnText}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              current === i ? "bg-white scale-125" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
