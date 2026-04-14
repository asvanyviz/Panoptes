<script lang="ts">
  import { getSessions } from '$lib/api/client';
  import type { SessionEntry } from '$lib/api/types';

  // Extended session type matching actual backend response
  interface SessionDetail {
    agentId: string;
    key: string;
    kind: string;
    sessionId: string;
    updatedAt: number;
    ageMs: number;
    abortedLastRun: boolean;
    systemSent: boolean;
    model: string;
    contextTokens: number;
    inputTokens: number;
    outputTokens: number;
    cacheRead: number;
    cacheWrite: number;
    totalTokens: number;
    remainingTokens: number;
    percentUsed: number;
    totalTokensFresh: boolean;
    isLocked: boolean;
    lockAgeS: number;
  }

  interface SessionApiResponse {
    sessions: SessionDetail[];
    agentSummary: { agentId: string; sessionCount: number; totalTokens: number }[];
    ageDist: Record<string, number>;
    locked: SessionDetail[];
    total: number;
    defaults: Record<string, unknown>;
    cleanupInfo: unknown;
    error?: string;
  }

  const BASE_URL = import.meta.env.VITE_PANOPTES_API_URL ?? '/api';

  let sessions: SessionDetail[] = $state([]);
  let agentSummary: { agentId: string; sessionCount: number; totalTokens: number }[] = $state([]);
  let ageDist: Record<string, number> = $state({});
  let lockedSessions: SessionDetail[] = $state([]);
  let totalCount = $state(0);
  let loading = $state(true);
  let error: string | null = $state(null);
  let lastRefresh = $state('');

  /** Selected session for detail panel */
  let selectedSession: SessionDetail | null = $state(null);

  /** Filter by agent */
  let selectedAgent = $state('');

  async function fetchData() {
    try {
      error = null;
      const res = await fetch(`${BASE_URL}/sessions`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: SessionApiResponse = await res.json();
      if (data.error) {
        error = data.error;
      } else {
        sessions = data.sessions;
        agentSummary = data.agentSummary;
        ageDist = data.ageDist;
        lockedSessions = data.locked;
        totalCount = data.total;
      }
      lastRefresh = new Date().toLocaleTimeString('hu-HU');
    } catch (e: unknown) {
      error = e instanceof Error ? e.message : 'Nem elérhető';
    } finally {
      loading = false;
    }
  }

  function formatAge(ageMs: number): string {
    const s = Math.floor(ageMs / 1000);
    if (s < 60) return `${s}mp`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m} perc`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}ó ${m % 60}p`;
    const d = Math.floor(h / 24);
    return `${d}nap ${h % 24}ó`;
  }

  function formatTokens(n: number): string {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return `${n}`;
  }

  function shortModel(model: string): string {
    const parts = model.split('/');
    return parts.length > 1 ? parts[parts.length - 1] : model;
  }

  function getFilteredSessions(): SessionDetail[] {
    if (!selectedAgent) return sessions;
    return sessions.filter((s) => s.agentId === selectedAgent);
  }

  function getUniqueAgents(): string[] {
    return [...new Set(sessions.map((s) => s.agentId))].sort();
  }

  fetchData();
  const interval = setInterval(fetchData, 10000);

  $effect(() => {
    return () => clearInterval(interval);
  });
</script>

<div class="sessions-view">
  <div class="sessions-header">
    <h2>Sessions</h2>
    <span class="last-refresh" title="Utolsó frissítés">{lastRefresh}</span>
  </div>

  {#if loading && sessions.length === 0}
    <div class="loading">Sessions betöltése…</div>
  {:else if error}
    <div class="error-card">
      <span class="error-icon">⚠</span>
      <span>Session adatok nem elérhetők: {error}</span>
    </div>
  {:else}
    <!-- Stats bar -->
    <div class="stats-bar">
      <span class="stat-item">Összesen: {totalCount} session</span>
      {#if agentSummary.length > 0}
        <span class="stat-divider">|</span>
        {#each agentSummary as ag}
          <span class="stat-item mono">{ag.agentId}: {ag.sessionCount}</span>
        {/each}
      {/if}
      {#if ageDist.lt1h}
        <span class="stat-divider">|</span>
        <span class="stat-item">1 órán belül: {ageDist.lt1h}</span>
      {/if}
      {#if ageDist.gt7d}
        <span class="stat-item" style="color: var(--danger)">7+ nap: {ageDist.gt7d}</span>
      {/if}
    </div>

    <!-- Locked sessions alert -->
    {#if lockedSessions.length > 0}
      <div class="locked-alert">
        <span class="lock-icon">🔒</span>
        <span>{lockedSessions.length} zárolt session (előfordulhat, hogy beragadt):</span>
        <div class="locked-list">
          {#each lockedSessions as ls}
            <span class="locked-item mono">
              {ls.agentId} / {ls.key} — zár: {
                ls.lockAgeS >= 3600
                  ? `${Math.floor(ls.lockAgeS / 3600)}ó`
                  : `${Math.floor(ls.lockAgeS / 60)}p`
              }
            </span>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Agent filter -->
    <div class="filter-bar">
      <button
        class="filter-btn"
        class:active={!selectedAgent}
        onclick={() => selectedAgent = ''}
      >
        Összes
      </button>
      {#each getUniqueAgents() as agent}
        <button
          class="filter-btn"
          class:active={selectedAgent === agent}
          onclick={() => selectedAgent = selectedAgent === agent ? '' : agent}
        >
          {agent}
        </button>
      {/each}
    </div>

    <!-- Sessions table -->
    {#if getFilteredSessions().length === 0}
      <div class="empty-state">Nincs megjeleníthető session ebben a szűrőben.</div>
    {:else}
      <div class="sessions-table-wrapper">
        <div class="sessions-table">
          <div class="table-header">
            <span class="col-agent">Agent</span>
            <span class="col-key">Kulcs</span>
            <span class="col-kind">Típus</span>
            <span class="col-model">Modell</span>
            <span class="col-age">Kor</span>
            <span class="col-tokens">Tokenek</span>
            <span class="col-usage">Használat</span>
            <span class="col-status">Státusz</span>
          </div>
          {#each getFilteredSessions() as session (session.sessionId + session.key)}
            <div
              class="table-row"
              class:selected={selectedSession === session}
              class:locked={session.isLocked}
              onclick={() => selectedSession = selectedSession === session ? null : session}
            >
              <span class="col-agent mono">{session.agentId}</span>
              <span class="col-key mono">{session.key}</span>
              <span class="col-kind">{session.kind}</span>
              <span class="col-model mono" title={session.model}>{shortModel(session.model)}</span>
              <span class="col-age">{formatAge(session.ageMs)}</span>
              <span class="col-tokens mono">{formatTokens(session.totalTokens)}</span>
              <span class="col-usage">
                <div class="usage-bar">
                  <div class="usage-fill" style="width: {session.percentUsed}%"></div>
                </div>
                <span class="usage-pct">{session.percentUsed.toFixed(0)}%</span>
              </span>
              <span class="col-status">
                {#if session.isLocked}
                  <span class="status-badge status-locked">🔒 Locked</span>
                {:else if session.abortedLastRun}
                  <span class="status-badge status-aborted">⚠ Aborted</span>
                {:else}
                  <span class="status-badge status-ok">● OK</span>
                {/if}
              </span>
            </div>

            <!-- Detail panel for selected session -->
            {#if selectedSession === session}
              <div class="detail-panel">
                <div class="detail-row">
                  <span class="detail-label">Session ID</span>
                  <span class="detail-value mono">{session.sessionId}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Agent</span>
                  <span class="detail-value mono">{session.agentId}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Modell</span>
                  <span class="detail-value mono">{session.model}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Context tokenek</span>
                  <span class="detail-value mono">{formatTokens(session.contextTokens)}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Bemenet tokenek</span>
                  <span class="detail-value mono">{formatTokens(session.inputTokens)}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Kimenet tokenek</span>
                  <span class="detail-value mono">{formatTokens(session.outputTokens)}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Cache read</span>
                  <span class="detail-value mono">{formatTokens(session.cacheRead)}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Cache write</span>
                  <span class="detail-value mono">{formatTokens(session.cacheWrite)}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Hátralévő tokenek</span>
                  <span class="detail-value mono">{formatTokens(session.remainingTokens)}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Kor</span>
                  <span class="detail-value">{formatAge(session.ageMs)}</span>
                </div>
                {#if session.isLocked}
                  <div class="detail-row warning">
                    <span class="detail-label">Zárolva</span>
                    <span class="detail-value" style="color: var(--warning)">
                      🔒 {session.lockAgeS >= 3600 ? `${Math.floor(session.lockAgeS / 3600)} órája` : `${Math.floor(session.lockAgeS / 60)} perce`}
                    </span>
                  </div>
                {/if}
                {#if session.abortedLastRun}
                  <div class="detail-row warning">
                    <span class="detail-label">Megszakítva</span>
                    <span class="detail-value" style="color: var(--danger)">⚠ Aborted last run</span>
                  </div>
                {/if}
              </div>
            {/if}
          {/each}
        </div>
      </div>
    {/if}
  {/if}
</div>

<style>
  .sessions-view {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .sessions-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .sessions-header h2 {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
  }

  .last-refresh {
    font-size: 12px;
    color: var(--fg-dim);
    font-family: var(--mono);
  }

  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    color: var(--fg-dim);
    font-size: 14px;
  }

  .error-card {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 20px;
    background: rgba(230, 126, 128, 0.08);
    border: 1px solid rgba(230, 126, 128, 0.25);
    border-radius: 8px;
    color: var(--danger);
    font-size: 14px;
  }

  .error-icon {
    font-size: 20px;
  }

  .stats-bar {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: var(--bg-surface);
    border-radius: 8px;
    border: 1px solid var(--border);
    overflow-x: auto;
    font-size: 13px;
  }

  .stat-item {
    color: var(--fg);
    white-space: nowrap;
  }

  .stat-divider {
    color: var(--fg-dim);
  }

  .mono {
    font-family: var(--mono);
    font-size: 11px;
  }

  .locked-alert {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 12px 16px;
    background: rgba(235, 188, 127, 0.08);
    border: 1px solid rgba(235, 188, 127, 0.25);
    border-radius: 8px;
    font-size: 13px;
    flex-wrap: wrap;
  }

  .lock-icon {
    font-size: 16px;
  }

  .locked-list {
    width: 100%;
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 4px;
  }

  .locked-item {
    font-size: 11px;
    background: var(--bg-elevated);
    padding: 2px 8px;
    border-radius: 4px;
  }

  .filter-bar {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
  }

  .filter-btn {
    padding: 4px 12px;
    font-size: 12px;
    font-family: var(--sans);
    border: 1px solid var(--border);
    border-radius: 4px;
    background: var(--bg-surface);
    color: var(--fg-dim);
    cursor: pointer;
    transition: all 0.15s;
  }

  .filter-btn:hover {
    color: var(--fg);
    background: var(--bg-elevated);
  }

  .filter-btn.active {
    color: var(--accent);
    border-color: var(--accent);
    background: rgba(167, 192, 128, 0.1);
  }

  .empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
    color: var(--fg-dim);
    font-size: 14px;
    font-style: italic;
  }

  .sessions-table-wrapper {
    max-height: 60vh;
    overflow-y: auto;
    border-radius: 8px;
  }

  .sessions-table {
    display: flex;
    flex-direction: column;
  }

  .table-header,
  .table-row {
    display: grid;
    grid-template-columns: 1fr 1.2fr 0.5fr 1.2fr 0.6fr 0.6fr 0.8fr 0.7fr;
    padding: 8px 12px;
    font-size: 12px;
    align-items: center;
  }

  .table-header {
    background: var(--bg-elevated);
    color: var(--fg-dim);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-size: 11px;
    position: sticky;
    top: 0;
    z-index: 1;
    border-bottom: 2px solid var(--border);
  }

  .table-row {
    border-bottom: 1px solid var(--border);
    cursor: pointer;
    transition: background 0.1s;
  }

  .table-row:last-child {
    border-bottom: none;
  }

  .table-row:hover {
    background: var(--bg-surface);
  }

  .table-row.selected {
    background: var(--bg-elevated);
    border-left: 3px solid var(--accent-alt);
  }

  .table-row.locked {
    background: rgba(235, 188, 127, 0.04);
  }

  .usage-bar {
    width: 60px;
    height: 4px;
    background: var(--bg-dim);
    border-radius: 2px;
    overflow: hidden;
  }

  .usage-fill {
    height: 100%;
    background: var(--accent);
    transition: width 0.3s;
  }

  .usage-pct {
    font-size: 10px;
    color: var(--fg-dim);
    margin-left: 4px;
  }

  .status-badge {
    font-size: 11px;
    padding: 2px 8px;
    border-radius: 4px;
  }

  .status-ok {
    color: var(--green);
    background: rgba(167, 192, 128, 0.1);
  }

  .status-locked {
    color: var(--warning);
    background: rgba(219, 188, 127, 0.1);
  }

  .status-aborted {
    color: var(--danger);
    background: rgba(230, 126, 128, 0.1);
  }

  .detail-panel {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 8px;
    padding: 16px 20px;
    background: var(--bg-dim);
    border-bottom: 1px solid var(--border);
  }

  .detail-row {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 4px 8px;
    font-size: 12px;
  }

  .detail-row.warning {
    background: rgba(219, 188, 127, 0.05);
    border-radius: 4px;
    padding: 8px;
  }

  .detail-label {
    color: var(--fg-dim);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }

  .detail-value {
    color: var(--fg);
    word-break: break-all;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .sessions-table > :global(*) {
    animation: fadeIn 0.3s ease-out;
  }
</style>
