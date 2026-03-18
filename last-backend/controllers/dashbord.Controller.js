import { date } from "drizzle-orm/mysql-core";
import db from "../db/index.js";
import { users, patients, appointments, doctors, specializations, doctorSlots, payments, } from "../db/schema.js";
import { eq, and, sql, is } from "drizzle-orm";
import { sendApprovalMail, sendRejectionMail } from "../utils/mailer.js";

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
        const doctorsForApproval = await db.select({ doctorId: doctors.id, ...doctors, ...users, specialization: specializations.name, symptoms: specializations.symptoms }).from(doctors).where(and(eq(doctors.status, "pending"), eq(doctors.isApproved, false))).leftJoin(users, eq(users.id, doctors.userId)).leftJoin(specializations, eq(specializations.id, doctors.specializationId));

        res.json({ success: true, totalUsers: usersList.length, doctorsForApproval, totalDoctors: doctorsList.length, totalPatients: patientsList.length, totalAppointments: appointmentList.length, appointments: appointmentList, });

    } catch (error) {
        console.error("AdminDashboard Error:", error);
        res.status(500).json({ success: false, message: "Server error", });
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

        let doctorsList = await db
            .select({ doctorId: doctors.id, fullName: users.fullName, image: users.image, experienceYears: doctors.experienceYears, consultationFee: doctors.consultationFee, specialization: specializations.name, slotId: doctorSlots.id, date: doctorSlots.date, startTime: doctorSlots.startTime, endTime: doctorSlots.endTime })
            .from(doctors)
            .leftJoin(users, eq(users.id, doctors.userId))
            .leftJoin(specializations, eq(specializations.id, doctors.specializationId))
            .leftJoin(doctorSlots, eq(doctorSlots.doctorId, doctors.id))
            .where(and(sql`JSON_SEARCH(${specializations.symptoms}, 'one', ${patient.disease})`, eq(doctors.isApproved, true), eq(doctors.status, "success"), eq(doctorSlots.isBooked, false)))
            .limit(6);

        if (doctorsList == 0) {
            doctorsList = await db
                .select({ doctorId: doctors.id, fullName: users.fullName, image: users.image, experienceYears: doctors.experienceYears, consultationFee: doctors.consultationFee, specialization: specializations.name, slotId: doctorSlots.id, date: doctorSlots.date, startTime: doctorSlots.startTime, endTime: doctorSlots.endTime })
                .from(doctors)
                .leftJoin(users, eq(users.id, doctors.userId))
                .leftJoin(specializations, eq(specializations.id, doctors.specializationId))
                .leftJoin(doctorSlots, eq(doctorSlots.doctorId, doctors.id))
                .where(and(sql`JSON_SEARCH(${specializations.symptoms}, 'one', 'fever')`, eq(doctors.isApproved, true), eq(doctors.status, "success"), eq(doctorSlots.isBooked, false)))
                .limit(6);
        }

        const appointmentList = await db
            .select({ amount: payments.amount, transactionId: payments.transactionId, paymentStatus: payments.paymentStatus, paymentId: payments.id, appointmentId: appointments.id, appoitmentStatus: appointments.status, doctorName: users.fullName, doctorImage: users.image, specialization: specializations.name, date: doctorSlots.date, startTime: doctorSlots.startTime, endTime: doctorSlots.endTime })
            .from(appointments)
            .leftJoin(doctors, eq(doctors.id, appointments.doctorId))
            .leftJoin(users, eq(users.id, doctors.userId))
            .leftJoin(specializations, eq(specializations.id, doctors.specializationId))
            .leftJoin(doctorSlots, eq(doctorSlots.id, appointments.slotId))
            .leftJoin(payments, eq(payments.appointmentId, appointments.id))
            .where(eq(appointments.patientId, patient.patientId));

        res.json({ success: true, patient, doctorsList, appointments: appointmentList });

    } catch (error) {
        console.error("PatientDashboard Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const AllPatients = async (req, res) => {
    try {
        const data = await db
            .select({ patientId: patients.id, age: patients.age, gender: patients.gender, phone: patients.phone, address: patients.address, disease: patients.disease, bloodGroup: patients.bloodGroup, userId: users.id, fullName: users.fullName, email: users.email, image: users.image, appointmentId: appointments.id, appoitmentStatus: appointments.status, doctorId: doctors.id, appoitmentDoctor: specializations.name, })
            .from(patients)
            .leftJoin(users, eq(users.id, patients.userId))
            .leftJoin(appointments, eq(appointments.patientId, patients.id))
            .leftJoin(doctors, eq(doctors.id, appointments.doctorId))
            .leftJoin(specializations, eq(specializations.id, doctors.specializationId));

        res.json({ success: true, patients: data, });

    } catch (error) {
        console.error("AdminPatients Error:", error);
        res.status(500).json({ success: false, message: "Server error", });
    }
};

export const AllDoctors = async (req, res) => {
    try {
        const data = await db
            .select({ startTime: doctorSlots.startTime, date: doctorSlots.date, endTime: doctorSlots.endTime, doctorId: doctors.id, experienceYears: doctors.experienceYears, consultationFee: doctors.consultationFee, license: doctors.licenseNumber, bio: doctors.bio, status: doctors.status, isApproved: doctors.isApproved, userId: users.id, fullName: users.fullName, email: users.email, image: users.image, specialization: specializations.name, appointmentId: appointments.id, appointmentStatus: appointments.status, })
            .from(doctors)
            .where(eq(doctors.isApproved, true))
            .leftJoin(users, eq(users.id, doctors.userId))
            .leftJoin(specializations, eq(specializations.id, doctors.specializationId))
            .leftJoin(appointments, eq(appointments.doctorId, doctors.id))
            .leftJoin(doctorSlots, eq(doctorSlots.doctorId, doctors.id))
            .leftJoin(patients, eq(patients.id, appointments.patientId))

        res.json({ success: true, doctors: data, });

    } catch (error) {
        console.error("ApprovedDoctors Error:", error);
        res.status(500).json({ success: false, message: "Server error", });
    }
};

export const updateDoctorStatus = async (req, res) => {
    try {
        let { status, doctorId, name, email } = req.body;

        if (!doctorId) {
            return res.status(400).json({ success: false, message: "Doctor ID is required", });
        }

        if (!status) {
            return res.status(400).json({ success: false, message: "Status is required", });
        }

        const normalizedStatus = status.toLowerCase();
        const isApproved = normalizedStatus === "approved";

        if (isApproved) {
            await sendApprovalMail(email, name);
        } else {
            const reason = "Your application has been rejected due to inaccurate or unverifiable information.";
            await sendRejectionMail(email, name, reason);
        }

        const result = await db.update(doctors).set({ status: normalizedStatus, isApproved: isApproved, }).where(eq(doctors.id, Number(doctorId)));

        if (!result) {
            return res.status(404).json({ success: false, message: "Doctor not found", });
        }

        if (!isApproved) {
            setTimeout(async () => {
                try {
                    const doctor = await db.query.doctors.findFirst({ where: eq(doctors.id, doctorId), });

                    if (doctor) {
                        await db.delete(notifications).where(eq(notifications.userId, doctor.userId));

                        await db.delete(doctors).where(eq(doctors.id, doctorId));
                        await db.delete(users).where(eq(users.id, doctor.userId));

                        console.log("Doctor deleted after rejection:", doctorId);
                    }
                } catch (err) { console.error("Delete failed:", err); }
            }, 1000 * 60 * 5);
        }

        return res.status(200).json({ success: true, message: "Doctor status updated", });

    } catch (error) {
        console.error("Update Doctor Status Error:", error);
        return res.status(500).json({ success: false, message: "Failed to update doctor status", });
    }
};