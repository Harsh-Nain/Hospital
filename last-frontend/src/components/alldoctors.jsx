import { useEffect, useState } from "react";
import axios from "axios";
import Doctorcard from "./doctorcard";
import ShowDoctorProfile from "./showDoctorProfile";

export default function Alldoctors() {
  const API_URL = import.meta.env.VITE_BACKEND_URL;
  const [showDoctorDetail, setshowDoctorDetail] = useState(null);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(`${API_URL}/admin/admin_doctors`, { withCredentials: true });

        if (res.data.success) {
          console.log(res.data.doctors);
          setDoctors(res.data.doctors);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, [API_URL]);

  return (
    <div className="p-5 space-y-5">
      {showDoctorDetail && <ShowDoctorProfile id={showDoctorDetail} setshowDoctorDetail={setshowDoctorDetail} isAdmin={true} />}

      <div className="bg-linear-to-r from-sky-100 to-white flex items-center justify-between px-6 py-5 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Doctors</h1>
          <p className="text-sm text-gray-500">Manage all doctors in system</p>
        </div>

        <div className="text-right">
          <p className="text-sm text-gray-500">Total Doctors</p>
          <h2 className="text-3xl font-bold text-sky-600">{doctors.length}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {doctors.length > 0 ? (doctors.map((doc, i) => (<Doctorcard key={i} doc={doc} setshowDoctorDetail={setshowDoctorDetail} />))) : (
          <div className="col-span-full text-center text-gray-500 py-10">No doctors found</div>
        )}
      </div>
    </div>
  );
}