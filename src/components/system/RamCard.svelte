<script lang="ts">
  import type { SystemInfo, HealthDetailResponse } from '$lib/api/types';

  let { sysInfo, health }: { sysInfo: SystemInfo; health: HealthDetailResponse | null } = $props();

  let memUsed = $derived(sysInfo.memUsedMB ?? 0);
  let memTotal = $derived(sysInfo.memTotalMB ?? 1);
  let memPercent = $derived(sysInfo.memPercent ?? 0);
  let sysPercent = $derived(health?.systemPercent ?? null);
  let sysUsed = $derived(health?.systemUsedMB ?? null);

  function percentColor(pct: number): string {
    if (pct < 60) return 'var(--accent)';
    if (pct < 85) return 'var(--warning)';
    return 'var(--danger)';
  }

  let barColor = $derived(percentColor(memPercent));
</script>

<div class="card">
  <div class="card-header">
    <span class="card-icon">▮</span>
    <span class="card-title">RAM</span>
    <span class="card-value">{memPercent.toFixed(1)}%</span>
  </div>
  <div class="bar-track">
    <div class="bar-fill" style="width: {memPercent}%; background: {barColor};"></div>
  </div>
  <div class="card-details">
    <div class="detail-row">
      <span class="detail-label">Használt</span>
      <span class="detail-value">{memUsed.toFixed(0)} / {memTotal.toFixed(0)} MB</span>
    </div>
    {#if sysPercent != null && sysUsed != null}
      <div class="detail-row">
        <span class="detail-label">Rendszer</span>
        <span class="detail-value">{sysUsed.toFixed(0)} MB ({sysPercent.toFixed(1)}%)</span>
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
    color: var(--info);
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