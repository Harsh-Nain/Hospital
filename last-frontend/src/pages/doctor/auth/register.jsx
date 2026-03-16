import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaLock, FaUserMd, FaCertificate, FaMoneyBillWave, FaClock, FaLockOpen, FaNotesMedical } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import VerifyOtp from "../../../components/verifyotp"
import toast from "react-hot-toast";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";

export default function DoctorRegister() {
    const API_URL = import.meta.env.VITE_BACKEND_URL

    const [Loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const [OtpVerification, setOtpVerification] = useState(false);
    const [formData, setFormData] = useState({ fullName: "", email: "", password: "", specialization: "", experienceYears: "", licenseNumber: "", symptoms: [], consultationFee: "" });
    const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            let formdata = { ...formData, symptoms: formData.symptoms.split(",").map((s) => s.trim()).filter(Boolean) };
            console.log(formdata);

            const res = await axios.post(`${API_URL}/auth/send-otp`, { ...formdata, role: "doctor" });

            if (res.data.success) {
                toast.success("OTP sent to email 📧");
                setOtpVerification(true)
            }

        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to send OTP");
        }
    };

    return (
        <div className="h-screen flex flex-col md:flex-row bg-gray-50 overflow-hidden">
            {OtpVerification && (<VerifyOtp formdata={formData} role="doctor" />)}

            <div className="hidden md:flex w-1/2 bg-linear-to-br from-emerald-300 via-emerald-400 to-emerald-600 items-center justify-center p-12 text-white">

                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="max-w-md text-center space-y-6">
                    <FaUserMd className="text-6xl mx-auto opacity-90" />
                    <h1 className="text-4xl font-bold">Join Doctor Portal</h1>
                    <p className="text-lg opacity-90 leading-relaxed">Register as a doctor to manage appointments, consult with patients online.</p>
                </motion.div>

            </div>

            <div className="w-full md:w-1/2 h-screen flex justify-center items-start overflow-y-auto p-4">

                <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-5 my-auto">

                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-bold text-gray-800">Doctor Register</h2>
                        <p className="text-gray-500">Create your doctor account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div className="relative">
                            <FaUser className="absolute top-4 left-3 text-gray-400" />
                            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-400" />
                        </div>

                        <div className="relative">
                            <FaEnvelope className="absolute top-4 left-3 text-gray-400" />
                            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-400" />
                        </div>

                        <div className="relative">
                            <span className="absolute top-4 left-3 text-gray-400 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>    {showPassword ? <FaLockOpen /> : <FaLock />}</span>
                            <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder={showPassword ? "Password" : "********"} className="w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
                            <span className="absolute top-4 right-3 text-gray-400 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>    {showPassword ? <IoIosEye /> : <IoIosEyeOff />}</span>
                        </div>


                        <div className="relative">
                            <FaUserMd className="absolute top-4 left-3 text-gray-400" />
                            <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} placeholder="Specialization" className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-400" />
                        </div>

                        <div className="relative">
                            <FaClock className="absolute top-4 left-3 text-gray-400" />
                            <input type="number" name="experienceYears" value={formData.experienceYears} onChange={handleChange} placeholder="Years of Experience" className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-400" />
                        </div>

                        <div className="relative">
                            <FaCertificate className="absolute top-4 left-3 text-gray-400" />
                            <input type="text" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} placeholder="Medical License Number" className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-400" />
                        </div>

                        <div className="relative">
                            <FaMoneyBillWave className="absolute top-4 left-3 text-gray-400" />
                            <input type="number" name="consultationFee" value={formData.consultationFee} onChange={handleChange} placeholder="Consultation Fee (₹)" className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-400" />
                        </div>

                        <div className="relative">
                            <FaNotesMedical className="absolute top-4 left-3 text-gray-400" />
                            <input type="text" name="symptoms" value={formData.symptoms} onChange={handleChange} placeholder="Enter Symptoms" className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-400" />
                        </div>

                        <button type="submit" className="w-full py-3 rounded-lg bg-linear-to-r from-emerald-400 to-emerald-600 text-white font-semibold shadow-md hover:opacity-90 transition">
                            Register as Doctor
                        </button>

                    </form>

                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-gray-200"></div>
                        <span className="text-sm text-gray-400">OR</span>
                        <div className="flex-1 h-px bg-gray-200"></div>
                    </div>

                    <p className="text-center text-sm text-gray-500">
                        Already have an account?{" "}
                        <NavLink to="/doctor/login" className="text-emerald-600 font-medium hover:underline">    Login</NavLink>
                    </p>

                </motion.div>
            </div>
        </div>
    );
}