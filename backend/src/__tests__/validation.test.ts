import { describe, it, expect } from "vitest";
import { clientSchema } from "../shared/validation.js";

const validData = {
  fullName: "João da Silva",
  cpf: "529.982.247-25",
  email: "joao@example.com",
  favoriteColor: "Azul" as const,
  notes: "Observação teste",
};

describe("clientSchema", () => {
  it("accepts valid data", () => {
    const result = clientSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("accepts empty notes", () => {
    const result = clientSchema.safeParse({ ...validData, notes: "" });
    expect(result.success).toBe(true);
  });

  it("accepts missing notes", () => {
    const { notes: _, ...withoutNotes } = validData;
    const result = clientSchema.safeParse(withoutNotes);
    expect(result.success).toBe(true);
  });

  it("rejects short name", () => {
    const result = clientSchema.safeParse({ ...validData, fullName: "Ab" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid CPF format", () => {
    const result = clientSchema.safeParse({ ...validData, cpf: "12345678901" });
    expect(result.success).toBe(false);
  });

  it("rejects CPF with all same digits", () => {
    const result = clientSchema.safeParse({ ...validData, cpf: "111.111.111-11" });
    expect(result.success).toBe(false);
  });

  it("rejects CPF with wrong check digits", () => {
    const result = clientSchema.safeParse({ ...validData, cpf: "529.982.247-26" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = clientSchema.safeParse({ ...validData, email: "not-email" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid color", () => {
    const result = clientSchema.safeParse({ ...validData, favoriteColor: "Rosa" });
    expect(result.success).toBe(false);
  });

  it("rejects notes longer than 1000 chars", () => {
    const result = clientSchema.safeParse({ ...validData, notes: "a".repeat(1001) });
    expect(result.success).toBe(false);
  });
});
