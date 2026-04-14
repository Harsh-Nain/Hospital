import { Server } from "socket.io";
import { callLogs, chatMessages } from "./db/schema.js";
import { inArray, eq } from "drizzle-orm";
import db from "./db/index.js";
const onlineUsers = new Map();

export const ChatSocket = (server) => {
    const io = new Server(server, { cors: { origin: ["http://localhost:5173"], methods: ["GET", "POST"], credentials: true, }, });

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);
        const userId = socket.handshake.auth?.userId;

        if (!userId) {
            socket.disconnect();
            return;
        }

        onlineUsers.set(String(userId), socket.id);
        socket.join(String(userId));
        io.emit("onlineUsers", Array.from(onlineUsers.keys()));

        socket.on("call-user", async ({ receiverId, callerId, offer, callType, appointmentId }) => {
            try {
                console.log('Calling.....');
                const [call] = await db.insert(callLogs).values({ appointmentId, callerId, receiverId, callType, status: "ringing", });
                io.to(String(receiverId)).emit("incoming-call", { callerId, offer, callType, callLogId: call.insertId, });

            } catch (err) {
                console.log("Call save error:", err);
            }
        });

        socket.on("answer-call", async ({ receiverId, answer, callLogId }) => {
            try {
                await db.update(callLogs).set({ status: "accepted", startedAt: new Date(), }).where(eq(callLogs.id, callLogId));
                io.to(String(receiverId)).emit("call-accepted", { answer, callLogId, });

            } catch (err) {
                console.log(err);
            }
        });

        socket.on("reject-call", async ({ receiverId, callLogId }) => {
            try {
                await db.update(callLogs).set({ status: "rejected", endedAt: new Date(), }).where(eq(callLogs.id, callLogId));
                io.to(String(receiverId)).emit("call-rejected");

            } catch (err) {
                console.log(err);
            }
        });

        socket.on("end-call", async ({ receiverId, callLogId }) => {
            try {
                const [call] = await db.select().from(callLogs).where(eq(callLogs.id, callLogId));
                let duration = 0;

                if (call?.startedAt) {
                    duration = Math.floor((new Date() - new Date(call.startedAt)) / 1000);
                }

                await db.update(callLogs).set({ status: "ended", endedAt: new Date(), duration, }).where(eq(callLogs.id, callLogId));
                io.to(String(receiverId)).emit("call-ended");

            } catch (err) {
                console.log(err);
            }
        });

        socket.on("ice-candidate", ({ receiverId, candidate }) => {
            io.to(String(receiverId)).emit("ice-candidate", { candidate, });
        });

        socket.on("toggle-mic", ({ receiverId, isMuted }) => {
            io.to(String(receiverId)).emit("toggle-mic", { isMuted, });
        });

        socket.on("toggle-camera", ({ receiverId, isCameraOn }) => {
            io.to(String(receiverId)).emit("toggle-camera", { isCameraOn, });
        });

        socket.on("markSeen", async ({ messageIds, senderId }) => {
            try {
                await db.update(chatMessages).set({ isSeen: true }).where(inArray(chatMessages.id, messageIds));
                io.to(String(senderId)).emit("messagesSeen", { messageIds, });
            } catch (err) {
                console.error("❌ markSeen error:", err);
            }
        });

        socket.on("typing", ({ senderId, receiverId }) => {
            socket.to(String(receiverId)).emit("typing", { senderId });
        });

        socket.on("stopTyping", ({ senderId, receiverId }) => {
            socket.to(String(receiverId)).emit("stopTyping", { senderId });
        });

        socket.on("connect_error", (err) => {
            console.log("Connection Error:", err.message);
        });

        socket.on("disconnect", () => {
            console.log("Disconnected:", socket.id);

            onlineUsers.delete(String(userId));
            io.emit("onlineUsers", Array.from(onlineUsers.keys()));
        });
    });

    return io;
};