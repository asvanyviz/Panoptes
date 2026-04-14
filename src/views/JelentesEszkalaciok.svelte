<script lang="ts">
  import { getOpenLoops } from '$lib/api/client';
  let loops: unknown[] = $state([]);
  getOpenLoops().then(d => { loops = (d as { loops?: unknown[] }).loops ?? []; }).catch(() => { loops = []; });
</script>
<div class="view">
  <h2>Eszkalációk</h2>
  {#if loops.length === 0}<p class="meta">Nincs nyitott eszkaláció.</p>
  {:else}{#each loops as l}
    <div class="row"><span class="prio {(l as any).priority}">{(l as any).priority}</span>
      <span class="mono">{(l as any).agent}</span> {(l as any).subject}</div>{/each}{/if}
</div>
<style>.view{display:flex;flex-direction:column;gap:4px}.meta{color:var(--fg-dim)}.row{font-size:12px;padding:6px 0;border-bottom:1px solid var(--border);display:flex;gap:8px;align-items:center}.prio{font-size:10px;padding:2px 6px;border-radius:3px;text-transform:uppercase;font-weight:600}.prio.high{background:rgba(230,126,128,0.15);color:var(--danger)}.prio.medium{background:rgba(219,188,127,0.15);color:var(--warning)}.mono{font-family:var(--mono);color:var(--accent-alt)}</style>
