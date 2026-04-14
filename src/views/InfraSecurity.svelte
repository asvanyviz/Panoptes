<script lang="ts">
  import { getSecurity } from '$lib/api/client';

  let score = $state(0);
  let findings: unknown[] = $state([]);
  let recommendations: string[] = $state([]);

  fetchData();
  async function fetchData() {
    try {
      const d = await getSecurity();
      score = (d as { score?: number }).score ?? 0;
      findings = (d as { findings?: unknown[] }).findings ?? [];
      recommendations = (d as { recommendations?: string[] }).recommendations ?? [];
    } catch { /* graceful */ }
  }
  setInterval(fetchData, 30000);

  function sevColor(sev: string): string {
    switch (sev) {
      case 'critical': return 'var(--danger)';
      case 'high': return 'var(--red, var(--danger))';
      case 'medium': return 'var(--warning)';
      case 'low': return 'var(--info)';
      default: return 'var(--fg-dim)';
    }
  }
</script>

<div class="view">
  <h2>Security</h2>
  <div class="score-card">
    <span class="score-label">Pontszám</span>
    <span class="score-value" style="color: {score >= 80 ? 'var(--green)' : score >= 50 ? 'var(--warning)' : 'var(--danger)'}">{score}/100</span>
  </div>

  {#if findings.length > 0}
    <h3>Findings ({findings.length})</h3>
    {#each findings as f}
      <div class="finding" style="border-left-color: {sevColor((f as any).severity)}">
        <span class="sev" style="color: {sevColor((f as any).severity)}">{(f as any).severity}</span>
        <span class="title">{(f as any).title}</span>
      </div>
    {/each}
  {/if}

  {#if recommendations.length > 0}
    <h3>Ajánlások</h3>
    <ul class="recs">
      {#each recommendations as r}
        <li>{r}</li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .view { display: flex; flex-direction: column; gap: 12px; }
  .score-card { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: var(--bg-surface); border-radius: 8px; border: 1px solid var(--border); }
  .score-label { font-size: 13px; color: var(--fg-dim); }
  .score-value { font-size: 28px; font-weight: 700; font-family: var(--mono); }
  h3 { font-size: 14px; margin: 4px 0 0; color: var(--fg); }
  .finding { display: flex; gap: 10px; align-items: center; padding: 8px 12px; background: var(--bg-surface); border-radius: 4px; border-left: 3px solid var(--border); font-size: 12px; }
  .sev { text-transform: uppercase; font-weight: 600; min-width: 55px; }
  .recs { font-size: 12px; color: var(--fg); padding-left: 20px; display: flex; flex-direction: column; gap: 4px; }
</style>
