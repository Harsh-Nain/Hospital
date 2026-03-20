import { Bell, User, Search } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Doctornav() {
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_BACKEND_URL;

    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);

    const dropdownRef = useRef();

    useEffect(() => {
        const getNotifications = async () => {
            try {
                const res = await axios.get(`${API_URL}/feed/notifications`, { withCredentials: true });

                if (res.data.success) {
                    setNotifications(res.data.notifications);
                } else {
                    navigate("/doctor/login");
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

            <div className="flex items-center gap-3 flex-1 max-w-xl"></div>

            <div className="flex items-center gap-4 ml-6 relative" ref={dropdownRef}>

                <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 rounded-lg hover:bg-gray-100 transition">
                    <Bell size={20} className="text-emerald-600" />
                    {notifications.length > 0 && (<span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>)}
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

                <button onClick={() => navigate("/doctor-profile")} className="p-2 rounded-lg hover:bg-gray-100 transition" >
                    <User size={20} className="text-gray-600" />
                </button>

            </div>
        </div>
    );
}