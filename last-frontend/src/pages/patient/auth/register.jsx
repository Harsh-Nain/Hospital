import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaLock, FaHeartbeat, FaLockOpen } from "react-icons/fa";
import { useNavigate, NavLink } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import VerifyOtp from "../../../components/verifyotp";

export default function PatientRegister() {
    const API_URL = import.meta.env.VITE_BACKEND_URL

    const [showPassword, setShowPassword] = useState(false);
    const [OtpVerification, setOtpVerification] = useState(false);
    const [Loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ fullName: "", email: "", password: "", disease: "" });
    const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post(`${API_URL}/auth/send-otp`, { ...formData, role: "patient" });

            if (res.data.success) {
                toast.success("OTP sent to email 📧");
                setOtpVerification(true)
            }
            setLoading(false);

        } catch (err) {
            setLoading(false);
            toast.error(err.response?.data?.message || "Failed to send OTP");
        }
    };

    return (
        <div className="h-screen flex flex-col md:flex-row bg-gray-100 overflow-hidden">
            {OtpVerification && (<VerifyOtp formdata={formData} role="patient" />)}

            <div className="hidden md:flex w-1/2 bg-linear-to-br from-blue-300 via-blue-400 to-blue-600 items-center justify-center p-12 text-white">

                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="max-w-md text-center space-y-6">
                    <FaUser className="text-6xl mx-auto opacity-90" />
                    <h1 className="text-4xl font-bold">Join Patient Portal</h1>
                    <p className="text-lg opacity-90 leading-relaxed">
                        Create your account to manage medical records, schedule doctor appointments.
                    </p>
                </motion.div>

            </div>

            <div className="flex w-full md:w-1/2 h-screen items-center justify-center overflow-y-auto p-6">

                <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 space-y-6">

                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-bold text-gray-800">Patient Register</h2>
                        <p className="text-gray-500">Create your healthcare account</p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>

                        <div className="relative">
                            <FaUser className="absolute top-4 left-3 text-gray-400" />
                            <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border focus:outline-none border-sky-100 focus:ring-2 focus:ring-sky-400 transition rounded-xl" />
                        </div>

                        <div className="relative">
                            <FaEnvelope className="absolute top-4 left-3 text-gray-400" />
                            <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border focus:outline-none border-sky-100 focus:ring-2 focus:ring-sky-400 transition rounded-xl" />
                        </div>

                        <div className="relative">
                            <span className="absolute top-4 left-3 text-gray-400 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>    {showPassword ? <FaLockOpen /> : <FaLock />}</span>
                            <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder={showPassword ? "Password" : "********"} className="w-full pl-10 pr-10 py-3 border  rounded-lg focus:outline-none border-sky-100 focus:ring-2 focus:ring-sky-400 transition" />
                            <span className="absolute top-4 right-3 text-gray-400 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>    {showPassword ? <IoIosEye /> : <IoIosEyeOff />}</span>
                        </div>

                        <div className="relative">
                            <FaHeartbeat className="absolute top-4 left-3 text-gray-400" />
                            <input type="text" name="disease" placeholder="Disease / Health Issue" value={formData.disease} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border focus:outline-none border-sky-100 focus:ring-2 focus:ring-sky-400 transition rounded-xl" />
                        </div>

                        <button type="submit" className="w-full py-3 rounded-xl bg-linear-to-r from-blue-400 to-sky-600 text-white font-semibold" >
                            {!Loading ? "Verify Email" : "Sending Otp..."}
                        </button>

                    </form>

                    <p className="text-center text-sm text-gray-500">
                        Already have an account?{" "}
                        <NavLink to="/patient/login" className="text-blue-600 font-medium hover:underline">Login</NavLink>
                    </p>

                </motion.div>

            </div>

        </div>
    );
}