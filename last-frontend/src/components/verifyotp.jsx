import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "./loading"

export default function VerifyOtp({ formdata, role, close }) {
    const API_URL = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    const handleVerify = async () => {
        if (!otp) {
            toast.error("Please enter OTP");
            return;
        }

        try {

            setLoading(true);

            const res = await axios.post(`${API_URL}/auth/verify-otp`, { email: formdata?.email, otp: otp, }, { withCredentials: true });


            if (res.data?.success) {
                const url = role === "doctor" ? "/auth/register-doctor" : "/auth/register-patient";

                const registerRes = await axios.post(`${API_URL}${url}`, { formdata }, { withCredentials: true });

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

    return (
        <div className="h-screen w-full z-50 fixed left-0 top-0 flex items-center justify-center bg-black/70">
            {loading && <Loading />}
            
            {   !loading && (
                    <div className="bg-white relative p-8 rounded-2xl w-85 space-y-4">
                        <button
                            onClick={() => close(false)}
                            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 hover:text-red-400 text-gray-600 hover:text-black transition cursor-pointer"
                        >
                            ✕
                        </button>
                        <h2 className="text-2xl font-bold text-center">Verify OTP</h2>
                        <p className="text-center text-gray-500">Enter OTP sent to your email.</p>
                        <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full border p-3 rounded-lg" />

                        <button onClick={handleVerify} disabled={loading} className={`w-full ${role == "patient" ? " bg-sky-500" : " bg-emerald-500"} text-white py-3 rounded-lg cursor-pointer`}>
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>

                    </div>

                )
            }


        </div>
    );
}