import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { Pool } from "pg";
import express from "express";
import request from "supertest";
import { ClientRepository } from "../repositories/client.repository.js";
import { ClientService } from "../services/client.service.js";
import { ClientController } from "../controllers/client.controller.js";
import { createClientRouter } from "../routes/clients.js";
import { errorHandler } from "../middleware/error-handler.js";

const TEST_DB_URL =
  process.env.TEST_DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/aetheryn_test";

const validClient = {
  fullName: "João da Silva",
  cpf: "529.982.247-25",
  email: "joao@example.com",
  favoriteColor: "Azul",
  notes: "Teste integração",
};

describe("POST /api/clients (integration)", () => {
  let pool: Pool;
  let app: express.Express;

  beforeAll(async () => {
    pool = new Pool({ connectionString: TEST_DB_URL });

    await pool.query(`
      CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        cpf VARCHAR(14) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        favorite_color VARCHAR(50) NOT NULL,
        notes TEXT DEFAULT '',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    const repository = new ClientRepository(pool);
    const service = new ClientService(repository);
    const controller = new ClientController(service);

    app = express();
    app.use(express.json());
    app.use("/api/clients", createClientRouter(controller));
    app.use(errorHandler);
  });

  beforeEach(async () => {
    await pool.query("DELETE FROM clients");
  });

  afterAll(async () => {
    await pool.query("DROP TABLE IF EXISTS clients");
    await pool.end();
  });

  it("creates a client and returns 201", async () => {
    const res = await request(app).post("/api/clients").send(validClient);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.clientId).toBeGreaterThan(0);
    expect(res.body.message).toBe("Cadastro realizado com sucesso!");

    const dbResult = await pool.query("SELECT * FROM clients WHERE id = $1", [res.body.clientId]);
    expect(dbResult.rows[0].full_name).toBe(validClient.fullName);
    expect(dbResult.rows[0].cpf).toBe(validClient.cpf);
    expect(dbResult.rows[0].email).toBe(validClient.email);
  });

  it("rejects duplicate CPF with 409", async () => {
    await request(app).post("/api/clients").send(validClient);

    const res = await request(app)
      .post("/api/clients")
      .send({
        ...validClient,
        email: "outro@example.com",
      });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("CPF já cadastrado");
  });

  it("rejects duplicate email with 409", async () => {
    await request(app).post("/api/clients").send(validClient);

    const res = await request(app)
      .post("/api/clients")
      .send({
        ...validClient,
        cpf: "987.654.321-00",
      });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("E-mail já cadastrado");
  });

  it("rejects invalid data with 400", async () => {
    const res = await request(app).post("/api/clients").send({
      fullName: "",
      cpf: "123",
      email: "not-email",
      favoriteColor: "Rosa",
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors.length).toBeGreaterThan(0);
  });

  it("returns available colors", async () => {
    const res = await request(app).get("/api/clients/colors");

    expect(res.status).toBe(200);
    expect(res.body.colors).toContain("Vermelho");
    expect(res.body.colors).toContain("Violeta");
    expect(res.body.colors).toHaveLength(7);
  });
});
