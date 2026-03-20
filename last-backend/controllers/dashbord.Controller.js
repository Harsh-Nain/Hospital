import { date } from "drizzle-orm/mysql-core";
import db from "../db/index.js";
import { users, patients, appointments, doctors, specializations, doctorSlots, payments, } from "../db/schema.js";
import { eq, and, sql,desc } from "drizzle-orm";
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
        const doctorsList = await db.select().from(doctors);
        const patientsList = await db.select().from(patients);
        const appointmentList = await db.select({ appointmentId: appointments.id, status: appointments.status, doctorId: appointments.doctorId, patientId: appointments.patientId, }).from(appointments);

        const doctorsForApproval = await db
            .select({ doctorId: doctors.id, ...doctors, ...users, specialization: specializations.name, symptoms: specializations.symptoms, })
            .from(doctors)
            .leftJoin(users, eq(users.id, doctors.userId))
            .leftJoin(specializations, eq(specializations.id, doctors.specializationId))
            .where(and(eq(doctors.status, "pending"), eq(doctors.isApproved, false)));

        const paymentsList = await db
            .select({ paymentId: payments.id, amount: payments.amount, paymentStatus: payments.paymentStatus, paymentMethod: payments.paymentMethod, transactionId: payments.transactionId, paidAt: payments.paidAt, appointmentId: appointments.id, appointmentStatus: appointments.status, patientId: patients.id, patientName: users.fullName, doctorId: doctors.id, specialization: specializations.name, date: doctorSlots.date, startTime: doctorSlots.startTime, })
            .from(payments)
            .leftJoin(appointments, eq(appointments.id, payments.appointmentId))
            .leftJoin(patients, eq(patients.id, appointments.patientId))
            .leftJoin(users, eq(users.id, patients.userId))
            .leftJoin(doctors, eq(doctors.id, appointments.doctorId))
            .leftJoin(specializations, eq(specializations.id, doctors.specializationId))
            .leftJoin(doctorSlots, eq(doctorSlots.id, appointments.slotId));

        const totalRevenue = paymentsList.reduce((sum, p) => sum + (p.amount || 0), 0);
        res.json({ success: true, totalUsers: usersList.length, totalDoctors: doctorsList.length, totalPatients: patientsList.length, totalAppointments: appointmentList.length, doctorsForApproval, appointments: appointmentList, payments: paymentsList, totalRevenue, });

    } catch (error) {
        console.error("AdminDashboard Error:", error);
        res.status(500).json({ success: false, message: "Server error", });
    }
};

export const AllPatients = async (req, res) => {
    try {
        const data = await db.select({ patientId: patients.id, age: patients.age, gender: patients.gender, phone: patients.phone, address: patients.address, disease: patients.disease, bloodGroup: patients.bloodGroup, userId: users.id, fullName: users.fullName, email: users.email, image: users.image, appointmentId: appointments.id, appointmentStatus: appointments.status, doctorId: doctors.id, appointmentDoctor: specializations.name, })
            .from(patients)
            .leftJoin(users, eq(users.id, patients.userId))
            .leftJoin(appointments, eq(appointments.patientId, patients.id))
            .leftJoin(doctors, eq(doctors.id, appointments.doctorId))
            .leftJoin(specializations, eq(specializations.id, doctors.specializationId));

        const groupedPatients = {};

        data.forEach((item) => {
            if (!groupedPatients[item.patientId]) {
                groupedPatients[item.patientId] = { patientId: item.patientId, age: item.age, gender: item.gender, phone: item.phone, address: item.address, disease: item.disease, bloodGroup: item.bloodGroup, userId: item.userId, fullName: item.fullName, email: item.email, image: item.image, appointments: [], };
            }

            if (item.appointmentId) {
                groupedPatients[item.patientId].appointments.push({ appointmentId: item.appointmentId, status: item.appointmentStatus, doctorId: item.doctorId, doctor: item.appointmentDoctor, });
            }
        });

        const result = Object.values(groupedPatients);

        res.json({ success: true, patients: result, });

    } catch (error) {
        console.error("AllPatients Error:", error);
        res.status(500).json({ success: false, message: "Server error", });
    }
};

export const AllDoctors = async (req, res) => {
    try {
        const data = await db
            .select({
                doctorId: doctors.id,
                experienceYears: doctors.experienceYears, consultationFee: doctors.consultationFee, license: doctors.licenseNumber, bio: doctors.bio, status: doctors.status, isApproved: doctors.isApproved,
                userId: users.id, fullName: users.fullName, email: users.email, image: users.image,
                specialization: specializations.name,
                startTime: doctorSlots.startTime, endTime: doctorSlots.endTime, date: doctorSlots.date,
                appointmentId: appointments.id, appointmentStatus: appointments.status,
            })
            .from(doctors)
            .where(eq(doctors.isApproved, true))
            .leftJoin(users, eq(users.id, doctors.userId))
            .leftJoin(specializations, eq(specializations.id, doctors.specializationId))
            .leftJoin(appointments, eq(appointments.doctorId, doctors.id))
            .leftJoin(doctorSlots, eq(doctorSlots.doctorId, doctors.id));

        const doctorsMap = {};

        data.forEach((row) => {
            if (!doctorsMap[row.doctorId]) {
                doctorsMap[row.doctorId] = { doctorId: row.doctorId, fullName: row.fullName, email: row.email, image: row.image, specialization: row.specialization, experienceYears: row.experienceYears, consultationFee: row.consultationFee, license: row.license, bio: row.bio, status: row.status, isApproved: row.isApproved, slots: [], appointments: [], };
            }

            if (row.startTime) {
                doctorsMap[row.doctorId].slots.push({ startTime: row.startTime, endTime: row.endTime, date: row.date, });
            }

            if (row.appointmentId) {
                doctorsMap[row.doctorId].appointments.push({ id: row.appointmentId, status: row.appointmentStatus, });
            }
        });

        const result = Object.values(doctorsMap);

        res.json({ success: true, doctors: result, });

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
            .where(and(sql`JSON_SEARCH(${specializations.symptoms}, 'one', ${patient.disease})`, eq(doctors.isApproved, true), eq(doctors.status, "success")))
            .limit(6);

        if (doctorsList == 0) {
            doctorsList = await db
                .select({ doctorId: doctors.id, fullName: users.fullName, image: users.image, experienceYears: doctors.experienceYears, consultationFee: doctors.consultationFee, specialization: specializations.name, slotId: doctorSlots.id, date: doctorSlots.date, startTime: doctorSlots.startTime, endTime: doctorSlots.endTime })
                .from(doctors)
                .leftJoin(users, eq(users.id, doctors.userId))
                .leftJoin(specializations, eq(specializations.id, doctors.specializationId))
                .leftJoin(doctorSlots, eq(doctorSlots.doctorId, doctors.id))
                .where(and(sql`JSON_SEARCH(${specializations.symptoms}, 'one', 'fever')`, eq(doctors.isApproved, true), eq(doctors.status, "success"),))
                .limit(6);
        }

        const appointmentList = await db
            .select({ amount: payments.amount, transactionId: payments.transactionId, paymentStatus: payments.paymentStatus, paymentId: payments.id, appointmentId: appointments.id, appoitmentStatus: appointments.status, doctorName: users.fullName, doctorImage: users.image, consultationFee: doctors.consultationFee, specialization: specializations.name, date: doctorSlots.date, startTime: doctorSlots.startTime, endTime: doctorSlots.endTime })
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

export const DoctorDashboard = async (req, res) => {
    try {
        const { id } = req.user;

        const [doctor] = await db
            .select({ doctorId: doctors.id, fullName: users.fullName, email: users.email, image: users.image, experienceYears: doctors.experienceYears, consultationFee: doctors.consultationFee, specialization: specializations.name, })
            .from(doctors)
            .leftJoin(users, eq(users.id, doctors.userId))
            .leftJoin(specializations, eq(specializations.id, doctors.specializationId))
            .where(eq(doctors.userId, id))
            .limit(1);

        if (!doctor) {
            return res.json({ success: false, message: "Doctor not found", });
        }

        const now = new Date();
        const today = now.toISOString().split("T")[0];

        const formatTime = (time) => {
            if (!time) return "";
            const [h, m] = time.split(":");
            return `${h.padStart(2, "0")}:${m}`;
        };

        const appointmentsData = await db
          .select({ appointmentId: appointments.id, status: appointments.status, meetingLink: appointments.meetingLink, date: doctorSlots.date, startTime: doctorSlots.startTime, endTime: doctorSlots.endTime, capacity: doctorSlots.capacity, patientId: patients.id, disease: patients.disease, patientName: users.fullName, patientImage: users.image, paymentId: payments.id, amount: payments.amount, paymentStatus: payments.paymentStatus, paymentMethod: payments.paymentMethod, transactionId: payments.transactionId, paidAt: payments.paidAt, })
            .from(appointments)
            .leftJoin(doctorSlots, eq(doctorSlots.id, appointments.slotId))
            .leftJoin(patients, eq(patients.id, appointments.patientId))
            .leftJoin(users, eq(users.id, patients.userId))
            .leftJoin(payments, eq(payments.appointmentId, appointments.id))
            .where(eq(appointments.doctorId, doctor.doctorId))
            .orderBy(desc(doctorSlots.date), desc(doctorSlots.startTime));
            
            
        const slotCounts = await db
            .select({ slotId: appointments.slotId, count: sql`COUNT(*)`, })
            .from(appointments)
            .where(eq(appointments.doctorId, doctor.doctorId))
            .groupBy(appointments.slotId);


        const slotCountMap = {};
        slotCounts.forEach((s) => {
            slotCountMap[s.slotId] = Number(s.count);
        });

        const formattedAppointments = appointmentsData.map((a) => {
            const slotDateTime = new Date(`${a.date}T${a.startTime}`);
            const booked = slotCountMap[a.slotId] || 0;
            const remaining = a.capacity - booked;
            return { appointmentId: a.appointmentId, status: a.status, meetingLink: a.meetingLink, type: slotDateTime > now ? "upcoming" : "past", patient: { id: a.patientId, name: a.patientName, image: a.patientImage, disease: a.disease, }, slot: { date: a.date, startTime: formatTime(a.startTime), endTime: formatTime(a.endTime), capacity: a.capacity, booked, remaining, isFull: remaining <= 0, }, payment: { id: a.paymentId, amount: a.amount, status: a.paymentStatus, method: a.paymentMethod, transactionId: a.transactionId, paidAt: a.paidAt, }, };
        });

        
        const totalAppointments = formattedAppointments.length;
        const confirmed = formattedAppointments.filter((a) => a.status === "confirmed").length;
        const Cancelled = formattedAppointments.filter((a) => a.status === "Cancelled").length;
        const pending = formattedAppointments.filter((a) => a.status === "wait for approval").length;
        const todayAppointments = formattedAppointments.filter((a) => a.slot.date === today).length;
        const totalRevenue = formattedAppointments.reduce((sum, a) => sum + (a.payment.amount || 0), 0);
        const fullSlots = formattedAppointments.filter((a) => a.slot.isFull).length;

        
        res.json({ success: true, doctor, stats: { totalAppointments, confirmed, pending,Cancelled, todayAppointments, totalRevenue, fullSlots, }, appointments: formattedAppointments, });
    } catch (error) {
        console.error("DoctorDashboard Error:", error);
        res.status(500).json({ success: false, message: "Server error", });
    }
};