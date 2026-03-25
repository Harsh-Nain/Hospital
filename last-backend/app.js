import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js"
import profileRouter from "./routes/profile.route.js"
import notifRouter from "./routes/response.route.js"
import dashboardRouter from "./routes/dashboard.route.js"
import adminRouter from "./routes/admin.route.js"
import medicalRouter from "./routes/medical.route.js"
import paymentRouter from "./routes/payment.route.js"
import chatRouter from "./routes/chat.route.js"
import { islogin } from "./middleware/auth.js"
import { logout } from "./controllers/access.Controller.js";
import cookieParser from "cookie-parser";
import http from "http";
import { ChatSocket } from "./socket.js";
const app = express();

dotenv.config();
app.use(cookieParser());

app.use(cors({ origin: ["http://localhost:5173", "http://192.168.1.25:5173"], credentials: true }));
app.use(express.json());

app.use("/auth", authRouter);

app.use("/dashboard", islogin, dashboardRouter);
app.use("/admin", islogin, adminRouter);

app.use("/profile", islogin, profileRouter);
app.use("/medical", islogin, medicalRouter);
app.use("/payment", islogin, paymentRouter);

app.use("/feed", islogin, notifRouter);
app.use("/chat", islogin, chatRouter);

app.get("/logout", islogin, logout);

app.get("/test", (req, res) => {
  res.send("hello")
})

const server = http.createServer(app);

const io = ChatSocket(server);
app.set("io", io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`server start at ${PORT}`);
});