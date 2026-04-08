import { useState } from "react";
import { MessageCircle, X, Send, Users, Stethoscope, User, Sparkles, CheckCircle2, } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const FloatingMessage = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [receiverType, setReceiverType] = useState("allUsers");
    const [message, setMessage] = useState("");
    const [isSending, setIsSending] = useState(false);

    const API_URL = import.meta.env.VITE_BACKEND_URL;

    const receiverOptions = [
        { id: "allUsers", label: "Everyone", desc: "Broadcast to all users", icon: Users, activeClass: "border-sky-300 bg-linear-to-br from-sky-50 to-cyan-50 shadow-lg shadow-sky-100", iconClass: "bg-sky-500 text-white", hoverClass: "hover:border-sky-200 hover:bg-sky-50/50", },
        { id: "allDoctors", label: "Doctors", desc: "Notify medical staff", icon: Stethoscope, activeClass: "border-cyan-300 bg-linear-to-br from-cyan-50 to-sky-50 shadow-lg shadow-cyan-100", iconClass: "bg-cyan-500 text-white", hoverClass: "hover:border-cyan-200 hover:bg-cyan-50/50", },
        { id: "allPatients", label: "Patients", desc: "Notify patients only", icon: User, activeClass: "border-emerald-300 bg-linear-to-br from-emerald-50 to-teal-50 shadow-lg shadow-emerald-100", iconClass: "bg-emerald-500 text-white", hoverClass: "hover:border-emerald-200 hover:bg-emerald-50/50", },
    ];

    const handleSend = async () => {
        if (!message.trim()) {
            toast.error("Please enter a message");
            return;
        }
        const formattedMessage = `🚀 Important Update! ${message} We’re excited to continue growing with you and are grateful for your trust and support. Thank you for being a valued part of our platform. Stay connected for more updates, improvements, and exciting features ahead.`;

        setIsSending(true);
        const res = await axios.post(`${API_URL}/admin/admin_anoucement`, { messageFor: receiverType, message: formattedMessage }, { withCredentials: true, });

        if (res.data.success) {
            setIsSending(false);
            toast.success(res.data.message || `Message sent to ${receiverType}`);
            setMessage("");
            setIsOpen(false);
        } else {
            toast.error(res.data.message);
        }
    };

    return (
        <div>
            <button onClick={() => setIsOpen(!isOpen)} className="fixed bottom-25 lg:bottom-6 right-6 z-999 flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-r from-sky-500 via-cyan-500 to-emerald-500 text-white shadow-[0_15px_45px_rgba(14,165,233,0.35)] transition-all duration-300 hover:scale-110 hover:rotate-6 hover:shadow-[0_20px_55px_rgba(16,185,129,0.35)]">
                <MessageCircle size={28} />
            </button>

            {isOpen && (
                <div className="fixed top-0 sm:bottom-7 right-0 h-screen z-999 w-full sm:w-100 overflow-scroll border border-white/60 bg-white/80 shadow-[0_25px_80px_rgba(15,23,42,0.12)] backdrop-blur-3xl animate-in slide-in-from-bottom-5 duration-500">

                    <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-sky-100/80 via-white to-emerald-100/80" />
                    <div className="pointer-events-none absolute -top-24 -right-20 h-56 w-56 rounded-full bg-sky-300/20 blur-3xl" />
                    <div className="pointer-events-none absolute bottom-0 left-0 h-44 w-44 rounded-full bg-emerald-300/20 blur-3xl" />

                    <div className="relative border-b border-slate-200/70 px-6 py-5 backdrop-blur-xl">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-sky-500 via-cyan-500 to-emerald-500 text-white shadow-lg shadow-sky-500/20">
                                    <Sparkles size={24} />
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold tracking-tight text-slate-800">Send Message</h3>
                                    <p className="mt-1 text-sm text-slate-500">Quickly notify doctors, patients, or everyone</p>
                                </div>
                            </div>

                            <button onClick={() => setIsOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-500 transition-all duration-300 hover:rotate-90 hover:bg-slate-100 hover:text-slate-700">
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="relative space-y-6 p-6">

                        <div>
                            <div className="mb-3 flex items-center justify-between">
                                <label className="text-sm font-semibold text-slate-700">Select Receiver</label>

                                <div className="rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-medium text-slate-500 backdrop-blur-md">
                                    {receiverType}
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                {receiverOptions.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = receiverType === item.id;

                                    return (
                                        <button key={item.id} onClick={() => setReceiverType(item.id)} className={`group relative overflow-hidden rounded-3xl border p-4 text-left transition-all duration-300 ${isActive ? item.activeClass : `border-slate-200 bg-white/70 ${item.hoverClass}`}`}>
                                            <div className="mb-4 flex items-center justify-between">
                                                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 ${isActive ? item.iconClass : "bg-slate-100 text-slate-500 group-hover:bg-white"}`}>
                                                    <Icon size={20} />
                                                </div>

                                                {isActive && (<CheckCircle2 size={18} className="text-emerald-500" />)}
                                            </div>

                                            <h4 className="text-sm font-semibold text-slate-800">{item.label}</h4>
                                            <p className="mt-1 text-[11px] leading-5 text-slate-500">{item.desc}</p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <div className="mb-3 flex items-center justify-between">
                                <label className="text-sm font-semibold text-slate-700">Message</label>
                                <span className={`text-xs font-medium ${message.length > 220 ? "text-red-500" : "text-slate-400"}`}>
                                    {message.length}/250
                                </span>
                            </div>

                            <div className="relative">
                                <textarea rows="5" maxLength={250} placeholder="Write a clear and professional message..." value={message} onChange={(e) => setMessage(e.target.value)} className="w-full resize-none rounded-[28px] border border-slate-200 bg-white/70 px-5 py-4 pr-12 text-sm text-slate-700 placeholder:text-slate-400 outline-none backdrop-blur-xl transition-all duration-300 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100" />

                                <div className="absolute bottom-4 right-4 rounded-full bg-slate-100 p-2 text-slate-400">
                                    <MessageCircle size={16} />
                                </div>
                            </div>

                            <p className="mt-2 text-xs text-slate-400">Keep your message concise and easy to understand.</p>
                        </div>

                        <div className="flex items-center gap-3 pt-2 w-full">
                            <button onClick={() => { setMessage(""); setReceiverType("allUsers"); }} className="flex-1 rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm font-semibold text-slate-600 transition-all duration-300 hover:bg-slate-100">
                                Reset
                            </button>

                            <button onClick={handleSend} disabled={isSending} className="group flex flex-1 items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-sky-500 via-cyan-500 to-emerald-500 px-4 py-3 font-semibold text-white shadow-[0_12px_35px_rgba(14,165,233,0.25)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_18px_45px_rgba(16,185,129,0.3)] disabled:cursor-not-allowed disabled:opacity-70">
                                {isSending ? (<>    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />    Sending...</>
                                ) : (<><Send size={18} className="transition-transform duration-300 group-hover:translate-x-1" />Send</>)}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FloatingMessage;