import { Pool } from "pg";
import { ClientInput } from "../shared/validation.js";

export interface ClientRecord {
  id: number;
  full_name: string;
  cpf: string;
  email: string;
  favorite_color: string;
  notes: string;
  created_at: Date;
}

export class ClientRepository {
  constructor(private readonly pool: Pool) {}

  async create(data: ClientInput): Promise<number> {
    const result = await this.pool.query<{ id: number }>(
      `INSERT INTO clients (full_name, cpf, email, favorite_color, notes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [data.fullName, data.cpf, data.email, data.favoriteColor, data.notes],
    );

    return result.rows[0].id;
  }
}
