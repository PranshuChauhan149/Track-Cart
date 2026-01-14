import express from "express";
import http from "http";
import dotenv from "dotenv";
import { Server } from "socket.io";
import axios from "axios";

dotenv.config();
const app = express();

const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

const io = new Server(server, {
  cors: {
    origin: process.env.NEXT_BASE_URL,
  },
});

io.on("connection", (socket) => {
  console.log("user connected: " + socket.id);

  socket.on("identity", async (userId) => {
    console.log("identity received:", userId);

    try {
      const res = await axios.post(
        `${process.env.NEXT_BASE_URL}/api/socket/connect`,
        { userId, socketId: socket.id }
      );

      console.log("response status:", res.status);
      console.log("response data:", res.data);
      console.log("done");
    } catch (err) {
      console.error("request failed:", err.response?.data || err.message);
    }
  });

  socket.on("update-location", async ({ userId, latitude, longitude }) => {
    const location = {
      type: "Point",
      coordinates: [longitude, latitude]
    }
    await axios.post(
      `${process.env.NEXT_BASE_URL}/api/socket/update-location`,
      { userId, location }
    );

  })

  socket.on("disconnect", () => {
    console.log("user disconnected: " + socket.id);
  });
});

server.listen(PORT, () => {
  console.log("server started at: " + PORT);
});
