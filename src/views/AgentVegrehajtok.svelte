<script lang="ts">
  import { getDashboard, getAgentDetail, getAgentCost } from '$lib/api/client';

  interface AgentSummary {
    id: string;
    name: string;
    status: string;
    model: string;
    sessionsCount: number;
    currentTask: string | null;
    lastActiveAgeMs: number | null;
    tokenUsage?: { total?: number };
  }

  interface AgentDetail {
    detail: { costToday: number; costTotal: number; lastSeen: string | null } | null;
  }

  // Synergy categorization from SYNERGY.md
  const EXECUTOR_IDS = ['aegis', 'argos', 'daimon', 'mnemon', 'rootbeard', 'theoros'];
  const SPECIALIST_IDS = ['aletheia', 'bundas', 'flytrap', 'hartmann', 'metis', 'pali', 'soteria', 'squidward'];

  let executors: AgentSummary[] = $state([]);
  let loading = $state(true);
  let error: string | null = $state(null);
  let lastRefresh = $state('');
  let expandedId = $state<string | null>(null);
  let costs: Record<string, { today: number; total: number }> = $state({});

  async function fetchData() {
    try {
      error = null;
      const d = await getDashboard();
      const all = (d as { agents?: AgentSummary[] }).agents || [];
      executors = all.filter(a => EXECUTOR_IDS.includes(a.id));

      for (const a of executors) {
        try {
          const costData = await getAgentCost(a.id) as { todayCost?: number };
          costs = { ...costs, [a.id]: { today: costData.todayCost || 0, total: 0 } };
        } catch { /* ignore cost failures */ }
      }

      lastRefresh = new Date().toLocaleTimeString('hu-HU');
    } catch (e: unknown) {
      error = e instanceof Error ? e.message : 'Nem elérhető';
    } finally {
      loading = false;
    }
  }

  function formatAge(ageMs: number | null): string {
    if (ageMs === null || ageMs < 0) return '–';
    const s = Math.floor(ageMs / 1000);
    if (s < 60) return `${s}mp`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}p`;
    const h = Math.floor(m / 60);
    return `${h}ó`;
  }

  function shortModel(model: string): string {
    const parts = model.split('/');
    return parts.length > 1 ? parts[parts.length - 1] : model;
  }

  function statusColor(s: string): string {
    if (s === 'active') return 'var(--green)';
    if (s === 'idle' || s === 'sleeping') return 'var(--yellow)';
    return 'var(--danger)';
  }

  fetchData();
  setInterval(fetchData, 5000);
</script>

<div class="view">
  <h2>Végrehajtók</h2>
  <p class="subtitle">Executor Pool — SYNERGY.md · {executors.length} végrehajtó</p>

  {#if loading && executors.length === 0}
    <div class="loading">Betöltés…</div>
  {:else if error}
    <div class="error-card">⚠ {error}</div>
  {:else if executors.length === 0}
    <p class="meta">Nem található végrehajtó agent.</p>
  {:else}
    <div class="agent-list">
      {#each executors as agent (agent.id)}
        <div class="agent-card" class:expanded={expandedId === agent.id}
             style="--status-color: {statusColor(agent.status)}">
          <div class="agent-header" onclick={() => expandedId = expandedId === agent.id ? null : agent.id}>
            <span class="status-dot"></span>
            <span class="name">{agent.name}</span>
            <span class="status-label" style="color: {statusColor(agent.status)}">{agent.status}</span>
            <span class="model mono">{shortModel(agent.model)}</span>
          </div>

          {#if expandedId === agent.id}
            <div class="agent-detail">
              <div class="detail-row"><span class="label">ID</span><span class="mono">{agent.id}</span></div>
              <div class="detail-row"><span class="label">Utolsó aktív</span><span>{formatAge(agent.lastActiveAgeMs)}</span></div>
              <div class="detail-row"><span class="label">Sessionk</span><span>{agent.sessionsCount}</span></div>
              {#if agent.currentTask}
                <div class="detail-row"><span class="label">Feladat</span><span>{agent.currentTask}</span></div>
              {/if}
              {#if costs[agent.id]?.today}
                <div class="detail-row"><span class="label">Ma költség</span><span class="mono">${costs[agent.id].today.toFixed(2)}</span></div>
              {/if}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .view { display: flex; flex-direction: column; gap: 12px; }
  .subtitle { font-size: 12px; color: var(--fg-dim); margin: 0; }
  .loading { color: var(--fg-dim); padding: 40px; text-align: center; }
  .error-card { background: rgba(230,126,128,0.08); border: 1px solid rgba(230,126,128,0.25); border-radius: 8px; padding: 12px; color: var(--danger); }
  .agent-list { display: flex; flex-direction: column; gap: 6px; }
  .agent-card { background: var(--bg-surface); border: 1px solid var(--border); border-radius: 8px; overflow: hidden; transition: border-color 0.15s; }
  .agent-card.expanded { border-color: var(--accent-alt); }
  .agent-header { display: flex; align-items: center; gap: 10px; padding: 12px 16px; cursor: pointer; }
  .agent-header:hover { background: var(--bg-elevated); }
  .status-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--status-color, var(--fg-dim)); flex-shrink: 0; }
  .name { font-weight: 600; font-size: 14px; min-width: 80px; }
  .status-label { font-size: 12px; text-transform: capitalize; }
  .model { font-size: 12px; color: var(--fg-dim); }
  .agent-detail { padding: 12px 16px 16px 34px; background: var(--bg-dim); display: flex; flex-direction: column; gap: 6px; }
  .detail-row { display: flex; gap: 10px; font-size: 12px; }
  .label { color: var(--fg-dim); min-width: 100px; }
  .mono { font-family: var(--mono); font-size: 11px; }
</style>
