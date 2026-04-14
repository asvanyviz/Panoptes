<script lang="ts">
  import { getLive } from '$lib/api/client';
  let entries: unknown[] = $state([]);
  getLive(50).then(d => { entries = (d as { entries?: unknown[] }).entries ?? []; }).catch(() => { entries = []; });
</script>
<div class="view">
  <h2>Napi jelentések</h2>
  {#if entries.length === 0}<p class="meta">Nincs napi jelentés.</p>
  {:else}{#each entries.slice(0, 30) as e}
    <div class="row"><span class="time">{(e as any).timestamp}</span><span class="mono">{(e as any).agent}</span>{(e as any).event}</div>
  {/each}{/if}
</div>
<style>.view{display:flex;flex-direction:column;gap:4px}.meta{color:var(--fg-dim)}.row{font-size:12px;padding:4px 0;border-bottom:1px solid var(--border);display:flex;gap:8px}.time{color:var(--fg-dim);min-width:140px;font-family:var(--mono)}.mono{color:var(--accent-alt);font-family:var(--mono)}</style>
