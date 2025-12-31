"use client";

import {
  Apple,
  Milk,
  Beef,
  Coffee,
  Cookie,
  Home,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Grid,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRef } from "react";

const categories = [
  { name: "fruits & vegetables", icon: Apple, color: "bg-green-100" },
  { name: "dairy & bakery", icon: Milk, color: "bg-yellow-100" },
  { name: "meat & seafood", icon: Beef, color: "bg-red-100" },
  { name: "beverages", icon: Coffee, color: "bg-blue-100" },
  { name: "snacks", icon: Cookie, color: "bg-orange-100" },
  { name: "household", icon: Home, color: "bg-purple-100" },
  { name: "personal care", icon: Sparkles, color: "bg-pink-100" },
];

const CategorySlider = () => {
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const scroll = (dir: "left" | "right") => {
    if (!sliderRef.current) return;
    sliderRef.current.scrollBy({
      left: dir === "left" ? -260 : 260,
      behavior: "smooth",
    });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: false, amount: 0.5 }}
      className="w-full py-12"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Heading */}
        <div className="flex justify-center items-center gap-2 mb-6">
          <Grid className="w-6 h-6 text-gray-700" />
          <h2 className="text-2xl font-extrabold text-gray-800">
            Shop by Category
          </h2>
        </div>

        {/* Slider */}
        <div className="relative">
          <button
            onClick={() => scroll("left")}
            className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 p-2 bg-white shadow-md rounded-full hover:bg-gray-100 transition block lg:hidden"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => scroll("right")}
            className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 p-2 bg-white shadow-md rounded-full hover:bg-gray-100 transition block lg:hidden"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div
            ref={sliderRef}
            className="flex gap-4 overflow-x-auto pb-4 px-4 scrollbar-hide scroll-smooth"
          >
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <motion.div
                  key={cat.name}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.97 }}
                  className={`
                    min-w-[150px] h-32 rounded-2xl
                    ${cat.color}
                    flex flex-col items-center justify-center
                    shadow-md cursor-pointer
                    transition
                  `}
                >
                  <Icon className="w-8 h-8 text-gray-700 mb-2" />
                  <p className="text-sm font-semibold text-gray-700 text-center px-2 capitalize">
                    {cat.name}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default CategorySlider;
