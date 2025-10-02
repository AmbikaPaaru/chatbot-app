import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRoutes from "./routes/chatRoutes.js";

dotenv.config();
const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json());

app.use("/api", chatRoutes);

app.listen(8000, () => console.log("Server running on http://localhost:8000"));