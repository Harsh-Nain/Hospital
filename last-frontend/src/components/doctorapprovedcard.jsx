import { CheckCircle, XCircle } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";

export default function DoctorApprovalCard({ i, doc, setLoading }) {
    const API_URL = import.meta.env.VITE_BACKEND_URL;

    const [status, setStatus] = useState(doc.status || "pending");

    const handleAction = async (type) => {
        try {
            setLoading(true)
            const res = await axios.put(`${API_URL}/admin/approve_doctor`, { doctorId: doc.doctorId, status: type, name: doc.fullName, email: doc.email, }, { withCredentials: true });

            if (res.data.success) {
                setStatus(type);
                setLoading(false)
                toast.success(`Doctor ${type} successfully`);
            }
        } catch (err) {
            toast.error("Action failed");
            setLoading(false)
        }
    };

    const cardStyle = status === "approved" ? "border-emerald-200 bg-emerald-50" : status === "reject" ? "border-red-200 bg-red-50" : "border-sky-100 bg-white";
    const badgeStyle = status === "approved" ? "bg-emerald-100 text-emerald-600" : status === "reject" ? "bg-red-100 text-red-600" : "bg-yellow-100 text-yellow-600";

    return (
        <div key={i} className={`rounded-2xl p-5 shadow-md  bg-linear-to-r from-emerald-100 to-sky-50  hover:shadow-xl transition-all ${cardStyle}`}>
            <div className="flex items-center gap-4">
                <img src={doc.image} alt="doctor" className="w-14 h-14 rounded-xl object-cover border border-gray-200" />

                <div>
                    <h3 className="font-semibold text-gray-800 text-lg">
                        Dr. {doc.fullName}
                    </h3>
                    <p className="text-sky-600 text-sm">{doc.email}</p>

                    <span className={`text-xs px-2 py-0.5 rounded-full ${badgeStyle}`}>
                        {status === "approved" ? "Approved" : status === "reject" ? "Rejected" : "Pending Approval"}
                    </span>
                </div>
            </div>

            <div className="my-4 h-px bg-linear-to-r from-transparent via-gray-200 to-transparent"></div>

            <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                <p><span className="font-medium">Experience</span><br />{doc.experienceYears} yrs</p>
                <p><span className="font-medium">Fee</span><br />₹{doc.consultationFee}</p>
                <p><span className="font-medium">License</span><br />{doc.licenseNumber}</p>
                <p><span className="font-medium">Specialization</span><br />{doc.specialization}</p>
            </div>

            {status === "pending" && (
                <div className="mt-5 flex gap-3">
                    <button onClick={() => handleAction("approved")} className="flex-1 flex items-center justify-center gap-2 bg-emerald-400 hover:opacity-90 cursor-pointer text-white py-2 rounded-xl font-medium hover:shadow-md transition">
                        <CheckCircle size={18} />
                        Approve
                    </button>

                    <button onClick={() => handleAction("reject")} className="flex-1 flex items-center justify-center gap-2 bg-red-400 hover:opacity-90 cursor-pointer text-white py-2 rounded-xl font-medium hover:shadow-md transition">
                        <XCircle size={18} />
                        Reject
                    </button>
                </div>
            )}
        </div>
    );
}