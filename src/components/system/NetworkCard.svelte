<script lang="ts">
  import type { SystemInfo } from '$lib/api/types';

  let { sysInfo }: { sysInfo: SystemInfo } = $props();

  let hostname = $derived(sysInfo.hostname ?? '–');
  let platform = $derived(sysInfo.platform ?? '–');
  let netDown = $derived(sysInfo.netDownMBs ?? 0);
  let netUp = $derived(sysInfo.netUpMBs ?? 0);
</script>

<div class="card">
  <div class="card-header">
    <span class="card-icon">▲</span>
    <span class="card-title">Hálózat</span>
    <span class="card-status">aktív</span>
  </div>
  <div class="card-details">
    <div class="detail-row">
      <span class="detail-label">Hosztnév</span>
      <span class="detail-value">{hostname}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Platform</span>
      <span class="detail-value">{platform}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Letöltés</span>
      <span class="detail-value">{netDown.toFixed(2)} MB/s</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Feltöltés</span>
      <span class="detail-value">{netUp.toFixed(2)} MB/s</span>
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
    color: var(--accent-alt);
  }

  .card-title {
    font-weight: 600;
    color: var(--fg);
  }

  .card-status {
    margin-left: auto;
    font-size: 12px;
    color: var(--accent);
    text-transform: uppercase;
    letter-spacing: 0.5px;
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