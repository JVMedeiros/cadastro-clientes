import express from "express";
import cors from "cors";
import clientsRouter from "./routes/clients.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/clients", clientsRouter);

export default app;
