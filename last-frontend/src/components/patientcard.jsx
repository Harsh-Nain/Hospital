export default function PatientCard({ pat, i, setshowPatientDetail }) {
        
    return (
        <div key={i} onClick={() => setshowPatientDetail(pat.patientId)} className="group relative bg-white border border-emerald-100 rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-linear-to-r from-emerald-100/40 to-green-100/40"></div>

            <div className="flex items-center gap-4 relative z-10">
                <img src={pat.image || "/user.png"} alt="patient" className="w-14 h-14 rounded-xl object-cover border border-emerald-200" />

                <div>
                    <h3 className="font-semibold text-gray-800 text-lg">
                        {pat.fullName}
                    </h3>

                    <p className="text-emerald-600 text-sm">
                        {pat.email}
                    </p>

                    <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${pat.appointments?.[0]?.status === "pending" ? "bg-yellow-100 text-yellow-600" : "bg-emerald-100 text-emerald-600"}`}>
                        {pat.appointments?.[0]?.status || "No Appointment"}
                    </span>
                </div>
            </div>

            <div className="my-4 h-px bg-linear-to-r from-transparent via-emerald-200 to-transparent"></div>

            <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">

                <p>
                    <span className="font-medium text-gray-700">Gender</span><br />
                    {pat.gender || "N/A"}
                </p>

                <p>
                    <span className="font-medium text-gray-700">Age</span><br />
                    {pat.age || "N/A"}
                </p>

                <p>
                    <span className="font-medium text-gray-700">Disease</span><br />
                    {pat.disease || "N/A"}
                </p>

                <p>
                    <span className="font-medium text-gray-700">Blood Group</span><br />
                    {pat.bloodGroup || "N/A"}
                </p>

                <p>
                    <span className="font-medium text-gray-700">Phone</span><br />
                    {pat.phone || "N/A"}
                </p>

                <p>
                    <span className="font-medium text-gray-700">Address</span><br />
                    {pat.address || "N/A"}
                </p>

            </div>

            <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                <p className="text-xs text-gray-500 mb-1">
                    Appointments ({pat.appointments?.length || 0})
                </p>

                {pat.appointments && pat.appointments.length > 0 ? (
                    <div className="space-y-1 max-h-20 overflow-y-auto">
                        {pat.appointments.slice(0, 3).map((a) => (
                            <div key={a.appointmentId} className="flex justify-between text-xs">
                                <span className="text-gray-700">
                                    Dr. {a.doctor}
                                </span>

                                <span className={`${a.status === "pending" ? "text-yellow-600" : "text-emerald-600"}`}>
                                    {a.status}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-xs text-gray-400">
                        No appointments
                    </p>
                )}
            </div>

            <div className="mt-4 flex items-center justify-between">
                <button onClick={(e) => { e.stopPropagation(); setshowPatientDetail(pat.patientId); }} className="bg-linear-to-r from-emerald-400 to-green-500 text-white px-4 py-2 rounded-lg text-sm hover:shadow-lg transition">
                    View Details
                </button>

                <span className="text-xs text-gray-400">
                    ID: {pat.patientId}
                </span>
            </div>
        </div>
    );
}