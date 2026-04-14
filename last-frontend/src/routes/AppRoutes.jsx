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
import ContactDetails from "../pages/admin/contactDetails";
import MainLayout from "../pages/layout/mainLayout";
import Home from "../pages/interface/Home";
import About from "../pages/interface/About";
import Contact from "../pages/interface/Contact";
import Doctors from "../pages/interface/Doctors";
import ProfessionalsPage from "../pages/interface/profationals";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />

      <Routes>

        <Route path="/logins" element={<RoleSelection />} />

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
          <Route path="/admin_contact-details" element={<ContactDetails />} />
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

        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/professionals" element={<ProfessionalsPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/doctors" element={<Doctors />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;