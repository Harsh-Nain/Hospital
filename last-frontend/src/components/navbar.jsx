import { Bell, User, Search } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const dropdownRef = useRef();

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const res = await axios.get("http://localhost:5000/feed/notifications", { withCredentials: true });

        if (res.data.success) {
          setNotifications(res.data.notifications);
        } else {
          navigate("/patient/login");
        }
      } catch (error) {
        console.error(error);
      }
    };

    getNotifications();
  }, [API_URL, navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-4">

      <div className="flex items-center gap-3 flex-1 max-w-xl">

        <div className="relative w-full">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search diseases or doctors..." className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <select className="border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500">
          <option>All</option>
          <option>Doctors</option>
          <option>Diseases</option>
        </select>

      </div>

      <div className="flex items-center gap-4 ml-6 relative" ref={dropdownRef}>

        <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 rounded-lg hover:bg-gray-100 transition">
          <Bell size={20} className="text-sky-600" />
          {notifications.length > 0 && (<span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>)}
        </button>

        {showNotifications && (
          <div className="absolute right-0 top-12 w-80 bg-white border border-gray-200 rounded-xl shadow-lg p-3 z-50">

            <h3 className="text-sm font-semibold mb-2">Notifications</h3>

            {notifications.length === 0 ? (<p className="text-gray-500 text-sm">No notifications</p>) : (
              <div className="max-h-64 overflow-y-auto">

                {notifications.map((item) => (
                  <div key={item.id} className="p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition">
                    <p className="text-sm font-medium text-gray-800">  {item.title}</p>
                    <p className="text-xs text-gray-500">  {item.message}</p>
                    <p className="text-xs text-gray-400 mt-1">  {item.createdAt}</p>
                  </div>
                ))}

              </div>
            )}

          </div>
        )}

        <button onClick={() => navigate("/profile")} className="p-2 rounded-lg hover:bg-gray-100 transition" >
          <User size={20} className="text-gray-600" />
        </button>

      </div>
    </div>
  );
}