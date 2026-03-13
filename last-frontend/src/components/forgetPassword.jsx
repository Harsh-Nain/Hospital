import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "./loading";
import { RxCross1 } from "react-icons/rx";
import { IoMdArrowRoundBack } from "react-icons/io";

export default function Forgetpassword({ role, setPasswordforget }) {

    const API_URL = import.meta.env.VITE_BACKEND_URL;

    const [Mail, setMail] = useState("");
    const [Otp, setOtp] = useState("");
    const [newpassword, setnewpassword] = useState("");
    const [loading, setLoading] = useState(false);

    const [next, setnext] = useState(false);
    const [nextpassword, setnextpassword] = useState(false);

    const handleVerify = async () => {
        if (!Mail) {
            toast.error("Please enter email");
            return;
        }

        try {
            setLoading(true);

            if (!next && !nextpassword) {
                const res = await axios.post(`${API_URL}/auth/forget-password`, { email: Mail, role }, { withCredentials: true });

                if (res.data.success) {
                    toast.success(res.data.message);
                    setnext(true);
                }
            }
            else if (!nextpassword) {
                const res = await axios.post(`${API_URL}/auth/verify-otp`, { email: Mail, otp: Otp }, { withCredentials: true });

                if (res.data.success) {
                    toast.success(res.data.message);
                    setnextpassword(true);
                }
            }
            else {
                const res = await axios.post(`${API_URL}/auth/updatePassword`, { email: Mail, role, password: newpassword }, { withCredentials: true });

                if (res.data.success) {
                    toast.success(res.data.message);
                    setPasswordforget(false);
                }
            }

        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }

    };

    const handleBack = () => {
        if (nextpassword) setnextpassword(false);
        else if (next) setnext(false);
    };

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

            {loading && <Loading />}

            <div className="relative w-100 bg-white/80 backdrop-blur-xl border border-sky-100 shadow-xl rounded-2xl p-8 space-y-6">

                <button onClick={() => setPasswordforget(false)} className="absolute right-4 top-4 text-gray-500 hover:text-red-500 text-xl">
                    <RxCross1 />
                </button>

                {(next || nextpassword) && (
                    <button onClick={handleBack} className="absolute left-4 top-4 text-sm text-gray-500 hover:text-sky-600">
                        <IoMdArrowRoundBack /> Back
                    </button>
                )}

                <div className="text-center space-y-1">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {nextpassword ? "Create New Password" : next ? "Verify OTP" : "Reset Password"}
                    </h2>

                    <p className="text-gray-500 text-sm">{nextpassword ? "Enter your new password" : next ? "Enter the OTP sent to your email" : "Enter your email to receive OTP"}
                    </p>

                </div>

                {!next && !nextpassword && (
                    <input type="email" placeholder="Enter your email" value={Mail} onChange={(e) => setMail(e.target.value)} className="w-full border border-sky-100 rounded-lg p-3 bg-white/50 focus:outline-none focus:ring-2 focus:ring-sky-400" />
                )}

                {next && !nextpassword && (
                    <input type="text" placeholder="Enter OTP" value={Otp} onChange={(e) => setOtp(e.target.value)} className="w-full border border-sky-100 rounded-lg p-3 bg-white/50 focus:outline-none focus:ring-2 focus:ring-sky-400" />
                )}

                {nextpassword && (
                    <input type="password" placeholder="Enter new password" value={newpassword} onChange={(e) => setnewpassword(e.target.value)} className="w-full border border-sky-100 rounded-lg p-3 bg-white/50 focus:outline-none focus:ring-2 focus:ring-sky-400" />
                )}

                <button onClick={handleVerify} disabled={loading} className={`w-full py-3 rounded-lg font-medium text-white transition  ${role === "patient" ? "bg-linear-to-r from-sky-400 to-blue-500" : "bg-linear-to-r from-emerald-400 to-green-500"} hover:shadow-md`}        >
                    {loading ? "Processing..." : nextpassword ? "Change Password" : next ? "Verify OTP" : "Send OTP"}
                </button>

            </div>

        </div>

    );

}