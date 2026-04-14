<script lang="ts">
  import { getDashboard } from '$lib/api/client';
  let agents: unknown[] = $state([]);
  getDashboard().then(d => { agents = (d as { agents?: unknown[] }).agents || []; }).catch(() => { agents = []; });
</script>
<div class="view"><h2>Végrehajtók</h2>
{#each agents as a}<div class="row"><span class="dot {(a as any).status}"></span><span class="name">{(a as any).name}</span> <span class="mono">{((a as any).model || '').split('/').slice(-1)[0]}</span> <span class="status">{(a as any).status}</span></div>{/each}</div>
<style>.view{display:flex;flex-direction:column;gap:4px}.row{display:flex;gap:10px;align-items:center;padding:8px 0;border-bottom:1px solid var(--border)}.dot{width:8px;height:8px;border-radius:50%;background:var(--fg-dim);flex-shrink:0}.dot.active{background:var(--green)}.dot.idle,.dot.sleeping{background:var(--yellow)}.dot.error,.dot.offline{background:var(--danger)}.name{min-width:100px;font-weight:600}.mono{font-family:var(--mono);font-size:12px;color:var(--fg-dim)}</style>
