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
    const { setLoading } = useOutletContext();

    useEffect(() => {
        const init = async () => {
            try {
                setLoading(true)
                const res = await axios.get(`${API_URL}/chat/user`, { withCredentials: true, });

                if (res.data?.success) {
                    setUsers(res.data.users);
                }

                const info = await axios.get(`${API_URL}/dashboard/${location ? "patient" : "doctor"}-info`, { withCredentials: true, });
                setCurrentUser(info.data.patient || info.data.doctor);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        init();
    }, []);

    useEffect(() => {
        const handleChatListUpdate = (data) => {
            setUsers((prev) =>
                prev.map((chat) =>
                    String(chat.userId) === String(data.userId) ? { ...chat, lastMessage: data.lastMessage || chat.lastMessage, updatedAt: data.updatedAt || chat.updatedAt, seen: data.seen ?? chat.seen, } : chat
                )
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

    return (
        <div className="h-full flex w-full bg-gray-100">

            <div className={`  ${selectedUser ? "hidden md:flex" : "flex"}  w-full md:w-[320px] lg:w-90 border-r border-black/10 bg-white`}>
                <UserList users={users} currentUser={currentUser} selectedUser={selectedUser} onSelectUser={setSelectedUser} />
            </div>

            <div className={` ${selectedUser ? "flex" : "hidden md:flex"} flex-1`}>
                <ChatArea selectedUser={selectedUser} currentUser={currentUser} onBack={() => setSelectedUser(null)} />
            </div>

        </div>
    );
}