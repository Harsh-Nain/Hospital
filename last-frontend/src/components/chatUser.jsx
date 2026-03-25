import { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";

export default function UserList({ users = [], currentUser, selectedUser, onSelectUser }) {
    const [search, setSearch] = useState("");
    const location = useLocation().pathname.startsWith("/patient")

    const normalizedUsers = useMemo(() => {
        return users.map((u) => ({
            id: u.id || u.userId,
            fullName: u.fullName || u.name || "User",
            image: u.image || "https://via.placeholder.com/40",
            lastMessage: u.lastMessage || "Start chatting...",
            updatedAt: u.updatedAt || u.createdAt,
            online: u.online || false,
            appointmentId: u.appointmentId,
            role: u.role || u.specialization || "",
        }));
    }, [users]);

    const filteredUsers = useMemo(() => {
        const q = search.toLowerCase();
        return normalizedUsers.filter((u) => u.fullName.toLowerCase().includes(q));
    }, [search, normalizedUsers]);

    const formatTime = (time) => {
        if (!time) return "";
        return new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", });
    };

    return (
        <div className="flex flex-col w-full h-screen bg-white">
            <div className="p-4.5 font-bold text-lg border-b border-black/10">{currentUser?.fullName || "Chats"}</div>

            <div className="px-3 py-2">
                <input className="w-full px-3 py-2 bg-gray-100 rounded-lg outline-none" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>

            <div className="flex-1 overflow-y-auto">
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((u) => (
                        <div key={u.id} onClick={() => onSelectUser(u)} className={`${selectedUser?.id == u.id ? `${location ? "bg-blue-50" : "bg-green-50"}` : "hover:bg-gray-100"} flex items-center mx-1 rounded-2xl justify-between px-3 py-3 cursor-pointer transition`}>
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="relative">
                                    <img src={u.image} className={`w-12 h-12 rounded-full object-cover border ${u.online ? "border-green-500" : "border-black/55"}`} alt="" />
                                    {u.online && (<span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />)}
                                </div>

                                <div className="min-w-0">
                                    <p className="font-semibold text-sm truncate">{u.fullName} ({u.role && <span className={`text-xs ${location ? "text-sky-500" : "text-emerald-500"}`}>{u.role}</span>})</p>
                                    <p className="text-xs text-gray-500 truncate">{u.lastMessage}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 whitespace-nowrap ml-2">{formatTime(u.updatedAt)}</p>
                                <p className={`text-xs ${u.online ? "text-green-500" : "text-gray-400"} whitespace-nowrap ml-2`}>{u.online ? "online" : "offline"}</p>
                            </div>
                        </div>
                    ))
                ) : (<p className="text-center text-gray-400 mt-10">No users found</p>)}
            </div>
        </div>
    );
}