import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import ShowDoctorProfile from "../../components/showDoctorProfile";
import Doctorcard from "../../components/doctorcard";
import { getTimeRemaining } from "../../components/formentTime"
import NextAppoitment from "../../components/nextappoitment";

export default function Dashboard() {
    const [patient, setPatient] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [showDoctorDetail, setshowDoctorDetail] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [nextAppoitment, setNextAppoitment] = useState(null);
    const [timeLeft, setTimeLeft] = useState("");
    const [pageLoading, setPageLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("all");
    const modals = [nextAppoitment, showDoctorDetail];
    const isAnyModalOpen = modals.some(Boolean);

    const [tick, setTick] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setTick((prev) => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [])

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
                setPageLoading(true)
                const res = await axios.get(`${API_URL}/dashboard/patient`, { withCredentials: true, });
                console.log(res.data.appointments);

                if (res.data.success) {
                    setPatient(res.data.patient);
                    setAppointments(res.data.appointments || []);
                    setDoctors(res.data.doctorsList || []);
                    setPageLoading(false)
                }
            } catch (err) {
                setPageLoading(false)
                console.error("Dashboard error:", err);
            }
        };

        fetchDashboard();
    }, []);

    const statusLabelMap = { "wait for approval": "Requested", "confirmed": "Confirmed At", "Cancelled": "Cancelled At", };

    const handleRefund = (appointment) => {
        console.log("Refund:", appointment);
    };

    if (pageLoading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-sky-50 p-3 sm:p-5 lg:p-8 space-y-6 sm:space-y-8 animate-pulse">

                <div className="relative overflow-hidden rounded-4xl bg-white border border-slate-200 shadow-sm p-4 sm:p-6 lg:p-8">
                    <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-slate-200 shrink-0"></div>

                            <div className="flex-1 min-w-0">
                                <div className="h-8 w-52 sm:w-72 bg-slate-200 rounded mb-3"></div>
                                <div className="h-4 w-40 sm:w-52 bg-slate-200 rounded mb-2"></div>
                                <div className="h-4 w-56 sm:w-72 bg-slate-200 rounded"></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full xl:w-auto">
                            {[1, 2].map((item) => (
                                <div key={item} className="bg-slate-100 border border-slate-200 rounded-3xl p-4 min-w-30">
                                    <div className="h-4 w-20 bg-slate-200 rounded mb-3"></div>
                                    <div className="h-8 w-14 bg-slate-200 rounded"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <div className="h-7 w-52 bg-slate-200 rounded mb-2"></div>
                            <div className="h-4 w-60 bg-slate-200 rounded"></div>
                        </div>

                        <div className="flex gap-2 bg-white border border-slate-200 rounded-2xl p-2 shadow-sm overflow-x-auto">
                            {[1, 2,].map((item) => (
                                <div key={item} className="h-10 min-w-22.5 bg-slate-200 rounded-xl shrink-0"></div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        {[1, 2].map((item) => (
                            <div key={item} className="rounded-4xl bg-white border border-slate-200 shadow-sm p-4 sm:p-5 lg:p-6">
                                <div className="flex flex-col xl:flex-row gap-5 xl:items-center xl:justify-between">
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className="w-16 h-16 rounded-2xl bg-slate-200 shrink-0"></div>

                                        <div className="min-w-0">
                                            <div className="h-5 w-32 sm:w-40 bg-slate-200 rounded mb-2"></div>
                                            <div className="h-4 w-24 sm:w-32 bg-slate-200 rounded"></div>
                                        </div>
                                    </div>

                                    <div className="flex-1 xl:text-center">
                                        <div className="h-5 w-28 bg-slate-200 rounded mb-2 mx-0 xl:mx-auto"></div>
                                        <div className="h-4 w-36 bg-slate-200 rounded mb-2 mx-0 xl:mx-auto"></div>
                                        <div className="h-3 w-24 bg-slate-200 rounded mx-0 xl:mx-auto"></div>
                                    </div>

                                    <div className="flex flex-col gap-3 xl:items-end">
                                        <div className="h-8 w-24 bg-slate-200 rounded-full"></div>

                                        <div className="flex gap-2 flex-wrap">
                                            <div className="h-10 w-24 bg-slate-200 rounded-xl"></div>
                                            <div className="h-10 w-28 bg-slate-200 rounded-xl"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>


            </div>
        );
    }

    return (
        <div className="min-h-screen sm:p-4 space-y-6 sm:space-y-8">
            {showDoctorDetail && (<ShowDoctorProfile id={showDoctorDetail} setshowDoctorDetail={setshowDoctorDetail} patientId={patient?.patientId} />)}
            {nextAppoitment && (<NextAppoitment id={nextAppoitment} setNextAppoitment={setNextAppoitment} patientId={patient?.patientId} />)}

            <div className="relative overflow-hidden rounded-4xl bg-white border border-slate-200 shadow-[0_10px_40px_rgba(0,0,0,0.08)] p-4 sm:p-6 lg:p-8">
                <div className="absolute top-0 right-0 w-52 h-52 bg-sky-100 rounded-full blur-3xl opacity-70"></div>
                <div className="absolute bottom-0 left-0 w-52 h-52 bg-cyan-100 rounded-full blur-3xl opacity-60"></div>

                <div className="relative flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
                        <div className="relative shrink-0">
                            <img src={patient?.image || "/default-user.png"} alt="patient" className="w-20 h-20 sm:w-30 sm:h-30 rounded-3xl object-cover border-4 border-white shadow-lg" />
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 hidden sm:flex bg-emerald-500 rounded-full border-2 border-white"></div>
                        </div>

                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 leading-tight">Welcome back, {patient?.fullName || "User"}</h1>
                            <p className="text-slate-500 mt-2 text-sm sm:text-base">Disease: {patient?.disease || "Not specified"}</p>
                            <p className="text-sky-600 font-medium mt-2 text-sm sm:text-base">Manage your appointments and health records easily</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full xl:w-auto">
                        <div className="bg-linear-to-br from-sky-50 to-sky-100 border border-sky-200 rounded-3xl p-4 min-w-35">
                            <p className="text-slate-500 text-sm">Appointments</p>
                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-1">{appointments.length}</h2>
                        </div>

                        <div className="bg-linear-to-br from-cyan-50 to-cyan-100 border border-cyan-200 rounded-3xl p-4 min-w-35">
                            <p className="text-slate-500 text-sm">Doctors</p>
                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-1">{doctors.length}</h2>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Your Appointments</h2>
                        <p className="text-slate-500 text-sm mt-1">Track and manage your upcoming visits</p>
                    </div>

                    <div className="flex gap-2 bg-white border border-slate-200 rounded-2xl p-2 shadow-sm w-full lg:w-auto">
                        {[
                            { label: "All", value: "all" },
                            { label: "Confirmed", value: "confirmed" },
                            { label: "Cancelled", value: "Cancelled" },
                            { label: "Upcoming", value: "wait for approval" },
                        ].map((item) => (
                            <button key={item.value} onClick={() => setStatusFilter(item.value)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap ${statusFilter === item.value ? "bg-linear-to-r from-sky-500 to-cyan-500 text-white shadow-lg" : "text-slate-600 hover:bg-slate-100"}`}>
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    {filteredAppointments.length === 0 && (
                        <div className="bg-white border border-dashed border-slate-300 rounded-4xl p-10 text-center shadow-sm">
                            <p className="text-slate-400 text-lg">No appointments yet...</p>
                        </div>
                    )}

                    {filteredAppointments.map((a, i) => {
                        const doctor = a.doctor || {};
                        const slot = a.slot || {};

                        return (
                            <div
                                key={i}
                                className="group relative rounded-4xl bg-white border border-slate-200 shadow-sm hover:shadow-[0_12px_35px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 p-4 sm:p-5 lg:p-6"
                            >
                                <div className="absolute inset-0 bg-linear-to-r from-sky-50/0 via-sky-50/40 to-cyan-50/0 opacity-0 group-hover:opacity-100 transition duration-500"></div>

                                <div className="relative flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

                                    {/* Doctor Info */}
                                    <div className="flex items-center gap-4 w-full xl:w-1/3">
                                        <img
                                            src={doctor.image || "/default-doctor.png"}
                                            alt="doctor"
                                            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border border-slate-200 shadow-sm"
                                        />

                                        <div className="min-w-0">
                                            <h3 className="text-base sm:text-lg font-semibold text-slate-800 truncate">
                                                Dr. {doctor.name || "Unknown"}
                                            </h3>
                                            <p className="text-sm text-sky-600 truncate">
                                                {doctor.specialization || "General"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Slot Info */}
                                    <div className="w-full xl:w-1/3 xl:text-center">
                                        <p className="text-base sm:text-lg font-semibold text-slate-800">
                                            {slot.date || "N/A"}
                                        </p>

                                        <p className="text-sm text-slate-500 mt-1">
                                            {slot.startTime} – {slot.endTime}
                                        </p>

                                        {a.status === "confirmed" && (
                                            <p className="text-sm text-emerald-600 font-medium mt-2">
                                                {getTimeRemaining(slot.startTime.split(" ")[0], slot.date)}
                                            </p>
                                        )}

                                        <p className="text-xs text-slate-400 mt-2 break-words">
                                            {statusLabelMap[a.status] &&
                                                `${statusLabelMap[a.status]}: `}
                                            {a.appoitmentCreatedAt}
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className=" xl:w-1/3 flex flex-col gap-3 xl:items-end sm:absolute xl:static top-0 right-0 w-fit">
                                        <div className="flex flex-col sm:flex-row-reverse flex-wrap gap-2 items-center xl:justify-end  absolute sm:static top-10 right-0">
                                            <div className={`px-4 py-2 rounded-full text-xs font-semibold capitalize w-fit ${a.isCancelled || a.status === "Cancelled" ? "bg-red-100 text-red-600" : a.status === "confirmed" ? "bg-emerald-100 text-emerald-600" : "bg-yellow-100 text-yellow-700"}`}>
                                                {a.status || "Unknown"}
                                            </div>
                                            {(a.isCancelled || a.cancelReason) && (<p className="text-xs text-red-500 break-words">Reason: {a.cancelReason}</p>)}
                                        </div>

                                        {(a.isCancelled || a.status === "Cancelled") && (
                                            <div className="flex flex-wrap gap-2">
                                                <button onClick={() => handleRefund(a)} className=" px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-all">
                                                    Refund
                                                </button>

                                                <button onClick={() => setNextAppoitment(doctor.doctorId)} className=" cursor-pointer px-4 py-2 rounded-xl bg-linear-to-r from-sky-500 to-cyan-500 hover:opacity-90 text-white text-sm font-medium transition-all">
                                                    Book Again
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Recommended Doctors</h2>
                        <p className="text-slate-500 text-sm mt-1">Find the best doctors for your health needs</p>
                    </div>

                    <button className="text-sky-600 font-medium hover:text-sky-700 transition">View All</button>
                </div>

                {doctors.length === 0 ? (
                    <div className="bg-white border border-dashed border-slate-300 rounded-4xl p-10 text-center shadow-sm">
                        <p className="text-slate-400 text-lg">No doctors available...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-5">
                        {doctors.map((doc, i) => (
                            <div key={i} className="bg-white border border-slate-200 rounded-4xl p-2 shadow-sm hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
                                <Doctorcard doc={{ ...doc, isApproved: true }} i={i} setshowDoctorDetail={setshowDoctorDetail} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}