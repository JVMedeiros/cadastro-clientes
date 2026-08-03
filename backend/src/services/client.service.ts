import { ClientRepository } from "../repositories/client.repository.js";
import { clientSchema } from "../shared/validation.js";

export class DuplicateEntryError extends Error {
  public readonly field: string;

  constructor(field: string) {
    super(`${field} já cadastrado`);
    this.name = "DuplicateEntryError";
    this.field = field;
  }
}

export class ClientService {
  constructor(private readonly repository: ClientRepository) {}

  async create(rawData: unknown): Promise<number> {
    const data = clientSchema.parse(rawData);

    try {
      return await this.repository.create(data);
    } catch (error) {
      const pgError = error as { code?: string; constraint?: string };
      if (pgError.code === "23505") {
        const field = pgError.constraint?.includes("cpf") ? "CPF" : "E-mail";
        throw new DuplicateEntryError(field);
      }
      throw error;
    }
  }
}
