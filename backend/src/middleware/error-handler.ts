import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { DuplicateEntryError } from "../services/client.service.js";

export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
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

  if (error instanceof DuplicateEntryError) {
    res.status(409).json({
      success: false,
      message: error.message,
    });
    return;
  }

  console.error("Unhandled error:", error);
  res.status(500).json({
    success: false,
    message: "Erro interno do servidor",
  });
}
