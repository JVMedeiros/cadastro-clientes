import { ClientFormData } from "./validation";

interface ApiSuccess {
  success: true;
  message: string;
  clientId: number;
}

interface ApiError {
  success: false;
  message: string;
  errors?: Array<{ field: string; message: string }>;
}

type ApiResponse = ApiSuccess | ApiError;

const API_BASE = import.meta.env.VITE_API_URL || "/api";

export async function createClient(data: ClientFormData): Promise<ApiResponse> {
  const response = await fetch(`${API_BASE}/clients`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return response.json() as Promise<ApiResponse>;
}
