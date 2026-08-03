import express from "express";
import cors from "cors";
import { pool } from "./db/pool.js";
import { ClientRepository } from "./repositories/client.repository.js";
import { ClientService } from "./services/client.service.js";
import { ClientController } from "./controllers/client.controller.js";
import { createClientRouter } from "./routes/clients.js";
import { errorHandler } from "./middleware/error-handler.js";

const clientRepository = new ClientRepository(pool);
const clientService = new ClientService(clientRepository);
const clientController = new ClientController(clientService);

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/clients", createClientRouter(clientController));

app.use(errorHandler);

export default app;
