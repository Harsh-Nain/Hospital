import { useState } from "react";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaLock, FaLockOpen, FaUserMd, FaGavel, FaBriefcase, FaCut, } from "react-icons/fa";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import Forgetpassword from "../components/forgetPassword";
import { MdKeyboardBackspace } from "react-icons/md";

const loginConfigs = {
    patient: { title: "Patient Portal", heading: "Patient Login", description: "Access your medical records, book appointments, and communicate with doctors securely.", endpoint: "/auth/login-patient", registerRoute: "/patient/register", redirectRoute: "/patient/dashboard", linear: "from-blue-500 via-blue-400 to-blue-600", buttonlinear: "from-blue-400 via-blue-500 to-blue-600", focusRing: "focus:ring-blue-400", linkColor: "text-blue-600", Icon: FaUser, },
    salon: { title: "Salon Portal", heading: "Salon Login", description: "Manage appointments, client records, and salon services.", endpoint: "/auth/login-salon", registerRoute: "/salon/register", redirectRoute: "/salon/dashboard", linear: "from-pink-500 via-rose-400 to-pink-600", buttonlinear: "from-pink-400 via-rose-500 to-pink-600", focusRing: "focus:ring-pink-400", linkColor: "text-pink-600", Icon: FaCut, },
    lawyer: { title: "Lawyer Portal", heading: "Lawyer Login", description: "Manage legal cases, appointments, and client communications securely.", endpoint: "/auth/login-lawyer", registerRoute: "/lawyer/register", redirectRoute: "/lawyer/dashboard", linear: "from-purple-500 via-purple-400 to-purple-600", buttonlinear: "from-purple-400 via-purple-500 to-purple-600", focusRing: "focus:ring-purple-400", linkColor: "text-purple-600", Icon: FaGavel, },
    client: { title: "Client Portal", heading: "Client Login", description: "Track your cases, appointments, and service requests in one place.", endpoint: "/auth/login-client", registerRoute: "/client/register", redirectRoute: "/client/dashboard", linear: "from-orange-500 via-orange-400 to-orange-600", buttonlinear: "from-orange-400 via-orange-500 to-orange-600", focusRing: "focus:ring-orange-400", linkColor: "text-orange-600", Icon: FaBriefcase, },
};

export default function DynamicLogin({ type = "patient", setType }) {
    const config = loginConfigs[type] || loginConfigs.patient;
    const { title, heading, description, endpoint, registerRoute, redirectRoute, linear, buttonlinear, focusRing, linkColor, Icon, } = config;
    const navigate = useNavigate();

    const [passwordForget, setPasswordForget] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({ email: "", password: "", });
    const handleChange = (e) => { setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value, })); };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        if (!formData.email.trim()) {
            toast.error("Email is required");
            return;
        }

        if (!formData.password.trim()) {
            toast.error("Password is required");
            return;
        }

        try {
            setLoading(true);

            const API_URL = import.meta.env.VITE_BACKEND_URL;

            const res = await axios.post(`${API_URL}${endpoint}`, formData, { withCredentials: true });

            if (res.data.success) {
                toast.success(`${heading} Successful 🎉`);
                navigate(res.data.redirect || redirectRoute);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex bg-linear-to-br from-slate-100 via-white to-slate-200 overflow-scroll">
            {passwordForget && (<Forgetpassword role={type} setPasswordforget={setPasswordForget} />)}

            <button onClick={() => setType(null)} className="absolute top-5 left-5 z-40 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 backdrop-blur-md border border-gray-200 shadow-sm hover:shadow-md hover:bg-white transition-all text-gray-700">
                <MdKeyboardBackspace size={20} />
                <span className="text-sm font-medium">Back</span>
            </button>

            <div className={`hidden lg:flex lg:w-1/2 relative overflow-hidden bg-linear-to-br ${linear} items-center justify-center p-12`}>
                <div className="absolute top-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-60 h-60 bg-black/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 right-20 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>

                <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="relative z-10 max-w-lg text-white">
                    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-10 shadow-2xl">
                        <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center mb-6 shadow-lg">
                            <Icon className="text-4xl text-white" />
                        </div>

                        <span className="inline-block px-4 py-1 mb-4 text-sm tracking-wide uppercase rounded-full bg-white/15 border border-white/20">
                            Secure Access
                        </span>
                        <h1 className="text-5xl font-bold leading-tight mb-5">{title}</h1>
                        <p className="text-white/80 text-lg leading-relaxed mb-8">{description}</p>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="backdrop-blur-md bg-white/10 rounded-2xl p-4 border border-white/10">
                                <h3 className="text-2xl font-bold">24/7</h3>
                                <p className="text-sm text-white/70">Secure Access</p>
                            </div>
                            <div className="backdrop-blur-md bg-white/10 rounded-2xl p-4 border border-white/10">
                                <h3 className="text-2xl font-bold">100%</h3>
                                <p className="text-sm text-white/70">Encrypted Login</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-10 relative">

                <div className="absolute top-16 right-16 w-40 h-40 bg-slate-300/30 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 left-10 w-52 h-52 bg-slate-200/40 rounded-full blur-3xl"></div>

                <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative z-10 w-full max-w-md">
                    <div className="bg-white/80 backdrop-blur-2xl border border-white/50 rounded-4xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] p-8 md:p-10">
                        <div className="text-center mb-8">
                            <h2 className="text-4xl font-bold text-slate-800 mb-2">{heading}</h2>
                            <p className="text-slate-500 text-sm leading-relaxed">Enter your credentials to continue securely</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="relative group">
                                <FaEnvelope className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-600 transition" />
                                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" className={`w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 ${focusRing} focus:border-transparent transition-all duration-300 shadow-sm`} />
                            </div>

                            <div className="relative group">
                                <span className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400 cursor-pointer">
                                    {showPassword ? <FaLockOpen /> : <FaLock />}
                                </span>
                                <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" className={`w-full pl-12 pr-12 py-4 bg-white border border-slate-200 rounded-2xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 ${focusRing} focus:border-transparent transition-all duration-300 shadow-sm`} />

                                <span className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-400 cursor-pointer hover:text-slate-600 transition" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <IoIosEye /> : <IoIosEyeOff />}
                                </span>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 text-slate-500 cursor-pointer">
                                    <input type="checkbox" className="rounded border-slate-300 text-slate-600 focus:ring-slate-500" />
                                    Remember me
                                </label>
                                <button type="button" onClick={() => setPasswordForget(true)} className={`${linkColor} hover:underline font-medium`} >     Forgot Password? </button>
                            </div>

                            <button type="submit" disabled={loading} className={`relative overflow-hidden w-full py-4 rounded-2xl bg-linear-to-r ${buttonlinear} text-white font-semibold text-lg shadow-xl transition-all duration-300 ${loading ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.02] hover:shadow-2xl"}`}>
                                <span className="relative z-10">
                                    {loading ? "Logging in..." : `Continue to ${title}`}
                                </span>

                                {!loading && (<div className="absolute inset-0 -translate-x-full hover:translate-x-full transition-transform duration-1000 bg-linear-to-r from-transparent via-white/20 to-transparent"></div>)}
                            </button>
                        </form>

                        <div className="flex items-center gap-4 my-8">
                            <div className="flex-1 h-px bg-slate-200"></div>
                            <span className="text-slate-400 text-sm">or</span>
                            <div className="flex-1 h-px bg-slate-200"></div>
                        </div>

                        <p className="text-center text-sm text-slate-500">
                            Don’t have an account?{" "}
                            <NavLink to={registerRoute} className={`${linkColor} font-semibold hover:underline`}>Create Account</NavLink>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}