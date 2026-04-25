import { getClient } from "./client";

export type LoginPayload = { email: string; password: string };
export type LoginResponse = {
  id: string;
  email: string;
  name?: string;
  role: "farmer" | "staff" | "vet";
  token: string;
};

export type SignupPayload = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "farmer" | "staff" | "vet";
};

export async function login(data: LoginPayload) {
  const api = getClient();
  const res = await api.post("/auth/login", data);
  return res.data.data as LoginResponse;
}

export async function signup(data: SignupPayload) {
  const api = getClient();
  const res = await api.post("/auth/signup", data);
  return res.data.data as { email: string };
}

export async function verifyEmail(payload: { email: string; otp: string; type: "verification" | "reset" }) {
  const api = getClient();
  const res = await api.post("/auth/verify-email", payload);
  return res.data;
}

export async function resendOtp(payload: { email: string }) {
  const api = getClient();
  const res = await api.post("/auth/resend-otp", payload);
  return res.data;
}

export async function forgotPassword(payload: { email: string }) {
  const api = getClient();
  const res = await api.post("/auth/forgot-password", payload);
  return res.data;
}

export async function resetPassword(payload: { email: string; otp: string; newPassword: string }) {
  const api = getClient();
  const res = await api.post("/auth/reset-password", payload);
  return res.data;
}

export async function me() {
  const api = getClient();
  const res = await api.get("/auth/me");
  return res.data.data as { id: string; email: string; name?: string; role: "farmer" | "staff" | "vet" };
}
