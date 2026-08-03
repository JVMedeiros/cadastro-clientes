import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { clientSchema, ClientFormData, RAINBOW_COLORS } from "../lib/validation";
import { createClient } from "../lib/api";

function formatCPF(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

interface SubmitResult {
  type: "success" | "error";
  message: string;
}

export function ClientForm() {
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      fullName: "",
      cpf: "",
      email: "",
      favoriteColor: undefined,
      notes: "",
    },
  });

  const onSubmit = async (data: ClientFormData) => {
    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const response = await createClient(data);

      if (response.success) {
        setSubmitResult({ type: "success", message: response.message });
        reset();
      } else {
        setSubmitResult({ type: "error", message: response.message });
      }
    } catch {
      setSubmitResult({
        type: "error",
        message: "Erro de conexão. Tente novamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="client-form" noValidate>
      <div className="form-header">
        <h1>Cadastro de Cliente</h1>
        <p>Preencha os dados abaixo para realizar o cadastro</p>
      </div>

      {submitResult && (
        <div
          className={`alert ${submitResult.type === "success" ? "alert-success" : "alert-error"}`}
          role="alert"
        >
          {submitResult.message}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="fullName">Nome completo *</label>
        <input
          id="fullName"
          type="text"
          placeholder="Digite o nome completo"
          {...register("fullName")}
          aria-invalid={!!errors.fullName}
        />
        {errors.fullName && <span className="error">{errors.fullName.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="cpf">CPF *</label>
        <input
          id="cpf"
          type="text"
          placeholder="000.000.000-00"
          {...register("cpf", {
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              setValue("cpf", formatCPF(e.target.value));
            },
          })}
          aria-invalid={!!errors.cpf}
          maxLength={14}
        />
        {errors.cpf && <span className="error">{errors.cpf.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email">E-mail *</label>
        <input
          id="email"
          type="email"
          placeholder="email@exemplo.com"
          {...register("email")}
          aria-invalid={!!errors.email}
        />
        {errors.email && <span className="error">{errors.email.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="favoriteColor">Cor preferida *</label>
        <select
          id="favoriteColor"
          {...register("favoriteColor")}
          aria-invalid={!!errors.favoriteColor}
        >
          <option value="">Selecione uma cor</option>
          {RAINBOW_COLORS.map((color) => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </select>
        {errors.favoriteColor && <span className="error">{errors.favoriteColor.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="notes">Observações</label>
        <textarea
          id="notes"
          placeholder="Observações adicionais (opcional)"
          rows={4}
          {...register("notes")}
          aria-invalid={!!errors.notes}
        />
        {errors.notes && <span className="error">{errors.notes.message}</span>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Enviando..." : "Enviar"}
      </button>
    </form>
  );
}
