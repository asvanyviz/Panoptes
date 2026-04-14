<script lang="ts">
  import { getCosts } from '$lib/api/client';
  let history: unknown[] = $state([]);
  getCosts().then(d => { history = (d as { history?: unknown[] }).history || []; }).catch(() => { history = []; });
</script>
<div class="view"><h2>Tokenhasználat</h2>
{#if history.length === 0}<p class="meta">Nincs költség adat.</p>
{:else}{#each history.slice(-7) as h}<div class="row"><span class="date">{(h as any).date}</span> <span class="total mono">{((h as any).total ?? 0).toFixed(2)} USD</span></div>{/each}{/if}</div>
<style>.view{display:flex;flex-direction:column;gap:4px}.meta{color:var(--fg-dim)}.row{font-size:12px;padding:6px 0;border-bottom:1px solid var(--border);display:flex;gap:12px;align-items:center;justify-content:space-between}.date{color:var(--fg)}.total{color:var(--accent-alt);font-family:var(--mono)}</style>
