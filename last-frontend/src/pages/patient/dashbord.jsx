import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import ShowDoctorProfile from "../../components/showDoctorProfile";
import Doctorcard from "../../components/doctorcard";
import { FormatTime, getTimeRemaining } from "../../components/formentTime"
import NextAppoitment from "../../components/nextappoitment";
import { useOutletContext } from "react-router-dom";

export default function Dashboard() {
    const [patient, setPatient] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [showDoctorDetail, setshowDoctorDetail] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [nextAppoitment, setNextAppoitment] = useState(null);
    const [timeLeft, setTimeLeft] = useState("");
    const { setLoading } = useOutletContext();
    const [statusFilter, setStatusFilter] = useState("all");
    const modals = [nextAppoitment, showDoctorDetail];
    const isAnyModalOpen = modals.some(Boolean);

    useEffect(() => {
        const root = document.documentElement;

        if (isAnyModalOpen) {
            root.classList.add("overflow-hidden");
        } else {
            root.classList.remove("overflow-hidden");
        }
        return () => { root.classList.remove("overflow-hidden"); };
    }, [isAnyModalOpen]);


    const sortedAppointments = [...appointments].sort((a, b) => {
        const isConfirmedA = a.status === "confirmed";
        const isConfirmedB = b.status === "confirmed";

        if (isConfirmedA !== isConfirmedB) {
            return isConfirmedB - isConfirmedA;
        }
        const dateTimeA = new Date(`${a.slot?.date}T${a.slot?.startTime}`);
        const dateTimeB = new Date(`${b.slot?.date}T${b.slot?.startTime}`);
        return dateTimeA - dateTimeB;
    });

    const filteredAppointments = useMemo(() => {
        if (!sortedAppointments) return [];

        if (statusFilter === "all") return sortedAppointments;

        return sortedAppointments.filter((appt) => appt.status === statusFilter);
    }, [sortedAppointments, statusFilter]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(getTimeRemaining("18:30"));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const API_URL = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setLoading(true)
                const res = await axios.get(`${API_URL}/dashboard/patient`, { withCredentials: true, });
                console.log(res.data);

                if (res.data.success) {
                    setPatient(res.data.patient);
                    setAppointments(res.data.appointments || []);
                    setDoctors(res.data.doctorsList || []);
                    setLoading(false)
                }
            } catch (err) {
                setLoading(false)
                console.error("Dashboard error:", err);
            }
        };

        fetchDashboard();
    }, []);

    const statusLabelMap = { "wait for approval": "Requested", "confirmed": "Confirmed At", "Cancelled": "Cancelled At", };

    const handleRefund = (appointment) => {
        console.log("Refund:", appointment);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-10 space-y-10">
            {showDoctorDetail && (<ShowDoctorProfile id={showDoctorDetail} setshowDoctorDetail={setshowDoctorDetail} patientId={patient?.patientId} />)}
            {nextAppoitment && (<NextAppoitment id={nextAppoitment} setNextAppoitment={setNextAppoitment} patientId={patient?.patientId} />)}

            <div className="bg-linear-to-tr from-sky-100 to-white border-black/10 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                <img src={patient?.image || "/default-user.png"} className="w-14 h-14 rounded-xl object-cover" />
                <div>
                    <h1 className="text-xl font-bold text-gray-800"> Welcome {patient?.fullName || "User"}</h1>
                    <p className="text-sm text-gray-500"> Disease: {patient?.disease || "Not specified"}</p>
                </div>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-6 text-gray-800">Your Appointments</h2>
                <div className="flex justify-center gap-3 bg-sky-50 mb-3 p-2 rounded-xl shadow-sm">
                    {[{ label: "All", value: "all" }, { label: "Confirmed", value: "confirmed" }, { label: "Cancelled", value: "Cancelled" }, { label: "Upcomming", value: "wait for approval" },].map((item) =>
                    (<button key={item.value} onClick={() => setStatusFilter(item.value)} className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${statusFilter === item.value ? "bg-sky-500 text-white shadow-md" : "text-sky-700 hover:bg-white hover:shadow-sm"}`}>{item.label}</button>
                    ))}
                </div>

                <div className="space-y-4">
                    {filteredAppointments.length === 0 && (
                        <div className="bg-linear-to-tr from-sky-50 to-white border text-gray-400 text-center border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">No appointments yet...</div>)}

                    {filteredAppointments.map((a, i) => {
                        const doctor = a.doctor || {};
                        const slot = a.slot || {};
                        return (
                            <div key={i} className="bg-linear-to-tr from-sky-50 to-white border relative border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col lg:flex-row justify-between gap-6">
                                <div className="flex items-center gap-4 min-w-55">
                                    <img src={doctor.image || "/default-doctor.png"} className="w-14 h-14 rounded-xl object-cover border-black/55" />
                                    <div>
                                        <h3 className="font-semibold text-gray-800">Dr. {doctor.name || "Unknown"}</h3>
                                        <p className="text-sm text-emerald-600">{doctor.specialization || "General"}</p>
                                    </div>
                                </div>

                                <div className="lg:text-center flex-1">
                                    <p className="font-semibold text-gray-800">{slot.date || "N/A"}</p>
                                    <p className="text-xs text-gray-500">{FormatTime(slot.startTime)} – {FormatTime(slot.endTime)}</p>
                                    {a.status == "confirmed" && <p className="text-xs font-medium text-blue-600 mt-1">{getTimeRemaining(slot.startTime, slot.date)}</p>}
                                    <p className="text-[10px] text-gray-400 mt-1">{statusLabelMap[a.status] && `${statusLabelMap[a.status]}: `}{a.appoitmentCreatedAt}</p>
                                </div>

                                <div className="flex flex-col items-end gap-2 min-w-55">
                                    <div className={`px-4 py-1 rounded-full absolute lg:static top-7.5 text-xs font-semibold capitalize ${a.isCancelled || a.status === "Cancelled" ? "bg-red-100 text-red-500" : a.status === "confirmed" ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"}`}>{a.status || "unknown"}</div>
                                    {a.isCancelled || a.cancelReason && (<p className="text-xs text-red-400 text-right">Reason: {a.cancelReason}</p>)}

                                    {(a.isCancelled || a.status === "Cancelled") && (
                                        <div className="flex gap-2 mt-2">
                                            <button onClick={() => handleRefund(a)} className="bg-red-500 hover:bg-red-600 transition text-white px-3 py-1 text-xs rounded-lg">Refund</button>
                                            <button onClick={() => setNextAppoitment(doctor.doctorId)} className="bg-emerald-500 hover:bg-emerald-600 transition text-white px-3 py-1 text-xs rounded-lg">Book Again</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-6 text-gray-800">Recommended Doctors</h2>

                {doctors.length === 0 ? (<p className="text-gray-400">No doctors available...</p>) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {doctors.map((doc, i) => (<Doctorcard key={i} doc={{ ...doc, isApproved: true }} i={i} setshowDoctorDetail={setshowDoctorDetail} />))}
                    </div>
                )}
            </div>
        </div>
    );
}