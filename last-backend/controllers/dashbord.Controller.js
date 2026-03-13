import db from "../db/index.js";
import { users, patients, appointments, doctors, specializations, doctorSlots, } from "../db/schema.js";
import { eq, and } from "drizzle-orm";

export const PatientInfo = async (req, res) => {

    try {
        const { id } = req.user;

        const [patient] = await db
            .select({ id: users.id, fullName: users.fullName, email: users.email, image: users.image, role: users.role, disease: patients.disease, patientId: patients.id })
            .from(users)
            .leftJoin(patients, eq(patients.userId, users.id))
            .where(and(eq(users.id, id), eq(users.role, "patient")))
            .limit(1);

        if (!patient) {
            return res.status(404).json({ success: false, redirect: "/auth/loginpatient", });
        }

        res.json({ success: true, patient });

    } catch (error) {
        console.error("PatientDashboard Error:", error);
        res.status(500).json({ success: false, message: "Server error", });
    }
};

export const patientAppointments = async (req, res) => {
    try {
        const { id } = req.user;

        const patientAppointments = await db
            .select({ appointmentId: appointments.id, status: appointments.status, doctorName: users.fullName, specialization: specializations.name, })
            .from(appointments)
            .leftJoin(doctors, eq(doctors.id, appointments.doctorId))
            .leftJoin(users, eq(users.id, doctors.userId))
            .leftJoin(specializations, eq(specializations.id, doctors.specializationId))
            .where(eq(appointments.patientId, id));

        res.json({ success: true, appointments: patientAppointments, });

    } catch (error) {
        console.error("PatientAppointments Error:", error);
        res.status(500).json({ success: false, message: "Server error", });
    }
};

export const DoctorInfo = async (req, res) => {
    try {
        const { id } = req.user;

        const [doctor] = await db
            .select({ id: users.id, fullName: users.fullName, email: users.email, image: users.image, role: users.role, doctorId: doctors.id, specialization: specializations.name, experience: doctors.experienceYears, })
            .from(users)
            .leftJoin(doctors, eq(doctors.userId, users.id))
            .leftJoin(specializations, eq(specializations.id, doctors.specializationId))
            .where(and(eq(users.id, id), eq(users.role, "doctor")))
            .limit(1);

        if (!doctor) {
            return res.status(404).json({ success: false, redirect: "/auth/logindoctor" });
        }
        res.json({ success: true, doctor });

    } catch (error) {
        console.error("DoctorDashboard Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const doctorAppointments = async (req, res) => {
    try {
        const { id } = req.user;
        const [doctor] = await db.select({ id: doctors.id }).from(doctors).where(eq(doctors.userId, id)).limit(1);

        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        const [doctorAppointments] = await db
            .select({ appointmentId: appointments.id, status: appointments.status, patientName: users.fullName, patientEmail: users.email, })
            .from(appointments)
            .leftJoin(patients, eq(patients.id, appointments.patientId))
            .leftJoin(users, eq(users.id, patients.userId))
            .where(eq(appointments.doctorId, doctor.id));

        res.json({ success: true, appointments: doctorAppointments || [], });

    } catch (error) {
        console.error("DoctorAppointments Error:", error);
        res.status(500).json({ success: false, message: "Server error", });
    }
};

export const AdminDashboard = async (req, res) => {
    try {
        const usersList = await db.select().from(users);
        const doctorsList = await db.select().from(doctors).leftJoin(users, eq(users.id, doctors.userId));
        const patientsList = await db.select().from(patients).leftJoin(users, eq(users.id, patients.userId));
        const appointmentList = await db.select({ appointmentId: appointments.id, status: appointments.status, doctorId: appointments.doctorId, patientId: appointments.patientId, }).from(appointments);

        res.json({ success: true, totalUsers: usersList.length, totalDoctors: doctorsList.length, totalPatients: patientsList.length, totalAppointments: appointmentList.length, appointments: appointmentList, });

    } catch (error) {
        console.error("AdminDashboard Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const PatientDashboard = async (req, res) => {
    try {
        const { id } = req.user;

        const [patient] = await db
            .select({ id: users.id, fullName: users.fullName, email: users.email, image: users.image, role: users.role, disease: patients.disease, patientId: patients.id })
            .from(users)
            .leftJoin(patients, eq(patients.userId, users.id))
            .where(and(eq(users.id, id), eq(users.role, "patient")))
            .limit(1);

        const doctorsList = await db
            .select({ doctorId: doctors.id, fullName: users.fullName, image: users.image, experienceYears: doctors.experienceYears, consultationFee: doctors.consultationFee, specialization: specializations.name, slotId: doctorSlots.id, date: doctorSlots.date, startTime: doctorSlots.startTime, endTime: doctorSlots.endTime })
            .from(doctors)
            .leftJoin(users, eq(users.id, doctors.userId))
            .leftJoin(specializations, eq(specializations.id, doctors.specializationId))
            .leftJoin(doctorSlots, eq(doctorSlots.doctorId, doctors.id))
            .where(and(eq(doctors.isApproved, true), eq(doctors.status, "success"), eq(doctorSlots.isBooked, false)))
            .limit(6);


        const appointmentList = await db
            .select({ appointmentId: appointments.id, status: appointments.status, meetingLink: appointments.meetingLink, doctorName: users.fullName, doctorImage: users.image, specialization: specializations.name, date: doctorSlots.date, startTime: doctorSlots.startTime, endTime: doctorSlots.endTime })
            .from(appointments)
            .leftJoin(doctors, eq(doctors.id, appointments.doctorId))
            .leftJoin(users, eq(users.id, doctors.userId))
            .leftJoin(specializations, eq(specializations.id, doctors.specializationId))
            .leftJoin(doctorSlots, eq(doctorSlots.id, appointments.slotId))
            .where(eq(appointments.patientId, patient.patientId));

        res.json({ success: true, patient, doctorsList, appointments: appointmentList });

    } catch (error) {
        console.error("PatientDashboard Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};