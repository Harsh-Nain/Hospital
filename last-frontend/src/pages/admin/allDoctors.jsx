import { useEffect, useState } from "react";
import axios from "axios";
import Doctorcard from "../../components/doctorcard";
import ShowDoctorProfile from "../../components/showDoctorProfile";
import { useOutletContext } from "react-router-dom";

export default function Alldoctors() {
  const API_URL = import.meta.env.VITE_BACKEND_URL;
  const [showDoctorDetail, setshowDoctorDetail] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  const modals = [showDoctorDetail];
  const isAnyModalOpen = modals.some(Boolean);

  useEffect(() => {
    const root = document.documentElement;

    if (isAnyModalOpen) {
      root.classList.add("overflow-hidden");
    } else {
      root.classList.remove("overflow-hidden");
    }

    return () => {
      root.classList.remove("overflow-hidden");
    };
  }, [isAnyModalOpen]);

  useEffect(() => {
    const getData = async () => {
      try {
        setPageLoading(true)
        const res = await axios.get(`${API_URL}/admin/admin_doctors`, { withCredentials: true });

        if (res.data.success) {
          console.log(res.data.doctors);
          setDoctors(res.data.doctors);
          setPageLoading(false)
        }
      } catch (error) {
        setPageLoading(false)
        console.log(error);
      }
    };

    getData();
  }, [API_URL]);

  if (pageLoading) {
    return (
      <div className="p-3 sm:p-5 space-y-5 animate-pulse">
        <div className="bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 sm:px-6 py-5 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <div className="h-6 w-28 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
          </div>

          <div className="sm:text-right">
            <div className="h-4 w-24 bg-gray-200 rounded mb-2 sm:ml-auto"></div>
            <div className="h-8 w-16 bg-gray-200 rounded sm:ml-auto"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 rounded-full bg-gray-200 shrink-0"></div>

                <div className="flex-1 min-w-0">
                  <div className="h-4 w-28 sm:w-32 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 w-20 sm:w-24 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 w-32 sm:w-40 bg-gray-200 rounded"></div>
                </div>
              </div>

              <div className="space-y-3 mb-5">
                <div className="h-3 w-full bg-gray-200 rounded"></div>
                <div className="h-3 w-5/6 bg-gray-200 rounded"></div>
                <div className="h-3 w-2/3 bg-gray-200 rounded"></div>
              </div>

              <div className="flex gap-3">
                <div className="h-10 flex-1 bg-gray-200 rounded-xl"></div>
                <div className="h-10 flex-1 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

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