<script lang="ts">
  import { getLive } from '$lib/api/client';
  import type { LiveEntry } from '$lib/api/types';

  let entries: { time: string; level: string; message: string }[] = $state([
    { time: '–', level: 'info', message: 'Betöltés…' },
  ]);
  let lastRefresh = $state('');

  async function fetchLive() {
    try {
      const data = await getLive(30);
      entries = data.entries.map(e => ({
        time: new Date(e.timestamp).toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' }),
        level: e.event || 'info',
        message: e.message || e.agent || '–',
      }));
      lastRefresh = new Date().toLocaleTimeString('hu-HU');
    } catch {
      // Keep previous data — graceful degradation
    }
  }

  fetchLive();
  const interval = setInterval(fetchLive, 10000);
  $effect(() => () => clearInterval(interval));
</script>

<div class="activity-log">
  <div class="log-header">
    <h3>Activity Log</h3>
    <span class="last-refresh">{lastRefresh}</span>
  </div>
  <div class="log-entries">
    {#each entries as entry}
      <div class="log-entry">
        <span class="log-time">{entry.time}</span>
        <span class="log-badge {entry.level.toLowerCase() === 'error' ? 'error' : entry.level.toLowerCase() === 'warn' ? 'warn' : 'info'}">{entry.level}</span>
        <span class="log-msg">{entry.message}</span>
      </div>
    {/each}
  </div>
</div>

<style>
  .activity-log {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .log-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid var(--border);
  }

  .log-header h3 {
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: var(--fg-dim);
    margin: 0;
  }

  .last-refresh {
    font-size: 11px;
    color: var(--fg-dim);
    font-family: var(--mono);
  }

  .log-entries {
    overflow-y: auto;
    padding: 8px 0;
    flex: 1;
  }

  .log-entry {
    display: flex;
    gap: 8px;
    padding: 6px 16px;
    align-items: baseline;
    font-size: 13px;
  }

  .log-entry:hover {
    background: var(--bg-elevated);
  }

  .log-time {
    font-family: var(--mono);
    color: var(--fg-dim);
    font-size: 11px;
    flex-shrink: 0;
    width: 44px;
  }

  .log-badge {
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    padding: 1px 6px;
    border-radius: 3px;
    flex-shrink: 0;
    width: 36px;
    text-align: center;
  }

  .log-badge.info {
    color: var(--info);
    background: rgba(127, 187, 179, 0.12);
  }

  .log-badge.warn {
    color: var(--warning);
    background: rgba(219, 188, 127, 0.12);
  }

  .log-badge.error {
    color: var(--danger);
    background: rgba(230, 126, 128, 0.12);
  }

  .log-msg {
    color: var(--fg-dim);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
  }
</style>