<script lang="ts">
  import { getDashboard } from '$lib/api/client';
  let statusText = $state('...');
  getDashboard().then(d => {
    statusText = `Modell: ${(d as any).gateway?.model ?? '–'} | ${(d as any).agents?.length ?? 0} agent`;
  }).catch(() => { statusText = 'API nem elérhető'; });
</script>
<div class="view"><h2>Áttekintés</h2><p class="meta">{statusText}</p></div>
<style>.view{display:flex;flex-direction:column;gap:12px}.meta{color:var(--fg-dim);font-family:var(--mono)}</style>
