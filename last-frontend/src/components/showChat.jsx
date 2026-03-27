import { useEffect, useState, useRef } from "react";
import { FiArrowLeft, FiSend } from "react-icons/fi";
import axios from "axios";
import "../index.css";
import socket from "../socket";
import { FiCopy, FiTrash2, FiCornerUpLeft } from "react-icons/fi";
import { MdDownload, MdPermMedia } from "react-icons/md";

export default function ChatArea({ selectedUser, currentUser, onBack }) {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [files, setFiles] = useState([]);
    const [typing, setTyping] = useState(false);
    const [activeMsg, setActiveMsg] = useState(null);

    const fileRef = useRef(null);
    const bottomRef = useRef(null);
    const prevMessageLength = useRef(0);
    const isLoadingMoreRef = useRef(false);

    const API_URL = import.meta.env.VITE_BACKEND_URL;
    const userId = selectedUser?.id || selectedUser?.userId;
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const wasNearBottom = useRef(true);

    useEffect(() => {
        const isNewMessage = messages.length > prevMessageLength.current;

        if (isLoadingMoreRef.current) {
            isLoadingMoreRef.current = false;
            prevMessageLength.current = messages.length;
            return;
        }

        if (isNewMessage && wasNearBottom.current) {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }

        prevMessageLength.current = messages.length;
    }, [messages]);

    const fetchMessages = async (pageNumber = 1) => {

        if (!userId || loading) return;

        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/chat/messages`, { params: { userId, page: pageNumber, limit: 10 }, withCredentials: true });
            const newMessages = res.data.messages || [];

            setMessages(prev => [...newMessages, ...prev]);

            if (newMessages.length < 10) {
                setHasMore(false);
            }

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!userId) return;

        setMessages([]);
        setPage(1);
        setHasMore(true);

        fetchMessages(1);
    }, [userId]);

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            isLoadingMoreRef.current = true;

            const nextPage = page + 1;
            setPage(nextPage);
            fetchMessages(nextPage);
        }
    };

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
                    console.log(exists);

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
            setMessages((prev) => prev.map((m) => messageIds.includes(m.id) || messageIds.includes(m._id) ? { ...m, isSeen: true } : m));
        };

        socket.on("messagesSeen", handleSeen);
        return () => socket.off("messagesSeen", handleSeen);
    }, []);

    useEffect(() => {
        if (!messages.length || !currentUser || !userId) return;

        const unseen = messages.filter(
            (m) => !m.isSeen && String(m.senderId) === String(userId)
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
        if (!text.trim() && files.length === 0) return;

        const tempId = Date.now();
        const tempMsg = { _id: tempId, senderId: currentUser.id, message: text, fileUrls: files.map(f => ({ url: f.url, type: f.type, name: f.name })), pending: true, isMe: true, createdAt: new Date(), };

        setMessages((prev) => [...prev, tempMsg]);
        setText("");
        setFiles([]);
        if (fileRef.current) fileRef.current.value = "";

        const formData = new FormData();
        formData.append("message", tempMsg.message);
        formData.append("appointmentId", selectedUser.appointmentId);
        formData.append("receiverId", userId);
        files.forEach(f => { formData.append("files", f.file); });

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

    useEffect(() => {
        const handleClickOutside = () => setActiveMsg(null);
        window.addEventListener("click", handleClickOutside);
        return () => window.removeEventListener("click", handleClickOutside);
    }, []);

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

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
    };

    const handleDelete = async (id) => {
        try {
            const res = await axios.delete(`${API_URL}/chat/message?messageId=${id}`, { withCredentials: true });
            const saved = res.data.success;

            if (saved) {
                setMessages((prev) => prev.filter((m) => (m.id || m._id) !== id));
            }
        } catch (err) {
            console.log(err);
        }

    };

    const handleReply = (msg) => {
        setText(`Replying to: ${msg.message}`);
    };

    if (!selectedUser) {
        return (<div className="flex-1 flex items-center justify-center text-gray-400 text-sm">Select a chat to start messaging</div>);
    }

    const handleDownload = async (m) => {
        try {
            const response = await fetch(m.fileUrl[0].url);

            if (!response.ok) {
                throw new Error("Failed to fetch file");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "image.jpg";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Download error:", err);
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-50 w-full">

            <div className={`p-3 border-b border-black/10 flex items-center gap-3 bg-white sticky top-0 z-10`}>
                <button onClick={onBack} className="md:hidden"><FiArrowLeft size={20} /></button>
                <img src={selectedUser.image} className="w-10 h-10 rounded-full" alt="" />

                <div className="flex flex-col cursor-pointer">
                    <p className="font-semibold">{selectedUser.fullName}</p>
                    <span className="text-xs text-gray-500">{selectedUser.online ? "Online" : "Offline"}</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-3">
                <div className="w-full flex items-center justify-center">
                    {hasMore && (<p onClick={handleLoadMore} className="px-5 border border-black/25 text-gray-500 hover:text-gray-700 cursor-pointer rounded-2xl text-xs">{loading ? "Loading..." : "Load More"}</p>)}
                </div>

                {messages != [] && (
                    messages.map((m, i) => {
                        return (
                            <div key={i} className={`flex ${m.isMe ? "justify-end" : "justify-start"} group relative px-2`} onClick={(e) => { e.stopPropagation(); setActiveMsg((prev) => (prev === i ? null : i)); }}>

                                {activeMsg === i && (
                                    <div className={` absolute z-30 ${m.isMe ? "right-2" : "left-2"} -top-14 flex items-center gap-3 px-3 py-2 rounded-full backdrop-blur-xl bg-white/80 shadow-xl border border-white/40 animate-fadeIn`}>
                                        {m.message && (<button onClick={() => handleCopy(m.message)} className="p-2 rounded-full hover:bg-sky-100 transition"><FiCopy size={16} /></button>)}
                                        <button onClick={() => handleReply(m)} className="p-2 rounded-full hover:bg-emerald-100 transition"><FiCornerUpLeft size={16} /></button>
                                        <button onClick={() => handleDelete(m.id || m._id)} className="p-2 rounded-full hover:bg-red-100 text-red-500 transition"><FiTrash2 size={16} /></button>
                                        {m.fileUrl?.length > 0 && (<button onClick={() => handleDownload(m)} className="p-2 rounded-full hover:bg-sky-100 text-sky-500 transition"><MdDownload size={16} /></button>)}
                                    </div>
                                )}

                                <div className={`flex flex-col ${m.isMe ? "items-end" : "items-start"} max-w-[80%]`}>

                                    {m.fileUrl && m.fileUrl.map((file, i) => {
                                        const isImage = file.type.startsWith("image/");
                                        const isPDF = file.type === "application/pdf";

                                        return (
                                            <div key={i} className="mb-2 rounded-2xl overflow-hidden shadow-md border border-white/40 backdrop-blur-md">
                                                {isImage && (<img src={file.url} alt={file.name} className="w-full max-h-60 object-cover hover:scale-[1.02] transition" />)}
                                                {isPDF && (<iframe src={file.url} title={file.name} className="w-full h-56" />)}
                                                {!isImage && !isPDF && (<a href={file.url} target="_blank" rel="noopener noreferrer" className="block p-3 bg-white/70 hover:bg-white transition text-sm">📄 {file.name}</a>)}
                                            </div>
                                        );
                                    })}

                                    {m.message && (
                                        <div className={` px-4 py-2 rounded-2xl text-sm shadow-lg backdrop-blur-md transition-all duration-200 hover:scale-[1.02] wrap-break-words ${m.isMe ? ` bg-[linear-gradient(135deg,#0ea5e9,#38bdf8,#34d399)] text-white rounded-br-none shadow-sm ` : ` bg-white text-gray-800 rounded-bl-none border border-gray-200 shadow-sm`}`}>
                                            <p className={`${m.isMe ? "text-right" : "text-left"} leading-relaxed`}>{m.message}</p>
                                        </div>
                                    )}
                                    <div className={`flex items-center gap-1 mt-1 px-1 text-[10px] text-gray-400 ${m.isMe ? "justify-end" : "justify-start"}`}>
                                        <span>{m.pending ? "✓" : new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", })}</span>
                                        {(!m.pending && m.isMe) && (<span className={`text-${m.isSeen ? "emerald" : "gray"}-500 font-bold`}> ✓✓</span>)}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={bottomRef} />
            </div>

            {typing && (
                <div className="flex items-end gap-2 px-3 py-1 animate-fadeIn">
                    <img src={selectedUser?.image} alt="" className="w-8 h-8 rounded-full object-cover" />

                    <div className="bg-linear-to-r from-sky-50 to-purple-50 shadow-lg px-4 py-2 rounded-2xl rounded-bl-none flex items-center gap-1">
                        <span className="w-2 h-2 bg-sky-400 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:.15s]"></span>
                        <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce [animation-delay:.3s]"></span>
                    </div>
                </div>
            )}

            {files.length > 0 && (
                <div className="px-3 pb-2 flex gap-2 flex-wrap">
                    {files.map((file, i) => {
                        const isImage = file.file.type?.startsWith("image/");
                        const isPDF = file.file.type === "application/pdf";

                        return (
                            <div key={i} className="mb-3 w-32 relative">
                                <button onClick={() => { setFiles(prev => prev.filter((_, index) => index !== i)); }} className="absolute hover:text-red-500 top-0 right-0 bg-black text-white text-xs px-1 rounded">✕</button>
                                {isImage && (<img src={file.preview} alt={file.name} className="rounded-xl h-32 w-32 object-cover border" />)}
                                {isPDF && (<iframe src={file.preview} title={file.name} className="w-32 h-32 border rounded-xl" />)}
                                {!isImage && !isPDF && (<a href={file.url} target="_blank" rel="noopener noreferrer" className="block p-2 border rounded-xl bg-gray-100 text-xs">📄 {file.name}</a>)}
                            </div>
                        );
                    })}
                </div>
            )}

            <div className="p-2 sm:p-3 bg-white border-t border-black/10 flex gap-2 items-center sticky bottom-0">
                <input type="file" hidden ref={fileRef} multiple onChange={(e) => { const selected = Array.from(e.target.files); const newFiles = selected.map(file => ({ file, preview: URL.createObjectURL(file) })); setFiles(prev => [...prev, ...newFiles]); }} />
                <button onClick={() => fileRef.current.click()} className="text-lg cursor-pointer"><MdPermMedia /></button>
                <input value={text} onChange={(e) => { handleTyping(e.target.value); setText(e.target.value) }} onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }} className="flex-1 bg-gray-100 px-3 py-2 rounded-full outline-none text-sm" placeholder="Message..." />
                <button onClick={sendMessage} className="bg-blue-500 text-white p-2 rounded-full"><FiSend size={16} /></button>
            </div>
        </div>
    );
}