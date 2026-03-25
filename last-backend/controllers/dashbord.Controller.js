import db from "../db/index.js";
import { users, patients, appointments, doctors, specializations, doctorSlots, payments, } from "../db/schema.js";
import { eq, and, sql, desc, or, gt } from "drizzle-orm";

const formatTime = (time) => {
    if (!time) return "";
    const [h, m] = time.split(":");
    return `${h.padStart(2, "0")}:${m}`;
};

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

export const PatientDashboard = async (req, res) => {
    try {
        const { id } = req.user;

        const [patient] = await db
            .select({ id: users.id, fullName: users.fullName, email: users.email, image: users.image, role: users.role, disease: patients.disease, patientId: patients.id, })
            .from(users)
            .leftJoin(patients, eq(patients.userId, users.id))
            .where(and(eq(users.id, id), eq(users.role, "patient")))
            .limit(1);

        if (!patient) {
            return res.json({ success: false, message: "Patient not found" });
        }

        const now = new Date();
        const today = now.toISOString().split("T")[0];
        const currentTime = now.toTimeString().slice(0, 5);

        let doctorsList = await db
            .select({ doctorId: doctors.id, fullName: users.fullName, image: users.image, experienceYears: doctors.experienceYears, specialization: specializations.name, slotId: doctorSlots.id, date: doctorSlots.date, startTime: doctorSlots.startTime, endTime: doctorSlots.endTime, capacity: doctorSlots.capacity, bookedCount: sql`COUNT(${appointments.id})`, })
            .from(doctors)
            .leftJoin(users, eq(users.id, doctors.userId))
            .leftJoin(specializations, eq(specializations.id, doctors.specializationId))
            .leftJoin(doctorSlots, eq(doctorSlots.doctorId, doctors.id))
            .leftJoin(appointments, eq(appointments.slotId, doctorSlots.id))
            .where(
                and(
                    or(sql`JSON_CONTAINS(${specializations.symptoms}, JSON_ARRAY(${patient.disease}))`, sql`LOWER(${specializations.name}) LIKE LOWER(${`%${patient.disease}%`})`),
                    eq(doctors.isApproved, true), eq(doctors.status, "approved"), eq(doctorSlots.isCancelled, false),
                    or(gt(doctorSlots.date, today), and(eq(doctorSlots.date, today), gt(doctorSlots.startTime, currentTime)))
                )
            ).groupBy(doctors.id, doctorSlots.id).orderBy(doctorSlots.date, doctorSlots.startTime).limit(6);

        if (doctorsList.length === 0) {
            doctorsList = await db
                .select({ doctorId: doctors.id, fullName: users.fullName, image: users.image, experienceYears: doctors.experienceYears, consultationFee: doctors.consultationFee, specialization: specializations.name, slotId: doctorSlots.id, date: doctorSlots.date, startTime: doctorSlots.startTime, endTime: doctorSlots.endTime, capacity: doctorSlots.capacity, bookedCount: sql`COUNT(${appointments.id})`, })
                .from(doctors)
                .leftJoin(users, eq(users.id, doctors.userId))
                .leftJoin(specializations, eq(specializations.id, doctors.specializationId))
                .leftJoin(doctorSlots, eq(doctorSlots.doctorId, doctors.id))
                .leftJoin(appointments, eq(appointments.slotId, doctorSlots.id))
                .where(and(sql`JSON_SEARCH(${specializations.symptoms}, 'one', 'fever')`, eq(doctors.isApproved, true), eq(doctors.status, "success"), eq(doctorSlots.isCancelled, false)))
                .groupBy(doctorSlots.id)
                .limit(6);
        }

        const formattedDoctors = doctorsList.map((d) => {
            const booked = Number(d.bookedCount || 0);
            const remaining = d.capacity - booked;
            return { doctorId: d.doctorId, fullName: d.fullName, image: d.image, experienceYears: d.experienceYears, consultationFee: d.consultationFee, specialization: d.specialization, slot: { slotId: d.slotId, date: d.date, startTime: formatTime(d.startTime), endTime: formatTime(d.endTime), capacity: d.capacity, booked, remaining, isFull: remaining <= 0, }, };
        });

        const appointmentList = await db
            .select({ amount: payments.amount, transactionId: payments.transactionId, cancelReason: appointments.cancelReason, paymentStatus: payments.paymentStatus, isCancelled: doctorSlots.isCancelled, appoitmentCreatedAt: appointments.createdAt, appointmentId: appointments.id, appointmentStatus: appointments.status, meetingLink: appointments.meetingLink, doctorName: users.fullName, doctorImage: users.image, doctorId: doctors.id, consultationFee: doctors.consultationFee, specialization: specializations.name, date: doctorSlots.date, startTime: doctorSlots.startTime, endTime: doctorSlots.endTime, })
            .from(appointments)
            .leftJoin(doctors, eq(doctors.id, appointments.doctorId))
            .leftJoin(users, eq(users.id, doctors.userId))
            .leftJoin(specializations, eq(specializations.id, doctors.specializationId))
            .leftJoin(doctorSlots, eq(doctorSlots.id, appointments.slotId))
            .leftJoin(payments, eq(payments.appointmentId, appointments.id))
            .where(and(eq(appointments.patientId, patient.patientId), or(gt(doctorSlots.date, today), and(eq(doctorSlots.date, today), gt(doctorSlots.startTime, currentTime)))))
            .orderBy(desc(doctorSlots.date), desc(doctorSlots.startTime));

        const formattedAppointments = appointmentList.map((a) => {
            const slotDateTime = new Date(`${a.date}T${a.startTime}`);
            const formatDateTime = (date) => { return new Date(date).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true, }); }
            return { appointmentId: a.appointmentId, status: a.appointmentStatus, cancelReason: a.cancelReason, appoitmentCreatedAt: formatDateTime(a.appoitmentCreatedAt), paymentStatus: a.paymentStatus, amount: a.amount, meetingLink: a.meetingLink, type: slotDateTime > now ? "upcoming" : "past", doctor: { doctorId: a.doctorId, name: a.doctorName, image: a.doctorImage, specialization: a.specialization }, slot: { date: a.date, startTime: formatTime(a.startTime), endTime: formatTime(a.endTime), isCancelled: a.isCancelled, }, };
        });

        res.json({ success: true, patient, doctorsList: formattedDoctors, appointments: formattedAppointments, });

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
        const pending = formattedAppointments.filter((a) => a.status === "wait for approval").length;
        const todayAppointments = formattedAppointments.filter((a) => a.slot.date === today).length;
        const totalRevenue = formattedAppointments.reduce((sum, a) => sum + (a.payment.amount || 0), 0);
        const fullSlots = formattedAppointments.filter((a) => a.slot.isFull).length;

        res.json({ success: true, doctor, stats: { totalAppointments, confirmed, pending, todayAppointments, totalRevenue, fullSlots, }, appointments: formattedAppointments, });
    } catch (error) {
        console.error("DoctorDashboard Error:", error);
        res.status(500).json({ success: false, message: "Server error", });
    }
};