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
            isSeen: u.isSeen,
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
        <div className="flex flex-col w-full h-full bg-white">
            <div className={`p-4.5 font-bold text-lg border-b sticky top-0 bg-white z-10 border-black/10`}>{currentUser?.fullName || "Chats"}</div>

            <div className="px-3 py-2">
                <input className="w-full px-3 py-2 bg-gray-100 rounded-lg outline-none" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>

            <div className="flex-1 overflow-y-auto">
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((u) => (
                        <div key={u.id} onClick={() => { onSelectUser({ ...u, isSeen: true }); }} className={` flex items-center justify-between  px-3 py-3  cursor-pointer  transition rounded-xl ${selectedUser?.id === u.id ? location ? "bg-sky-50" : "bg-emerald-50" : location ? "hover:bg-sky-50" : "hover:bg-emerald-50"} `}>
                            <div className="flex items-center gap-3 min-w-0">

                                <div className="relative">
                                    <img src={u.image} className="w-12 h-12 rounded-full object-cover" alt="" />
                                    {u.online && (<span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />)}
                                </div>

                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate">{location && "Dr. "} {u.fullName}</p>
                                    <p className={`text-sm truncate max-w-35 sm:max-w-50 md:max-w-40 ${!u.isSeen ? "text-gray-900 font-medium" : "text-gray-500"}`}>{u.lastMessage}</p>
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-1 ml-2">
                                <p className="text-[11px] text-gray-400">{formatTime(u.updatedAt)}</p>

                                {!u.isSeen && (<span className="w-2 h-2 bg-blue-500 rounded-full"></span>)}
                            </div>
                        </div>
                    ))
                ) : (<p className="text-center text-gray-400 mt-10">No users found</p>)}
            </div>
        </div>
    );
}