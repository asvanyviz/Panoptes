<script lang="ts">
  import { getLive, getLogs } from '$lib/api/client';

  let liveEntries: unknown[] = $state([]);
  let logEntries: unknown[] = $state([]);
  let loading = $state(true);

  async function fetchData() {
    try {
      const [live, logs] = await Promise.all([
        getLive(30),
        getLogs(30),
      ]);
      liveEntries = (live as { entries?: unknown[] }).entries || [];
      logEntries = (logs as { entries?: unknown[] }).entries || [];
    } catch { /* graceful */ } finally { loading = false; }
  }

  fetchData();
  setInterval(fetchData, 5000);
</script>

<div class="view">
  <h2>Live Activity</h2>

  {#if loading}
    <p class="meta">Betöltés…</p>
  {:else}
    <div class="columns">
      <div class="col">
        <h3>Live (utolsó 30)</h3>
        {#if liveEntries.length === 0}
          <p class="meta">Nincs live bejegyzés.</p>
        {:else}
          {#each liveEntries as e}
            <div class="entry">
              <span class="time">{(e as any).timestamp}</span>
              <span class="agent mono">{(e as any).agent}</span>
              <span>{(e as any).event} — {(e as any).message}</span>
            </div>
          {/each}
        {/if}
      </div>
      <div class="col">
        <h3>Logs (utolsó 30)</h3>
        {#if logEntries.length === 0}
          <p class="meta">Nincs log bejegyzés.</p>
        {:else}
          {#each logEntries as e}
            <div class="entry log">
              <span class="time">{(e as any).timestamp}</span>
              <span class="level {(e as any).level}">{(e as any).level}</span>
              <span>{(e as any).message}</span>
            </div>
          {/each}
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .view { display: flex; flex-direction: column; gap: 12px; }
  .meta { color: var(--fg-dim); }
  .columns { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .col h3 { font-size: 13px; font-weight: 700; color: var(--accent); margin-bottom: 6px; }
  .entry { font-size: 12px; padding: 4px 0; border-bottom: 1px solid var(--border); display: flex; gap: 8px; align-items: baseline; }
  .entry.log { gap: 6px; }
  .time { color: var(--fg-dim); font-size: 11px; min-width: 140px; font-family: var(--mono); }
  .agent { color: var(--accent-alt); min-width: 80px; }
  .level { text-transform: uppercase; font-size: 10px; font-weight: 600; min-width: 40px; }
  .level.error, .level.ERROR { color: var(--danger); }
  .level.warn, .level.WARNING { color: var(--warning); }
  .level.info, .level.INFO { color: var(--info); }
  .mono { font-family: var(--mono); }
</style>
