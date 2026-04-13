// ================================================================
// Panoptes REST API — TypeScript type definitions
// Mirrors backend.py endpoint return shapes
// ================================================================

// ─── Health ───────────────────────────────────────────────
export interface HealthResponse {
  status: 'ok';
  uptime_seconds: number;
  timestamp: number;
}

// ─── Dashboard /api/status ────────────────────────────────
export interface GatewayInfo {
  model: string;
  status: string;
  connected: boolean;
  url?: string;
}

export interface AgentSummary {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'sleeping' | 'offline' | 'error';
  model: string;
  session: string | null;
  channel: string | null;
  lastActiveAgeMs: number | null;
  currentTask: string | null;
  error?: string;
}

export interface DashboardResponse {
  gateway: GatewayInfo;
  agents: AgentSummary[];
  sessions: { defaults: Record<string, string>; recent: unknown[] };
  channels: unknown[];
  memory: Record<string, unknown>;
  update: Record<string, unknown>;
  timestamp: number;
}

// ─── /api/status/raw ─────────────────────────────────────
export type RawStatusResponse = Record<string, unknown>;

// ─── /api/health ──────────────────────────────────────────
export interface AgentHealthEntry {
  agent: string;
  pid: number | null;
  rssMB: number | null;
  peakRssMB: number | null;
  samples: number;
  trend: 'stable' | 'growing' | 'shrinking';
}

export interface HealthDetailResponse {
  agents: AgentHealthEntry[];
  totalMemoryMB: number | null;
  systemUsedMB: number | null;
  systemPercent: number | null;
  timestamp: number;
}

// ─── /api/system (derived from /api/status/raw) ───────────
export interface SystemInfo {
  hostname: string | null;
  uptime: string | null;
  bootTime: string | null;
  cpuPercent: number | null;
  cpuCores: number;
  loadAvg1: number | null;
  loadAvg5: number | null;
  loadAvg15: number | null;
  memUsedMB: number | null;
  memTotalMB: number | null;
  memPercent: number | null;
  diskFreeGB: number | null;
  diskTotalGB: number | null;
  ioReadMBs: number | null;
  ioWriteMBs: number | null;
  netDownMBs: number | null;
  netUpMBs: number | null;
  platform: string | null;
  pythonVersion: string | null;
}

// ─── /api/sessions ────────────────────────────────────────
export interface SessionEntry {
  agentId: string;
  sessionId: string;
  created: string;
  status: string;
  model?: string;
  channel?: string;
  title?: string;
}

export interface SessionsResponse {
  sessions: SessionEntry[];
}

// ─── /api/agent-detail?id=… ───────────────────────────────
export interface AgentDetailResponse {
  id: string;
  name: string;
  status: string;
  model: string;
  channel: string;
  session: string | null;
  currentTask: string | null;
  costToday: number;
  costTotal: number;
  lastSeen: string | null;
}

// ─── /api/agent-cost?id=… ─────────────────────────────────
export interface AgentCostResponse {
  agentId: string;
  todayCost: number;
}

// ─── /api/requests ────────────────────────────────────────
export interface PanoptesRequest {
  id: string;
  sender: string;
  recipient: string;
  subject: string;
  description: string;
  deadline: string;
  priority: string;
  type: string;
  status: string;
  createdAt: string;
}

export interface RequestsResponse {
  requests: PanoptesRequest[];
}

// ─── /api/open-loops ──────────────────────────────────────
export interface OpenLoop {
  id: string;
  agent: string;
  subject: string;
  description: string;
  priority: string;
  status: string;
  createdAt: string;
}

export interface OpenLoopsResponse {
  loops: OpenLoop[];
}

// ─── /api/live?n=… ────────────────────────────────────────
export interface LiveEntry {
  timestamp: string;
  agent: string;
  session: string;
  event: string;
  message: string;
}

export interface LiveResponse {
  entries: LiveEntry[];
  count: number;
}

// ─── /api/logs?n=… ────────────────────────────────────────
export interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
}

export interface LogsResponse {
  entries: LogEntry[];
  count: number;
}

// ─── /api/heartbeat ───────────────────────────────────────
export interface HeartbeatEntry {
  agent: string;
  status: string;
  lastHeartbeat: string;
  uptime: string;
}

export interface HeartbeatResponse {
  agents: HeartbeatEntry[];
  timestamp: string;
}

// ─── /api/cron ────────────────────────────────────────────
export interface CronJob {
  expression: string;
  description: string;
  enabled: boolean;
  lastRun: string | null;
  nextRun: string | null;
}

export interface CronResponse {
  jobs: CronJob[];
}

// ─── /api/costs ───────────────────────────────────────────
export interface CostArchiveEntry {
  date: string;
  agents: Record<string, number>;
  total: number;
}

export interface CostsResponse {
  history: CostArchiveEntry[];
  total: number;
}

// ─── /api/learnings ───────────────────────────────────────
export interface LearningEntry {
  agent: string;
  text: string;
  timestamp: string;
  source: string;
}

export interface LearningsResponse {
  learnings: LearningEntry[];
}

// ─── /api/insights ────────────────────────────────────────
export interface InsightEntry {
  agent: string;
  summary: string;
  timestamp: string;
  type: string;
}

export interface InsightsResponse {
  insights: InsightEntry[];
}

// ─── /api/agent-comms ─────────────────────────────────────
export interface AgentMessage {
  from: string;
  to: string;
  subject: string;
  body: string;
  status: string;
  timestamp: string;
}

export interface AgentCommsResponse {
  messages: AgentMessage[];
}

// ─── /api/procedures ──────────────────────────────────────
export interface Procedure {
  name: string;
  description: string;
  triggers: string[];
}

export interface ProceduresResponse {
  procedures: Procedure[];
}

// ─── /api/team-overview ───────────────────────────────────
export interface TeamMemberInfo {
  name: string;
  role: string;
  status: string;
  currentTask: string | null;
  costToday: number;
}

export interface TeamOverviewResponse {
  team: string;
  members: TeamMemberInfo[];
}

// ─── /api/blueprint ───────────────────────────────────────
export interface BlueprintResponse {
  name: string;
  description: string;
  teams: string[];
  goals: string[];
  status: Record<string, unknown>;
}

// ─── /api/security ────────────────────────────────────────
export interface SecurityResponse {
  score: number;
  findings: SecurityFinding[];
  recommendations: string[];
}

export interface SecurityFinding {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  title: string;
  description: string;
  status: string;
}

// ─── /api/audits ──────────────────────────────────────────
export interface AuditEntry {
  timestamp: string;
  agent: string;
  action: string;
  target?: string;
  details?: string;
}

export interface AuditsResponse {
  audits: AuditEntry[];
}

// ─── /api/update-status ───────────────────────────────────
export interface UpdateStatusResponse {
  currentVersion: string;
  latestVersion: string | null;
  upToDate: boolean;
}

// ─── Command responses ────────────────────────────────────
export interface CommandResponse {
  ok: boolean;
  stdout: string;
  stderr: string;
}

// ─── Request create/update responses ──────────────────────
export interface RequestUpdateResponse {
  success: boolean;
  error?: string;
}

// ─── Generic API error ────────────────────────────────────
export interface ApiErrorResponse {
  error: string;
}

export function isApiError(response: unknown): response is ApiErrorResponse {
  return typeof response === 'object' && response !== null && 'error' in response;
}
