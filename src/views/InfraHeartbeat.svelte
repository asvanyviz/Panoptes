<script lang="ts">
  import { getHeartbeat } from '$lib/api/client';
  let agents: unknown[] = $state([]);
  getHeartbeat().then(d => { agents = (d as { agents?: unknown[] }).agents || []; }).catch(() => { agents = []; });
</script>
<div class="view"><h2>Heartbeat</h2>
{#each agents as a}<div class="row"><span class="name mono">{(a as any).agent}</span> <span class="status">{(a as any).status}</span> <span class="time">{(a as any).lastHeartbeat}</span></div>{/each}</div>
<style>.view{display:flex;flex-direction:column;gap:4px}.row{font-size:12px;padding:6px 0;border-bottom:1px solid var(--border);display:flex;gap:12px;align-items:center}.name{font-family:var(--mono);color:var(--accent-alt);min-width:100px}</style>
