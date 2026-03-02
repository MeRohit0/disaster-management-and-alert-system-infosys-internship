import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loadingLocation, setLoadingLocation] = useState(false);

  // Combined state for all possible fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    location: "",
    role: "ROLE_CITIZEN",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // Login Logic
        const response = await api.post("/auth/login", {
          email: formData.email,
          password: formData.password,
        });
        login(response.data);

        // Role-based redirect
        const role = response.data.role;
        if (role === "ROLE_ADMIN") navigate("/admin");
        else if (role === "ROLE_RESPONDER") navigate("/responder");
        else navigate("/citizen");
      } else {
        // Registration Logic
        await api.post("/auth/register", formData);
        alert("Account created! Please login.");
        setIsLogin(true); // Switch to login view
      }
    } catch (err: any) {
      alert(
        err.response?.data || "An error occurred. Check backend connection.",
      );
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Using a free reverse geocoding API (BigDataCloud or OpenStreetMap)
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
          );
          const data = await response.json();

          // Update the form state with the city/region name
          const cityLocation = `${data.city}, ${data.principalSubdivision}`;
          setFormData({ ...formData, location: cityLocation });
        } catch (error) {
          console.error("Error fetching city name:", error);
          alert("Could not determine city name. Please enter manually.");
        } finally {
          setLoadingLocation(false);
        }
      },
      (error) => {
        setLoadingLocation(false);
        alert("Location access denied. Please type your location.");
      },
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-blue-700 p-6 text-white text-center">
          <h1 className="text-2xl font-bold uppercase tracking-wider">
            DMAS Portal
          </h1>
          <p className="text-blue-100 text-sm mt-1">
            Disaster Management & Alert System
          </p>
        </div>

        <div className="p-8">
          <div className="flex mb-8 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition ${isLogin ? "bg-white shadow text-blue-700" : "text-gray-500"}`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition ${!isLogin ? "bg-white shadow text-blue-700" : "text-gray-500"}`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase">
                  Full Name
                </label>
                <input
                  name="name"
                  type="text"
                  onChange={handleChange}
                  required
                  className="w-full mt-1 p-2 border-b-2 border-gray-200 focus:border-blue-500 outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                onChange={handleChange}
                required
                className="w-full mt-1 p-2 border-b-2 border-gray-200 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase">
                Password
              </label>
              <input
                name="password"
                type="password"
                onChange={handleChange}
                required
                className="w-full mt-1 p-2 border-b-2 border-gray-200 focus:border-blue-500 outline-none"
              />
            </div>

            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase">
                      Phone
                    </label>
                    <input
                      name="phoneNumber"
                      type="text"
                      onChange={handleChange}
                      required
                      className="w-full mt-1 p-2 border-b-2 border-gray-200 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div className="relative">
                    <label className="block text-xs font-bold text-gray-500 uppercase">
                      Location
                    </label>
                    <div className="flex items-center">
                      <input
                        name="location"
                        type="text"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        className="w-full mt-1 p-2 border-b-2 border-gray-200 focus:border-blue-500 outline-none"
                        placeholder="City, State"
                      />
                      <button
                        type="button"
                        onClick={handleGetLocation}
                        className="ml-2 p-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition text-xs font-bold"
                        disabled={loadingLocation}
                      >
                        {loadingLocation ? "..." : "📍 Auto"}
                      </button>
                    </div>
                  </div>
                  {/* <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase">
                      Location
                    </label>
                    <input
                      name="location"
                      type="text"
                      onChange={handleChange}
                      required
                      className="w-full mt-1 p-2 border-b-2 border-gray-200 focus:border-blue-500 outline-none"
                    />
                  </div> */}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase">
                    Account Role
                  </label>
                  <select
                    name="role"
                    onChange={handleChange}
                    className="w-full mt-1 p-2 border-b-2 border-gray-200 bg-white focus:border-blue-500 outline-none"
                  >
                    <option value="ROLE_CITIZEN">Citizen</option>
                    <option value="ROLE_RESPONDER">Responder</option>
                    <option value="ROLE_ADMIN">Admin</option>
                  </select>
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full bg-blue-700 text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition shadow-lg mt-6"
            >
              {isLogin ? "SIGN IN" : "CREATE ACCOUNT"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
