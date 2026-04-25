import { getClient } from "./client";

export type CreateFarmhousePayload = {
  name: string;
  state: string;
  city: string;
  address: string;
  capacity: number;
  system: string;
  water: string;
  ventilator: boolean;
  imageUrl?: string | null;
};

export async function createFarmhouse(data: CreateFarmhousePayload) {
  const api = getClient();
  const res = await api.post("/farmhouse", data);
  return res.data.data as any;
}
