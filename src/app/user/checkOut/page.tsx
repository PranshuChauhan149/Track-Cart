"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  User,
  Phone,
  Home,
  Building,
  Navigation,
  Search,
} from "lucide-react";
import "leaflet/dist/leaflet.css";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L, { LatLngExpression } from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/684/684908.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const Page = () => {
  const { userData } = useSelector((state: RootState) => state.user);

  const [address, setAddress] = useState({
    fullName: "",
    mobile: "",
    city: "",
    state: "",
    pincode: "",
    fullAddress: "",
  });

  const [position, setPosition] = useState<[number, number] | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!navigator.geolocation) return;

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        setPosition([lat, lon]);

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=en`
          );
          const data = await res.json();

          setAddress((prev) => ({
            ...prev,
            city: data.address.city || data.address.town || "",
            state: data.address.state || "",
            pincode: data.address.postcode || "",
            fullAddress: data.display_name || "",
          }));
        } catch (e) {}

        setLoadingLocation(false);
      },
      () => setLoadingLocation(false)
    );
  }, []);

  useEffect(() => {
    if (userData) {
      setAddress((prev) => ({
        ...prev,
        fullName: userData?.name || "",
        mobile: userData?.mobile || "",
      }));
    }
  }, [userData]);

  return (
    <div className="w-[92%] p-16 md:w-[80%] py-10 relative">
      <motion.div
        onClick={() => router.back()}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2 cursor-pointer text-gray-700 hover:text-black w-fit"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Back</span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-2xl font-bold mt-4 text-center text-green-500"
      >
        CheckOut
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 mt-6 max-w-xl"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <MapPin className="text-green-700" /> Delivery Address
        </h2>

        <div className="space-y-4">
          {/* Full Name */}
          <div className="relative">
            <User className="absolute left-3 top-3 text-green-600" size={18} />
            <input
              type="text"
              value={address.fullName}
              onChange={(e) =>
                setAddress({ ...address, fullName: e.target.value })
              }
              className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
              placeholder="Full Name"
            />
          </div>

          {/* Mobile */}
          <div className="relative">
            <Phone className="absolute left-3 top-3 text-green-600" size={18} />
            <input
              type="text"
              value={address.mobile}
              onChange={(e) =>
                setAddress({ ...address, mobile: e.target.value })
              }
              className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
              placeholder="Mobile Number"
            />
          </div>

          {/* Full Address */}
          <div className="relative">
            <Home className="absolute left-3 top-3 text-green-600" size={18} />
            <input
              type="text"
              value={address.fullAddress}
              onChange={(e) =>
                setAddress({ ...address, fullAddress: e.target.value })
              }
              className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
              placeholder="Full Address"
            />
          </div>

          {/* City / State / Pincode */}
          <div className="grid grid-cols-3 gap-3">
            <div className="relative">
              <Building className="absolute left-3 top-3 text-green-600" size={18} />
              <input
                type="text"
                value={address.city}
                onChange={(e) =>
                  setAddress({ ...address, city: e.target.value })
                }
                className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
                placeholder="City"
              />
            </div>

            <div className="relative">
              <Navigation className="absolute left-3 top-3 text-green-600" size={18} />
              <input
                type="text"
                value={address.state}
                onChange={(e) =>
                  setAddress({ ...address, state: e.target.value })
                }
                className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
                placeholder="State"
              />
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-3 text-green-600" size={18} />
              <input
                type="text"
                value={address.pincode}
                onChange={(e) =>
                  setAddress({ ...address, pincode: e.target.value })
                }
                className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
                placeholder="Pincode"
              />
            </div>
          </div>

          {/* Search area */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="search city area..."
              className="flex-1 border rounded-lg p-2 text-sm"
            />
            <button className="bg-green-600 text-white px-4 rounded-lg">
              Search
            </button>
          </div>

          {/* Map */}
          <div className="relative mt-6 h-[330px] rounded-xl overflow-hidden border-gray-100 shadow-inner">
            {position && (
              <MapContainer
                className="w-full h-full"
                center={position as LatLngExpression}
                zoom={13}
                scrollWheelZoom={false}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={position} icon={markerIcon}>
                  <Popup>Your delivery location.  </Popup>
                </Marker>
              </MapContainer>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Page;
