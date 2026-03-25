import { useEffect, useState, useRef } from "react";
import { FiArrowLeft, FiSend } from "react-icons/fi";
import axios from "axios";
import socket from "../socket";
import { useOutletContext } from "react-router-dom";
import { MdPermMedia } from "react-icons/md";

export default function ChatArea({ selectedUser, currentUser, onBack }) {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [preview, setPreview] = useState(null);
    const [typing, setTyping] = useState(false);
    const { setLoading } = useOutletContext()

    const fileRef = useRef(null);
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
                const res = await axios.get(`${API_URL}/chat/messages?userId=${userId}`, { withCredentials: true });
                setMessages(res.data.messages || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, [userId]);

    useEffect(() => {
        if (!currentUser) return;

        if (!socket.connected) {
            socket.auth = { userId: currentUser.id };
            socket.connect();
        }

        const handleMessage = (msg) => {

            if (String(msg.senderId) === String(userId) || String(msg.receiverId) === String(userId)) {
                setMessages((prev) => {
                    const exists = prev.some((m) => {
                        return (String(m.id) === String(msg.id) || (m.pending && m.message === msg.message && String(m.senderId) === String(msg.senderId)));
                    });
                    if (exists) return prev;

                    return [...prev, msg];
                });
            }
        };
        socket.on("newMessage", handleMessage);
        return () => socket.off("newMessage", handleMessage);
    }, [userId, currentUser]);

    useEffect(() => {
        const handleSeen = ({ messageIds }) => {
            setMessages((prev) =>
                prev.map((m) =>
                    messageIds.includes(m.id) || messageIds.includes(m._id)
                        ? { ...m, isSeen: true }
                        : m
                )
            );
        };

        socket.on("messagesSeen", handleSeen);
        return () => socket.off("messagesSeen", handleSeen);
    }, []);

    useEffect(() => {
        if (!messages.length || !currentUser || !userId) return;

        const unseen = messages.filter(
            (m) =>
                !m.isSeen &&
                String(m.senderId) === String(userId) 
        );

        if (unseen.length > 0) {
            socket.emit("markSeen", {
                messageIds: unseen.map((m) => m.id || m._id),
                senderId: userId,
                receiverId: currentUser.id,
            });
        }
    }, [messages, userId, currentUser]);

    const sendMessage = async () => {
        const file = fileRef.current?.files[0];
        if (!text.trim() && !file) return;

        const tempId = Date.now();
        const tempMsg = { _id: tempId, senderId: currentUser.id, message: text, imageUrl: file ? URL.createObjectURL(file) : null, pending: true, isMe: true, createdAt: new Date(), };

        setMessages((prev) => [...prev, tempMsg]);
        setText("");
        setPreview(null);
        if (fileRef.current) fileRef.current.value = "";

        const formData = new FormData();
        formData.append("message", tempMsg.message);
        formData.append("appointmentId", selectedUser.appointmentId);
        formData.append("receiverId", userId);
        if (file) formData.append("file", file);

        try {
            const res = await axios.post(`${API_URL}/chat/message`, formData, { withCredentials: true });

            const saved = res.data.data;
            if (saved) {
                const newId = saved.id || saved._id;

                setMessages((prev) =>
                    prev.map((m) => {
                        const msgId = m.id || m._id;

                        if (msgId === tempId) {
                            return { ...saved, id: newId, isMe: true, pending: false, };
                        }
                        return m;
                    })
                );
            }
        } catch (err) {
            setMessages((prev) => prev.filter((m) => m._id !== tempId));
        }
    };

    const typingTimeoutRef = useRef(null);

    const handleTyping = (value) => {
        setText(value);

        socket.emit("typing", {
            senderId: currentUser.id,
            receiverId: userId,
        });

        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit("stopTyping", { senderId: currentUser.id, receiverId: userId, });
        }, 1000);
    };

    useEffect(() => {
        const handleTyping = ({ senderId }) => {
            if (String(senderId) === String(userId)) {
                setTyping(true);
            }
        };

        const handleStopTyping = ({ senderId }) => {
            if (String(senderId) === String(userId)) {
                setTyping(false);
            }
        };

        socket.on("typing", handleTyping);
        socket.on("stopTyping", handleStopTyping);

        return () => {
            socket.off("typing", handleTyping);
            socket.off("stopTyping", handleStopTyping);
        };
    }, [userId]);

    if (!selectedUser) {
        return (<div className="flex-1 flex items-center justify-center text-gray-400 text-sm">Select a chat to start messaging</div>);
    }

    return (
        <div className="flex flex-col h-full bg-gray-50 w-full">

            <div className="p-3 border-b border-black/10 flex items-center gap-3 bg-white sticky top-0 z-10">
                <button onClick={onBack} className="md:hidden"><FiArrowLeft size={20} /></button>

                <img src={selectedUser.image} className="w-10 h-10 rounded-full" alt="" />

                <div className="flex flex-col cursor-pointer">
                    <p className="font-semibold">{selectedUser.fullName}</p>
                    <span className="text-xs text-gray-500">{selectedUser.online ? "Online" : "Offline"}</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-2">
                {messages != [] && (
                    messages.map((m, i) => {

                        return (
                            <div key={i} className={`flex ${m.isMe ? "justify-end" : "justify-start"} group`}>
                                <div className={`flex flex-col ${m.isMe ? "items-end" : "justify-start"} max-w-[80%] md:max-w-[65%]`}>

                                    {m.fileUrl && (<img src={m.fileUrl} className={`rounded-xl ${m.isMe ? "rounded-br-none" : "rounded-bl-none"} mb-2 max-h-60 w-full object-cover border border-black/5`} />)}
                                    <div className={`px-3 py-2 rounded-full w-fit shadow-sm text-sm wrap-break-words ${m.isMe ? "bg-blue-500 text-white rounded-br-none" : "bg-black/5 text-gray-800 rounded-bl-none"}`}>
                                        {m.message && <p className={`leading-relaxed ${m.isMe ? "text-right" : "text-left"}`}>{m.message}</p>}
                                    </div>

                                    <div className={`flex items-center gap-1 mt-1 px-1 text-[10px] text-gray-400 ${m.isMe ? "justify-end" : "justify-start"}`}                               >
                                        <span>{m.pending ? "Sending..." : new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", })}</span>
                                        {(!m.pending && m.isMe) && (<span className={`text-${m.isSeen ? "blue" : "gray"}-500 font-bold text-[11px]`}>✓✓</span>)}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={bottomRef} />
            </div>

            {typing && (
                <div className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-lg ml-7 shadow-sm rounded-2xl rounded-bl-none w-fit m-2 transition-all duration-300">

                    <div className="w-2 h-2 rounded-full bg-black/25 animate-bounce [animation-delay:.7s]"></div>
                    <div className="w-2 h-2 rounded-full bg-black/25 animate-bounce [animation-delay:.5s]"></div>
                    <div className="w-2 h-2 rounded-full bg-black/25 animate-bounce [animation-delay:.3s]"></div>
                </div>
            )}
            {preview && (<div className="px-3 pb-2"><img src={preview} className="h-20 rounded" /></div>)}

            <div className="p-2 bg-white border-t border-black/10 flex gap-2 items-center">
                <input type="file" hidden ref={fileRef} onChange={(e) => { const file = e.target.files[0]; if (file) setPreview(URL.createObjectURL(file)); }} />
                <button onClick={() => fileRef.current.click()} className="text-lg cursor-pointer"><MdPermMedia /></button>
                <input value={text} onChange={(e) => { handleTyping(e.target.value); setText(e.target.value) }} onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }} className="flex-1 bg-gray-100 px-3 py-2 rounded-full outline-none text-sm" placeholder="Message..." />
                <button onClick={sendMessage} className="bg-blue-500 text-white p-2 rounded-full">
                    <FiSend size={16} />
                </button>
            </div>
        </div>
    );
}