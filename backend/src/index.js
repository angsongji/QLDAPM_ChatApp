import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import messageRoutes from "./routes/message.route.js";
import chatRoutes from "./routes/chat.route.js";
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";
import cors from "cors";

dotenv.config();
const PORT = process.env.PORT;

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://192.168.0.134:5173",
    credentials: true,
  })
);

const rootAPI = "/api/";
app.use(`${rootAPI}auth`, authRoutes);
app.use(`${rootAPI}users`, userRoutes);
app.use(`${rootAPI}chats`, chatRoutes);
app.use(`${rootAPI}messages`, messageRoutes);

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log("Server is running on PORT:", PORT);
  });
});
