"use client";

import React, { useEffect, useState, useRef } from "react";
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
  LocateFixed,
  Loader2,
  CreditCard,
  Wallet,
} from "lucide-react";
import "leaflet/dist/leaflet.css";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import axios from "axios";

const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/684/684908.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const Page = () => {
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">(
    "online"
  );

  const [searchquery, setSearchQuery] = useState("");

  const { userData } = useSelector((state: RootState) => state.user);
  const { subTotal, cartData, deliveryFee, finalTotal } = useSelector(
    (state: RootState) => state.cart
  );
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
  const [searching, setSearching] = useState(false);

  const router = useRouter();
  const mapRef = useRef<any>(null);

  const reverseGeocode = async (lat: number, lon: number) => {
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
    } catch {}
  };

  const fetchCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        setPosition([lat, lon]);
        mapRef.current?.flyTo([lat, lon], 14);
        await reverseGeocode(lat, lon);
        setLoadingLocation(false);
      },
      () => setLoadingLocation(false)
    );
  };

  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  const handleSearch = async () => {
    if (!searchquery) return;
    setSearching(true);

    const provider = new OpenStreetMapProvider();
    const result = await provider.search({ query: searchquery });

    if (result?.length) {
      const lat = result[0].y;
      const lon = result[0].x;

      setPosition([lat, lon]);
      mapRef.current?.flyTo([lat, lon], 14);
      await reverseGeocode(lat, lon);
    }

    setSearching(false);
  };

  useEffect(() => {
    if (userData) {
      setAddress((prev) => ({
        ...prev,
        fullName: userData?.name || "",
        mobile: userData?.mobile || "",
      }));
    }
  }, [userData]);

  const handleCod = async () => {
    try {
      if (!userData?._id) return;

      const payload = {
        userId: userData._id,
        items: cartData.map((item) => ({
          grocery: item._id,
          name: item.name,
          price: item.price,
          unit: item.unit,
          image: item.image,
          quantity: item.quantity,
        })),
        paymentMethod: "cod",
        totalAmount: finalTotal,
        address: {
          fullName: address.fullName,
          mobile: address.mobile,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          fullAddress: address.fullAddress,
          latitude: position?.[0],
          longitude: position?.[1],
        },
      };

      const result = await axios.post("/api/user/order", payload);

      console.log("Order placed:", result.data);
      router.push("/user/order-success");
    } catch (error) {
      console.error("Order failed:", error);
    }
  };

  return (
    <div className="w-full px-4 py-10 flex justify-center">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* LEFT - ADDRESS */}
        <div className="md:col-span-2">
          <motion.div
            onClick={() => router.back()}
            className="flex items-center gap-2 cursor-pointer text-gray-700 hover:text-black w-fit"
          >
            <ArrowLeft className="w-5 h-5" /> Back
          </motion.div>

          <h1 className="text-2xl font-bold mt-4 text-center text-green-500">
            CheckOut
          </h1>

          <div className="bg-white rounded-2xl shadow-lg p-6 border mt-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MapPin className="text-green-700" /> Delivery Address
            </h2>

            <div className="space-y-4">
              <div className="relative">
                <User
                  className="absolute left-3 top-3 text-green-600"
                  size={18}
                />
                <input
                  value={address.fullName}
                  onChange={(e) =>
                    setAddress({ ...address, fullName: e.target.value })
                  }
                  className="pl-10 w-full border rounded-lg p-3 bg-gray-50"
                  placeholder="Full Name"
                />
              </div>

              <div className="relative">
                <Phone
                  className="absolute left-3 top-3 text-green-600"
                  size={18}
                />
                <input
                  value={address.mobile}
                  onChange={(e) =>
                    setAddress({ ...address, mobile: e.target.value })
                  }
                  className="pl-10 w-full border rounded-lg p-3 bg-gray-50"
                  placeholder="Mobile"
                />
              </div>

              <div className="relative">
                <Home
                  className="absolute left-3 top-3 text-green-600"
                  size={18}
                />
                <input
                  value={address.fullAddress}
                  onChange={(e) =>
                    setAddress({ ...address, fullAddress: e.target.value })
                  }
                  className="pl-10 w-full border rounded-lg p-3 bg-gray-50"
                  placeholder="Full Address"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  value={address.city}
                  readOnly
                  className="border rounded-lg p-3 bg-gray-50"
                  placeholder="City"
                />
                <input
                  value={address.state}
                  readOnly
                  className="border rounded-lg p-3 bg-gray-50"
                  placeholder="State"
                />
                <input
                  value={address.pincode}
                  readOnly
                  className="border rounded-lg p-3 bg-gray-50"
                  placeholder="Pincode"
                />
              </div>

              <div className="flex gap-2">
                <input
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search city area..."
                  className="flex-1 border rounded-lg p-2"
                />
                <button
                  onClick={handleSearch}
                  disabled={searching}
                  className="bg-green-600 text-white px-4 rounded-lg flex items-center gap-2 disabled:opacity-60"
                >
                  {searching && <Loader2 className="animate-spin" size={16} />}
                  Search
                </button>
              </div>

              <div className="relative mt-6 h-[330px] rounded-xl overflow-hidden">
                {position && (
                  <>
                    <MapContainer
                      ref={mapRef}
                      center={position}
                      zoom={13}
                      className="w-full h-full"
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <Marker position={position} icon={markerIcon}>
                        <Popup>Your delivery location</Popup>
                      </Marker>
                    </MapContainer>

                    <button
                      onClick={fetchCurrentLocation}
                      disabled={loadingLocation}
                      className="absolute bottom-4 right-4 z-[999] bg-green-600 text-white p-3 rounded-full shadow-lg"
                    >
                      {loadingLocation ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <LocateFixed />
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT - PAYMENT */}
        <div className="sticky top-24 h-fit">
          <div className="bg-white rounded-2xl shadow-lg p-6 border">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <CreditCard className="text-green-600" /> Payment Method
            </h2>

            <div className="space-y-4">
              {/* Pay Online */}
              <button
                onClick={() => setPaymentMethod("online")}
                className={`flex items-center gap-3 w-full border rounded-lg p-3 transition-all ${
                  paymentMethod === "online"
                    ? "border-green-600 bg-green-50 shadow-sm"
                    : "hover:bg-gray-50"
                }`}
              >
                <CreditCard className="text-green-600" />
                <span className="font-medium text-gray-700">
                  Pay Online (Stripe)
                </span>
              </button>

              {/* Cash on Delivery */}
              <button
                onClick={() => setPaymentMethod("cod")}
                className={`flex items-center gap-3 w-full border rounded-lg p-3 transition-all ${
                  paymentMethod === "cod"
                    ? "border-green-600 bg-green-50 shadow-sm"
                    : "hover:bg-gray-50"
                }`}
              >
                <Wallet className="text-green-600" />
                <span className="font-medium text-gray-700">
                  Cash on Delivery
                </span>
              </button>
            </div>

            {/* Price summary */}
            <div className="mt-6 space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>₹{deliveryFee}</span>
              </div>
              <div className="border-t my-2" />
              <div className="flex justify-between font-semibold text-base">
                <span>Total</span>
                <span>₹{finalTotal}</span>
              </div>
            </div>

            {/* Action Button */}
            {paymentMethod === "cod" ? (
              <button
                onClick={handleCod}
                className="mt-6 w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition"
              >
                Place Order (COD)
              </button>
            ) : (
              <button
                onClick={() => console.log("Proceed to online payment")}
                className="mt-6 w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition"
              >
                Pay Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
