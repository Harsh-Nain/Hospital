import { useEffect, useState, useRef } from "react";
import { FiArrowLeft } from "react-icons/fi";
import axios from "axios";
import socket from "../socket";
import { useOutletContext } from "react-router-dom";

export default function Adminshowchat({ selectedUser, currentUser, onBack }) {
    const [messages, setMessages] = useState([]);
    const [typing, setTyping] = useState(false);
    const { setLoading } = useOutletContext();
    const bottomRef = useRef(null);
    const API_URL = import.meta.env.VITE_BACKEND_URL;
    const userId = selectedUser?.id || selectedUser?.userId;

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (!userId) return;
        const fetchMessages = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get(`${API_URL}/admin/admin_chatdata?userId=${userId}&id=${currentUser.id}`, { withCredentials: true });
                setMessages(data.messages || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchMessages();
    }, [userId, API_URL, currentUser, setLoading]);

    useEffect(() => {
        if (!currentUser) return;
        if (!socket.connected) {
            socket.auth = { userId: currentUser.id };
            socket.connect();
        }
        const handleMessage = (msg) => {
            if (String(msg.senderId) === String(userId) || String(msg.receiverId) === String(userId)) {
                setMessages((prev) => {
                    const exists = prev.some((m) => m.id === msg.id);
                    return exists ? prev : [...prev, msg];
                });
            }
        };
        socket.on("newMessage", handleMessage);
        return () => socket.off("newMessage", handleMessage);
    }, [userId, currentUser]);

    if (!selectedUser) {
        return <div className="flex-1 flex items-center justify-center text-gray-400 bg-gray-50 text-sm">Select a chat to see message</div>;
    }

    return (
            <>
            <div className="p-3 border-b border-black/10 flex items-center gap-3 bg-white sticky top-0 z-10">
                <button onClick={onBack} className="md:hidden">
                    <FiArrowLeft size={20} />
                </button>
                <img
                    src={selectedUser.image}
                    className="w-10 h-10 rounded-full object-cover"
                    alt=""
                />
                <div className="flex flex-col cursor-pointer">
                    <p className="font-semibold">{selectedUser.fullName}</p>
                    <span className="text-xs text-gray-500">{selectedUser.online ? "Online" : "Offline"}</span>
                </div>
            </div>

            <div className="flex-1 flex flex-col overflow-y-auto p-3 space-y-3">
                {messages.length === 0 ? (
                    <p className="text-center text-gray-400 text-sm m-auto">No messages yet</p>
                ) : (
                    messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}>
                            <div className={`flex flex-col ${msg.isMe ? "items-end" : "items-start"} max-w-[80%]`}>
                                {msg.fileUrl && (
                                    <img
                                        src={msg.fileUrl}
                                        className={`rounded-xl ${msg.isMe ? "rounded-br-none" : "rounded-bl-none"} mb-1 max-h-60 w-full object-cover border border-black/5`}
                                    />
                                )}
                                {msg.message && (
                                    <div className={`px-3 py-2 rounded-2xl text-sm shadow-sm break-words ${msg.isMe ? "bg-blue-500 text-white" : "bg-black/5 text-gray-800"}`}>
                                        {msg.message}
                                    </div>
                                )}
                                <div className={`flex items-center gap-1 mt-1 text-[10px] text-gray-400 ${msg.isMe ? "justify-end" : "justify-start"}`}>
                                    <span>{msg.pending ? "Sending..." : new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                                    {!msg.pending && msg.isMe && (
                                        <span className={`${msg.isSeen ? "text-blue-500" : "text-gray-400"} font-bold`}>✓✓</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
                <div ref={bottomRef} />
            </div>
            </>
        
    );
}