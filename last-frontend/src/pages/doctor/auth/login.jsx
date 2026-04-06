import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaUserMd, FaEnvelope, FaLock, FaGoogle, FaLockOpen } from "react-icons/fa";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { NavLink, useNavigate } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";
import axios from "axios";
import toast from "react-hot-toast";
import Forgetpassword from "../../../components/forgetPassword";

export default function DoctorLogin() {
    const API_URL = import.meta.env.VITE_BACKEND_URL

    const [Passwordforget, setPasswordforget] = useState(false);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };
    const [Loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        if (Loading) return;

        e.preventDefault();
        if (!formData.email?.trim()) {
            toast.error("Email is required");
            return;
        }

        if (!formData.password?.trim()) {
            toast.error("Password is required");
            return;
        }

        try {
            setLoading(true);

            const res = await axios.post(`${API_URL}/auth/login-doctor`, formData, { withCredentials: true, });

            if (res.data.success) {

                toast.success("Doctor Login Successful 👨‍⚕️");
                navigate(res.data.redirect || "/dashboard-doctor");
            }

        } catch (err) {

            if (err.response) {
                toast.error(err.response.data.message || "Login failed");
                navigate(err.response.data.redirect);
            } else {
                toast.error("Server error. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex flex-col md:flex-row bg-gray-50">
            {Passwordforget && (<Forgetpassword role="doctor" setPasswordforget={setPasswordforget} />)}

            <div className="hidden md:flex w-1/2 bg-linear-to-br from-green-300 via-emerald-400 to-emerald-600 items-center justify-center p-10 text-white">

                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="max-w-md text-center space-y-6">
                    <FaUserMd className="text-6xl mx-auto opacity-90" />
                    <h1 className="text-4xl font-bold">Doctor Portal</h1>
                    <p className="text-lg opacity-90 leading-relaxed">Manage your patients, appointments, and medical records with a modern healthcare platform.</p>
                </motion.div>
            </div>

            <div className="flex w-full md:w-1/2 h-screen items-center justify-center p-4">

                <button onClick={() => navigate(-1)} className="absolute cursor-pointer top-4 left-6 flex items-center gap-2 px-3 py-2 rounded-lg bg-white/30 hover:shadow-sm hover:bg-white/70 transition text-gray-700">
                    <MdKeyboardBackspace size={20} />
                    <span className="text-sm font-medium">Back</span>
                </button>

                <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-4">

                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-bold text-gray-800">Doctor Login</h2>
                        <p className="text-gray-500">Access your healthcare dashboard</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">

                        <div className="relative">
                            <FaEnvelope className="absolute top-4 left-3 text-gray-400" />
                            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" className="w-full pl-10 pr-4 py-3 border focus:outline-none border-emerald-100 focus:ring-2 focus:ring-emerald-400 transition rounded-lg" />
                        </div>

                        <div className="relative">
                            <span className="absolute top-4 left-3 text-gray-400 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>    {showPassword ? <FaLockOpen /> : <FaLock />}</span>
                            <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder={showPassword ? "Password" : "********"} className="w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none border-emerald-100 focus:ring-2 focus:ring-emerald-400 transition" />
                            <span className="absolute top-4 right-3 text-gray-400 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>    {showPassword ? <IoIosEye /> : <IoIosEyeOff />}</span>
                        </div>

                        <div className="text-right text-sm w-fit cursor-pointer" onClick={() => setPasswordforget(true)}>
                            <p className="text-emerald-600 hover:underline">Forget Password?</p>
                        </div>
                        <button
                            type="submit"
                            disabled={Loading}
                            className={`w-full py-3 rounded-lg text-white font-semibold shadow-md transition
        ${Loading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-gradient-to-r from-green-400 to-emerald-600 hover:opacity-90"
                                }`}
                        >
                            {Loading ? "Logging in..." : "Login"}
                        </button>                    </form>


                    <p className="text-center text-sm text-gray-500">
                        Don’t have an account?{" "}
                        <NavLink to="/doctor/register" className="text-emerald-600 font-medium hover:underline">    Create Account</NavLink>
                    </p>

                </motion.div>

            </div>

        </div>
    );
}