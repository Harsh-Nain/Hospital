import { medicalReports, doctorSlots, appointments } from "../db/schema.js";
import { eq } from "drizzle-orm";
import db from "../db/index.js";

export const UploadMedicalReport = async (req, res) => {
    try {
        const { patientId, diseaseName } = req.body;

        if (!req.files) {
            return res.json({ success: false, message: "File required" });
        }

        await db.insert(medicalReports).values({ patientId: Number(patientId), fileUrl: req.files[0].path, diseaseName: diseaseName });
        res.json({ success: true, message: "Medical report uploaded" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
};

export const GetMedicalReports = async (req, res) => {
    try {
        const { patientId } = req.query;

        const reports = await db.select().from(medicalReports).where(eq(medicalReports.patientId, patientId));
        res.json({ success: true, reports });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
};

export const CreateDoctorSlot = async (req, res) => {
    try {
        const { id } = req.user;
        const { date, startTime, endTime } = req.body;

        await db.insert(doctorSlots).values({ doctorId: id, date, startTime, endTime });
        res.json({ success: true, message: "Slot created" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
};

export const GetDoctorSlots = async (req, res) => {
    try {
        const { doctorId } = req.query;

        const slots = await db.select().from(doctorSlots).where(eq(doctorSlots.doctorId, doctorId));
        res.json({ success: true, slots });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
};

export const CreateAppointment = async (req, res) => {
    try {
        const { doctorId, patientId, slotId } = req.body;

        await db.insert(appointments).values({ doctorId, patientId, slotId, status: "pending" });
        res.json({ success: true, message: "Appointment requested" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
};

export const ConfirmAppointment = async (req, res) => {
    try {
        const { appointmentId, slotId } = req.body;

        await db.update(appointments).set({ status: "confirmed" }).where(eq(appointments.id, appointmentId));
        await db.update(doctorSlots).set({ isBooked: true }).where(eq(doctorSlots.id, slotId));

        res.json({ success: true, message: "Appointment confirmed" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
};

export const CancelAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.query;

        await db.update(appointments).set({ status: "cancelled" }).where(eq(appointments.id, appointmentId));
        res.json({ success: true, message: "Appointment cancelled" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
};

export const GetPatientAppointments = async (req, res) => {
    try {
        const { patientId } = req.query;

        const data = await db.select().from(appointments).where(eq(appointments.patientId, patientId));
        res.json({ success: true, appointments: data });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
};

export const GetDoctorAppointments = async (req, res) => {
    try {
        const { doctorId } = req.query;

        const data = await db.select().from(appointments).where(eq(appointments.doctorId, doctorId));
        res.json({ success: true, appointments: data });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
};

export const DeleteMedicalReport = async (req, res) => {
    try {
        const { reportId } = req.query;

        await db.delete(medicalReports).where(eq(medicalReports.id, reportId));
        res.json({ success: true, message: "Report deleted" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
};