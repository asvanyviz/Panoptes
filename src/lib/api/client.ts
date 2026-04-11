/**
 * Panoptes API client — typed fetch wrapper
 *
 * Usage:
 *   import { api } from '$lib/api/client';
 *   const dashboard = await api.getDashboard();
 */

import * as T from './types';

// ─── Configuration ────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_PANOPTES_API_URL ?? '/api';

// ─── Core fetch helper ────────────────────────────────────
async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });

  if (!res.ok) {
    throw new ApiError(`HTTP ${res.status} — ${res.statusText}`, path);
  }

  const data = await res.json();
  if (T.isApiError(data)) {
    throw new ApiError(data.error, path);
  }
  return data as T;
}

// ─── Custom error class ──────────────────────────────────
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly endpoint: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ─── Health & Status ─────────────────────────────────────
export function getHealth() {
  return fetchJson<T.HealthResponse>('/health');
}

export function getDashboard() {
  return fetchJson<T.DashboardResponse>('/status');
}

export function getRawStatus() {
  return fetchJson<T.RawStatusResponse>('/status/raw');
}

export function getSystemInfo() {
  return fetchJson<T.SystemInfo>('/system');
}

export function getUpdateStatus() {
  return fetchJson<T.UpdateStatusResponse>('/update-status');
}

// ─── Agents ──────────────────────────────────────────────
export function getAgentDetail(agentId: string) {
  return fetchJson<T.AgentDetailResponse>(`/agent-detail?id=${encodeURIComponent(agentId)}`);
}

export function getAgentCost(agentId: string) {
  return fetchJson<T.AgentCostResponse>(`/agent-cost?id=${encodeURIComponent(agentId)}`);
}

// ─── Sessions ────────────────────────────────────────────
export function getSessions() {
  return fetchJson<T.SessionsResponse>('/sessions');
}

// ─── Requests & Open Loops ──────────────────────────────
export function getRequests() {
  return fetchJson<T.RequestsResponse>('/requests');
}

export function updateRequest(requestId: string, newStatus: string) {
  return fetchJson<T.RequestUpdateResponse>('/requests/update', {
    method: 'POST',
    body: JSON.stringify({ requestId, newStatus }),
  });
}

export function createRequest(req: {
  sender: string;
  recipient: string;
  subject: string;
  description?: string;
  deadline: string;
  priority?: string;
  type?: string;
}) {
  return fetchJson<T.RequestUpdateResponse>('/requests/create', {
    method: 'POST',
    body: JSON.stringify(req),
  });
}

export function getOpenLoops() {
  return fetchJson<T.OpenLoopsResponse>('/open-loops');
}

// ─── Activity ────────────────────────────────────────────
export function getLive(limit = 50) {
  return fetchJson<T.LiveResponse>(`/live?n=${limit}`);
}

export function getLogs(limit = 100) {
  return fetchJson<T.LogsResponse>(`/logs?n=${limit}`);
}

export function getHeartbeat() {
  return fetchJson<T.HeartbeatResponse>('/heartbeat');
}

export function getMemoryHealth() {
  return fetchJson<T.HealthDetailResponse>('/memory');
}

// ─── Admin / Cron ────────────────────────────────────────
export function getCron() {
  return fetchJson<T.CronResponse>('/cron');
}

// ─── Costs ───────────────────────────────────────────────
export function getCosts() {
  return fetchJson<T.CostsResponse>('/costs');
}

// ─── Knowledge ───────────────────────────────────────────
export function getLearnings() {
  return fetchJson<T.LearningsResponse>('/learnings');
}

export function getInsights() {
  return fetchJson<T.InsightsResponse>('/insights');
}

// ─── Communication ───────────────────────────────────────
export function getAgentComms() {
  return fetchJson<T.AgentCommsResponse>('/agent-comms');
}

// ─── Procedures ──────────────────────────────────────────
export function getProcedures() {
  return fetchJson<T.ProceduresResponse>('/procedures');
}

// ─── Team & Blueprint ────────────────────────────────────
export function getTeamOverview() {
  return fetchJson<T.TeamOverviewResponse>('/team-overview');
}

export function getBlueprint() {
  return fetchJson<T.BlueprintResponse>('/blueprint');
}

// ─── Security ────────────────────────────────────────────
export function getSecurity() {
  return fetchJson<T.SecurityResponse>('/security');
}

// ─── Audits ──────────────────────────────────────────────
export function getAudits() {
  return fetchJson<T.AuditsResponse>('/audits');
}

// ─── Commands ────────────────────────────────────────────
export function cmdGatewayRestart() {
  return fetchJson<T.CommandResponse>('/cmd/gateway-restart', { method: 'POST' });
}

export function cmdSessionCleanup() {
  return fetchJson<T.CommandResponse>('/cmd/session-cleanup', { method: 'POST' });
}

export function cmdBackendRestart() {
  return fetchJson<T.CommandResponse>('/cmd/backend-restart', { method: 'POST' });
}
