<script lang="ts">
  import { getDashboard } from '$lib/api/client';
  import type { AgentSummary } from '$lib/api/types';
  import AgentCard from '../components/agents/AgentCard.svelte';

  let agents: AgentSummary[] = $state([]);
  let loading = $state(true);
  let error: string | null = $state(null);
  let lastRefresh = $state('');
  let filterStatus: 'all' | 'active' | 'warning' | 'error' = $state('all');

  async function fetchData() {
    try {
      error = null;
      const dashboard = await getDashboard();
      agents = dashboard.agents;
      lastRefresh = new Date().toLocaleTimeString('hu-HU');
    } catch (e: unknown) {
      error = e instanceof Error ? e.message : 'Nem elérhető';
    } finally {
      loading = false;
    }
  }

  function getFilteredAgents(): AgentSummary[] {
    if (filterStatus === 'all') return agents;

    return agents.filter((a) => {
      switch (filterStatus) {
        case 'active':
          return a.status === 'active';
        case 'warning':
          return a.status === 'idle' || a.status === 'sleeping';
        case 'error':
          return a.status === 'error' || a.status === 'offline';
        default:
          return true;
      }
    });
  }

  function getStats() {
    const total = agents.length;
    const active = agents.filter((a) => a.status === 'active').length;
    const warning = agents.filter((a) => a.status === 'idle' || a.status === 'sleeping').length;
    const errors = agents.filter((a) => a.status === 'error' || a.status === 'offline').length;
    return { total, active, warning, errors };
  }

  fetchData();
  const interval = setInterval(fetchData, 5000);

  $effect(() => {
    return () => clearInterval(interval);
  });
</script>

<div class="agents-view">
  <div class="agents-header">
    <h2>Agentek</h2>
    <span class="last-refresh" title="Utolsó frissítés">{lastRefresh}</span>
  </div>

  {#if loading && agents.length === 0}
    <div class="loading">Agentek betöltése…</div>
  {:else if error}
    <div class="error-card">
      <span class="error-icon">⚠</span>
      <span>Agent adatok nem elérhetők: {error}</span>
    </div>
  {:else if agents}
    <!-- Stats bar -->
    <div class="stats-bar">
      {#if getStats().total === 0}
        <span class="stat-item">Nincs megjelenített agent</span>
      {:else}
        <span class="stat-item">
          <span class="stat-dot" style="--dot-color: var(--green)"></span>
          {getStats().active} aktív
        </span>
        <span class="stat-item">
          <span class="stat-dot" style="--dot-color: var(--yellow)"></span>
          {getStats().warning} figyelmeztetés
        </span>
        <span class="stat-item">
          <span class="stat-dot" style="--dot-color: var(--danger)"></span>
          {getStats().errors} hiba
        </span>
        <span class="stat-divider">|</span>
        <span class="stat-item">Összesen: {getStats().total}</span>
      {/if}

      <div class="filter-group">
        <button
          class="filter-btn"
          class:active={filterStatus === 'all'}
          onclick={() => filterStatus = 'all'}
        >
          Összes {agents.length}
        </button>
        <button
          class="filter-btn"
          class:active={filterStatus === 'active'}
          onclick={() => filterStatus = 'active'}
        >
          Aktív
        </button>
        <button
          class="filter-btn"
          class:active={filterStatus === 'warning'}
          onclick={() => filterStatus = 'warning'}
        >
          Figyelmeztetés
        </button>
        <button
          class="filter-btn"
          class:active={filterStatus === 'error'}
          onclick={() => filterStatus = 'error'}
        >
          Hiba
        </button>
      </div>
    </div>

    <!-- Agent cards grid -->
    {#if getFilteredAgents().length === 0}
      <div class="empty-state">
        Nincs megjeleníthető agent ebben a szűrőben.
      </div>
    {:else}
      <div class="agents-grid">
        {#each getFilteredAgents() as agent (agent.id)}
          <AgentCard {agent} />
        {/each}
      </div>
    {/if}
  {/if}
</div>

<style>
  .agents-view {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .agents-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .agents-header h2 {
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
    justify-content: space-between;
    gap: 16px;
    padding: 12px 16px;
    background: var(--bg-surface);
    border-radius: 8px;
    border: 1px solid var(--border);
    flex-wrap: wrap;
  }

  .stat-item {
    font-size: 13px;
    color: var(--fg);
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .stat-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--dot-color, var(--fg-dim));
  }

  .stat-divider {
    color: var(--fg-dim);
    font-size: 12px;
  }

  .filter-group {
    display: flex;
    gap: 4px;
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
    border-color: var(--bg-elevated);
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

  .agents-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 12px;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .agents-grid > :global(*) {
    animation: fadeIn 0.3s ease-out;
  }
</style>
