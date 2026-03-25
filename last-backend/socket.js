import { Server } from "socket.io";
import { chatMessages } from "./db/schema.js";
import { inArray } from "drizzle-orm";
import db from "./db/index.js";
const onlineUsers = new Map();

export const ChatSocket = (server) => {
    const io = new Server(server, {
        cors: { origin: ["http://localhost:5173"], methods: ["GET", "POST"], credentials: true, },
    });

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
            console.log("❌ Disconnected:", socket.id);

            onlineUsers.delete(String(userId));
            io.emit("onlineUsers", Array.from(onlineUsers.keys()));
        });
    });

    return io;
};