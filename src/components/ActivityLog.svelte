<script lang="ts">
  interface LogEntry {
    time: string;
    level: 'info' | 'warn' | 'error';
    message: string;
  }

  let entries: LogEntry[] = $state([
    { time: '09:00', level: 'info', message: 'Dashboard loaded' },
    { time: '09:01', level: 'info', message: 'Connected to backend' },
    { time: '09:02', level: 'warn', message: 'Slow query detected (1.2s)' },
    { time: '09:05', level: 'info', message: 'Health check passed' },
  ]);
</script>

<div class="activity-log">
  <h3 class="log-header">Activity Log</h3>
  <div class="log-entries">
    {#each entries as entry}
      <div class="log-entry">
        <span class="log-time">{entry.time}</span>
        <span class="log-badge {entry.level}">{entry.level}</span>
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
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: var(--fg-dim);
    padding: 12px 16px;
    border-bottom: 1px solid var(--border);
    margin: 0;
  }

  .log-entries {
    overflow-y: auto;
    padding: 8px 0;
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
    width: 36px;
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
  }
</style>
