<script lang="ts">
  import type { AgentSummary } from '$lib/api/types';

  interface Props {
    agent: AgentSummary;
    expanded?: boolean;
  }

  let { agent, expanded = $bindable(false) }: Props = $props();

  function statusColor(status: string): string {
    switch (status) {
      case 'active':
        return 'var(--green)';
      case 'idle':
      case 'sleeping':
        return 'var(--warning)';
      case 'error':
        return 'var(--danger)';
      case 'offline':
      default:
        return 'var(--fg-dim)';
    }
  }

  function statusLabel(status: string): string {
    switch (status) {
      case 'active':
        return 'Aktív';
      case 'idle':
        return 'Tétlen';
      case 'sleeping':
        return 'Alvó';
      case 'error':
        return 'Hiba';
      case 'offline':
      default:
        return 'Offline';
    }
  }

  function formatLastActive(ageMs: number | null): string {
    if (ageMs === null || ageMs < 0) return '–';
    const s = Math.floor(ageMs / 1000);
    if (s < 60) return `${s}mp`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}p`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}ó ${m % 60}p`;
    const d = Math.floor(h / 24);
    return `${d}nap ${h % 24}ó`;
  }

  function shortModel(model: string): string {
    // Strip provider prefix if present (e.g. "openrouter/deepseek/deepseek-chat" -> "deepseek-chat")
    const parts = model.split('/');
    return parts.length > 1 ? parts[parts.length - 1] : model;
  }
</script>

<div class="agent-card" class:expanded class:is-active={agent.status === 'active'}>
  <button class="agent-card-body" onclick={() => expanded = !expanded}>
    <div class="agent-header">
      <span class="agent-status-dot" style="--dot-color: {statusColor(agent.status)}"></span>
      <span class="agent-name">{agent.name}</span>
      <span class="agent-status-label" style="color: {statusColor(agent.status)}">
        {statusLabel(agent.status)}
      </span>
    </div>

    <div class="agent-meta">
      <span class="agent-model" title={agent.model}>{shortModel(agent.model)}</span>
      <span class="agent-sessions">
        {agent.sessionsCount} session{agent.sessionsCount !== 1 ? 'ok' : ''}
      </span>
    </div>

    {#if agent.lastActiveAgeMs !== null}
      <div class="agent-last-active">
        Utolsó aktív: {formatLastActive(agent.lastActiveAgeMs)}
      </div>
    {/if}

    {#if expanded}
      <div class="agent-details">
        <div class="detail-row">
          <span class="detail-label">ID</span>
          <span class="detail-value mono">{agent.id}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Státusz</span>
          <span class="detail-value" style="color: {statusColor(agent.status)}">
            {statusLabel(agent.status)}
          </span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Modell</span>
          <span class="detail-value mono" title={agent.model}>{agent.model}</span>
        </div>
        {#if agent.currentTask}
          <div class="detail-row">
            <span class="detail-label">Feladat</span>
            <span class="detail-value">{agent.currentTask}</span>
          </div>
        {/if}
        <div class="detail-row">
          <span class="detail-label">Sessionk</span>
          <span class="detail-value">{agent.sessionsCount}</span>
        </div>
        {#if agent.tokenUsage?.total}
          <div class="detail-row">
            <span class="detail-label">Tokenek (össz.)</span>
            <span class="detail-value mono">{
              agent.tokenUsage.total >= 1_000_000
                ? (agent.tokenUsage.total / 1_000_000).toFixed(1) + 'M'
                : agent.tokenUsage.total >= 1_000
                  ? (agent.tokenUsage.total / 1_000).toFixed(1) + 'K'
                  : agent.tokenUsage.total
            }</span>
          </div>
        {/if}
        {#if agent.bootstrapPending}
          <div class="detail-row warning">
            <span class="detail-label">Bootstrap</span>
            <span class="detail-value" style="color: var(--warning)">⏳ Függőben</span>
          </div>
        {/if}
      </div>
    {/if}
  </button>
</div>

<style>
  .agent-card {
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
    transition: border-color 0.15s, box-shadow 0.15s;
  }

  .agent-card:hover {
    border-color: var(--bg-elevated);
  }

  .agent-card.is-active {
    border-color: rgba(167, 192, 128, 0.3);
  }

  .agent-card.expanded {
    border-color: var(--accent-alt);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
  }

  .agent-card-body {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 14px 16px;
    background: none;
    border: none;
    color: inherit;
    font: inherit;
    cursor: pointer;
    width: 100%;
    text-align: left;
  }

  .agent-header {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .agent-status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--dot-color, var(--fg-dim));
    flex-shrink: 0;
  }

  .agent-status-dot::after {
    content: '';
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--dot-color, var(--fg-dim));
    animation: pulse 2s ease-in-out infinite;
  }

  .is-active .agent-status-dot::after {
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.4; transform: scale(1); }
    50% { opacity: 0; transform: scale(1.8); }
  }

  .agent-name {
    font-weight: 600;
    font-size: 14px;
  }

  .agent-status-label {
    font-size: 12px;
    font-weight: 500;
  }

  .agent-meta {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-left: 18px;
  }

  .agent-model {
    font-size: 12px;
    color: var(--fg-dim);
  }

  .agent-sessions {
    font-size: 12px;
    color: var(--fg-dim);
  }

  .agent-last-active {
    font-size: 11px;
    color: var(--fg-dim);
    padding-left: 18px;
  }

  .agent-details {
    margin-top: 8px;
    padding-top: 12px;
    border-top: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .detail-row {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 12px;
  }

  .detail-row.warning .detail-label {
    color: var(--warning);
  }

  .detail-label {
    color: var(--fg-dim);
    min-width: 120px;
    font-weight: 500;
  }

  .detail-value {
    color: var(--fg);
  }

  .mono {
    font-family: var(--mono);
    font-size: 11px;
  }
</style>
