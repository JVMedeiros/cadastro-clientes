import { Router, Request, Response } from "express";
import { pool } from "../db/pool.js";
import { clientSchema } from "../shared/validation.js";
import { RAINBOW_COLORS } from "../shared/colors.js";
import { ZodError } from "zod";

const router = Router();

router.get("/colors", (_req: Request, res: Response) => {
  res.json({ colors: RAINBOW_COLORS });
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const data = clientSchema.parse(req.body);

    const result = await pool.query(
      `INSERT INTO clients (full_name, cpf, email, favorite_color, notes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [data.fullName, data.cpf, data.email, data.favoriteColor, data.notes]
    );

    res.status(201).json({
      success: true,
      message: "Cadastro realizado com sucesso!",
      clientId: result.rows[0].id,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        message: "Dados inválidos",
        errors: error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      });
      return;
    }

    const pgError = error as { code?: string; constraint?: string };
    if (pgError.code === "23505") {
      const field = pgError.constraint?.includes("cpf") ? "CPF" : "E-mail";
      res.status(409).json({
        success: false,
        message: `${field} já cadastrado`,
      });
      return;
    }

    console.error("Error creating client:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
});

export default router;
