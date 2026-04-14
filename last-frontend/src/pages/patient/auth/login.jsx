import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaGoogle, FaLock, FaLockOpen } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import toast from "react-hot-toast";
import axios from "axios";
import Forgetpassword from "../../../components/forgetPassword";
import { MdKeyboardBackspace } from "react-icons/md";
import Footer from "../../interface/Footer";
import Nav from "../../interface/Nav";

export default function PatientLogin() {
    const [Passwordforget, setPasswordforget] = useState(false);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };
    const [Loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        if (Loading) return;

        const API_URL = import.meta.env.VITE_BACKEND_URL
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

            const res = await axios.post(`${API_URL}/auth/login-patient`, formData, { withCredentials: true });
            if (res.data.success) {
                toast.success("Login Successful 🎉");
                navigate(res.data.redirect);
            }

        } catch (err) {

            if (err.response) {
                toast.error(err.response.data.message || "Login failed");
            } else {
                toast.error("Server error! please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (

        <>
            <Nav />

            <div className="min-h-screen flex flex-col relative md:flex-row bg-gray-50">
                {Passwordforget && (<Forgetpassword role="patient" setPasswordforget={setPasswordforget} />)}

                <div className="hidden md:flex w-1/2 bg-linear-to-b from-blue-500  via-blue-400  to-blue-600  focus:ring-blue-400  text-blue-600 border-sky-100 items-center justify-center p-12">

                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="max-w-md text-center space-y-6">
                        <FaUser className="text-6xl mx-auto opacity-90" />
                        <h1 className="text-4xl font-bold">Patient Portal</h1>
                        <p className="text-lg opacity-90 leading-relaxed">Access your medical records, book appointments, and communicate with doctors through our secure healthcare platform.</p>
                    </motion.div>
                </div>

                <div className="flex w-full md:w-1/2 items-center h-screen justify-center p-6">

                    {/* <button onClick={() => navigate(-1)} className="absolute cursor-pointer top-4 left-6 flex items-center gap-2 px-3 py-2 rounded-lg bg-white/30 hover:shadow-sm hover:bg-white/70 transition text-gray-700">
                    <MdKeyboardBackspace size={20} />
                    <span className="text-sm font-medium">Back</span>
                </button> */}

                    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-3">

                        <div className="text-center space-y-3">
                            <h2 className="text-3xl font-bold text-gray-800">Patient Login</h2>
                            <p className="text-gray-500">Access your healthcare dashboard</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">

                            <div className="relative">
                                <FaEnvelope className="absolute top-4 left-3 text-gray-400" />
                                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" className="w-full pl-10 pr-4 py-3 border border-sky-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
                            </div>

                            <div className="relative">
                                <span className="absolute top-4 left-3 text-gray-400 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>    {showPassword ? <FaLockOpen /> : <FaLock />}</span>
                                <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder={showPassword ? "password" : "********"} className="w-full pl-10 pr-10 py-3 border border-sky-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
                                <span className="absolute top-4 right-3 text-gray-400 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>    {showPassword ? <IoIosEye /> : <IoIosEyeOff />}</span>
                            </div>

                            <div className="text-right text-sm w-fit cursor-pointer" onClick={() => setPasswordforget(true)}>
                                <p className="text-sky-600 hover:underline">Forget Password?</p>
                            </div>

                            <button type="submit" disabled={Loading} className={`w-full py-3 rounded-lg text-white font-semibold shadow-md transition ${Loading ? "bg-gray-400 cursor-not-allowed"
                                : "bg-linear-to-r from-blue-400 via-blue-400 to-blue-500 hover:opacity-90"
                                }`}   >
                                {Loading ? "Logging in..." : "Login"}
                            </button>
                        </form>


                        <p className="text-center text-sm text-gray-500">
                            Don’t have an account?{" "}
                            <NavLink to="/patient/register" className="text-blue-600 font-medium hover:underline">
                                Create Account
                            </NavLink>
                        </p>

                    </motion.div>

                </div>

            </div>
            <Footer />


        </>
    );
}