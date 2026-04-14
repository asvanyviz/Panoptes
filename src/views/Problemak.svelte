<script lang="ts">
  import { getSecurity } from '$lib/api/client';
  let findings: unknown[] = $state([]);
  getSecurity().then(d => {
    const f = (d as { findings?: unknown[] }).findings || [];
    findings = f.filter((x: any) => x.severity !== 'info');
  }).catch(() => { findings = []; });
</script>
<div class="view"><h2>Problémák</h2>
{#if findings.length === 0}<p class="meta">Nincs aktív probléma.</p>
{:else}{#each findings as f}<div class="card"><span class="sev {(f as any).severity}">{(f as any).severity}</span> {(f as any).title}</div>{/each}{/if}</div>
<style>.view{display:flex;flex-direction:column;gap:8px}.meta{color:var(--fg-dim)}.card{background:var(--bg-surface);padding:8px 12px;border-radius:6px;border:1px solid var(--border)}.sev.critical,.sev.high{color:var(--danger)}.sev.medium{color:var(--warning)}.sev.low{color:var(--info)}</style>
