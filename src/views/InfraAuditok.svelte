<script lang="ts">
  import { getAudits } from '$lib/api/client';
  let audits: unknown[] = $state([]);
  getAudits().then(d => { audits = (d as { audits?: unknown[] }).audits || []; }).catch(() => { audits = []; });
</script>
<div class="view"><h2>Auditok</h2>
{#if audits.length === 0}<p class="meta">Nincs audit bejegyzés.</p>
{:else}{#each audits.slice(0, 20) as a}<div class="row"><span class="time">{(a as any).timestamp}</span> <span class="mono">{(a as any).agent}</span> {(a as any).action}</div>{/each}{/if}</div>
<style>.view{display:flex;flex-direction:column;gap:4px}.meta{color:var(--fg-dim)}.row{font-size:12px;padding:4px 0;border-bottom:1px solid var(--border)}.time{color:var(--fg-dim)}.mono{font-family:var(--mono)}</style>
