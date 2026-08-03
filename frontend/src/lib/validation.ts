import { z } from "zod";

export const RAINBOW_COLORS = [
  "Vermelho",
  "Laranja",
  "Amarelo",
  "Verde",
  "Azul",
  "Anil",
  "Violeta",
] as const;

export type RainbowColor = (typeof RAINBOW_COLORS)[number];

function isValidCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(digits.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== parseInt(digits.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(digits.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== parseInt(digits.charAt(10))) return false;

  return true;
}

export const clientSchema = z.object({
  fullName: z
    .string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(255, "Nome muito longo"),
  cpf: z
    .string()
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF deve estar no formato 000.000.000-00")
    .refine(isValidCPF, "CPF inválido"),
  email: z.string().email("E-mail inválido"),
  favoriteColor: z.enum(RAINBOW_COLORS, {
    errorMap: () => ({ message: "Selecione uma cor válida" }),
  }),
  notes: z.string().max(1000, "Observações muito longas").optional().default(""),
});

export type ClientFormData = z.infer<typeof clientSchema>;
