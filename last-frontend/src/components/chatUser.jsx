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
        <div className="flex h-full w-full flex-col overflow-hidden rounded-3xl sm:rounded-none border border-gray-200 bg-linear-to-b from-white to-gray-50 shadow-sm">

            <div className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 px-5 py-4 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400">Last Conversation</p>
                        <h2 className="mt-1 text-lg font-bold text-gray-900">
                            {location ? "Patient " : "Doctor "}
                            <span className={`${location ? "text-sky-600" : "text-emerald-600"}`}>{currentUser?.fullName || "Chats"}</span>
                        </h2>
                    </div>

                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl shadow-sm ${location ? "bg-sky-100 text-sky-600" : "bg-emerald-100 text-emerald-600"}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-5 w-5"    >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.964 0a9 9 0 10-11.964 0m11.964 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275" />
                        </svg>
                    </div>
                </div>

                <div className="mt-4">
                    <div className="relative">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-700 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100" placeholder={`Search ${location ? "patients" : "doctors"}...`} value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-3">
                {filteredUsers.length > 0 ? (
                    <div className="space-y-2">
                        {filteredUsers.map((u) => {
                            const isSelected = selectedUser?.id === u.id;

                            return (
                                <div key={u.id} onClick={() => { onSelectUser({ ...u, isSeen: true }); }} className={`group relative flex cursor-pointer items-center justify-between rounded-2xl border px-3 py-3 transition-all duration-200 ${isSelected ? location ? "border-sky-200 bg-sky-50 shadow-sm" : "border-emerald-200 bg-emerald-50 shadow-sm" : "border-transparent bg-white hover:border-gray-200 hover:bg-gray-50"}`}>
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="relative shrink-0">
                                            <img src={u.image} className="h-13 w-13 rounded-2xl object-cover ring-2 ring-white" alt={u.fullName} />
                                            {u.online && (<span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500 shadow-sm" />)}
                                        </div>

                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="truncate text-sm font-semibold text-gray-900">    {location && "Dr. "}    {u.fullName}</p>
                                                {u.online && (<span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700">Online</span>)}
                                            </div>
                                            <p className={`mt-1 truncate text-sm ${!u.isSeen ? "font-medium text-gray-900" : "text-gray-500"}`}>     {u.lastMessage}</p>
                                        </div>
                                    </div>

                                    <div className="ml-3 flex flex-col items-end gap-2">
                                        <p className="text-[11px] font-medium text-gray-400">{formatTime(u.updatedAt)}</p>
                                        {!u.isSeen && (<span className={`h-2.5 w-2.5 rounded-full ${location ? "bg-sky-500" : "bg-emerald-500"}`} />)}
                                    </div>

                                    {isSelected && (<div className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-full ${location ? "bg-sky-500" : "bg-emerald-500"}`} />)}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3h6m-9 7.5h12A2.25 2.25 0 0018.75 16.5v-9A2.25 2.25 0 0016.5 5.25h-9A2.25 2.25 0 005.25 7.5v9A2.25 2.25 0 007.5 18.75z" />
                            </svg>
                        </div>

                        <h3 className="text-sm font-semibold text-gray-700">No conversations found</h3>
                        <p className="mt-1 text-sm text-gray-400">Try searching with a different name.</p>
                    </div>
                )}
            </div>
        </div>
    );
}