import { Request, Response, NextFunction } from "express";
import { ClientService } from "../services/client.service.js";
import { RAINBOW_COLORS } from "../shared/colors.js";

export class ClientController {
  constructor(private readonly service: ClientService) {}

  getColors = (_req: Request, res: Response): void => {
    res.json({ colors: RAINBOW_COLORS });
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const clientId = await this.service.create(req.body);

      res.status(201).json({
        success: true,
        message: "Cadastro realizado com sucesso!",
        clientId,
      });
    } catch (error) {
      next(error);
    }
  };
}
