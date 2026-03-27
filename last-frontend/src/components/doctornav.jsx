import { Bell, User, X } from "lucide-react";
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
                const res = await axios.get(`${API_URL}/feed/notifications`, { withCredentials: true, });

                if (res.data.success) {
                    setNotifications(res.data.notifications);
                }

            } catch (error) {
                console.error(error);
            }
        };
        getNotifications();
    }, [API_URL]);

    useEffect(() => {
        const handleClickOutside = (event) => {

            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const readNotification = async (notificationId) => {
        try {
            await axios.put(`${API_URL}/feed/notification?notificationId=${notificationId}`, { withCredentials: true });
            setNotifications((prev) => prev.map((n) => n.id === notificationId ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error(error);
        }
    };

    const deleteNotification = async (notificationId) => {
        try {
            console.log(notificationId);

            const res = await axios.delete(`${API_URL}/feed/notification?notificationId=${notificationId}`, { withCredentials: true });

            if (res.data.success) {
                setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-4">

            <div className="flex items-center gap-3 flex-1 max-w-xl"></div>

            <div className="flex items-center gap-4 ml-6 relative" ref={dropdownRef}>

                <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 rounded-lg hover:bg-gray-100 transition">
                    <Bell size={20} className="text-emerald-600" />
                    {notifications.length > 0 && (<span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>)}
                </button>

                {showNotifications && (
                    <div className="absolute right-0 top-12 w-80 bg-white border rounded-xl shadow-lg p-3 z-50">

                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-sm font-semibold">Notifications</h3>
                            <button onClick={() => notifications.forEach((n) => { if (!n.isRead) readNotification(n.id); })} className="text-xs text-blue-500 hover:underline">Mark all read</button>
                        </div>

                        {notifications.length === 0 ? (<p className="text-sm text-gray-500">No notifications</p>) : (
                            <div className="max-h-64 overflow-y-auto space-y-2">

                                {notifications.map((item) => (
                                    <div key={item.id} className={`p-3 rounded-lg ${item.isRead ? "bg-white" : "bg-blue-50"}`}>
                                        <div className="flex justify-between gap-2">

                                            <div className="flex-1 cursor-pointer" onClick={() => readNotification(item.id)}>
                                                <p className="text-sm font-medium">{item.title}</p>
                                                <p className="text-xs text-gray-500">{item.message}</p>
                                                <p className="text-xs text-gray-400 mt-1">{new Date(item.createdAt).toLocaleString()}</p>
                                            </div>

                                            <button onClick={() => deleteNotification(item.id)} className="text-gray-400 hover:text-red-500"><X size={16} /></button>
                                        </div>
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