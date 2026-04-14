<script lang="ts">
  // Advisors from SYNERGY.md (cannot be live-fetched, shown as static registry)
  let advisors = $state([
    { id: 'anamnesis', name: 'Anamnesis', role: 'Memória fájlok desztillálása', tags: 'memory · data-processing · desztillálás' },
    { id: 'aporia', name: 'Aporia', role: 'Blueprint minőségellenőrzés', tags: 'blueprint-review · quality-assurance · critical-analysis' },
    { id: 'basanos', name: 'Basanos', role: 'Agent konfiguráció validálás', tags: 'testing · configuration · validation' },
    { id: 'corrector', name: 'Corrector', role: 'Nyelvi minőség javítás', tags: 'writing · language · text-processing' },
    { id: 'corsair', name: 'Corsair', role: 'Nextcloud adminisztráció', tags: 'nextcloud · cloud · sysadmin' },
    { id: 'crow', name: 'Crow', role: 'Changelog elemzés', tags: 'changelog · nextcloud · IRC · release-analysis' },
    { id: 'datadread', name: 'Datadread', role: 'IRC szerver + bot fejlesztés', tags: 'IRC · networking · communication · sysadmin' },
    { id: 'elenchos', name: 'Elenchos', role: 'Memória desztilláció QA', tags: 'memory · quality-assurance · review · validation' },
    { id: 'hephaestus', name: 'Hephaestus', role: 'Webfejlesztés (backend + API)', tags: 'web-development · backend · api · frontend' },
    { id: 'kraken', name: 'Kraken', role: 'Linux rendszergazda', tags: 'linux · sysadmin · systemd · networking' },
    { id: 'kustos', name: 'Kustos', role: 'Git · GitHub · release', tags: 'git · github · release · CI/CD' },
    { id: 'lychnos', name: 'Lychnos', role: 'Agent pszichológia + viselkedés', tags: 'psychology · behavior-analysis · pattern-recognition' },
    { id: 'nova', name: 'Nova', role: 'Workspace hygiene', tags: 'workspace · hygiene · maintenance · cleanup' },
    { id: 'patch', name: 'Patch', role: 'Webops + deployment', tags: 'webops · deployment · HTTP · sysadmin' },
    { id: 'phoenix', name: 'Phoenix', role: 'Kód tesztelés (smoke, regression)', tags: 'testing · web-development · quality-assurance' },
    { id: 'phylax', name: 'Phylax', role: 'Config drift + SOUL.md audit', tags: 'configuration · drift-detection · security · audit' },
    { id: 'prometheus', name: 'Prometheus', role: 'Frissítés-figyelés + changelog', tags: 'release-monitoring · changelog · OpenClaw' },
    { id: 'reader1', name: 'Reader1', role: 'Történet olvasás + értékelés', tags: 'writing · reading · feedback · storytelling' },
    { id: 'scriptor', name: 'Scriptor', role: 'Kreatív történetírás', tags: 'writing · storytelling · creative' },
    { id: 'scurvy', name: 'Scurvy', role: 'Biztonsági elemzés + hardening', tags: 'security · vulnerability · hardening · audit' },
    { id: 'synopsis', name: 'Synopsis', role: 'Memória coverage + snapshot', tags: 'memory · analytics · snapshot · coverage' },
    { id: 'tekhne', name: 'Tekhne', role: 'Skill fejlesztés + karbantartás', tags: 'skill-development · agent-config · OpenClaw' },
    { id: 'translator', name: 'Translator', role: 'Többnyelvű fordítás', tags: 'translation · language · localization' },
    { id: 'visor', name: 'Visor', role: 'Session egészség elemzés', tags: 'session-health · diagnostics · lock-detection' },
  ]);

  let expandedId = $state<string | null>(null);
</script>

<div class="view">
  <h2>Tanácsadók</h2>
  <p class="subtitle">Advisor Pool — SYNERGY.md · {advisors.length} tanácsadó</p>
  <p class="meta">Az advisorok on-demand, spawnolva léteznek (nincs heartbeat, nincs cron).</p>

  <div class="advisor-grid">
    {#each advisors as advisor (advisor.id)}
      <div class="advisor-card" class:expanded={expandedId === advisor.id}
           onclick={() => expandedId = expandedId === advisor.id ? null : advisor.id}>
        <div class="advisor-header">
          <span class="advisor-name">{advisor.name}</span>
        </div>
        <div class="advisor-role">{advisor.role}</div>
        {#if expandedId === advisor.id}
          <div class="advisor-detail">
            <span class="id mono">ID: {advisor.id}</span>
            <span class="tags">{advisor.tags}</span>
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>

<style>
  .view { display: flex; flex-direction: column; gap: 12px; }
  .subtitle { font-size: 12px; color: var(--fg-dim); margin: 0; }
  .meta { font-size: 11px; color: var(--fg-dim); font-style: italic; margin: 0; }
  .advisor-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 8px; }
  .advisor-card { background: var(--bg-surface); border: 1px solid var(--border); border-radius: 6px; padding: 10px 14px; cursor: pointer; transition: border-color 0.15s; }
  .advisor-card:hover { border-color: var(--bg-elevated); }
  .advisor-card.expanded { border-color: var(--accent-alt); }
  .advisor-name { font-weight: 600; font-size: 13px; }
  .advisor-role { font-size: 12px; color: var(--fg-dim); margin-top: 2px; }
  .advisor-detail { margin-top: 8px; display: flex; flex-direction: column; gap: 4px; font-size: 11px; }
  .id { color: var(--fg-dim); }
  .tags { color: var(--accent-alt); font-family: var(--mono); font-size: 10px; }
  .mono { font-family: var(--mono); }
</style>
