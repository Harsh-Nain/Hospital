import axios from "axios";
import { useEffect, useState } from "react";
import ShowDoctorProfile from "./showDoctorProfile";
import PatientDoctorCard from "./patientDoctorCard";
import { useOutletContext } from "react-router-dom";

export default function PatientGetDoctors() {
    const API_URL = import.meta.env.VITE_BACKEND_URL;

    const [data, setData] = useState([]);
    const { patientInfo } = useOutletContext()
    const [showDoctorDetail, setshowDoctorDetail] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getPatient = async () => {
            try {
                const res = await axios.get(`${API_URL}/dashboard/patientgetdoctor`, { withCredentials: true });
                if (res.data.success) {                    
                    setData(res.data.doctors);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        getPatient();
    }, [API_URL]);

    const categories = ["All", ...new Set(data.map((item) => item.category))];
    const filteredData = selectedCategory === "All" ? data : data.filter((item) => item.category === selectedCategory);

    return (
        <div className="w-full mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-6">

            {showDoctorDetail && (<ShowDoctorProfile id={showDoctorDetail} setshowDoctorDetail={setshowDoctorDetail} patientId={patientInfo.patientId} />)}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 sm:mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Find Doctors</h1>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">{categories.length - 1} categories available</p>
                </div>
            </div>

            <div className="sm:w-full w-screen mb-5 sm:mb-6">
                <div className="flex gap-2 sm:gap-3 items-center overflow-x-scroll sm:flex-wrap pb-2 no-scrollbar">
                    {categories.map((cat, index) => <button key={index} onClick={() => setSelectedCategory(cat)} className={`flex shrink-0 whitespace-nowrap px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-full transition-all duration-200 ${selectedCategory === cat ? "bg-linear-to-r from-sky-500 to-blue-500 text-white shadow-md" : "bg-white border border-gray-200 text-gray-600 hover:bg-sky-50"}`}>{cat} </button>)}
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                    {[...Array(8)].map((_, i) => <div key={i} className="h-40 sm:h-44 rounded-2xl bg-gray-100 animate-pulse" />)}
                </div>
            ) : (
                filteredData.map((item, i) => (
                    <div key={i} className="mb-8 sm:mb-10 w-full">

                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">{item.category}</h2>
                            <span className="text-xs text-gray-400">{item.doctors.length} doctors</span>
                        </div>

                        {item.doctors.length === 0 ? (
                            <div className="text-center py-8 sm:py-10 bg-gray-50 rounded-xl border border-black/10 w-full">
                                <p className="text-gray-400 text-sm">No doctors available</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                                {item.doctors.map((doc, j) => (
                                    <PatientDoctorCard key={j} doc={doc} setshowDoctorDetail={setshowDoctorDetail} />
                                ))}
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}