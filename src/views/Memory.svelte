<script lang="ts">
  import { getMemoryHealth, getInsights, getLearnings } from '$lib/api/client';
  import type { HealthDetailResponse, InsightsResponse, LearningsResponse } from '$lib/api/types';

  let healthData: HealthDetailResponse | null = $state(null);
  let insightsData = $state<InsightsResponse | null>(null);
  let learningsData = $state<LearningsResponse | null>(null);
  let loading = $state(true);
  let error: string | null = $state(null);
  let lastRefresh = $state('');

  /** Which tab is active */
  let activeTab: 'health' | 'insights' | 'learnings' = $state('health');

  async function fetchData() {
    try {
      error = null;
      const [health, insights, learnings] = await Promise.all([
        getMemoryHealth(),
        getInsights(),
        getLearnings(),
      ]);
      healthData = health;
      insightsData = insights;
      learningsData = learnings;
      lastRefresh = new Date().toLocaleTimeString('hu-HU');
    } catch (e: unknown) {
      error = e instanceof Error ? e.message : 'Nem elérhető';
    } finally {
      loading = false;
    }
  }

  function formatSize(mb: number | null): string {
    if (mb === null) return '–';
    if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
    return `${mb.toFixed(0)} MB`;
  }

  function trendIcon(trend: string): string {
    switch (trend) {
      case 'growing':
        return '🔺';
      case 'shrinking':
        return '🔻';
      default:
        return '⚖️';
    }
  }

  function trendColor(trend: string): string {
    switch (trend) {
      case 'growing':
        return 'var(--danger)';
      case 'shrinking':
        return 'var(--info)';
      default:
        return 'var(--fg-dim)';
    }
  }

  function timeAgo(timestamp: string): string {
    try {
      const now = new Date();
      const then = new Date(timestamp);
      const diffMs = now.getTime() - then.getTime();
      const mins = Math.floor(diffMs / 60000);
      if (mins < 1) return 'Most';
      if (mins < 60) return `${mins} perce`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `${hours} órája`;
      const days = Math.floor(hours / 24);
      return `${days} napja`;
    } catch {
      return timestamp;
    }
  }

  fetchData();
  const interval = setInterval(fetchData, 10000);

  $effect(() => {
    return () => clearInterval(interval);
  });
</script>

<div class="memory-view">
  <div class="memory-header">
    <h2>Memória &amp; Tudás</h2>
    <span class="last-refresh" title="Utolsó frissítés">{lastRefresh}</span>
  </div>

  {#if loading && !healthData}
    <div class="loading">Memória adatok betöltése…</div>
  {:else if error}
    <div class="error-card">
      <span class="error-icon">⚠</span>
      <span>Memória adatok nem elérhetők: {error}</span>
    </div>
  {:else}
    <!-- Tab bar -->
    <div class="tab-bar">
      <button
        class="tab-btn"
        class:active={activeTab === 'health'}
        onclick={() => activeTab = 'health'}
      >
        🩺 Health
      </button>
      <button
        class="tab-btn"
        class:active={activeTab === 'insights'}
        onclick={() => activeTab = 'insights'}
      >
        💡 Insights
      </button>
      <button
        class="tab-btn"
        class:active={activeTab === 'learnings'}
        onclick={() => activeTab = 'learnings'}
      >
        📚 Learnings
      </button>
    </div>

    <!-- Health tab -->
    {#if activeTab === 'health' && healthData}
      <div class="tab-content">
        <!-- System summary -->
        <div class="system-summary">
          <div class="summary-card">
            <span class="summary-label">Összes memória</span>
            <span class="summary-value">{formatSize(healthData.totalMemoryMB)}</span>
          </div>
          <div class="summary-card">
            <span class="summary-label">Rendszer használt</span>
            <span class="summary-value">{formatSize(healthData.systemUsedMB)}</span>
          </div>
          <div class="summary-card">
            <span class="summary-label">Rendszer %</span>
            <span class="summary-value">
              {healthData.systemPercent !== null ? `${healthData.systemPercent.toFixed(1)}%` : '–'}
            </span>
          </div>
          <div class="summary-card">
            <span class="summary-label">Agentek</span>
            <span class="summary-value">{healthData.agents?.length ?? 0}</span>
          </div>
        </div>

        <!-- Agent memory table -->
        {#if healthData.agents && healthData.agents.length > 0}
          <div class="agent-memory-table">
            <div class="table-header">
              <span class="col-agent">Agent</span>
              <span class="col-rss">RSS</span>
              <span class="col-peak">Peak</span>
              <span class="col-samples">Minták</span>
              <span class="col-trend">Trend</span>
            </div>
            {#each healthData.agents as agent}
              <div class="table-row">
                <span class="col-agent mono">{agent.agent}</span>
                <span class="col-rss">
                  {formatSize(agent.rssMB)}
                  {#if agent.rssMB === null}<span class="na">N/A</span>{/if}
                </span>
                <span class="col-peak">
                  {formatSize(agent.peakRssMB)}
                  {#if agent.peakRssMB === null}<span class="na">N/A</span>{/if}
                </span>
                <span class="col-samples">{agent.samples}</span>
                <span class="col-trend trend" style="color: {trendColor(agent.trend)}">
                  {trendIcon(agent.trend)} {agent.trend}
                </span>
              </div>
            {/each}
          </div>
        {:else}
          <div class="empty-state">Nincs memória adat elérhető.</div>
        {/if}
      </div>

    <!-- Insights tab -->
    {:else if activeTab === 'insights' && insightsData}
      <div class="tab-content">
        {#if insightsData.insights && insightsData.insights.length > 0}
          <div class="cards-list">
            {#each insightsData.insights as insight}
              <div class="insight-card">
                <div class="insight-header">
                  <span class="insight-agent mono">{insight.agent}</span>
                  <span class="insight-time">{timeAgo(insight.timestamp)}</span>
                </div>
                <div class="insight-type">{insight.type}</div>
                <div class="insight-text">{insight.summary}</div>
              </div>
            {/each}
          </div>
        {:else}
          <div class="empty-state">Nincsenek elérhető insightok.</div>
        {/if}
      </div>

    <!-- Learnings tab -->
    {:else if activeTab === 'learnings' && learningsData}
      <div class="tab-content">
        {#if learningsData.learnings && learningsData.learnings.length > 0}
          <div class="cards-list">
            {#each learningsData.learnings as learning}
              <div class="learning-card">
                <div class="learning-header">
                  <span class="learning-agent mono">{learning.agent}</span>
                  <span class="learning-time">{timeAgo(learning.timestamp)}</span>
                </div>
                <div class="learning-source">
                  Forrás: <code>{learning.source}</code>
                </div>
                <div class="learning-text">{learning.text}</div>
              </div>
            {/each}
          </div>
        {:else}
          <div class="empty-state">Nincsenek elérhető learnings.</div>
        {/if}
      </div>

    {/if}
  {/if}
</div>

<style>
  .memory-view {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .memory-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .memory-header h2 {
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

  /* Tab bar */
  .tab-bar {
    display: flex;
    gap: 4px;
    padding-bottom: 4px;
  }

  .tab-btn {
    padding: 6px 16px;
    font-size: 13px;
    font-family: var(--sans);
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--bg-surface);
    color: var(--fg-dim);
    cursor: pointer;
    transition: all 0.15s;
  }

  .tab-btn:hover {
    color: var(--fg);
    background: var(--bg-elevated);
  }

  .tab-btn.active {
    color: var(--accent);
    border-color: var(--accent);
    background: rgba(167, 192, 128, 0.1);
  }

  .tab-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  /* Summary cards */
  .system-summary {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 10px;
  }

  .summary-card {
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 12px 16px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .summary-label {
    font-size: 11px;
    color: var(--fg-dim);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .summary-value {
    font-size: 20px;
    font-weight: 600;
    font-family: var(--mono);
  }

  /* Agent memory table */
  .agent-memory-table {
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
  }

  .table-header,
  .table-row {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr 0.8fr 0.5fr 1.2fr;
    padding: 10px 16px;
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
    border-bottom: 2px solid var(--border);
  }

  .table-row {
    border-bottom: 1px solid var(--border);
    transition: background 0.1s;
  }

  .table-row:last-child {
    border-bottom: none;
  }

  .table-row:hover {
    background: var(--bg-elevated);
  }

  .mono {
    font-family: var(--mono);
    font-size: 11px;
  }

  .na {
    color: var(--fg-dim);
    font-size: 10px;
  }

  .trend {
    text-transform: capitalize;
  }

  /* Cards list */
  .cards-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .insight-card,
  .learning-card {
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 14px 16px;
  }

  .insight-header,
  .learning-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;
  }

  .insight-agent,
  .learning-agent {
    font-size: 12px;
    font-weight: 600;
    color: var(--accent-alt);
  }

  .insight-time,
  .learning-time {
    font-size: 11px;
    color: var(--fg-dim);
  }

  .insight-type {
    font-size: 11px;
    color: var(--warning);
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }

  .insight-text,
  .learning-text {
    font-size: 13px;
    line-height: 1.6;
    color: var(--fg);
  }

  .learning-source {
    font-size: 11px;
    color: var(--fg-dim);
    margin-bottom: 8px;
  }

  .learning-source code {
    background: var(--bg-elevated);
    padding: 1px 5px;
    border-radius: 3px;
    font-size: 10px;
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

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .tab-content > :global(*) {
    animation: fadeIn 0.3s ease-out;
  }
</style>
