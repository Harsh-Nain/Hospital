import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function PaymentCard({ payment, API_URL, onClose }) {
    const [step, setStep] = useState("create");
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState(payment.consultationFee || 100);
    const [transactionId, setTransactionId] = useState("");

    const handleCreatePayment = async () => {
        try {
            setLoading(true);
            const res = await axios.post(`${API_URL}/payment/create`, { appointmentId: payment.appointmentId, amount, paymentMethod: "UPI", }, { withCredentials: true });

            if (res.data.success) {
                setStep("verify");
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Error");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyPayment = async () => {
        try {
            setLoading(true);
            const res = await axios.post(`${API_URL}/payment/verify`, { appointmentId: payment.appointmentId, transactionId, }, { withCredentials: true });

            if (res.data.success) {
                toast.success("Payment Successful ✅");
                onClose();
            }
        } catch (err) {
            console.error(err);
            toast.error("Verification failed ❌");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex h-screen items-center justify-center bg-black/50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">

                <h2 className="text-lg font-semibold mb-4">Payment</h2>

                <div className="flex items-center gap-3 mb-4">
                    <img src={payment.doctorImage} className="w-12 h-12 rounded-lg" />
                    <div>
                        <p className="font-medium">
                            Dr. {payment.doctorName}
                        </p>
                        <p className="text-xs text-gray-500">
                            {payment.specialization}
                        </p>
                    </div>
                </div>

                <p className="text-sm text-gray-600 mb-3">
                    {payment.date} | {payment.startTime} – {payment.endTime}
                </p>

                <div className="mb-4">
                    <p className="text-sm text-gray-500">Amount</p>
                    <p className="text-lg font-bold text-gray-800">
                        ₹{amount}
                    </p>
                </div>

                {step === "create" && (
                    <button onClick={handleCreatePayment} disabled={loading} className="w-full bg-sky-500/50 cursor-pointer text-white py-2 rounded-lg">
                        {loading ? "Creating..." : "Create Payment"}
                    </button>
                )}

                {step === "verify" && (
                    <>
                        <input type="text" placeholder="Enter Transaction ID" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} className="w-full border p-2 rounded-lg mb-3 text-sm" />
                        <button onClick={handleVerifyPayment} disabled={loading} className="w-full bg-green-500/50 cursor-pointer text-white py-2 rounded-lg">
                            {loading ? "Verifying..." : "Verify Payment"}
                        </button>
                    </>
                )}

                <button onClick={onClose} className="mt-3 w-full border cursor-pointer py-2 rounded-lg text-sm">Cancel</button>
            </div>
        </div>
    );
}