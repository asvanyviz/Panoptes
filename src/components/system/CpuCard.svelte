<script lang="ts">
  import type { SystemInfo, HealthDetailResponse } from '$lib/api/types';

  let { sysInfo, health }: { sysInfo: SystemInfo; health: HealthDetailResponse | null } = $props();

  let cpuPercent = $derived(sysInfo.cpuPercent ?? 0);
  let cores = $derived(sysInfo.cpuCores ?? 0);
  let loadAvg1 = $derived(sysInfo.loadAvg1 ?? 0);
  let loadAvg5 = $derived(sysInfo.loadAvg5 ?? 0);
  let loadAvg15 = $derived(sysInfo.loadAvg15 ?? 0);

  let totalAgentMem = $derived(
    health ? health.agents.reduce((sum: number, a) => sum + (a.rssMB ?? 0), 0) : null
  );

  function percentColor(pct: number): string {
    if (pct < 50) return 'var(--accent)';
    if (pct < 80) return 'var(--warning)';
    return 'var(--danger)';
  }

  let barColor = $derived(percentColor(cpuPercent));
</script>

<div class="card">
  <div class="card-header">
    <span class="card-icon">⬢</span>
    <span class="card-title">CPU</span>
    <span class="card-value">{cpuPercent.toFixed(1)}%</span>
  </div>
  <div class="bar-track">
    <div class="bar-fill" style="width: {cpuPercent}%; background: {barColor};"></div>
  </div>
  <div class="card-details">
    <div class="detail-row">
      <span class="detail-label">Magok</span>
      <span class="detail-value">{cores}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Load avg</span>
      <span class="detail-value">{loadAvg1.toFixed(2)} / {loadAvg5.toFixed(2)} / {loadAvg15.toFixed(2)}</span>
    </div>
    {#if totalAgentMem != null}
      <div class="detail-row">
        <span class="detail-label">Össz. agent mem</span>
        <span class="detail-value">{totalAgentMem.toFixed(0)} MB</span>
      </div>
    {/if}
  </div>
</div>

<style>
  .card {
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
  }

  .card-icon {
    font-size: 16px;
    color: var(--accent);
  }

  .card-title {
    font-weight: 600;
    color: var(--fg);
  }

  .card-value {
    margin-left: auto;
    font-family: var(--mono);
    font-size: 16px;
    font-weight: 700;
    color: var(--fg);
  }

  .bar-track {
    height: 6px;
    background: var(--bg-elevated);
    border-radius: 3px;
    overflow: hidden;
  }

  .bar-fill {
    height: 100%;
    border-radius: 3px;
    transition: width 0.4s ease, background 0.3s ease;
  }

  .card-details {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin-top: 4px;
  }

  .detail-row {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
  }

  .detail-label {
    color: var(--fg-dim);
  }

  .detail-value {
    color: var(--fg);
    font-family: var(--mono);
    font-size: 12px;
  }
</style>