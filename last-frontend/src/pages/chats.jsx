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
    const [allUsers, setAllUsers] = useState([]);
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
                    setAllUsers(res.data.users);
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
        if (!currentUser?.id) return;
        socket.auth = { userId: currentUser.id };
        socket.connect();

        socket.on("connect", () => {
            console.log("Connected:", socket.id);
        });

        socket.on("onlineUsers", (ids) => {
            setUsers((prev) => prev.map((u) => ({ ...u, online: ids.includes(String(u.userId)), })));
        });

        socket.on("chatUserUpdate", (data) => {
            setUsers((prev) => {
                const filtered = prev.filter((u) => String(u.userId) !== String(data.contactId));
                return [{ userId: data.contactId, name: data.user, lastMessage: data.lastMessage, updatedAt: data.updatedAt, }, ...filtered,];
            });
        });

        return () => {
            socket.off("onlineUsers");
            socket.off("chatUserUpdate");
            socket.disconnect();
        };
    }, [currentUser]);

    useEffect(() => {
        if (selectedUser && currentUser) {
            socket.emit("joinChat", {
                receiverId: selectedUser.userId,
            });
        }
    }, [selectedUser, currentUser]);


    useEffect(() => {
        if (selectedUser && currentUser) {
            socket.emit("joinChat", { receiverId: selectedUser.userId, });
        }
    }, [selectedUser, currentUser]);

    return (
        <div className="h-screen flex w-full justify-center items-center">

            <div className={`${selectedUser ? "hidden md:flex" : "flex"} w-full h-screen md:w-87.5 border-r border-black/10`}>
                <UserList users={users} currentUser={currentUser} selectedUser={selectedUser} onSelectUser={setSelectedUser} />
            </div>

            <div className={`${selectedUser ? "flex" : "hidden md:flex"} h-screen flex-1`}>
                <ChatArea selectedUser={selectedUser} currentUser={currentUser} onBack={() => setSelectedUser(null)} />
            </div>
        </div>
    );
}