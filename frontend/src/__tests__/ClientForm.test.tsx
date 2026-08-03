import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ClientForm } from "../components/ClientForm";

vi.mock("../lib/api", () => ({
  createClient: vi.fn(),
}));

import { createClient } from "../lib/api";

const mockedCreateClient = vi.mocked(createClient);

describe("ClientForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all form fields", () => {
    render(<ClientForm />);

    expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cpf/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cor preferida/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/observações/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /enviar/i })).toBeInTheDocument();
  });

  it("renders all rainbow color options", () => {
    render(<ClientForm />);
    const select = screen.getByLabelText(/cor preferida/i);
    const options = select.querySelectorAll("option");
    expect(options).toHaveLength(8); // placeholder + 7 colors
  });

  it("shows validation errors on empty submit", async () => {
    const user = userEvent.setup();
    render(<ClientForm />);

    await user.click(screen.getByRole("button", { name: /enviar/i }));

    await waitFor(() => {
      expect(screen.getByText(/nome deve ter pelo menos/i)).toBeInTheDocument();
    });
  });

  it("formats CPF as user types", async () => {
    const user = userEvent.setup();
    render(<ClientForm />);

    const cpfInput = screen.getByLabelText(/cpf/i);
    await user.type(cpfInput, "52998224725");

    expect(cpfInput).toHaveValue("529.982.247-25");
  });

  it("shows success message on successful submit", async () => {
    mockedCreateClient.mockResolvedValueOnce({
      success: true,
      message: "Cadastro realizado com sucesso!",
      clientId: 1,
    });

    const user = userEvent.setup();
    render(<ClientForm />);

    await user.type(screen.getByLabelText(/nome completo/i), "João da Silva");
    await user.type(screen.getByLabelText(/cpf/i), "52998224725");
    await user.type(screen.getByLabelText(/e-mail/i), "joao@example.com");
    await user.selectOptions(screen.getByLabelText(/cor preferida/i), "Azul");
    await user.click(screen.getByRole("button", { name: /enviar/i }));

    await waitFor(() => {
      expect(screen.getByText(/cadastro realizado com sucesso/i)).toBeInTheDocument();
    });
  });

  it("shows error message on API failure", async () => {
    mockedCreateClient.mockResolvedValueOnce({
      success: false,
      message: "CPF já cadastrado",
    });

    const user = userEvent.setup();
    render(<ClientForm />);

    await user.type(screen.getByLabelText(/nome completo/i), "João da Silva");
    await user.type(screen.getByLabelText(/cpf/i), "52998224725");
    await user.type(screen.getByLabelText(/e-mail/i), "joao@example.com");
    await user.selectOptions(screen.getByLabelText(/cor preferida/i), "Azul");
    await user.click(screen.getByRole("button", { name: /enviar/i }));

    await waitFor(() => {
      expect(screen.getByText(/cpf já cadastrado/i)).toBeInTheDocument();
    });
  });

  it("shows connection error on network failure", async () => {
    mockedCreateClient.mockRejectedValueOnce(new Error("Network error"));

    const user = userEvent.setup();
    render(<ClientForm />);

    await user.type(screen.getByLabelText(/nome completo/i), "João da Silva");
    await user.type(screen.getByLabelText(/cpf/i), "52998224725");
    await user.type(screen.getByLabelText(/e-mail/i), "joao@example.com");
    await user.selectOptions(screen.getByLabelText(/cor preferida/i), "Azul");
    await user.click(screen.getByRole("button", { name: /enviar/i }));

    await waitFor(() => {
      expect(screen.getByText(/erro de conexão/i)).toBeInTheDocument();
    });
  });
});
