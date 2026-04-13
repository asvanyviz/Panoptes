<script lang="ts">
  import { getSystemInfo, getMemoryHealth } from '$lib/api/client';
  import type { SystemInfo, HealthDetailResponse } from '$lib/api/types';
  import CpuCard from '../components/system/CpuCard.svelte';
  import RamCard from '../components/system/RamCard.svelte';
  import DiskCard from '../components/system/DiskCard.svelte';
  import NetworkCard from '../components/system/NetworkCard.svelte';
  import HostCard from '../components/system/HostCard.svelte';

  let sysInfo: SystemInfo | null = $state(null);
  let healthInfo: HealthDetailResponse | null = $state(null);
  let loading = $state(true);
  let error: string | null = $state(null);
  let lastRefresh = $state('');

  async function fetchData() {
    try {
      error = null;
      const [sys, health] = await Promise.all([
        getSystemInfo(),
        getMemoryHealth(),
      ]);
      sysInfo = sys;
      healthInfo = health;
      lastRefresh = new Date().toLocaleTimeString('hu-HU');
    } catch (e: unknown) {
      error = e instanceof Error ? e.message : 'Nem elérhető';
    } finally {
      loading = false;
    }
  }

  function formatUptime(seconds: number): string {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (d > 0) return `${d}nap ${h}ó ${m}p`;
    if (h > 0) return `${h}ó ${m}p`;
    return `${m}p`;
  }

  function getUptimeDisplay(): string {
    if (!sysInfo || !sysInfo.uptime) return '–';
    return formatUptime(parseFloat(sysInfo.uptime));
  }

  fetchData();
  const interval = setInterval(fetchData, 5000);

  $effect(() => {
    return () => clearInterval(interval);
  });
</script>

<div class="system-view">
  <div class="system-header">
    <h2>Rendszeráttekintés</h2>
    <span class="last-refresh" title="Utolsó frissítés">{lastRefresh}</span>
  </div>

  {#if loading && !sysInfo}
    <div class="loading">Betöltés…</div>
  {:else if error}
    <div class="error-card">
      <span class="error-icon">⚠</span>
      <span>Rendszeradat nem elérhető: {error}</span>
    </div>
  {:else if sysInfo}
    <div class="system-grid">
      <HostCard {sysInfo} uptime={getUptimeDisplay()} />
      <CpuCard {sysInfo} health={healthInfo} />
      <RamCard {sysInfo} health={healthInfo} />
      <DiskCard {sysInfo} />
      <NetworkCard {sysInfo} />
    </div>
  {/if}
</div>

<style>
  .system-view {
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 16px;
  }

  .system-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .system-header h2 {
    font-size: 18px;
    font-weight: 600;
    color: var(--fg);
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

  .system-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 12px;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .system-grid > :global(*) {
    animation: fadeIn 0.3s ease-out;
  }
</style>