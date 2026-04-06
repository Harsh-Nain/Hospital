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
import AdminLayout from "../pages/layout/adminlayout";
import PatientRecord from "../pages/patient/patientrecord";
import Dashboard from "../pages/admin/dashboard";
import Alldoctors from "../pages/admin/allDoctors"
import Allpatients from "../pages/admin/allPatients"
import Allchats from "../pages/admin/allchats";
import Chats from "../pages/chats"
import PatientGetDoctors from "../components/patientGetDoctors";
import Webintro from "../pages/interface/Home";
import WebDoctor from "../pages/interface/Doctors";
import WebAbout from "../pages/interface/About";
import WebContact from "../pages/interface/Contact";
function AppRoutes() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />

      <Routes>

        {/* <Route path="/" element={<RoleSelection />} /> */}
        <Route path="/" element={<Webintro />} />
        <Route path="/RoleSelection" element={<RoleSelection/>} />
        <Route path="/doctor" element={<WebDoctor/>} />
        <Route path="/about" element={<WebAbout/>} />
        <Route path="/contact" element={<WebContact/>} />

        <Route path="/patient/login" element={<PatientLogin />} />
        <Route path="/patient/register" element={<PatientRegister />} />

        <Route path="/doctor/login" element={<DoctorLogin />} />
        <Route path="/doctor/register" element={<DoctorRegister />} />

        <Route path="/checking" element={<Checking />} />

        <Route element={<AdminLayout />}>
          <Route path="/admin_dashboard" element={<Dashboard />} />
          <Route path="/admin_doctors" element={<Alldoctors />} />
          <Route path="/admin_Patients" element={<Allpatients />} />
          <Route path="/admin_chat" element={<Allchats />} />
        </Route>

        <Route element={<PatientLayout />}>
          <Route path="/dashboard-patient" element={<PatientDashboard />} />
          <Route path="/patient-chats" element={<Chats />} />
          <Route path="/reports" element={<PatientRecord />} />
          <Route path="/patient-profile" element={<PatientProfile />} />
          <Route path="/Patient-dr.suggession" element={<PatientGetDoctors />} />
        </Route>

        <Route element={<DoctorLayout />}>
          <Route path="/dashboard-doctor" element={<DoctorDashboard />} />
          <Route path="/doctor-chats" element={<Chats />} />
          <Route path="/doctor-profile" element={<DoctorProfile />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;