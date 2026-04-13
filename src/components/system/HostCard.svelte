<script lang="ts">
  import type { SystemInfo } from '$lib/api/types';

  let { sysInfo, uptime }: { sysInfo: SystemInfo; uptime: string } = $props();

  let hostname = $derived(sysInfo.hostname ?? '–');
  let platform = $derived(sysInfo.platform ?? '–');
  let python = $derived(sysInfo.pythonVersion ?? '–');
  let bootTime = $derived(sysInfo.bootTime ?? '–');
</script>

<div class="card host-card">
  <div class="card-header">
    <span class="card-icon">⌂</span>
    <span class="card-title">{hostname}</span>
  </div>
  <div class="card-details">
    <div class="detail-row">
      <span class="detail-label">Uptime</span>
      <span class="detail-value">{uptime}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Platform</span>
      <span class="detail-value">{platform}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Python</span>
      <span class="detail-value">{python}</span>
    </div>
    <div class="detail-row">
      <span class="detail-label">Boot</span>
      <span class="detail-value">{bootTime}</span>
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
    color: var(--accent);
  }

  .card-title {
    font-weight: 600;
    color: var(--fg);
    font-size: 15px;
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