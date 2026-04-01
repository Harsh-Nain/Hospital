import { useEffect, useState } from "react";
import axios from "axios";
import socket from "../socket";
import UserList from "../components/chatUser";
import ChatArea from "../components/showChat";
import { useLocation, useOutletContext } from "react-router-dom";

export default function Chats() {
    const API_URL = import.meta.env.VITE_BACKEND_URL;
    const location = useLocation().pathname.startsWith("/patient")

    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            try {
                setPageLoading(true)
                const res = await axios.get(`${API_URL}/chat/user`, { withCredentials: true, });

                if (res.data?.success) {
                    setUsers(res.data.users);
                }

                const info = await axios.get(`${API_URL}/dashboard/${location ? "patient" : "doctor"}-info`, { withCredentials: true, });
                setCurrentUser(info.data.patient || info.data.doctor);
            } catch (err) {
                console.error(err);
            } finally {
                setPageLoading(false);
            }
        };

        init();
    }, []);

    useEffect(() => {
        const handleChatListUpdate = (data) => {
            setUsers((prev) =>
                prev.map((chat) => String(chat.userId) === String(data.userId) ? { ...chat, lastMessage: data.lastMessage || chat.lastMessage, updatedAt: data.updatedAt || chat.updatedAt, seen: data.seen ?? chat.seen, } : chat)
            );
        };

        socket.on("chatListUpdated", handleChatListUpdate);

        return () => {
            socket.off("chatListUpdated", handleChatListUpdate);
        };
    }, []);

    useEffect(() => {
        if (!currentUser?.id) return;
        socket.auth = { userId: currentUser.id };
        socket.connect();

        socket.on("connect", () => {
            console.log("Connected:", socket.id);
        });

        socket.on("onlineUsers", (ids) => {
            setUsers((prev) => prev.map((u) => ({ ...u, online: ids.includes(String(u.userId)), })));
        });

        return () => {
            socket.off("onlineUsers");
            socket.disconnect();
        };
    }, [currentUser]);

    useEffect(() => {
        if (selectedUser && currentUser) {
            socket.emit("joinChat", { receiverId: selectedUser.userId, });
        }
    }, [selectedUser, currentUser]);

    if (pageLoading) {
        return (
            <div className="h-screen flex w-full bg-gray-100 animate-pulse">

                <div className="w-full md:w-[320px] lg:w-90 border-r border-black/10 bg-white p-4">
                    <div className="h-12 bg-gray-200 rounded-2xl mb-6"></div>

                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((item) => (
                            <div key={item} className="flex items-center gap-3 p-3 rounded-2xl">
                                <div className="w-14 h-14 rounded-full bg-gray-200"></div>

                                <div className="flex-1">
                                    <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-3 w-48 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-3 w-20 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="hidden md:flex flex-1 flex-col bg-gray-50">
                    <div className="h-20 bg-white border-b border-black/10 px-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-200"></div>

                        <div>
                            <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                            <div className="h-3 w-20 bg-gray-200 rounded"></div>
                        </div>
                    </div>

                    <div className="flex-1 p-6 space-y-4">
                        <div className="flex justify-start">
                            <div className="h-14 w-52 bg-gray-200 rounded-2xl"></div>
                        </div>

                        <div className="flex justify-end">
                            <div className="h-14 w-40 bg-gray-200 rounded-2xl"></div>
                        </div>

                        <div className="flex justify-start">
                            <div className="h-20 w-64 bg-gray-200 rounded-2xl"></div>
                        </div>

                        <div className="flex justify-end">
                            <div className="h-12 w-32 bg-gray-200 rounded-2xl"></div>
                        </div>

                        <div className="flex justify-start">
                            <div className="h-16 w-44 bg-gray-200 rounded-2xl"></div>
                        </div>
                    </div>

                    <div className="p-4 border-t border-black/10 bg-white flex items-center gap-3">
                        <div className="flex-1 h-12 bg-gray-200 rounded-full"></div>
                        <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex w-full bg-white">

            <div className={`  ${selectedUser ? "hidden md:flex" : "flex"}  w-full md:w-[320px] lg:w-90 border-r border-black/10 bg-white`}>
                <UserList users={users} currentUser={currentUser} selectedUser={selectedUser} onSelectUser={setSelectedUser} />
            </div>

            <div className={` ${selectedUser ? "flex" : "hidden md:flex"} flex-1`}>
                <ChatArea selectedUser={selectedUser} currentUser={currentUser} onBack={() => setSelectedUser(null)} />
            </div>

        </div>
    );
}