import { useEffect, useState } from "react";
import axios from "axios";
import ShowDoctorProfile from "../../components/showDoctorProfile";
import Doctorcard from "../../components/doctorcard";

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
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-10 space-y-10">
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
                    {appointments.length == 0 && "no any appointments yet..."}
                    {appointments.map((a, i) => (
                        <div key={i} className="bg-white/80 backdrop-blur-lg border border-sky-100 rounded-2xl p-4 sm:px-6 sm:py-4 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4 min-w-55">
                                <img src={a.doctorImage} alt="doctor" className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover border border-sky-100" />

                                <div>
                                    <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Dr. {a.doctorName}</h3>
                                    <p className="text-xs sm:text-sm text-sky-500 font-medium">{a.specialization}</p>
                                </div>
                            </div>

                            <div className="text-sm text-gray-600 text-left sm:text-center flex-1 ">
                                <p className="font-medium text-gray-800">{a.date}</p>
                                <p className="text-xs text-gray-500">{a.startTime} – {a.endTime}</p>
                            </div>

                            <div className={`px-4 py-1.5 rounded-full text-xs text-center font-semibold sm:w-[33%] capitalize flex items-center gap-2 justify-center sm:justify-end ${a.appoitmentStatus === "confirmed" ? "bg-emerald-50 text-emerald-600" : a.appoitmentStatus === "pending" ? "bg-yellow-50 text-yellow-600" : a.appoitmentStatus === "payment pending" ? "bg-blue-50 text-blue-600" : "bg-red-50 text-red-500"}`}>
                                <span className="w-full text-center">{a.appoitmentStatus}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h2 className="text-lg sm:text-xl font-semibold mb-6 text-gray-800">Recommended Doctors</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                    {doctors.length == 0 && "no any doctor avalable..."}
                    {doctors.map((doc, i) => (<Doctorcard doc={{ ...doc, isApproved: true }} i={i} setshowDoctorDetail={setshowDoctorDetail} />))}
                </div>
            </div>
        </div>
    );
}