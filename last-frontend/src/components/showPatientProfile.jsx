import { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";

export default function ShowPatientProfile({ user, showDoctorDetail }) {

  const [User, setUser] = useState()

  useEffect(() => {
    const fetchDashboard = async () => {
      const res = await axios.get(`${API_URL}/profile/patient`, { withCredentials: true });

      if (res.data.success) {
        setUser(res.data.patient);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center h-screen justify-center bg-black/50 backdrop-blur-sm p-4">

      <div className="relative w-full max-w-xl bg-white/80 backdrop-blur-xl border border-sky-100 rounded-2xl shadow-xl p-6 sm:p-8">

        <button onClick={() => showDoctorDetail(null)} className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-lg">
          <RxCross1 />
        </button>

        <div className="flex flex-col sm:flex-row items-center gap-5">

          <img src={user?.image || ""} alt={user?.fullName} className="w-20 h-20 rounded-xl object-cover border border-sky-100 shadow-sm" />

          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-gray-800">
              {user?.fullName}
            </h2>

            <p className="text-sky-600 text-sm font-medium">
              {user?.role}
            </p>

            <p className="text-gray-500 text-sm">
              {user?.email}
            </p>
          </div>

        </div>


        {/* Divider */}
        <div className="my-6 h-px bg-linear-to-r from-transparent via-sky-200 to-transparent"></div>


        {/* Profile Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">

          <div>
            <p className="text-gray-500">Gender</p>
            <p className="font-medium text-gray-800">
              {user?.gender || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Age</p>
            <p className="font-medium text-gray-800">
              {user?.age || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Phone</p>
            <p className="font-medium text-gray-800">
              {user?.phone || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Blood Group</p>
            <p className="font-medium text-gray-800">
              {user?.bloodGroup || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Disease</p>
            <p className="font-medium text-gray-800">
              {user?.disease || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Allergy</p>
            <p className="font-medium text-gray-800">
              {user?.allergy || "None"}
            </p>
          </div>

        </div>


        {/* Address */}
        <div className="mt-5">

          <p className="text-gray-500 text-sm">
            Address
          </p>

          <p className="text-gray-800 font-medium">
            {user?.address || "Not provided"}
          </p>

        </div>


        {/* Bio */}
        {user?.bio && (
          <div className="mt-4">
            <p className="text-gray-500 text-sm">About</p>
            <p className="text-gray-700 text-sm">
              {user.bio}
            </p>
          </div>
        )}

      </div>

    </div>
  );
}