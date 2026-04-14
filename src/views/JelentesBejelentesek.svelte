<script lang="ts">
  import { getRequests } from '$lib/api/client';
  let items: unknown[] = $state([]);
  getRequests().then(d => { items = (d as { requests?: unknown[] }).requests ?? []; }).catch(() => { items = []; });
</script>
<div class="view">
  <h2>Bejelentések</h2>
  {#if items.length === 0}<p class="meta">Nincs bejelentés.</p>
  {:else}{#each items.slice(0, 20) as r}
    <div class="row"><span class="badge {(r as any).priority}">{(r as any).priority}</span>
      <span class="mono">{(r as any).sender}</span> {(r as any).subject}
      <span class="status">(r as any).status}</span></div>{/each}{/if}
</div>
<style>.view{display:flex;flex-direction:column;gap:4px}.meta{color:var(--fg-dim)}.row{font-size:12px;padding:6px 0;border-bottom:1px solid var(--border);display:flex;gap:8px;align-items:center}.badge{font-size:10px;padding:2px 6px;border-radius:3px;text-transform:uppercase;font-weight:600}.badge.high{background:rgba(230,126,128,0.15);color:var(--danger)}.badge.medium{background:rgba(219,188,127,0.15);color:var(--warning)}.badge.low{background:rgba(127,187,179,0.15);color:var(--info)}.mono{font-family:var(--mono);color:var(--accent-alt)}</style>
