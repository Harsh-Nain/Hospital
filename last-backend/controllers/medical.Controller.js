import { medicalReports, doctorSlots, appointments, patients, doctors } from "../db/schema.js";
import { eq, and, sql, ne } from "drizzle-orm";
import db from "../db/index.js";

export const UploadMedicalReport = async (req, res) => {

  try {
    const { diseaseName } = req.body;
    const userId = req.user?.id;
    const file = req.file;


    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    if (!diseaseName || diseaseName.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Disease name is required",
      });
    }


    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Medical report file is required",
      });
    }




    const patient = await db
      .select()
      .from(patients)
      .where(eq(patients.userId, userId))
      .limit(1);

    if (!patient.length) {
      return res.status(404).json({
        success: false,
        message: "Patient profile not found",
      });
    }

    const patientId = patient[0].id;

    const result = await db
      .insert(medicalReports)
      .values({
        patientId,
        diseaseName: diseaseName.trim(),
        fileUrl: file.path,
        uploadedAt: new Date(),
      })
      ;

    const insertedId = result[0]?.insertId || result.insertId;

    const newReport = await db
      .select()
      .from(medicalReports)
      .where(eq(medicalReports.id, insertedId))
      .limit(1);


    return res.json({
      success: true,
      message: "Medical report uploaded successfully",
      data: newReport[0],
    });

  } catch (error) {
    console.error("UploadMedicalReport Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const GetMedicalReports = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const patient = await db
      .select()
      .from(patients)
      .where(eq(patients.userId, userId))
      .limit(1);

    if (!patient.length) {
      return res.json({
        success: true,
        reports: [],
      });
    }

    const patientId = patient[0].id;

    const reports = await db
      .select()
      .from(medicalReports)
      .where(eq(medicalReports.patientId, patientId));

    return res.json({
      success: true,
      reports,
    });

  } catch (error) {
    console.error("GetMedicalReports Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const DeleteMedicalReport = async (req, res) => {
  try {

    const { reportId } = req.params;

    if (!reportId) {
      return res.status(400).json({
        success: false,
        message: "Report ID required",
      });
    }

    await db
      .delete(medicalReports)
      .where(eq(medicalReports.id, reportId));

    return res.json({
      success: true,
      message: "Report deleted successfully",
    });

  } catch (error) {
    console.error("DeleteMedicalReport Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const CreateDoctorSlot = async (req, res) => {
  try {
    const userId = req.user.id

    const { date, startTime, endTime, capacity } = req.body;

    const doctorData = await db
      .select()
      .from(doctors)
      .where(eq(doctors.userId, userId))
      .limit(1);

    const doctor = doctorData[0];
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    await db.insert(doctorSlots).values({ doctorId: doctor.id, date, startTime, endTime, capacity: capacity });
    res.json({ success: true, message: "Slot created" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

export const GetDoctorSlots = async (req, res) => {
  try {
    const { doctorId } = req.query;

    if (!doctorId) {
      return res.status(400).json({ success: false, message: "doctorId required" });
    }

    const slots = await db
      .select({
        slotId: doctorSlots.id,
        date: doctorSlots.date,
        startTime: doctorSlots.startTime,
        endTime: doctorSlots.endTime,
        capacity: doctorSlots.capacity,
        isCancelled: doctorSlots.isCancelled,
        slotstage: doctorSlots.slotstage,
        booked: sql`COUNT(CASE WHEN ${appointments.status} = 'confirmed' THEN 1 END)`.as("booked"),
      })
      .from(doctorSlots)
      .leftJoin(appointments, eq(appointments.slotId, doctorSlots.id))
      .where(eq(doctorSlots.doctorId, doctorId))
      .groupBy(doctorSlots.id);


    //  const formattedAppointments = appointmentsData
    //     .filter(a => a.slotstage !== "Removed")
    //   .map((a) => {
    //       if (a.slotstage == "Removed")return   

    const formattedSlots = slots.filter(slot => slot.slotstage !== "Removed")
      .map((slot) => {
        if (slot.slotstage == "Removed") return



        const booked = Number(slot.booked || 0);
        const capacity = Number(slot.capacity || 0);

        return {
          ...slot,
          booked,
          available: capacity - booked,
        };
      });


    const now = new Date();

    const futureSlots = slots.filter(slot => {
      const slotDateTime = new Date(`${slot.date}T${slot.startTime}`);
      return slotDateTime > now && !slot.isCancelled;
    });

    res.json({
      success: true,
      slots: formattedSlots,
      futureSlots: futureSlots
    });

  } catch (error) {
    console.error("GetDoctorSlots Error:", error);
    res.status(500).json({ success: false });
  }
};


export const UpdateDoctorSlot = async (req, res) => {
  try {
    const userId = req.user.id;
    const { slotId, action, reason, change } = req.body;

    if (!slotId || !action) {
      return res.status(400).json({
        success: false,
        message: "slotId and action are required",
      });
    }

    const slotData = await db
      .select({ slotId: doctorSlots.id })
      .from(doctorSlots)
      .innerJoin(doctors, eq(doctorSlots.doctorId, doctors.id))
      .where(
        and(
          eq(doctorSlots.id, slotId),
          eq(doctors.userId, userId)
        )
      )
      .limit(1);

    if (slotData.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Slot not found or unauthorized",
      });
    }


    if (action === "remove") {
      await db
        .update(doctorSlots)
        .set({ slotstage: "Removed" })
        .where(eq(doctorSlots.id, slotId));

      return res.json({
        success: true,
        message: "Slot removed successfully",
      });
    }


    if (action === "changeactive") {
      if (!reason) {
        return res.status(400).json({
          success: false,
          message: "Reason is required for cancel",
        });
      }

      await db
        .update(doctorSlots)
        .set({ isCancelled: change })
        .where(eq(doctorSlots.id, slotId));

      await db
        .update(appointments)
        .set({
          status: "Cancelled",
          createdAt: new Date(),
          cancelReason: reason,
        })
        .where(
          and(
            eq(appointments.slotId, slotId),
            ne(appointments.status, "Cancelled")
          )
        );

      return res.json({
        success: true,
        message: change
          ? "Slot unactivated successfully"
          : "Slot activated successfully",
      });
    }
    return res.status(400).json({
      success: false,
      message: "Invalid action type",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const CreateAppointment = async (req, res) => {
  try {
    const { doctorId, slotId, patientId } = req.body;

    if (!doctorId || !slotId || !patientId) {
      return res.json({ success: false, message: "DoctorId, SlotId and PatientId are required", });
    }

    const slot = await db.select().from(doctorSlots).where(eq(doctorSlots.id, slotId));

    const existingAppointments = await db.select().from(appointments).where(eq(appointments.slotId, slotId));

    if (existingAppointments.length >= slot[0].capacity) {
      return res.status(400).json({ message: "Slot is full", });
    }

    await db.insert(appointments).values({ doctorId, patientId, slotId, status: "wait for approval", });
    res.json({ success: true, message: "Appointment booked successfully", });

  } catch (error) {
    console.error("CreateAppointment Error:", error);
    res.status(500).json({ success: false, message: "Server error", });
  }
};

export const ConfirmAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res.status(400).json({ success: false, message: "Appointment ID required" });
    }

    // const appointmentData = await db
    //   .select({
    //     appointmentId: appointments.id,
    //     slotId: appointments.slotId,
    //     status: appointments.status,
    //     capacity: doctorSlots.capacity,
    //     doctorId: doctorSlots.doctorId,
    //   })
    //   .from(appointments)
    //   .leftJoin(doctorSlots, eq(doctorSlots.id, appointments.slotId))
    //   .leftJoin(patients, eq(patients.id, appointments.patientId))
    //   .where(eq(appointments.id, appointmentId))
    //   .limit(1);

    // if (!appointmentData.length) {
    //   return res.status(404).json({ success: false, message: "Appointment not found" });
    // }

    // const data = appointmentData[0];

    // const slotCounts = await db
    //   .select({ count: sql`COUNT(*)` })
    //   .from(appointments)
    //   .where(eq(appointments.slotId, data.slotId));

    // const totalBooked = Number(slotCounts[0]?.count || 0);

    // if (totalBooked >= data.capacity) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Slot is full",
    //   });
    // }

    await db
      .update(appointments).set({ status: "confirmed", updatedAt: new Date(), })
      .where(eq(appointments.id, appointmentId));

    return res.json({
      success: true,
      message: "Appointment confirmed successfully",
    });

  } catch (error) {
    console.error("ConfirmAppointment Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const CancelAppointment = async (req, res) => {
  try {
    const { appointmentId, reason } = req.body
    console.log(appointmentId, reason);

    if (!appointmentId || !reason) {
      return res.status(400).json({
        success: false,
        message: "SlotId and reason are required",
      });
    }

    await db.update(appointments)
      .set({ status: "Cancelled", createdAt: new Date(), cancelReason: reason, })
      .where(eq(appointments.id, appointmentId));


    res.json({ success: true, message: "Appointment cancelled" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};