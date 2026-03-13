import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const getData = async () => {
      try {
        const appointmentRes = await axios.get(`${API_URL}/dashboard/doctor-appointment`, { withCredentials: true });

        if (appointmentRes.data.success) {
          setAppointments(appointmentRes.data.appointments);
        } else {
          navigate("/doctor/login");
        }
      } catch (error) {
        console.log(error);
        navigate("/doctor/login");
      }
    };

    getData();
  }, [API_URL, navigate]);

  return (
    <div>
      <h1>Appointments</h1>
      {/* {appointments.length === 0 ? (<p>No appointments found</p>) :
        (appointments.map((appointment, index) => (<DiseaseCard key={index} data={appointment} />)))} */}
    </div>
  );
}