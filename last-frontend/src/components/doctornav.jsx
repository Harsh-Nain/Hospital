import { Bell, Stethoscope, User, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Doctornav({ doctorInfo }) {
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
        <div className="flex items-center justify-between gap-3 sm:px-5 py-3">
            <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-xl shadow-sm">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#10b981,#34d399,#6ee7b7)] text-white shadow-md">
                        <Stethoscope size={20} />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-slate-800"> Welcome back</h2>
                        <p className="text-xs text-slate-500">Manage appointments & notifications</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 ml-2 sm:ml-4 relative" ref={dropdownRef}>

                <button onClick={() => setShowNotifications(!showNotifications)} className="relative w-12 h-12 rounded-2xl border border-slate-200 bg-white/90 backdrop-blur-xl flex items-center justify-center text-slate-600 hover:bg-sky-50 hover:text-sky-600 transition-all shadow-sm" >
                    <Bell size={19} />

                    {notifications.some((n) => !n.isRead) && (
                        <>
                            <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-sky-500"></span>
                            <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-sky-500 animate-ping"></span>
                        </>
                    )}
                </button>

                {showNotifications && (
                    <div className="absolute top-14 right-0 w-85 sm:w-95 overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white/95 backdrop-blur-2xl shadow-[0_20px_60px_rgba(15,23,42,0.15)] z-50">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                            <div>
                                <h3 className="font-bold text-slate-800">Notifications</h3>
                                <p className="text-xs text-slate-500">Stay updated with recent activity</p>
                            </div>

                            <button onClick={() => notifications.forEach((n) => { if (!n.isRead) readNotification(n.id); })} className="text-xs font-medium text-sky-600 hover:text-sky-700">
                                Mark all read
                            </button>
                        </div>

                        {notifications.length === 0 ? (
                            <div className="p-8 text-center">
                                <Bell size={30} className="mx-auto text-slate-300 mb-3" />
                                <p className="text-sm text-slate-500">No notifications yet</p>
                            </div>
                        ) : (
                            <div className="max-h-100 overflow-y-auto p-3 space-y-2">
                                {notifications.map((item) => (
                                    <div key={item.id} className={`rounded-2xl border p-4 transition-all ${item.isRead ? "bg-slate-50 border-slate-100" : "bg-sky-50 border-sky-100"}`}>
                                        <div className="flex justify-between gap-3">
                                            <div className="flex-1 cursor-pointer" onClick={() => readNotification(item.id)}>
                                                <div className="flex items-start gap-2">
                                                    {!item.isRead && (<span className="mt-2 w-2 h-2 rounded-full bg-sky-500 shrink-0"></span>)}

                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                                                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.message}</p>
                                                        <p className="text-[11px] text-slate-400 mt-2">{new Date(item.createdAt).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <button onClick={() => deleteNotification(item.id)} className="text-slate-400 hover:text-red-500 transition">
                                                <X size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <button onClick={() => navigate("/doctor-profile")} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/90 backdrop-blur-xl px-2.5 py-2 pr-4 hover:bg-slate-50 transition-all shadow-sm">
                    <img src={doctorInfo?.image || "https://res.cloudinary.com/ddiyrbync/image/upload/v1773301256/zk7ksr5vfxsjzir7k4cu.jpg"} alt="profile" className="w-9 h-9 rounded-xl object-cover border border-slate-200" />

                    <div className="hidden md:block text-left">
                        <p className="text-sm font-semibold text-slate-800 leading-none">{doctorInfo?.fullName || "Doctor"} </p>
                        <p className="text-xs text-slate-500 mt-1">View Profile</p>
                    </div>
                </button>
            </div>
        </div>

    );
}