import { getClient } from "./client";

export const getWeeklySummary = async (batchId?: string, period?: "weekly" | "monthly") => {
  const client = getClient();
  const params = new URLSearchParams();
  if (batchId) params.set("batchId", batchId);
  if (period) params.set("period", period);
  const qs = params.toString();
  const { data } = await client.get(`/analytics/weekly-summary${qs ? `?${qs}` : ""}`);
  return data.data;
};

export const getReports = async (period: 'weekly' | 'monthly', batchId?: string) => {
  const client = getClient();
  const params = new URLSearchParams();
  params.set("period", period);
  if (batchId) params.set("batchId", batchId);
  const { data } = await client.get(`/analytics/reports?${params.toString()}`);
  return data.data;
};

export const getProductionData = async (batchId?: string) => {
  const client = getClient();
  const params = new URLSearchParams();
  if (batchId) params.set("batchId", batchId);
  const qs = params.toString();
  const { data } = await client.get(`/analytics/production${qs ? `?${qs}` : ""}`);
  return data.data;
};

export const getFCR = async (period: 'weekly' | 'monthly', avgEggWeightKg?: number, batchId?: string) => {
  const client = getClient();
  const params = new URLSearchParams();
  params.set('period', period);
  if (avgEggWeightKg !== undefined) params.set('avgEggWeightKg', String(avgEggWeightKg));
  if (batchId) params.set('batchId', batchId);
  const { data } = await client.get(`/analytics/fcr?${params.toString()}`);
  return data.data;
};

export const getFlockCycleOverview = async (batchId: string) => {
  const client = getClient();
  const { data } = await client.get(`/analytics/flock-overview?batchId=${batchId}`);
  return data.data;
};

export const getBatchKPI = async (batchId: string) => {
  const client = getClient();
  const { data } = await client.get(`/analytics/batch-kpi?batchId=${batchId}`);
  return data.data;
};
