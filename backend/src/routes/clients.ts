import { Router } from "express";
import { ClientController } from "../controllers/client.controller.js";

export function createClientRouter(controller: ClientController): Router {
  const router = Router();

  router.get("/colors", controller.getColors);
  router.post("/", controller.create);

  return router;
}
