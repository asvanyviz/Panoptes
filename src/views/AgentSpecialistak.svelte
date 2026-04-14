<script lang="ts">
  // Specialists from SYNERGY.md
  let specialists = $state([
    { id: 'aletheia', name: 'Aletheia', role: 'Csapatvezető, SYNERGY.md regiszter karbantartója', status: 'active' },
    { id: 'bundas', name: 'Bundás', role: 'Kutya-kozmetikai agent, Kinga user-facing', status: 'inactive' },
    { id: 'flytrap', name: 'Flytrap', role: 'Növényvédelmi agent', status: 'inactive' },
    { id: 'hartmann', name: 'Hartmann', role: 'Rendszer üzemeltetés, reggeli jelentés, állapot aggregáció', status: 'active' },
    { id: 'metis', name: 'Metis', role: 'Kutatás, könyvfeldolgozás', status: 'active' },
    { id: 'pali', name: 'Pali', role: 'Notion integráció, tartalomfeldolgozás', status: 'active' },
    { id: 'soteria', name: 'Soteria', role: 'Emergency sysadmin (Recovery Protocol, heartbeat kikapcsolva)', status: 'standby' },
    { id: 'squidward', name: 'Squidward', role: 'Akvarisztikai agent, Kinga user-facing', status: 'inactive' },
  ]);

  let expandedId = $state<string | null>(null);
</script>

<div class="view">
  <h2>Specialisták</h2>
  <p class="subtitle">Specialist kategória — SYNERGY.md · {specialists.length} specialist</p>

  <div class="spec-list">
    {#each specialists as s (s.id)}
      <div class="spec-card" class:expanded={expandedId === s.id} onclick={() => expandedId = expandedId === s.id ? null : s.id}>
        <div class="spec-header">
          <span class="dot {s.status}"></span>
          <span class="name">{s.name}</span>
          <span class="status-badge {s.status}">{s.status}</span>
        </div>
        {#if expandedId === s.id}
          <div class="spec-detail">
            <span class="id mono">{s.id}</span>
            <span class="role">{s.role}</span>
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>

<style>
  .view { display: flex; flex-direction: column; gap: 12px; }
  .subtitle { font-size: 12px; color: var(--fg-dim); margin: 0; }
  .spec-list { display: flex; flex-direction: column; gap: 6px; }
  .spec-card { background: var(--bg-surface); border: 1px solid var(--border); border-radius: 6px; overflow: hidden; cursor: pointer; transition: border-color 0.15s; }
  .spec-card:hover { border-color: var(--bg-elevated); }
  .spec-card.expanded { border-color: var(--accent-alt); }
  .spec-header { display: flex; align-items: center; gap: 10px; padding: 10px 14px; }
  .dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
  .dot.active { background: var(--green); }
  .dot.inactive { background: var(--fg-dim); }
  .dot.standby { background: var(--yellow); }
  .name { font-weight: 600; font-size: 13px; min-width: 80px; }
  .status-badge { font-size: 11px; color: var(--fg-dim); text-transform: capitalize; }
  .status-badge.active { color: var(--green); }
  .status-badge.standby { color: var(--yellow); }
  .spec-detail { padding: 8px 14px 12px 30px; background: var(--bg-dim); display: flex; flex-direction: column; gap: 4px; font-size: 12px; }
  .id { color: var(--fg-dim); font-family: var(--mono); font-size: 11px; }
  .mono { font-family: var(--mono); }
</style>
