<script lang="ts">
  import { getCron } from '$lib/api/client';
  let jobs: unknown[] = $state([]);
  getCron().then(d => { jobs = (d as { jobs?: unknown[] }).jobs || []; }).catch(() => { jobs = []; });
</script>
<div class="view"><h2>Cron jobs</h2>
{#if jobs.length === 0}<p class="meta">Nincs cron bejegyzés.</p>
{:else}{#each jobs as j}<div class="row"><span class="expr mono">{(j as any).expression}</span> <span class="enabled">{(j as any).enabled ? '✅' : '❌'}</span> {(j as any).description}</div>{/each}{/if}</div>
<style>.view{display:flex;flex-direction:column;gap:4px}.meta{color:var(--fg-dim)}.row{font-size:12px;padding:4px 0;border-bottom:1px solid var(--border);display:flex;gap:8px;align-items:center}.expr{font-family:var(--mono);color:var(--accent-alt)}.enabled{font-size:14px}</style>
