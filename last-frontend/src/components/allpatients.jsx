import { useEffect, useState } from "react";
import axios from "axios";
import PatientCard from "./PatientCard";
import ShowPatientProfile from "../components/showPatientProfile"

export default function Allpatient() {
    const API_URL = import.meta.env.VITE_BACKEND_URL;
    const [showPatientDetail, setshowPatientDetail] = useState(null);
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await axios.get(`${API_URL}/dashboard/admin_patients`, { withCredentials: true });

                if (res.data.success) {
                    setPatients(res.data.patients);
                }
            } catch (error) {
                console.log(error);
            }
        };
        getData();
    }, [API_URL]);

    return (
        <div className="p-5 space-y-5">
            {showPatientDetail && <ShowPatientProfile id={showPatientDetail} setshowPatientDetail={setshowPatientDetail} />}

            <div className="bg-linear-to-r from-emerald-100 to-white flex items-center justify-between px-6 py-5 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-xl font-semibold text-gray-800">Patients</h1>
                    <p className="text-sm text-gray-500">Manage all patients in system</p>
                </div>

                <div className="text-right">
                    <p className="text-sm text-gray-500">Total Patient</p>
                    <h2 className="text-3xl font-bold text-sky-600">{patients.length}</h2>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {patients.length > 0 ? (patients.map((pat, i) => (<PatientCard key={i} pat={pat} setshowPatientDetail={setshowPatientDetail} />))) : (
                    <div className="col-span-full text-center text-gray-500 py-10">No patient found</div>
                )}
            </div>
        </div>
    );
}