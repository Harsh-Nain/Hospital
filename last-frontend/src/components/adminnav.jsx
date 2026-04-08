import { useLocation } from "react-router-dom";
import { Menu, Bell, ChevronRight, X } from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";

export default function AdminNav({ open, setOpen }) {
    const API_URL = import.meta.env.VITE_BACKEND_URL;
    const location = useLocation();

    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        const getNotifications = async () => {
            try {
                const res = await axios.get(`${API_URL}/feed/notifications?notifId=${1}`, { withCredentials: true, });

                if (res.data.success) {
                    setNotifications(res.data.notifications);
                }

            } catch (error) {
                console.error(error);
            }
        };
        getNotifications();
    }, [API_URL]);

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

    const getTitle = () => {
        if (location.pathname.includes("dashboard")) return "Dashboard";
        if (location.pathname.includes("doctors")) return "Doctors";
        if (location.pathname.includes("patients")) return "Patients";
        if (location.pathname.includes("chat")) return "Conversations";
        if (location.pathname.includes("contact-details")) return "Contacts";
        return "Admin Panel";
    };

    return (
        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3">

            <div className="flex items-center gap-3 min-w-0">
                <button onClick={() => setOpen(!open)} className="lg:hidden flex items-center justify-center w-11 h-11 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition shadow-sm">
                    <Menu size={20} />
                </button>

                <div className="hidden sm:flex items-center justify-center w-11 h-11 rounded-2xl bg-linear-to-br from-sky-500 to-cyan-500 text-white font-bold shadow-lg shadow-sky-200">
                    AP
                </div>

                <div className="min-w-0">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                        <span>Admin</span>
                        <ChevronRight size={14} />
                        <span className="text-slate-500">{getTitle()}</span>
                    </div>

                    <h1 className="text-lg sm:text-xl font-bold text-slate-800 truncate">
                        {getTitle()}
                    </h1>
                </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">

                <button onClick={() => setShowNotifications(!showNotifications)} className="relative flex items-center justify-center w-11 h-11 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition shadow-sm">
                    <Bell size={18} />
                    {notifications.some((n) => !n.isRead) && (
                        <>
                            <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-sky-500"></span>
                            <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-sky-500 animate-ping"></span>
                        </>
                    )}
                </button>

                {showNotifications && (
                    <div className="absolute top-17 right-0 w-85 sm:w-95 overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white/95 backdrop-blur-2xl shadow-[0_20px_60px_rgba(15,23,42,0.15)] z-50">
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

                <div className="hidden sm:flex items-center gap-3 px-3 py-2 rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-sky-500 to-cyan-500 text-white flex items-center justify-center font-bold shadow">
                        A
                    </div>

                    <div className="leading-tight">
                        <p className="text-sm font-semibold text-slate-800"> Admin</p>
                        <p className="text-xs text-slate-500"> Super Administrator</p>
                    </div>
                </div>

            </div>
        </div>
    );
}