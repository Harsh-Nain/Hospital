import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { X } from "lucide-react";

export default function VerifyOtp({ formData, role, close, loading, setLoading }) {
    const API_URL = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    const [otp, setOtp] = useState("");

    const handleVerify = async () => {
        if (!otp) {
            toast.error("Please enter OTP");
            return;
        }

        try {
            setLoading(true);

            const res = await axios.post(`${API_URL}/auth/verify-otp`, { email: formData?.email, otp }, { withCredentials: true });

            if (res.data?.success) {
                const url = role === "doctor" ? "/auth/register-doctor" : "/auth/register-patient";

                const registerRes = await axios.post(`${API_URL}${url}`, { formData }, { withCredentials: true });

                if (registerRes.data?.success) {
                    toast.success("Register Successful 🎉");
                    navigate(registerRes.data.redirect);
                }
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "OTP invalid");
        } finally {
            setLoading(false);
        }
    };
    const resend = async () => {
        setLoading(true);
        setOtp("")
        const res = await axios.post(`${API_URL}/auth/send-otp`, { ...formData, role });

        if (res.data.success) {
            toast.success("OTP sent to email 📧");
        }
        setLoading(false);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">

            {!loading && (
                <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 relative animate-in fade-in zoom-in-95">

                    <button onClick={() => close(false)} className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition">
                        <X className="text-gray-500" size={20} />
                    </button>

                    <div className="text-center space-y-2 mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Verify OTP</h2>
                        <p className="text-gray-500 text-sm">Enter the verification code sent to your email</p>
                    </div>

                    <div className="space-y-4">
                        <input type="text" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter 6 digit OTP" className="w-full text-center tracking-widest text-lg font-semibold py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition" />
                        <button onClick={handleVerify} disabled={loading} className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-200      ${role === "patient" ? "bg-sky-500 hover:bg-sky-600" : "bg-emerald-500 hover:bg-emerald-600"}    disabled:opacity-50 disabled:cursor-not-allowed`}>
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>

                        <p className="text-center text-sm text-gray-500">
                            Didn’t receive code?{" "}
                            <button onClick={() => resend()} className="text-sky-500 font-medium hover:underline" >Resend OTP </button>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}