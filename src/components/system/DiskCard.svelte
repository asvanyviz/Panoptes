<script lang="ts">
  import type { SystemInfo } from '$lib/api/types';

  let { sysInfo }: { sysInfo: SystemInfo } = $props();

  let diskFree = $derived(sysInfo.diskFreeGB ?? 0);
  let diskTotal = $derived(sysInfo.diskTotalGB ?? 1);
  let diskUsed = $derived(diskTotal - diskFree);
  let diskPercent = $derived(diskTotal > 0 ? (diskUsed / diskTotal) * 100 : 0);
  let ioRead = $derived(sysInfo.ioReadMBs ?? 0);
  let ioWrite = $derived(sysInfo.ioWriteMBs ?? 0);

  function percentColor(pct: number): string {
    if (pct < 70) return 'var(--accent)';
    if (pct < 90) return 'var(--warning)';
    return 'var(--danger)';
  }

  let barColor = $derived(percentColor(diskPercent));
</script>

<div class="card">
  <div class="card-header">
    <span class="card-icon">▪</span>
    <span class="card-title">Lemez</span>
    <span class="card-value">{diskPercent.toFixed(1)}%</span>
  </div>
  <div class="bar-track">
    <div class="bar-fill" style="width: {diskPercent}%; background: {barColor};"></div>
  </div>
  <div class="card-details">
    <div class="detail-row">
      <span class="detail-label">Szabad</span>
      <span class="detail-value">{diskFree.toFixed(1)} GB</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Összesen</span>
      <span class="detail-value">{diskTotal.toFixed(1)} GB</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Használt</span>
      <span class="detail-value">{diskUsed.toFixed(1)} GB</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">I/O</span>
      <span class="detail-value">↓ {ioRead.toFixed(2)} ↑ {ioWrite.toFixed(2)} MB/s</span>
    </div>
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
    color: var(--ev-orange);
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