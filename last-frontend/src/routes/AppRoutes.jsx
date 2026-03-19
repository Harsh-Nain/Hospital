import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import RoleSelection from "../pages/RoleSection";
import PatientLogin from "../pages/patient/auth/login";
import PatientRegister from "../pages/patient/auth/register";
import DoctorLogin from "../pages/doctor/auth/login";
import DoctorRegister from "../pages/doctor/auth/register";
import PatientDashboard from "../pages/patient/dashbord";
import DoctorDashboard from "../pages/doctor/dashboard";

import Checking from "../components/checking";
import PatientProfile from "../pages/patient/profile";
import DoctorProfile from "../pages/doctor/profile";
import PatientLayout from "../pages/layout/patientlayout";
import DoctorLayout from "../pages/layout/doctorlayout";
import PatientRecord from "../pages/patient/patientrecord";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />

      <Routes>

        <Route path="/" element={<RoleSelection />} />

        <Route path="/patient/login" element={<PatientLogin />} />
        <Route path="/patient/register" element={<PatientRegister />} />

        <Route path="/doctor/login" element={<DoctorLogin />} />
        <Route path="/doctor/register" element={<DoctorRegister />} />

        <Route path="/checking" element={<Checking />} />

        <Route element={<PatientLayout />}>
          <Route path="/dashboard-patient" element={<PatientDashboard />} />
          <Route path="/patient-chats" element={""} />
          <Route path="/reports" element={< PatientRecord/>} />
          <Route path="/Patient-profile" element={<PatientProfile />} />
        </Route>

        <Route element={<DoctorLayout />}>
          <Route path="/dashboard-doctor" element={<DoctorDashboard />} />
          <Route path="/doctor-chats" element={""} />
          <Route path="/doctor-profile" element={<DoctorProfile />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;