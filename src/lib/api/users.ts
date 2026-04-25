import { getClient } from "./client";

export async function saveNIN(nin: string) {
  const api = getClient();
  const res = await api.post("/users/nin", { nin });
  return res.data;
}

export type VetBusinessPayload = {
  businessName: string;
  profession: string;
  experienceYears: number;
  location: string;
  about?: string;
  profileImage?: string | null;
  gallery?: any;
  latitude?: number;
  longitude?: number;
};

export async function saveVetBusiness(data: VetBusinessPayload) {
  const api = getClient();
  const res = await api.post("/users/vet-business", data);
  return res.data;
}

export async function saveVCN(vcn: string) {
  const api = getClient();
  const res = await api.post("/users/vcn", { vcn });
  return res.data;
}
