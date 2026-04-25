import { getClient } from "./client";

export async function startStaff(role: string) {
  const api = getClient();
  const res = await api.post("/staff/start", { role });
  return res.data.data as { staff: any; profile: any };
}

export async function saveBasic(
  id: string,
  payload: {
    firstName: string;
    middleName?: string | null;
    lastName: string;
    dob?: string | null;
    gender?: string | null;
    imageDataUri?: string | null;
  },
) {
  const api = getClient();
  const res = await api.patch(`/staff/${id}/basic`, payload);
  return res.data.data;
}

export async function saveContact(id: string, payload: any) {
  const api = getClient();
  const res = await api.patch(`/staff/${id}/contact`, payload);
  return res.data.data;
}

export async function saveSecurity(id: string, nin: string) {
  const api = getClient();
  const res = await api.patch(`/staff/${id}/security`, { nin });
  return res.data.data;
}

export async function saveGuarantor(
  id: string,
  payload: { firstName: string; lastName: string; phone: string },
) {
  const api = getClient();
  const res = await api.patch(`/staff/${id}/guarantor`, payload);
  return res.data.data;
}

export async function saveNextOfKin(
  id: string,
  payload: { firstName: string; lastName: string; phone: string },
) {
  const api = getClient();
  const res = await api.patch(`/staff/${id}/nok`, payload);
  return res.data.data;
}

export async function saveDocument(
  id: string,
  payload: {
    docType: string;
    frontDataUri?: string | null;
    backDataUri?: string | null;
  },
) {
  const api = getClient();
  const res = await api.post(`/staff/${id}/document`, payload);
  return res.data.data;
}

export async function completeStaff(id: string) {
  const api = getClient();
  const res = await api.post(`/staff/${id}/complete`);
  return res.data.data;
}
