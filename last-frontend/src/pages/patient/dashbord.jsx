import { useEffect, useState } from "react";
import axios from "axios";
import ShowDoctorProfile from "../../components/showDoctorProfile";

export default function Dashboard() {

    const [patient, setPatient] = useState();
    const [appointments, setAppointments] = useState([]);
    const [showDoctorDetail, setshowDoctorDetail] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const API_URL = import.meta.env.VITE_BACKEND_URL

    useEffect(() => {
        const fetchDashboard = async () => {
            const res = await axios.get(`${API_URL}/dashboard/patient`, { withCredentials: true });
            if (res.data.success) {
                setPatient(res.data.patient);
                setAppointments(res.data.appointments);
                setDoctors(res.data.doctorsList);
            }
        };
        fetchDashboard();
    }, []);

    return (
        <div className="min-h-screen bg-white/70 p-4 sm:p-6 lg:p-10 space-y-10">
            {showDoctorDetail && <ShowDoctorProfile id={showDoctorDetail} setshowDoctorDetail={setshowDoctorDetail} patientId={patient?.patientId} />}

            <div className="bg-white/80 backdrop-blur-xl border border-sky-100 rounded-2xl p-5 sm:p-6 shadow-sm flex items-center gap-4">
                <img src={patient?.image} className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover" />
                <div>
                    <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">Welcome {patient?.fullName}</h1>
                    <p className="text-sm text-gray-500">Disease : {patient?.disease || "Not specified"}</p>
                </div>
            </div>

            <div>
                <h2 className="text-lg sm:text-xl font-semibold mb-6 text-gray-800">Your Appointments</h2>

                <div className="space-y-4">
                    {appointments.map((a, i) => (

                        <div key={i} className=" bg-white/80 backdrop-blur-lg border border-sky-100 rounded-2xl p-4 sm:px-6 sm:py-4 shadow-sm hover:shadow-lg  transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4 w-[33%]">
                                <img src={a.doctorImage} className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover border border-sky-100" />
                                <div>
                                    <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Dr {a.doctorName}</h3>
                                    <p className="text-xs sm:text-sm text-sky-500 font-medium">{a.specialization}</p>
                                </div>
                            </div>

                            <div className="text-sm text-gray-600 text-center sm:text-center w-[33%]">
                                <p className="font-medium">{a.date}</p>
                                <p className="text-xs text-gray-500">{a.startTime} – {a.endTime}</p>
                            </div>
                            <div className={`self-start sm:self-auto px-4 text-right py-1.5 w-[33%] rounded-full text-xs font-semibold capitalize${a.status !== "pending" ? "bg-blue-50 text-green-600" : "bg-red-50 text-red-500"}`}  >
                                {a.status}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h2 className="text-lg sm:text-xl font-semibold mb-6 text-gray-800">Recommended Doctors</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                    {doctors.map((doc, i) => (
                        <div key={i} onClick={() => setshowDoctorDetail(doc.doctorId)} className="group relative bg-white/80 backdrop-blur-xl border border-sky-100 rounded-2xl p-5 sm:p-6 shadow-xl transition-all duration-300 overflow-hidden">

                            <div className="absolute inset-0 opacity-100 transition bg-linear-to-r from-sky-200/20 via-blue-200/20 to-transparent"></div>
                            <div className="flex items-center gap-4 relative z-10">
                                <img src={doc.image || "https://i.pravatar.cc/150"} className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-sky-100 shadow-sm" />

                                <div>
                                    <h3 className="font-semibold text-gray-800 text-base sm:text-lg">Dr {doc.fullName}</h3>
                                    <p className="text-sky-600 text-sm font-medium">{doc.specialization}</p>
                                    <span className="inline-block mt-1 text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">Available Today</span>
                                </div>
                            </div>
                            <div className="my-4 h-px bg-linear-to-r from-transparent via-sky-200 to-transparent"></div>
                            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                                <p>
                                    <span className="font-medium text-gray-700">Experience</span>
                                    <br />
                                    {doc.experienceYears} yrs
                                </p>
                                <p>
                                    <span className="font-medium text-gray-700">Fee</span>
                                    <br />
                                    ₹{doc.consultationFee}
                                </p>
                            </div>

                            <div className="mt-4 p-3 bg-sky-50 rounded-lg border border-sky-100">
                                <p className="text-xs text-gray-500">Next Available Slot</p>
                                <p className="font-semibold text-gray-800 text-sm">
                                    {doc.date}</p>
                                <p className="text-xs text-gray-500">{doc.startTime} – {doc.endTime}</p>
                            </div>

                            <button onClick={() =>  setshowDoctorDetail(doc.doctorId)} className="mt-5 w-full bg-linear-to-r from-sky-400 to-blue-500 text-white py-2.5 rounded-xl font-medium shadow-sm hover:shadow-lg transition">View Details</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}