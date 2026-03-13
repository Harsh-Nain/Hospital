import { FaUserMd, FaUserInjured } from "react-icons/fa";
import { useNavigate } from "react-router";

export default function RoleSelection() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-linear-to-br from-sky-50 via-white to-emerald-50 flex items-center justify-center px-6">

            <div className="w-full max-w-5xl">

                <div className="text-center mb-14">
                    <h1 className="text-5xl font-bold text-gray-900 tracking-tight">Last Doctor</h1>
                    <p className="mt-4 text-lg text-gray-500">Smart Healthcare Platform connecting Patients and Doctors</p>
                </div>

                <div className="grid md:grid-cols-2 gap-10">

                    <div onClick={() => navigate("/patient/login")} className="group cursor-pointer bg-white border border-gray-200 rounded-3xl p-7 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                        
                        <div className="flex flex-col items-center text-center space-y-6">
                            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-sky-100 group-hover:bg-sky-200 transition"><FaUserInjured className="text-sky-600 text-4xl" /></div>
                            <h2 className="text-2xl font-semibold text-gray-900">Patient Portal</h2>
                            <p className="text-gray-500 max-w-sm">Book doctor appointments, access reports, manage prescriptions and track your health records easily.</p>
                            <button className="mt-3 px-7 py-3 bg-sky-600 text-white rounded-xl font-medium hover:bg-sky-700 transition">Continue as Patient</button>
                        </div>
                    </div>


                    <div onClick={() => navigate("/doctor/login")} className="group cursor-pointer bg-white border border-gray-200 rounded-3xl p-7 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">

                        <div className="flex flex-col items-center text-center space-y-6">
                            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-green-100 group-hover:bg-green-200 transition">    <FaUserMd className="text-green-600 text-4xl" /></div>
                            <h2 className="text-2xl font-semibold text-gray-900">Doctor Portal</h2>
                            <p className="text-gray-500 max-w-sm">Manage appointments, connect with patients, upload reports and streamline your healthcare workflow.</p>
                            <button className="mt-3 px-7 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition">Continue as Doctor</button>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}